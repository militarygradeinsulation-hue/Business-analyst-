import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  DollarSign,
  TrendingDown,
  Layers,
} from 'lucide-react';
import {
  CompanyScanReport,
} from '../lib/urlScannerBrain';
import {
  buildGoldenReportFullDossier,
  GoldenDiagnosticChapter,
} from '../lib/goldenReportComplete';

interface GoldenReportCompleteViewProps {
  companyScan: CompanyScanReport | null;
}

const formatUSD = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

export const GoldenReportCompleteView: React.FC<GoldenReportCompleteViewProps> = ({
  companyScan,
}) => {
  const dossier = buildGoldenReportFullDossier(companyScan);
  const [openChapter, setOpenChapter] = useState<string | null>(dossier.chapters[0]?.chapterSlug ?? null);
  const [activeTab, setActiveTab] = useState<'chapters' | 'top10' | 'schedule'>('chapters');

  return (
    <div className="rounded-2xl border border-white/15 bg-[#0a0a0a] overflow-hidden space-y-6 p-6 sm:p-8 animate-fade-in shadow-2xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="badge mb-2">
            <i></i>
            <span>COMPLETE 22-CHAPTER FINANCIAL AUTOPSY // MODEL VERSION 6</span>
          </div>
          <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white">
            {dossier.companyName} Forensic Dossier
          </h3>
          <p className="font-mono text-xs text-zinc-200 mt-1">
            Total Modeled Exposure: {formatUSD(dossier.totalAnnualLow)} – {formatUSD(dossier.totalAnnualHigh)}/yr across {dossier.pricedLeaksCount} Uniquely Priced Leaks
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`py-1.5 px-3 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
              activeTab === 'chapters'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 border border-white/10 text-zinc-200 hover:text-white'
            }`}
          >
            22 Chapters ({dossier.chapters.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('top10')}
            className={`py-1.5 px-3 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
              activeTab === 'top10'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 border border-white/10 text-zinc-200 hover:text-white'
            }`}
          >
            Top 10 Leaks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-1.5 px-3 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 border border-white/10 text-zinc-200 hover:text-white'
            }`}
          >
            30-Day Plan
          </button>
        </div>
      </div>

      {/* TAB 1: 22 CHAPTER AUTOPSIES */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            Diagnostic Chapters (Click to expand evidence, cost basis, and remediation steps)
          </div>

          <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden bg-[#070707]">
            {dossier.chapters.map((ch: GoldenDiagnosticChapter) => {
              const isOpen = openChapter === ch.chapterSlug;
              return (
                <div key={ch.chapterSlug} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenChapter(isOpen ? null : ch.chapterSlug)}
                    className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-zinc-400 font-bold w-12">
                        CH {ch.chapterNum}
                      </span>
                      <div>
                        <span className="font-bold text-white text-sm block">
                          {ch.title}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-300">
                          {ch.allocationLabel} · {ch.verdict}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-rose-300 font-bold hidden sm:inline">
                        {ch.whatItsCosting}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4 text-xs font-mono bg-black/40">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3.5 rounded bg-white/[0.03] border border-white/10 space-y-1">
                          <span className="text-zinc-400 font-bold block uppercase text-[10px]">
                            Why It&apos;s Leaking
                          </span>
                          <p className="text-zinc-200 leading-relaxed font-sans text-xs">
                            {ch.whyItsLeaking}
                          </p>
                        </div>
                        <div className="p-3.5 rounded bg-white/[0.03] border border-white/10 space-y-1">
                          <span className="text-rose-400 font-bold block uppercase text-[10px]">
                            Financial Exposure
                          </span>
                          <p className="text-rose-200 leading-relaxed font-sans text-xs">
                            {ch.costBasis}
                          </p>
                        </div>
                        <div className="p-3.5 rounded bg-white/[0.03] border border-white/10 space-y-1">
                          <span className="text-emerald-400 font-bold block uppercase text-[10px]">
                            Immediate Fix (This Week)
                          </span>
                          <ul className="text-zinc-200 space-y-1 font-sans text-xs list-disc pl-4">
                            {ch.whatToDo.thisWeek.map((tw, idx) => (
                              <li key={idx}>{tw}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-1 text-zinc-300 pt-1">
                        <span className="text-white font-bold block">Observed Evidence:</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {ch.evidenceLines.map((ev, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-zinc-200"
                            >
                              • {ev}
                            </span>
                          ))}
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

      {/* TAB 2: TOP 10 LEAKS */}
      {activeTab === 'top10' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            Ranked Active Revenue Leaks (Root-Cause Deduplicated)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.top10Leaks.map((leak) => (
              <div
                key={leak.leakId}
                className="p-5 rounded-xl border border-white/10 bg-[#070707] space-y-3"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                    RANK #{leak.rank}
                  </span>
                  <span className="text-rose-400 font-bold text-sm">
                    {leak.rangeLabel}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{leak.title}</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Pricing Basis: {leak.pricingBasis}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Confidence: <strong className="text-white uppercase">{leak.confidence}</strong></span>
                  <span>Fingerprint: <strong className="text-zinc-300">{leak.fingerprint}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 30-DAY REMEDIATION SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            30-Day Technical Remediation &amp; Reactivation Schedule
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dossier.contentSchedule30Days.slice(0, 15).map((item) => (
              <div
                key={item.day}
                className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">DAY {item.day}</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300">
                    {item.purpose}
                  </span>
                </div>
                <div className="text-white font-bold text-xs">{item.topic}</div>
                <div className="text-[11px] text-zinc-400">
                  {item.platform} · {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
