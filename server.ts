import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  compileCompanyScanReport,
  compilePersonScanReport,
  normalizeUrlInput,
  CompanyScanReport,
  ScrapedOsintSource,
} from './src/lib/urlScannerBrain';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function fetchWithTimeout(url: string, timeoutMs = 4000, headers?: Record<string, string>): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,text/plain,*/*',
        ...headers,
      },
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPublicPageSignals(targetUrl: string): Promise<{
  html?: string;
  pageTitle?: string;
  metaDescription?: string;
}> {
  const html = await fetchWithTimeout(targetUrl, 3800);
  if (!html) {
    // Fallback to Jina Reader if direct fetch is blocked by WAF
    const jinaText = await fetchWithTimeout(`https://r.jina.ai/${targetUrl}`, 4200);
    if (!jinaText) return {};
    const titleMatch = jinaText.match(/^Title:\s*(.+)$/m);
    return {
      html: jinaText.slice(0, 60_000),
      pageTitle: titleMatch ? titleMatch[1].trim() : undefined,
      metaDescription: jinaText.slice(0, 280).replace(/\s+/g, ' ').trim(),
    };
  }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);

  return {
    html: html.slice(0, 60_000),
    pageTitle: titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : undefined,
    metaDescription: descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : undefined,
  };
}

/**
 * Multi-Vector LinkedIn & Public OSINT Footprint Scraper
 * Uses Jina Reader + DuckDuckGo HTML Search indexing + deep external page scraping
 * so LinkedIn profile URLs work reliably even when LinkedIn blocks raw anonymous HTTP requests.
 */
