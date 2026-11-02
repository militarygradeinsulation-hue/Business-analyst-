import React, { useState } from 'react';
import {
  Globe,
  UserCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Scale,
  Network,
  Handshake,
  Database,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
} from 'lucide-react';
import {
  CompanyScanReport,
  PersonScanReport,
  compileCompanyScanReport,
  compilePersonScanReport,
} from '../lib/urlScannerBrain';
import { buildGoldenReportFullDossier } from '../lib/goldenReportComplete';
import { GoldenReportCompleteView } from './GoldenReportCompleteView';
import { GoldenLedgerView } from './GoldenLedgerView';
import { MindprintGraphView } from './MindprintGraphView';
import { AskIntrosView } from './AskIntrosView';
import { CollectiveBrainView } from './CollectiveBrainView';
import { MindprintIntelligenceReportView } from './MindprintIntelligenceReportView';
import { FinanceBento } from './ui/finance-bento';
import { generateForensicBentoData } from '../lib/forensicBentoAdapter';

interface UrlScannerCommandViewProps {
  companyScan: CompanyScanReport | null;
  personScan: PersonScanReport | null;
  onCompanyScanComplete: (report: CompanyScanReport) => void;
  onPersonScanComplete: (report: PersonScanReport) => void;
  onBothScansComplete: (company: CompanyScanReport, person: PersonScanReport) => void;
  onClearScans: () => void;
}

