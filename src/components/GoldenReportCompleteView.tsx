import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Calendar,
  Share2,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import { CompanyScanReport } from '../lib/urlScannerBrain';
import { buildGoldenReportFullDossier } from '../lib/goldenReportComplete';

interface GoldenReportCompleteViewProps {
  companyScan: CompanyScanReport;
}

type GoldenSectionTab =
  | 'all'
  | 'overview-leaks'
  | 'diagnostic-chapters'
  | 'growth-blueprint'
  | 'reconciliation';

export const GoldenReportCompleteView: React.FC<GoldenReportCompleteViewProps> = ({
  companyScan,
}) => {
  const dossier = useMemo(() => buildGoldenReportFullDossier(companyScan), [companyScan]);

  const [activeTab, setActiveTab] = useState<GoldenSectionTab>('all');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'site-autopsy': true,
    'owner-capacity': true,
  });
  const [expandedLeaks, setExpandedLeaks] = useState<Record<string, boolean>>({
    'ch:owner-capacity': true,
  });
  const [showAllPosts, setShowAllPosts] = useState<boolean>(false);
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  const toggleChapter = (slug: string) => {
    setExpandedChapters((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const toggleLeak = (leakId: string) => {
    setExpandedLeaks((prev) => ({ ...prev, [leakId]: !prev[leakId] }));
  };

  const expandAllChapters = () => {
    const next: Record<string, boolean> = {};
    dossier.chapters.forEach((ch) => {
      next[ch.chapterSlug] = true;
    });
    setExpandedChapters(next);
  };

  const collapseAllChapters = () => {
    setExpandedChapters({});
  };

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const showSection = (tab: GoldenSectionTab) => activeTab === 'all' || activeTab === tab;

  return (
    <div className="space-y-8 text-white">
      {/* COVER BANNER — Forensic Audit Report (Page 1 of Golden Report PDF) */}
      <div className="plan space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="badge mb-3">
              <i></i>
              <span>AETHERIS · BUSINESS FORENSICS · MODEL V6</span>
            </div>
            <h2 className="h2" style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Forensic Audit Report <span className="soft">// {dossier.companyName}</span>
            </h2>
            <div className="font-mono text-xs text-[#9a9a9a] mt-2 space-x-3">
              <span>Target: {dossier.targetUrl}</span>
              <span>·</span>
              <span>Generated: {dossier.generatedAt}</span>
              <span>·</span>
              <span>Scan ID: {dossier.scanId}</span>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <div className="text-[11px] uppercase tracking-widest text-[#9a9a9a]">
              OVERALL CONVERSION FRICTION
            </div>
            <div className="metric mt-1" style={{ fontSize: 'clamp(42px, 4.5vw, 64px)' }}>
              {dossier.overallFrictionScore}
              <small>/100 (GRADE {dossier.overallGrade})</small>
            </div>
          </div>
        </div>

        {/* TOTAL ESTIMATED ANNUAL REVENUE LOSS BOX */}
        <div
          className="p-6 rounded border"
          style={{
            borderColor: 'rgba(239, 68, 68, 0.45)',
            background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.08), rgba(10, 10, 10, 0.9))',
          }}
        >
          <div className="font-mono text-xs uppercase tracking-widest text-rose-400">
            TOTAL ESTIMATED ANNUAL REVENUE LOSS
          </div>
          <div
            className="metric text-rose-400 mt-2 tabular-nums"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
          >
            {formatUSD(dossier.totalAnnualLow)} – {formatUSD(dossier.totalAnnualHigh)}{' '}
            <small>/ YEAR</small>
          </div>
          <p className="text-sm text-white/90 mt-3 max-w-4xl">
            Sum of the <strong>{dossier.pricedLeaksCount} uniquely priced leaks</strong> documented in
            this report across {dossier.detectedFindingsCount} detected findings and{' '}
            {dossier.uniqueRootCausesCount} unique root causes. Every dollar is a system your business
            is bleeding right now. Each chapter below shows where and how to stop it.
          </p>
          <div className="font-mono text-[11px] text-[#9a9a9a] mt-3 pt-3 border-t border-white/10">
            ANNUAL REVENUE LOSS: Included in total annual revenue loss · SOURCE EVIDENCE: Not a
            separate leak total · IMPLEMENTATION INVESTMENT: Not included in annual revenue loss total
            · RECOVERY SCENARIO: Not a second annual revenue loss total.
          </div>
        </div>

        {/* SECTION FILTER TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="toggle" role="tablist" aria-label="Golden Report Section Filter">
            {[
              { id: 'all', label: 'Full Report (All 22 Sections)' },
              { id: 'overview-leaks', label: '01–03 Confidence, Summary & Top 10 Leaks' },
              { id: 'diagnostic-chapters', label: '08–20 Site Autopsy & Chapter Diagnostics' },
              { id: 'growth-blueprint', label: '04–07 Brand Blueprint, Posts & 30-Day Schedule' },
              { id: 'reconciliation', label: '21–22 Ledger v6 Reconciliation' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                aria-pressed={activeTab === t.id}
                onClick={() => setActiveTab(t.id as GoldenSectionTab)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 01 EVIDENCE CONFIDENCE & 02 EXECUTIVE SUMMARY + 03 TOP 10 ACTIVE LEAKS */}
      {showSection('overview-leaks') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 01 Evidence Confidence */}
            <div className="lg:col-span-5 plan space-y-4">
              <div className="svc-num">
                <span>SECTION 01</span>
                <span>EVIDENCE CONFIDENCE</span>
              </div>
              <h3 className="font-display text-3xl uppercase tracking-tight">
                01. Evidence Confidence
              </h3>
              <p className="text-xs text-[#9a9a9a] leading-relaxed">
                This report evaluated {dossier.claimsEvaluatedCount} evidence-based claims across{' '}
                {dossier.detectedFindingsCount} findings and {dossier.uniqueRootCausesCount} root
                causes ({dossier.weightedSignalsCount} weighted signals).
              </p>

              <div className="divide-y divide-white/10 border-t border-b border-white/10 font-mono text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9a9a9a]">Claims Evaluated</span>
                  <span className="text-white font-bold tabular-nums">
                    {dossier.claimsEvaluatedCount}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9a9a9a]">Findings Detected</span>
                  <span className="text-white font-bold tabular-nums">
                    {dossier.detectedFindingsCount}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9a9a9a]">Uniquely Priced Leaks (Model v6)</span>
                  <span className="text-white font-bold tabular-nums">
                    {dossier.pricedLeaksCount}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9a9a9a]">Directly Observed Claims</span>
                  <span className="text-white font-bold tabular-nums">
                    {dossier.evidenceBasisCounts.directlyObserved}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9a9a9a]">Evidence-Supported Patterns</span>
                  <span className="text-white font-bold tabular-nums">
                    {dossier.evidenceBasisCounts.evidenceSupportedPattern}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9a9a9a]">Requires Internal CRM Validation</span>
                  <span className="text-white font-bold tabular-nums">
                    {dossier.evidenceBasisCounts.requiresInternalValidation}
                  </span>
                </div>
              </div>
            </div>

            {/* 02 Executive Summary */}
            <div className="lg:col-span-7 plan space-y-4">
              <div className="svc-num">
                <span>SECTION 02</span>
                <span>EXECUTIVE SUMMARY</span>
              </div>
              <h3 className="font-display text-3xl uppercase tracking-tight">
                02. Executive Summary
              </h3>
              <div className="space-y-3 text-sm text-white/85 leading-relaxed">
                {dossier.executiveSummaryParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          {/* 03 Top 10 Active Leaks (Ranked by $ Exposure) + Remaining 3 Priced Leaks */}
          <div className="plan space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="svc-num">
                  <span>SECTION 03 &amp; 19 · CANONICAL RANKING</span>
                </div>
                <h3 className="font-display text-3xl uppercase tracking-tight mt-1">
                  03. Top 10 Active Leaks (Ranked by $ Exposure) + Remainder
                </h3>
                <p className="text-xs font-mono text-[#9a9a9a] mt-1">
                  Top 10 subtotal: {formatUSD(dossier.top10SubtotalLow)} –{' '}
                  {formatUSD(dossier.top10SubtotalHigh)} · Remaining 3 leaks:{' '}
                  {formatUSD(dossier.remainderSubtotalLow)} –{' '}
                  {formatUSD(dossier.remainderSubtotalHigh)} · Total:{' '}
                  {formatUSD(dossier.totalAnnualLow)} – {formatUSD(dossier.totalAnnualHigh)}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[...dossier.top10Leaks, ...dossier.remainingLeaks].map((leak) => {
                const isExpanded = Boolean(expandedLeaks[leak.leakId]);
                return (
                  <div
                    key={leak.leakId}
                    className="rounded border border-white/10 bg-[#070707] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleLeak(leak.leakId)}
                      aria-expanded={isExpanded}
                      className="w-full p-4 flex flex-wrap items-center justify-between gap-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs px-2 py-1 rounded border border-white/15 bg-white/5 text-white shrink-0">
                          #{leak.rank}
                        </span>
                        <div>
                          <div className="font-semibold text-white text-sm sm:text-base">
                            {leak.title}
                          </div>
                          <div className="font-mono text-xs text-[#9a9a9a]">
                            Chapter: {leak.chapterSlug} · Fingerprint: {leak.fingerprint} ·
                            Confidence: {leak.confidence}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right font-mono">
                          <div className="text-sm sm:text-base font-bold text-white tabular-nums">
                            {leak.rangeLabel}
                          </div>
                          <div className="text-[10px] text-[#9a9a9a] uppercase">
                            ANNUAL REVENUE LOSS
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#9a9a9a]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#9a9a9a]" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-white/10 font-mono text-xs text-white/80 space-y-1.5 bg-black/50">
                        <div>
                          <span className="text-[#9a9a9a]">Pricing Basis: </span>
                          {leak.pricingBasis}
                        </div>
                        <div>
                          <span className="text-[#9a9a9a]">Ledger ID: </span>
                          {leak.leakId} · Origin: {leak.origin} · Financial Basis:
                          evidence_based_model (v6)
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 08–20 DIAGNOSTIC CHAPTERS (Expandable Chapter Cards with Verdict, What We Found, Why It's Leaking, What It's Costing, What To Do, Evidence) */}
      {showSection('diagnostic-chapters') && (
        <div className="plan space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="svc-num">
                <span>SECTIONS 08–20 · FORENSIC CHAPTER AUTOPSY</span>
              </div>
              <h3 className="font-display text-3xl uppercase tracking-tight mt-1">
                Forensic Diagnostic Chapters &amp; 30/60/90 Remediation
              </h3>
              <p className="text-xs text-[#9a9a9a] mt-1">
                Click any chapter below to expand its Verdict, What We Found, Why It&apos;s Leaking,
                What It&apos;s Costing (USD), What To Do (This Week / Month / Quarter), and Raw
                Evidence.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAllChapters}
                className="daemon-chip"
              >
                Expand All Chapters ({dossier.chapters.length})
              </button>
              <button
                type="button"
                onClick={collapseAllChapters}
                className="daemon-chip"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {dossier.chapters.map((ch) => {
              const isExpanded = Boolean(expandedChapters[ch.chapterSlug]);
              return (
                <div
                  key={ch.chapterSlug}
                  className="rounded border border-white/10 bg-[#070707] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleChapter(ch.chapterSlug)}
                    aria-expanded={isExpanded}
                    className="w-full p-5 flex flex-wrap items-center justify-between gap-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="font-mono text-[11px] uppercase tracking-widest text-[#9a9a9a]">
                        {ch.chapterNum} · {ch.chapterSlug}
                      </div>
                      <div className="font-display text-2xl uppercase tracking-tight text-white">
                        {ch.title}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono">
                        <div className="text-xs sm:text-sm font-bold text-white tabular-nums">
                          {ch.allocationLabel}
                        </div>
                        <div className="text-[11px] text-[#9a9a9a]">{ch.categoryNote}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#9a9a9a]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-4 border-t border-white/10 space-y-5 bg-black/60 text-sm">
                      {/* VERDICT */}
                      <div
                        className="p-4 rounded border"
                        style={{
                          borderColor: 'rgba(239, 68, 68, 0.35)',
                          background: 'rgba(239, 68, 68, 0.06)',
                        }}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400">
                          VERDICT
                        </div>
                        <div className="text-white font-medium mt-1">{ch.verdict}</div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-3">
                          <div>
                            <div className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                              WHAT WE FOUND
                            </div>
                            <div className="space-y-2 mt-1.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                              {ch.whatWeFound.map((p, idx) => (
                                <p key={idx}>{p}</p>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                              WHY IT&apos;S LEAKING
                            </div>
                            <p className="mt-1.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                              {ch.whyItsLeaking}
                            </p>
                          </div>

                          <div>
                            <div className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                              WHAT IT&apos;S COSTING (USD)
                            </div>
                            <p className="mt-1.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                              {ch.whatItsCosting}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 rounded border border-white/10 bg-[#0a0a0a] space-y-3">
                            <div className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                              WHAT TO DO (REMEDIATION CADENCE)
                            </div>
                            <div>
                              <div className="font-mono text-[11px] text-white font-semibold">
                                This Week
                              </div>
                              <ul className="list-disc list-inside text-xs text-white/80 space-y-1 mt-1">
                                {ch.whatToDo.thisWeek.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="font-mono text-[11px] text-white font-semibold">
                                This Month
                              </div>
                              <ul className="list-disc list-inside text-xs text-white/80 space-y-1 mt-1">
                                {ch.whatToDo.thisMonth.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="font-mono text-[11px] text-white font-semibold">
                                This Quarter
                              </div>
                              <ul className="list-disc list-inside text-xs text-white/80 space-y-1 mt-1">
                                {ch.whatToDo.thisQuarter.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="p-4 rounded border border-white/10 bg-[#0a0a0a] font-mono text-xs space-y-1.5">
                            <div className="text-[11px] uppercase tracking-wider text-[#9a9a9a]">
                              EVIDENCE &amp; COST BASIS
                            </div>
                            {ch.evidenceLines.map((line, i) => (
                              <div key={i} className="text-white/85">
                                {line}
                              </div>
                            ))}
                            <div className="text-[#9a9a9a] pt-1 border-t border-white/10">
                              Cost Basis: {ch.costBasis}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 04–07 GROWTH ASSETS: Brand Blueprint, Imagery Direction, Ready-To-Publish Posts, 30-Day Content Schedule */}
      {showSection('growth-blueprint') && (
        <div className="space-y-6">
          {/* 04 Brand Blueprint & Scan Corrections */}
          <div className="plan space-y-6">
            <div className="svc-num">
              <span>SECTION 04 · GROWTH ASSETS</span>
              <span>BRAND BLUEPRINT &amp; CORRECTIONS</span>
            </div>
            <h3 className="font-display text-3xl uppercase tracking-tight">
              04. Brand Blueprint &amp; Scan Corrections
            </h3>

            <div className="p-4 rounded border border-white/15 bg-white/[0.03]">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#9a9a9a]">
                VALUE PROPOSITION
              </div>
              <div className="text-base font-medium text-white mt-1">
                {dossier.brandBlueprint.valueProposition}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-xs uppercase text-[#9a9a9a]">POSITIONING</div>
                  <p className="text-white/85 mt-1">{dossier.brandBlueprint.positioning}</p>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase text-[#9a9a9a]">TARGET AUDIENCE</div>
                  <p className="text-white/85 mt-1">{dossier.brandBlueprint.targetAudience}</p>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase text-[#9a9a9a]">VOICE</div>
                  <p className="text-white/85 mt-1">{dossier.brandBlueprint.voiceSummary}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded border border-white/10 bg-[#070707]">
                    <div className="font-mono text-xs font-bold text-white mb-1.5">Voice — Do</div>
                    <ul className="list-disc list-inside text-xs text-white/80 space-y-1">
                      {dossier.brandBlueprint.voiceDo.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded border border-white/10 bg-[#070707]">
                    <div className="font-mono text-xs font-bold text-white mb-1.5">
                      Voice — Don&apos;t
                    </div>
                    <ul className="list-disc list-inside text-xs text-white/80 space-y-1">
                      {dossier.brandBlueprint.voiceDont.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="font-mono text-xs uppercase text-[#9a9a9a]">
                  CORRECTIONS FROM THE SCAN
                </div>
                <div className="space-y-2.5">
                  {dossier.brandBlueprint.scanCorrections.map((corr, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded border border-white/10 bg-[#070707] space-y-1"
                    >
                      <div className="font-mono text-xs font-bold text-rose-400">
                        ISSUE: {corr.issue}
                      </div>
                      <div className="text-xs text-white/85">Fix: {corr.fix}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 05 Imagery Direction + 06 Ready-To-Publish Posts + 07 30-Day Content Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 plan space-y-4">
              <div className="svc-num">
                <span>SECTION 05 · IMAGERY DIRECTION</span>
              </div>
              <h3 className="font-display text-2xl uppercase tracking-tight">
                05. Imagery Direction &amp; Prompts
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                {dossier.imageryDirection.visualStyle}
              </p>
              <div className="space-y-2.5">
                {dossier.imageryDirection.prompts.map((pr, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded border border-white/10 bg-[#070707] font-mono text-xs space-y-1"
                  >
                    <div className="text-white font-bold">{pr.title}</div>
                    <div className="text-[#9a9a9a] text-[11px] leading-relaxed">
                      {pr.promptText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 plan space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="svc-num">
                    <span>SECTION 06 · READY TO PUBLISH POSTS</span>
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tight">
                    06. Ready-To-Publish Remediation Posts
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllPosts((s) => !s)}
                  className="daemon-chip"
                >
                  {showAllPosts
                    ? 'Show Compact List'
                    : `Expand All (${dossier.readyToPublishPosts.length})`}
                </button>
              </div>

              <div className="space-y-3">
                {(showAllPosts
                  ? dossier.readyToPublishPosts
                  : dossier.readyToPublishPosts.slice(0, 3)
                ).map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded border border-white/10 bg-[#070707] space-y-2"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-white">{post.id}</span>
                      <span className="text-[#9a9a9a]">{post.channel}</span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.04] border border-white/10 font-mono text-xs text-white">
                      HOOK: {post.hook}
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">{post.body}</p>
                    <div className="font-mono text-[11px] text-[#9a9a9a]">
                      CTA: <span className="text-white">{post.cta}</span> · Visual: {post.visual}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 07 Content Schedule (30 Days) */}
          <div className="plan space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="svc-num">
                  <span>SECTION 07 · 30-DAY EXECUTION CALENDAR</span>
                </div>
                <h3 className="font-display text-2xl uppercase tracking-tight">
                  07. Content Schedule (30 Days)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFullSchedule((s) => !s)}
                className="daemon-chip"
              >
                {showFullSchedule ? 'Collapse Schedule' : 'Expand Full 30-Day Schedule'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/15 text-[#9a9a9a]">
                    <th className="py-2.5 px-3">DAY</th>
                    <th className="py-2.5 px-3">PLATFORM</th>
                    <th className="py-2.5 px-3">TIME</th>
                    <th className="py-2.5 px-3">PURPOSE</th>
                    <th className="py-2.5 px-3">TOPIC</th>
                    <th className="py-2.5 px-3">VISUAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {(showFullSchedule
                    ? dossier.contentSchedule30Days
                    : dossier.contentSchedule30Days.slice(0, 5)
                  ).map((row) => (
                    <tr key={row.day} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-bold text-white tabular-nums">{row.day}</td>
                      <td className="py-2.5 px-3 text-white/90">{row.platform}</td>
                      <td className="py-2.5 px-3 text-[#9a9a9a]">{row.time}</td>
                      <td className="py-2.5 px-3 uppercase text-white/80">{row.purpose}</td>
                      <td className="py-2.5 px-3 text-white">{row.topic}</td>
                      <td className="py-2.5 px-3 text-[#9a9a9a]">{row.visual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 21–22 FINANCIAL RECONCILIATION & ADDITIONAL REPORT DATA */}
      {showSection('reconciliation') && (
        <div className="plan space-y-4">
          <div className="svc-num">
            <span>SECTIONS 21–22 · CANONICAL RECONCILIATION</span>
            <span>MODEL VERSION 6</span>
          </div>
          <h3 className="font-display text-3xl uppercase tracking-tight">
            Financial Reconciliation &amp; Invariant Audit
          </h3>
          <p className="text-xs text-[#9a9a9a]">
            Every dollar figure in this report is rendered from the canonical Financial Leak Ledger
            (model version 6). Top 10 subtotal plus the remaining 3 priced leaks equals the total
            annual revenue loss.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded border border-white/10 bg-[#070707]">
              <div className="text-[#9a9a9a]">Ledger Total</div>
              <div className="text-base font-bold text-white mt-1 tabular-nums">
                {formatUSD(dossier.totalAnnualLow)} – {formatUSD(dossier.totalAnnualHigh)}
              </div>
            </div>
            <div className="p-4 rounded border border-white/10 bg-[#070707]">
              <div className="text-[#9a9a9a]">Chapter Allocation Total</div>
              <div className="text-base font-bold text-white mt-1 tabular-nums">
                {formatUSD(dossier.totalAnnualLow)} – {formatUSD(dossier.totalAnnualHigh)}
              </div>
            </div>
            <div className="p-4 rounded border border-white/10 bg-[#070707]">
              <div className="text-[#9a9a9a]">Top 10 Subtotal</div>
              <div className="text-base font-bold text-white mt-1 tabular-nums">
                {formatUSD(dossier.top10SubtotalLow)} – {formatUSD(dossier.top10SubtotalHigh)}
              </div>
            </div>
            <div className="p-4 rounded border border-white/10 bg-[#070707]">
              <div className="text-[#9a9a9a]">Remainder (3 Leaks)</div>
              <div className="text-base font-bold text-white mt-1 tabular-nums">
                {formatUSD(dossier.remainderSubtotalLow)} –{' '}
                {formatUSD(dossier.remainderSubtotalHigh)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