async function scrapePersonOsintFootprint(
  normalizedUrl: string,
  domain: string,
  pathSegments: string[],
  suppliedBioText: string
): Promise<{
  scrapedSources: ScrapedOsintSource[];
  extractedPersonName?: string;
  extractedRoleTitle?: string;
  combinedScrapedText: string;
}> {
  const today = new Date().toISOString().slice(0, 10);
  const rawSlug =
    pathSegments[pathSegments.length - 1] ||
    pathSegments[0] ||
    domain.split('.')[0] ||
    'executive';
  const cleanSlug = rawSlug.replace(/-[0-9a-f]{6,}$/i, '');
  const guessedName = cleanSlug
    .replace(/[-_0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  const scrapedSources: ScrapedOsintSource[] = [];
  let extractedPersonName: string | undefined = guessedName || undefined;
  let extractedRoleTitle: string | undefined;

  if (suppliedBioText.trim().length > 5) {
    scrapedSources.push({
      id: 'src-user-pasted',
      sourceType: 'LinkedIn (pasted/indexed)',
      label: `Pasted LinkedIn profile · ${guessedName || domain}`,
      domain: 'linkedin.com',
      url: normalizedUrl,
      capturedDate: today,
      originTag: 'user_provided',
      rawText: suppliedBioText.trim(),
      reliability: 0.85,
    });
  }

  // Vector 1 & Vector 2 in parallel:
  // - Scrape DuckDuckGo HTML search via Jina Reader for "<Name> linkedin" and "<Name>"
  // - If target URL is not linkedin.com, also scrape target URL directly via Jina Reader
  const searchQueryLinkedIn = encodeURIComponent(`${guessedName} linkedin`);
  const searchQueryBroad = encodeURIComponent(`${guessedName}`);

  const [ddgLinkedInMd, ddgBroadMd, directTargetMd] = await Promise.all([
    fetchWithTimeout(`https://r.jina.ai/https://html.duckduckgo.com/html/?q=${searchQueryLinkedIn}`, 2500),
    fetchWithTimeout(`https://r.jina.ai/https://html.duckduckgo.com/html/?q=${searchQueryBroad}`, 2500),
    !domain.includes('linkedin.com')
      ? fetchWithTimeout(`https://r.jina.ai/${normalizedUrl}`, 2500)
      : Promise.resolve(''),
  ]);

  if (directTargetMd && directTargetMd.length > 80 && !directTargetMd.includes('AbuseAlleviationError')) {
    const titleMatch = directTargetMd.match(/^Title:\s*(.+)$/m);
    const cleaned = directTargetMd
      .replace(/^Title:.*$/m, '')
      .replace(/^URL Source:.*$/m, '')
      .replace(/^Markdown Content:/m, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3500);

    scrapedSources.push({
      id: 'src-direct-web',
      sourceType: 'Website',
      label: titleMatch ? `Web · ${titleMatch[1].trim()}` : `Web · ${domain}`,
      domain,
      url: normalizedUrl,
      capturedDate: today,
      originTag: 'live_scraped',
      rawText: cleaned,
      reliability: 0.8,
    });
  }

  // Parse DuckDuckGo search results for LinkedIn headlines & external OSINT URLs
  const combinedSearchMd = `${ddgLinkedInMd}\n${ddgBroadMd}`;
  const headingRegex = /##\s*\[([^\]]+)\]\(https:\/\/duckduckgo\.com\/l\/\?uddg=([^)&]+)[^)]*\)/g;
  const discoveredExternalUrls: { title: string; url: string; domain: string }[] = [];
  const linkedInSnippets: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(combinedSearchMd)) !== null) {
    const rawTitle = match[1].replace(/\*\*/g, '').trim();
    let decodedUrl = '';
    try {
      decodedUrl = decodeURIComponent(match[2]);
    } catch {
      continue;
    }
    if (!decodedUrl.startsWith('http')) continue;

    let urlDomain = '';
    try {
      urlDomain = new URL(decodedUrl).hostname.replace(/^www\./i, '').toLowerCase();
    } catch {
      continue;
    }

    if (urlDomain.includes('linkedin.com')) {
      linkedInSnippets.push(rawTitle);
      // Extract name & headline from "Name - Headline | LinkedIn"
      const parts = rawTitle.replace(/\s*[|-]\s*LinkedIn.*$/i, '').split(/\s+-\s+/);
      if (parts.length >= 2) {
        if (!extractedPersonName && parts[0].length < 40) {
          extractedPersonName = parts[0].trim();
        }
        if (!extractedRoleTitle && parts[1].length > 3) {
          extractedRoleTitle = parts[1].trim();
        }
      }
    } else if (
      !['facebook.com', 'instagram.com', 'tiktok.com', 'pinterest.com', 'duckduckgo.com'].some((blocked) =>
        urlDomain.includes(blocked)
      )
    ) {
      if (!discoveredExternalUrls.some((u) => u.domain === urlDomain)) {
        discoveredExternalUrls.push({
          title: rawTitle,
          url: decodedUrl,
          domain: urlDomain,
        });
      }
    }
  }

  if (linkedInSnippets.length > 0 && !scrapedSources.some((s) => s.domain === 'linkedin.com')) {
    scrapedSources.push({
      id: 'src-li-indexed',
      sourceType: 'LinkedIn (pasted/indexed)',
      label: `Indexed LinkedIn Profile · ${ linkedInSnippets[0].slice(0, 75) }`,
      domain: 'linkedin.com',
      url: normalizedUrl,
      capturedDate: today,
      originTag: 'search_indexed',
      rawText: linkedInSnippets.join(' · '),
      reliability: 0.8,
    });
  }

  // Vector 3: Deep-scrape top 3 discovered external OSINT footprint URLs via Jina Reader
  const topExternalTargets = discoveredExternalUrls.slice(0, 3);
  if (topExternalTargets.length > 0) {
    const externalPages = await Promise.all(
      topExternalTargets.map(async (target, idx) => {
        const pageMd = await fetchWithTimeout(`https://r.jina.ai/${target.url}`, 2000);
        if (!pageMd || pageMd.length < 60 || pageMd.includes('AbuseAlleviationError')) {
          return {
            id: `src-osint-${idx + 1}`,
            sourceType: 'Website' as const,
            label: `Web · ${target.title.slice(0, 70)}`,
            domain: target.domain,
            url: target.url,
            capturedDate: today,
            originTag: 'search_indexed' as const,
            rawText: `${target.title} (${target.url})`,
            reliability: 0.7,
          };
        }
        const cleanedContent = pageMd
          .replace(/^Title:.*$/m, '')
          .replace(/^URL Source:.*$/m, '')
          .replace(/^Markdown Content:/m, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 3000);

        return {
          id: `src-osint-${idx + 1}`,
          sourceType: (target.domain.includes('wiza')
            ? 'OSINT Directory'
            : target.domain.includes('skool')
            ? 'Social/Community'
            : 'Website') as ScrapedOsintSource['sourceType'],
          label: `Web · ${target.title.slice(0, 70)}`,
          domain: target.domain,
          url: target.url,
          capturedDate: today,
          originTag: 'live_scraped' as const,
          rawText: `${target.title}. ${cleanedContent}`,
          reliability: 0.75,
        };
      })
    );
    scrapedSources.push(...externalPages);
  }

  const combinedScrapedText = scrapedSources.map((s) => s.rawText).join('\n\n');

  return {
    scrapedSources,
    extractedPersonName,
    extractedRoleTitle,
    combinedScrapedText,
  };
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '1mb' }));

  // POST /api/scan/company — Golden Report + Canonical Ledger v6 + Collective Brain
  app.post('/api/scan/company', async (req, res) => {
    console.log('Received company scan request', req.body);
    try {
      const rawUrl = String(req.body?.url || '').trim();
      if (!rawUrl) {
        res.status(400).json({ error: 'Company URL is required.' });
        return;
      }

      const { normalizedUrl, domain } = normalizeUrlInput(rawUrl);
      const pageSignals = await fetchPublicPageSignals(normalizedUrl);

      let aiSynthesisNote: string | undefined;
      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this company domain for an Aetheris Golden Report forensic intake scan:
Domain: ${domain}
URL: ${normalizedUrl}
Observed Page Title: ${pageSignals.pageTitle || 'Not exposed'}
Observed Meta Description: ${pageSignals.metaDescription || 'Not exposed'}

Write a concise 2-sentence forensic intake hypothesis identifying where lead capture, quote handoff, or billing friction typically emerges at subsystem interfaces for this business model, strictly adhering to the Aetheris rule that a public URL is an intake signal and not proof of internal CRM staffing or realized financial loss.`,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          });
          aiSynthesisNote = response.text?.trim();
        } catch {
          // Graceful fallback to deterministic compiler if Gemini key is unconfigured or rate-limited
        }
      }

      const report = compileCompanyScanReport({
        rawUrl: normalizedUrl,
        fetchedHtml: pageSignals.html,
        pageTitle: pageSignals.pageTitle,
        metaDescription: pageSignals.metaDescription,
        aiSynthesisNote,
      });

      res.json(report);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid company URL';
      res.status(400).json({ error: msg });
    }
  });

  // POST /api/scan/person — Multi-Vector LinkedIn & OSINT Mindprint 10-Stage Engine + 12-Section Dossier
  app.post('/api/scan/person', async (req, res) => {
    console.log('Received person scan request', { url: req.body?.url, company: req.body?.activeCompanyScan?.companyName });
    try {
      const rawUrl = String(req.body?.url || '').trim();
      const bioText = String(req.body?.bioText || '').trim();
      const activeCompanyScan = req.body?.activeCompanyScan as CompanyScanReport | undefined;

      if (!rawUrl) {
        res.status(400).json({ error: 'Person URL is required.' });
        return;
      }

      const { normalizedUrl, domain, pathSegments } = normalizeUrlInput(rawUrl);
      const osintResult = await scrapePersonOsintFootprint(
        normalizedUrl,
        domain,
        pathSegments,
        bioText
      );

      const combinedBio = [bioText, osintResult.combinedScrapedText]
        .filter(Boolean)
        .join('\n\n')
        .slice(0, 12_000);

      let aiSynthesisNote: string | undefined;
      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Perform an Aetheris Mindprint source-constrained communication & decision requirement hypothesis for:
Profile URL: ${normalizedUrl}
Scraped OSINT Sources (${osintResult.scrapedSources.length}): ${combinedBio.slice(0, 2500) || 'URL reference only'}
Target Company Context: ${activeCompanyScan?.companyName || 'Enterprise Organization'} (${activeCompanyScan?.domain || 'N/A'})

Write a concise 2-sentence forensic investigator synthesis describing their observable communication DNA (length, data vs story, directness), decision sequence (evidence -> strategic fit -> business impact -> alignment), and what proof to bring to a first meeting, explicitly noting that public profile signals are hypotheses rather than psychological diagnoses.`,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          });
          aiSynthesisNote = response.text?.trim();
        } catch {
          // Graceful fallback to deterministic Mindprint 12-section compiler
        }
      }

      const report = compilePersonScanReport({
        rawUrl: normalizedUrl,
        SupplementaryBioText: combinedBio,
        activeCompanyScan,
        aiSynthesisNote,
        scrapedSources: osintResult.scrapedSources,
        extractedPersonName: osintResult.extractedPersonName,
        extractedRoleTitle: osintResult.extractedRoleTitle,
      });

      res.json(report);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid person URL';
      res.status(400).json({ error: msg });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
        watch: null,
      },
      plugins: [
        {
          name: 'aistudio-safe-hmr-client',
          transform(code, id) {
            if (id.includes('vite/dist/client/client.mjs')) {
              return code.replace(
                'transport.connect(createHMRHandler(handleMessage));',
                '// HMR WebSocket disabled in preview middleware environment'
              );
            }
            return null;
          },
        },
      ],
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Aetheris Forensic OS server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