export const UrlScannerCommandView: React.FC<UrlScannerCommandViewProps> = ({
  companyScan,
  personScan,
  onCompanyScanComplete,
  onPersonScanComplete,
  onBothScansComplete,
  onClearScans,
}) => {
  const [companyUrlInput, setCompanyUrlInput] = useState<string>('');
  const [personUrlInput, setPersonUrlInput] = useState<string>('');
  const [personBioInput, setPersonBioInput] = useState<string>('');
  const [showBioInput, setShowBioInput] = useState<boolean>(false);

  const [isScanningCompany, setIsScanningCompany] = useState<boolean>(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const [isScanningPerson, setIsScanningPerson] = useState<boolean>(false);
  const [personError, setPersonError] = useState<string | null>(null);

  const [isScanningBoth, setIsScanningBoth] = useState<boolean>(false);

  // Expandable sections for Company and Person scans
  const [showGoldenReportComplete, setShowGoldenReportComplete] = useState<boolean>(true);
  const [showFullMindprintDossier, setShowFullMindprintDossier] = useState<boolean>(true);
  const [showVisualBento, setShowVisualBento] = useState<boolean>(true);
  const [showPreviewBento, setShowPreviewBento] = useState<boolean>(false);
  const [activeDeepDive, setActiveDeepDive] = useState<
    'none' | 'ledger' | 'graph' | 'askintros' | 'collective'
  >('none');

  const hasAnyResult = Boolean(companyScan || personScan);
  const hasCombinedResult = Boolean(companyScan && personScan);

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const fetchCompanyScan = async (rawUrl: string): Promise<CompanyScanReport> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch('/api/scan/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawUrl }),
        signal: controller.signal,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to deterministic local compiler
    } finally {
      clearTimeout(timer);
    }
    return compileCompanyScanReport({ rawUrl });
  };

  const fetchPersonScan = async (
    rawUrl: string,
    bioText: string,
    companyContext?: CompanyScanReport | null
  ): Promise<PersonScanReport> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch('/api/scan/person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: rawUrl,
          bioText,
          activeCompanyScan: companyContext ?? undefined,
        }),
        signal: controller.signal,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to deterministic local compiler
    } finally {
      clearTimeout(timer);
    }
    return compilePersonScanReport({
      rawUrl,
      SupplementaryBioText: bioText,
      activeCompanyScan: companyContext ?? undefined,
    });
  };

  const handleRunCompanyScan = async (targetUrl: string) => {
    const effectiveUrl = targetUrl.trim() || 'https://discflo.com/';
    if (!targetUrl.trim()) {
      setCompanyUrlInput(effectiveUrl);
    }
    setCompanyError(null);
    setIsScanningCompany(true);
    try {
      const immediateReport = compileCompanyScanReport({ rawUrl: effectiveUrl });
      onCompanyScanComplete(immediateReport);
      setShowGoldenReportComplete(true);

      const enriched = await fetchCompanyScan(effectiveUrl);
      onCompanyScanComplete(enriched);
    } catch (err) {
      setCompanyError(err instanceof Error ? err.message : 'Invalid company URL');
    } finally {
      setIsScanningCompany(false);
    }
  };

  const handleRunPersonScan = async (
    targetUrl: string,
    bioOverride?: string,
    companyContext?: CompanyScanReport | null
  ) => {
    const effectiveUrl =
      targetUrl.trim() || 'https://www.linkedin.com/in/tiffany-spahl-nally';
    const effectiveBio =
      bioOverride ??
      (personBioInput.trim() ||
        (effectiveUrl.includes('tiffany-spahl-nally')
          ? 'Positive Thinker | Smile Spreader | Beach Lover · Chief Revenue Officer (CRO) · Strategic Advisor · Director of Sales, Americas · Director, Enterprise Accounts - SouthEast'
          : ''));
    if (!targetUrl.trim()) {
      setPersonUrlInput(effectiveUrl);
    }
    setPersonError(null);
    setIsScanningPerson(true);
    try {
      const activeComp = companyContext ?? companyScan;
      const immediateReport = compilePersonScanReport({
        rawUrl: effectiveUrl,
        SupplementaryBioText: effectiveBio,
        activeCompanyScan: activeComp ?? undefined,
      });
      onPersonScanComplete(immediateReport);
      setShowFullMindprintDossier(true);

      const enriched = await fetchPersonScan(
        effectiveUrl,
        effectiveBio,
        activeComp
      );
      onPersonScanComplete(enriched);
    } catch (err) {
      setPersonError(err instanceof Error ? err.message : 'Invalid person URL');
    } finally {
      setIsScanningPerson(false);
    }
  };

  const handleRunBothScans = async (
    overrideCompanyUrl?: string,
    overridePersonUrl?: string,
    overrideBio?: string
  ) => {
    const targetCompanyUrl =
      (overrideCompanyUrl ?? companyUrlInput).trim() ||
      companyScan?.normalizedUrl ||
      'https://discflo.com/';
    const targetPersonUrl =
      (overridePersonUrl ?? personUrlInput).trim() ||
      personScan?.normalizedUrl ||
      'https://www.linkedin.com/in/tiffany-spahl-nally';
    const targetBio =
      overrideBio ??
      (personBioInput.trim() ||
        (targetPersonUrl.includes('tiffany-spahl-nally')
          ? 'Positive Thinker | Smile Spreader | Beach Lover · Chief Revenue Officer (CRO) · Strategic Advisor · Director of Sales, Americas · Director, Enterprise Accounts - SouthEast'
          : ''));

    setCompanyUrlInput(targetCompanyUrl);
    setPersonUrlInput(targetPersonUrl);
    if (overrideBio !== undefined) {
      setPersonBioInput(overrideBio);
    }

    setCompanyError(null);
    setPersonError(null);
    setIsScanningBoth(true);
    setIsScanningCompany(true);
    setIsScanningPerson(true);

    try {
      // Immediately compile and render the synchronized Company + Person scan
      const immediateComp = compileCompanyScanReport({ rawUrl: targetCompanyUrl });
      const immediatePers = compilePersonScanReport({
        rawUrl: targetPersonUrl,
        SupplementaryBioText: targetBio,
        activeCompanyScan: immediateComp,
      });
      onBothScansComplete(immediateComp, immediatePers);
      setShowGoldenReportComplete(true);
      setShowFullMindprintDossier(true);

      // Enrich both concurrently in parallel from server OSINT
      const [enrichedComp, enrichedPers] = await Promise.all([
        fetchCompanyScan(targetCompanyUrl),
        fetchPersonScan(targetPersonUrl, targetBio, immediateComp),
      ]);
      onBothScansComplete(enrichedComp, enrichedPers);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to execute combined scan';
      setCompanyError(msg);
    } finally {
      setIsScanningBoth(false);
      setIsScanningCompany(false);
      setIsScanningPerson(false);
    }
  };

  const goldenDossier = companyScan ? buildGoldenReportFullDossier(companyScan) : null;

  return (
    <div className="space-y-6">
      {/* DUAL SCANNER PANELS (.plans / .plan from Daemon Template) — POSITIONED ABOVE THE FOLD */}
      <div className="plans">
        {/* PANEL 01: COMPANY URL SCAN */}
        <div className="plan flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="badge">
                <i></i>
                <span>01 // COMPANY URL SCAN · GOLDEN REPORT V6</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/80 shrink-0">
                22-Chapter Audit
              </span>
            </div>

            <div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white">
                Scan Company Website URL
              </h2>
              <p className="text-xs sm:text-sm text-[#c4c4c4] mt-1">
                Enter any company domain to quantify annual revenue leakage across 13 canonical
                leak categories, SEO/CTA friction, and 30/60/90 remediation.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunCompanyScan(companyUrlInput);
              }}
              className="space-y-2.5"
            >
              <label
                htmlFor="company-url-input"
                className="block font-mono text-xs uppercase tracking-wider text-white/90 font-semibold"
              >
                Target Company Website URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="company-url-input"
                  type="text"
                  value={companyUrlInput}
                  onChange={(e) => setCompanyUrlInput(e.target.value)}
                  placeholder="https://discflo.com/ (or enter any domain)"
                  className="daemon-input flex-1"
                />
                <button
                  type="submit"
                  disabled={isScanningCompany || isScanningBoth}
                  className="btn-skeu shrink-0"
                >
                  <span className="dot" />
                  <span>{isScanningCompany ? 'Scanning URL...' : 'Scan Company URL'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {companyError && (
              <div className="font-mono text-xs text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{companyError}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#bdbdbd] mr-1">
              1-Click Targets:
            </span>
            {[
              { label: 'discflo.com ($357k–$440k PDF Case)', url: 'https://discflo.com/' },
              { label: 'stripe.com', url: 'https://stripe.com' },
              { label: 'linear.app', url: 'https://linear.app' },
              { label: 'aetheris.tech', url: 'https://aetheris.tech' },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setCompanyUrlInput(preset.url);
                  handleRunCompanyScan(preset.url);
                }}
                className="daemon-chip"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* PANEL 02: PERSON URL SCAN */}
        <div className="plan flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="badge">
                <i></i>
                <span>02 // PERSON URL SCAN · MINDPRINT OSINT</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/80 shrink-0">
                12-Section Dossier
              </span>
            </div>

            <div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white">
                Scan LinkedIn / Executive URL
              </h2>
              <p className="text-xs sm:text-sm text-[#c4c4c4] mt-1">
                Multi-vector LinkedIn &amp; public OSINT scraper. Maps Communication DNA, Thinking
                Core Graph, MBTI Hypothesis, ACH Casebook, and Opening Pitch.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunPersonScan(personUrlInput);
              }}
              className="space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor="person-url-input"
                  className="block font-mono text-xs uppercase tracking-wider text-white/90 font-semibold"
                >
                  LinkedIn or Executive Profile URL
                </label>
                <button
                  type="button"
                  onClick={() => setShowBioInput((s) => !s)}
                  className="font-mono text-[11px] text-[#bdbdbd] hover:text-white underline cursor-pointer"
                >
                  {showBioInput ? '− Hide Pasted Bio Notes' : '+ Add Optional Bio / Post Text'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="person-url-input"
                  type="text"
                  value={personUrlInput}
                  onChange={(e) => setPersonUrlInput(e.target.value)}
                  placeholder="https://www.linkedin.com/in/tiffany-spahl-nally"
                  className="daemon-input flex-1"
                />
                <button
                  type="submit"
                  disabled={isScanningPerson || isScanningBoth}
                  className="btn-skeu shrink-0"
                >
                  <span className="dot" />
                  <span>{isScanningPerson ? 'Scraping OSINT...' : 'Scan Person URL'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {showBioInput && (
                <textarea
                  rows={2}
                  value={personBioInput}
                  onChange={(e) => setPersonBioInput(e.target.value)}
                  placeholder="Optional: Paste LinkedIn headline, bio, or post excerpts to enrich multi-source OSINT analysis..."
                  className="daemon-input text-xs"
                />
              )}
            </form>

            {personError && (
              <div className="font-mono text-xs text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{personError}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#bdbdbd] mr-1">
              1-Click Profiles:
            </span>
            {[
              {
                label: 'Tiffany Spahl-Nally (CRO · PDF Case)',
                url: 'https://www.linkedin.com/in/tiffany-spahl-nally',
                bio: 'Positive Thinker | Smile Spreader | Beach Lover · Chief Revenue Officer (CRO) · Strategic Advisor · Director of Sales, Americas · Director, Enterprise Accounts - SouthEast',
              },
              {
                label: 'Joseph Toney (Founder)',
                url: 'https://www.linkedin.com/in/joseph-toney',
                bio: 'Founder of Aetheris Technology. Systems-level forensic methodology connecting organizational diagnostics, human decision architecture, and verified recovery.',
              },
              {
                label: 'Elena Vance (VP RevOps)',
                url: 'https://www.linkedin.com/in/elena-vance-revops',
                bio: 'VP Revenue Operations. Enforces strict CRM stage exit criteria, SLA routing governance, and margin-adjusted pipeline attribution.',
              },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setPersonUrlInput(preset.url);
                  setPersonBioInput(preset.bio);
                  handleRunPersonScan(preset.url, preset.bio);
                }}
                className="daemon-chip"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL 03: ALWAYS-VISIBLE COMBINED SCAN ("SCAN BOTH TOGETHER") */}
      <div className="plan plan-highlight flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">
              <i></i>
              <span>03 // SYNCHRONIZED DUAL-VECTOR EXECUTION</span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/80">
              Company Audit + Executive Mindprint + Butler Brief
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
            Scan Both Company &amp; Person Together
          </h3>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="font-mono text-[11px] uppercase text-[#bdbdbd]">
              1-Click Synchronized Pairs:
            </span>
            <button
              type="button"
              onClick={() =>
                handleRunBothScans(
                  'https://discflo.com/',
                  'https://www.linkedin.com/in/tiffany-spahl-nally',
                  'Positive Thinker | Smile Spreader | Beach Lover · Chief Revenue Officer (CRO) · Strategic Advisor · Director of Sales, Americas · Director, Enterprise Accounts - SouthEast'
                )
              }
              className="daemon-chip"
            >
              discflo.com + Tiffany Spahl-Nally (Full PDF Benchmark Pair)
            </button>
            <button
              type="button"
              onClick={() =>
                handleRunBothScans(
                  'https://aetheris.tech',
                  'https://www.linkedin.com/in/joseph-toney',
                  'Founder of Aetheris Technology. Systems-level forensic methodology connecting organizational diagnostics, human decision architecture, and verified recovery.'
                )
              }
              className="daemon-chip"
            >
              aetheris.tech + Joseph Toney
            </button>
            <button
              type="button"
              onClick={() => setShowPreviewBento((p) => !p)}
              className="daemon-chip inline-flex items-center gap-1.5"
            >
              <span>{showPreviewBento ? 'Hide Bento Visuals' : 'Preview Bento Visuals'}</span>
              {showPreviewBento ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {hasAnyResult && (
              <button
                type="button"
                onClick={() => {
                  setCompanyUrlInput('');
                  setPersonUrlInput('');
                  setPersonBioInput('');
                  setActiveDeepDive('none');
                  onClearScans();
                }}
                className="daemon-chip inline-flex items-center gap-1.5 text-rose-300 border-rose-500/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Active Scans</span>
              </button>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            disabled={isScanningBoth || isScanningCompany || isScanningPerson}
            onClick={() => handleRunBothScans()}
            className="btn-skeu"
            style={{ padding: '16px 26px', fontSize: '13.5px' }}
          >
            <span className="dot" />
            <span>
              {isScanningBoth
                ? 'Synchronizing Dual Scan...'
                : 'Scan Both Company & Person Together'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PREVIEW BENCHMARK BENTO (SHOWN WHEN REQUESTED PRIOR TO SCAN) */}
      {showPreviewBento && !hasAnyResult && (
        <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#070707] space-y-4 animate-view-enter">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="badge">
                <i></i>
                <span>BENCHMARK VISUAL BENTO · DISCFLO CORPORATION ($1.38M–$1.66M)</span>
              </span>
            </div>
            <span className="font-mono text-xs text-[#9a9a9a]">
              Interactive SVG Stream · Allocation Gauge · Cash Flow Waves
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/90 p-2 sm:p-4">
            <FinanceBento
              data={generateForensicBentoData()}
              title="Discflo Corporation"
              subtitle="Canonical Ledger v6 Benchmark Model · 13 Priced Leaks · F Grade"
              credit={false}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* RESULTS ANCHOR & SECTION */}
      <div id="scan-results-anchor" />
      {hasAnyResult && (
        <div className="space-y-10 animate-view-enter pt-4">
          {/* COMBINED COMPANY × PERSON FORENSIC SYNTHESIS BRIDGE (Shown when both are scanned!) */}
          {hasCombinedResult && companyScan && personScan && goldenDossier && (
            <div className="plan space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="badge mb-2">
                    <i></i>
                    <span>SYNCHRONIZED COMPANY × EXECUTIVE FORENSIC BRIDGE</span>
                  </div>
                  <h2 className="font-display text-4xl uppercase tracking-tight text-white">
                    {goldenDossier.companyName} <span className="soft">×</span>{' '}
                    {personScan.personName}
                  </h2>
                  <p className="font-mono text-xs text-[#9a9a9a] mt-1">
                    Organization Exposure: {formatUSD(goldenDossier.totalAnnualLow)} –{' '}
                    {formatUSD(goldenDossier.totalAnnualHigh)}/yr ({goldenDossier.pricedLeaksCount}{' '}
                    Priced Leaks) · Executive Target: {personScan.inferredRoleTitle} (Ask Intros
                    Match: {personScan.askIntrosExecution.matchResult.score}/100)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDeepDive((d) => (d === 'graph' ? 'none' : 'graph'))
                    }
                    className="btn-skeu"
                  >
                    <span className="dot" />
                    <span>
                      {activeDeepDive === 'graph'
                        ? 'Hide Evidence Graph'
                        : 'Expand Shared Evidence Graph'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDeepDive((d) => (d === 'askintros' ? 'none' : 'askintros'))
                    }
                    className="btn-skeu"
                  >
                    <span>
                      {activeDeepDive === 'askintros'
                        ? 'Hide Ask Intros Calculator'
                        : 'Expand Ask Intros Calculator'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 rounded border border-white/10 bg-[#070707] space-y-1.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#9a9a9a]">
                    01 // WHY THEM (ROLE FIT)
                  </div>
                  <div className="text-white leading-relaxed">
                    {personScan.askIntrosExecution.butlerMeetingBrief.whyThem}
                  </div>
                </div>
                <div className="p-4 rounded border border-white/10 bg-[#070707] space-y-1.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#9a9a9a]">
                    02 // WHY YOU (PROOF ASSET)
                  </div>
                  <div className="text-white leading-relaxed">
                    {personScan.askIntrosExecution.butlerMeetingBrief.whyYou}
                  </div>
                </div>
                <div className="p-4 rounded border border-white/10 bg-[#070707] space-y-1.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#9a9a9a]">
                    03 // WHY NOW (TIMING WINDOW)
                  </div>
                  <div className="text-white leading-relaxed">
                    {personScan.askIntrosExecution.butlerMeetingBrief.whyNow}
                  </div>
                </div>
                <div className="p-4 rounded border border-white/10 bg-[#070707] space-y-1.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#9a9a9a]">
                    04 // FIRST MEETING OBJECTIVE
                  </div>
                  <div className="text-white leading-relaxed">
                    {personScan.askIntrosExecution.butlerMeetingBrief.firstMeetingObjective}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPANY SCAN SUMMARY & EXPAND CONTROLS */}
          {companyScan && goldenDossier && (
            <div className="space-y-6">
              <div className="plan space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="svc-num">
                      <span>COMPANY URL SCAN RESULT · {companyScan.domain}</span>
                    </div>
                    <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                      {goldenDossier.companyName}
                    </h2>
                    <div className="font-mono text-xs text-[#9a9a9a] mt-1">
                      {companyScan.industry} · {goldenDossier.pricedLeaksCount} Uniquely Priced
                      Leaks · {goldenDossier.detectedFindingsCount} Findings ·{' '}
                      {goldenDossier.weightedSignalsCount} Weighted Signals
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <div className="text-xs uppercase tracking-wider text-rose-400">
                      Total Annual Revenue Loss (Ledger v6)
                    </div>
                    <div className="metric text-rose-400 mt-1 tabular-nums" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
                      {formatUSD(goldenDossier.totalAnnualLow)} –{' '}
                      {formatUSD(goldenDossier.totalAnnualHigh)}
                    </div>
                  </div>
                </div>

                {/* Key Financial Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 rounded border border-white/10 bg-[#070707]">
                    <div className="text-xs text-[#9a9a9a]">Top 10 Active Leaks</div>
                    <div className="text-lg font-bold text-white tabular-nums mt-1">
                      {formatUSD(goldenDossier.top10SubtotalLow)} –{' '}
                      {formatUSD(goldenDossier.top10SubtotalHigh)}
                    </div>
                    <div className="text-[11px] text-[#9a9a9a] mt-0.5">
                      #1 Owner &amp; Capacity: {goldenDossier.top10Leaks[0]?.rangeLabel}
                    </div>
                  </div>

                  <div className="p-4 rounded border border-white/10 bg-[#070707]">
                    <div className="text-xs text-[#9a9a9a]">Remaining 3 Priced Leaks</div>
                    <div className="text-lg font-bold text-white tabular-nums mt-1">
                      {formatUSD(goldenDossier.remainderSubtotalLow)} –{' '}
                      {formatUSD(goldenDossier.remainderSubtotalHigh)}
                    </div>
                    <div className="text-[11px] text-[#9a9a9a] mt-0.5">
                      Authority, CTA &amp; Proof Leaks
                    </div>
                  </div>

                  <div className="p-4 rounded border border-white/10 bg-[#070707]">
                    <div className="text-xs text-[#9a9a9a]">Modeled Net Profit Bridge</div>
                    <div className="text-lg font-bold text-white tabular-nums mt-1">
                      {formatUSD(companyScan.profitBridgeSummary.bridge.netEconomicBenefit)} (
                      {companyScan.profitBridgeSummary.bridge.roiPercent}% ROI)
                    </div>
                    <div className="text-[11px] text-[#9a9a9a] mt-0.5">
                      Accrual-consistent contribution
                    </div>
                  </div>

                  <div className="p-4 rounded border border-white/10 bg-[#070707]">
                    <div className="text-xs text-[#9a9a9a]">DOM &amp; Schema Signals</div>
                    <div className="text-lg font-bold text-white tabular-nums mt-1">
                      Grade {goldenDossier.overallGrade} ({goldenDossier.overallFrictionScore}/100)
                    </div>
                    <div className="text-[11px] text-[#9a9a9a] mt-0.5">
                      {companyScan.liveDomSignals.formsDetected} forms ·{' '}
                      {companyScan.liveDomSignals.ctaCount} CTAs · schema: false
                    </div>
                  </div>
                </div>

                {/* EXPAND / COLLAPSE ACTION BAR FOR COMPANY SCAN */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVisualBento((s) => !s)}
                    aria-expanded={showVisualBento}
                    className="btn-skeu"
                  >
                    <span className="dot" />
                    <span>
                      {showVisualBento
                        ? 'Collapse Visual Bento Dashboard'
                        : 'Expand Visual Bento Dashboard'}
                    </span>
                    {showVisualBento ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGoldenReportComplete((s) => !s)}
                    aria-expanded={showGoldenReportComplete}
                    className="btn-skeu"
                  >
                    <span className="dot" />
                    <span>
                      {showGoldenReportComplete
                        ? 'Collapse Full 22-Chapter Golden Report Audit'
                        : 'Expand Full 22-Chapter Golden Report Audit'}
                    </span>
                    {showGoldenReportComplete ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDeepDive((d) => (d === 'ledger' ? 'none' : 'ledger'))
                    }
                    aria-expanded={activeDeepDive === 'ledger'}
                    className="daemon-chip py-3 px-4 inline-flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    <span>
                      {activeDeepDive === 'ledger'
                        ? 'Hide Interactive Profit Bridge & Sensitivity Matrix'
                        : 'Expand Interactive Profit Bridge & Sensitivity Matrix'}
                    </span>
                    {activeDeepDive === 'ledger' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDeepDive((d) => (d === 'collective' ? 'none' : 'collective'))
                    }
                    aria-expanded={activeDeepDive === 'collective'}
                    className="daemon-chip py-3 px-4 inline-flex items-center gap-2"
                  >
                    <Database className="w-4 h-4" />
                    <span>
                      {activeDeepDive === 'collective'
                        ? 'Hide Collective Brain Benchmark'
                        : 'Expand Collective Brain Benchmark'}
                    </span>
                    {activeDeepDive === 'collective' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* INTERACTIVE FORENSIC BENTO CHARTS (VISUAL DASHBOARD) */}
                {showVisualBento && (
                  <div className="space-y-4 pt-4 border-t border-white/10 animate-view-enter">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                      <div className="flex items-center gap-2">
                        <span className="badge">
                          <i></i>
                          <span>FORENSIC VISUAL BENTO · NET EXPOSURE &amp; FLOW CHARTS</span>
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[#9a9a9a]">
                        Interactive SVG Graphs · Allocation Gauge · Cash Flow Waves · Weekly Telemetry
                      </span>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/90 p-2 sm:p-4">
                      <FinanceBento
                        data={generateForensicBentoData({ companyScan, personScan })}
                        title={goldenDossier.companyName}
                        subtitle={`Model v6 Canonical Ledger · ${goldenDossier.pricedLeaksCount} Priced Leaks · ${goldenDossier.overallGrade} Friction Rating`}
                        credit={false}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* EXPANDED 22-CHAPTER GOLDEN REPORT COMPLETE VIEW */}
              {showGoldenReportComplete && (
                <GoldenReportCompleteView companyScan={companyScan} />
              )}
            </div>
          )}

          {/* PERSON SCAN SUMMARY & EXPAND CONTROLS */}
          {personScan && (
            <div className="space-y-6">
              <div className="plan space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="svc-num">
                      <span>
                        PERSON URL SCAN RESULT · {personScan.scrapedSources.length} OSINT SOURCES
                      </span>
                    </div>
                    <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                      {personScan.personName}
                    </h2>
                    <div className="font-mono text-xs text-[#9a9a9a] mt-1">
                      {personScan.inferredRoleTitle} · {personScan.stats.extractedSignalsCount}{' '}
                      Signals · Confidence: {personScan.stats.systemConfidenceLabel} (
                      {personScan.stats.systemConfidenceScore}/100)
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <div className="text-xs uppercase tracking-wider text-[#9a9a9a]">
                      Ask Intros Match Score
                    </div>
                    <div className="metric text-white mt-1 tabular-nums" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
                      {personScan.askIntrosExecution.matchResult.score}
                      <small>/100</small>
                    </div>
                  </div>
                </div>

                {/* EXPAND / COLLAPSE ACTION BAR FOR PERSON SCAN */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFullMindprintDossier((s) => !s)}
                    aria-expanded={showFullMindprintDossier}
                    className="btn-skeu"
                  >
                    <span className="dot" />
                    <span>
                      {showFullMindprintDossier
                        ? 'Collapse Full 12-Section Mindprint Dossier'
                        : 'Expand Full 12-Section Mindprint Dossier'}
                    </span>
                    {showFullMindprintDossier ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDeepDive((d) => (d === 'graph' ? 'none' : 'graph'))
                    }
                    aria-expanded={activeDeepDive === 'graph'}
                    className="daemon-chip py-3 px-4 inline-flex items-center gap-2"
                  >
                    <Network className="w-4 h-4" />
                    <span>
                      {activeDeepDive === 'graph'
                        ? 'Hide Company-Person Evidence Graph'
                        : 'Expand Company-Person Evidence Graph'}
                    </span>
                    {activeDeepDive === 'graph' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDeepDive((d) => (d === 'askintros' ? 'none' : 'askintros'))
                    }
                    aria-expanded={activeDeepDive === 'askintros'}
                    className="daemon-chip py-3 px-4 inline-flex items-center gap-2"
                  >
                    <Handshake className="w-4 h-4" />
                    <span>
                      {activeDeepDive === 'askintros'
                        ? 'Hide Ask Intros Scoring Calculator'
                        : 'Expand Ask Intros Scoring Calculator'}
                    </span>
                    {activeDeepDive === 'askintros' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {showFullMindprintDossier && (
                <MindprintIntelligenceReportView
                  intelligence={personScan.fullIntelligence}
                  aiSynthesisNote={personScan.aiSynthesisNote}
                />
              )}
            </div>
          )}

          {/* ON-DEMAND DEEP FORENSICS DRAWER */}
          {activeDeepDive !== 'none' && (
            <div className="pt-4 animate-view-enter">
              {activeDeepDive === 'ledger' && (
                <GoldenLedgerView companyScan={companyScan ?? undefined} />
              )}
              {activeDeepDive === 'graph' && (
                <MindprintGraphView personScan={personScan ?? undefined} />
              )}
              {activeDeepDive === 'askintros' && (
                <AskIntrosView personScan={personScan ?? undefined} />
              )}
              {activeDeepDive === 'collective' && <CollectiveBrainView />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
