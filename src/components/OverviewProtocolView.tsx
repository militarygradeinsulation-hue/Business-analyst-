import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Scale,
  Network,
  Handshake,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
} from 'lucide-react';
import {
  EVIDENCE_CLASSIFICATIONS,
  SEVEN_PHASE_PROTOCOL,
} from '../data/aifmCorpus';
import { computeCorpusMetrics, EvidenceCode } from '../lib/forensicMath';

interface OverviewProtocolViewProps {
  onNavigateTab: (tab: 'overview' | 'ledger' | 'mindprint' | 'askintros' | 'collective') => void;
  onOpenManuscript: () => void;
}

export const OverviewProtocolView: React.FC<OverviewProtocolViewProps> = ({
  onNavigateTab,
  onOpenManuscript,
}) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [selectedEvidenceCode, setSelectedEvidenceCode] = useState<EvidenceCode | 'ALL'>('ALL');
  const [claimStep, setClaimStep] = useState<number>(3);
  const pointerStartX = useRef<number | null>(null);

  const corpusMetrics = computeCorpusMetrics(1910, 1067, 22282);
  const activePhase = SEVEN_PHASE_PROTOCOL[activePhaseIndex];

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    if (deltaX < -50 && activePhaseIndex < SEVEN_PHASE_PROTOCOL.length - 1) {
      setActivePhaseIndex((prev) => prev + 1);
    } else if (deltaX > 50 && activePhaseIndex > 0) {
      setActivePhaseIndex((prev) => prev - 1);
    }
    pointerStartX.current = null;
  };

  const filteredEvidence =
    selectedEvidenceCode === 'ALL'
      ? EVIDENCE_CLASSIFICATIONS
      : EVIDENCE_CLASSIFICATIONS.filter((e) => e.code === selectedEvidenceCode);

  const claimProgressionSteps = [
    {
      step: 1,
      code: '01',
      label: 'Detected',
      basis: 'Public or system signal',
      description: 'Raw HTML, rendered DOM, or initial intake response identifies an observable surface anomaly.',
      gate: 'Cannot infer internal CRM staffing, margins, or verified financial loss from a URL alone.',
    },
    {
      step: 2,
      code: '02',
      label: 'Corroborated',
      basis: 'Independent source',
      description: 'At least two independent source records (e.g., CRM timestamp logs + policy document) confirm the transition failure.',
      gate: 'Passes the Ask Intros / Golden Report Two-Reference Safeguard; single-reference claims are stripped of money.',
    },
    {
      step: 3,
      code: '03',
      label: 'Quantified',
      basis: 'Ledger basis + uncertainty',
      description: 'Canonical Financial Leak Ledger (v6) prices the mechanism using eligible denominators, chapter ownership, and root-cause fingerprint deduplication.',
      gate: 'Distinguishes measured vs evidence_based_model vs illustrative_scenario; excludes roll-up sections.',
    },
    {
      step: 4,
      code: '04',
      label: 'Tested',
      basis: 'Defined intervention',
      description: 'Proportionate, consent-gated correction deployed (e.g., shared qualification schema + Ask Intros verified route) with a comparable control group.',
      gate: 'Tests competing operational explanations before attributing outcomes to human communication style.',
    },
    {
      step: 5,
      code: '05',
      label: 'Realized',
      basis: 'Transaction or expense proof',
      description: 'Pre/post dataset and financial bridge verify incremental sales contribution, actual avoided overtime, or bank-settled receivables.',
      gate: 'Separates accrual operating income ($108k net benefit) from balance-sheet cash collection ($55k).',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section & Production Corpus Snapshot */}
      <section className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37] tracking-wide">
                Joseph Toney · Founder, Aetheris Technology · Manuscript Version 2.0
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                The Aetheris Integrated Forensic Methodology
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Measuring financial loss through organizational systems, human decision architecture, and evidence-based recovery. A unified forensic operating system connecting{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">Golden Report</strong> organizational diagnostics,{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">Mindprint</strong> source-constrained relationship graphs, and{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">Ask Intros</strong> consent-gated execution.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigateTab('ledger')}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-transform active:scale-[0.98] flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Inspect Canonical Leak Ledger</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTab('mindprint')}
                className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/15 hover:border-amber-500/50 text-slate-800 dark:text-slate-200 font-medium text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explore Evidence Graph
              </button>
              <button
                onClick={onOpenManuscript}
                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span>View Book Manuscript PDF</span>
              </button>
            </div>
          </div>

          {/* Right Column: Three-Instrument Architecture Interactive Map */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Figure 1 & 13 · Integrated Evidence Architecture
              </span>
              <span className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
                Diagnose · Map · Score · Connect · Compound
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigateTab('ledger')}
                className="text-left p-3.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-amber-500/60 bg-white dark:bg-[#131622] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-mono text-slate-400">01</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">
                  Golden Report
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Where process & money leak · Canonical Ledger v6
                </p>
              </button>

              <button
                onClick={() => onNavigateTab('mindprint')}
                className="text-left p-3.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-amber-500/60 bg-white dark:bg-[#131622] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Network className="w-4 h-4 text-sky-400" />
                  <span className="text-[11px] font-mono text-slate-400">02</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                  Mindprint
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Who & what coordinates decisions · Role Graph
                </p>
              </button>

              <button
                onClick={() => onNavigateTab('askintros')}
                className="text-left p-3.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-amber-500/60 bg-white dark:bg-[#131622] transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Handshake className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-mono text-slate-400">03</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                  Ask Intros
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Who can act & did it work · Consent & Outcomes
                </p>
              </button>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5 text-center">
              <div className="text-xs font-semibold text-slate-900 dark:text-amber-300">
                Forensic Decision & Outcome Register
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                Observe → Attribute Sources → Test Mechanism → Price Once → Consent Action → Verify Recovery
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 5-Column Production Snapshot Strip below Hero Split */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Recorded Production Corpus Snapshot · October 29, 2026 [T1, Class C]
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              f̂ = 22,282 / 1,910 = {corpusMetrics.findingsPerReport} indexed findings/report · ŝ = 1,910 / 1,067 = {corpusMetrics.reportsPerCompany} reports/company
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Golden Reports', value: '1,910', detail: 'Archived scan runs · Class C' },
              { label: 'Represented Companies', value: '1,067', detail: '1.79 reports per organization' },
              { label: 'Indexed Findings', value: '22,282', detail: '11.67 findings per report avg' },
              { label: 'Pattern Records', value: '701', detail: 'Normalized root-cause keys' },
              { label: 'Co-Occurring Pairs', value: '339', detail: 'Appear together in ≥ 3 reports' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#0B0D14]"
              >
                <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4.2 / Figure 3: Interactive Claim-Strength Progression */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              01. Claim-Strength Progression Gate
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Claims become stronger only when additional independent evidence and intervention-oriented measurement justify movement toward the right (Figure 3).
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
            Select any stage to inspect evidentiary requirements
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {claimProgressionSteps.map((item) => {
            const isActive = claimStep === item.step;
            const isPassed = claimStep >= item.step;
            return (
              <button
                key={item.code}
                onClick={() => setClaimStep(item.step)}
                className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10'
                    : isPassed
                    ? 'border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#151824]'
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0D14] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={isActive ? 'text-amber-500 font-semibold' : 'text-slate-400'}>
                    {item.code}
                  </span>
                  {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {item.basis}
                </div>
              </button>
            );
          })}
        </div>

        <div
          key={claimStep}
          className="animate-view-enter p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          <div className="lg:col-span-7 space-y-1.5">
            <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
              Stage {claimProgressionSteps[claimStep - 1].code} · {claimProgressionSteps[claimStep - 1].label} ({claimProgressionSteps[claimStep - 1].basis})
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {claimProgressionSteps[claimStep - 1].description}
            </p>
          </div>
          <div className="lg:col-span-5 p-3.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C]">
            <div className="text-xs font-semibold text-slate-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Methodological Boundary Safeguard</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {claimProgressionSteps[claimStep - 1].gate}
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Interactive Seven-Phase Forensic Operating Protocol with Swipe/Drag Gestures */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              02. The Seven-Phase Forensic Operating Protocol
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Each investigative phase produces a verifiable artifact. Swipe horizontally on the card or use the phase controls to step through the protocol.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActivePhaseIndex((prev) => Math.max(0, prev - 1))}
              disabled={activePhaseIndex === 0}
              aria-label="Previous forensic phase"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 px-2">
              Phase {activePhase.code} of 07
            </span>
            <button
              onClick={() =>
                setActivePhaseIndex((prev) => Math.min(SEVEN_PHASE_PROTOCOL.length - 1, prev + 1))
              }
              disabled={activePhaseIndex === SEVEN_PHASE_PROTOCOL.length - 1}
              aria-label="Next forensic phase"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Phase Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2" role="tablist" aria-label="Seven Forensic Phases">
          {SEVEN_PHASE_PROTOCOL.map((item, idx) => {
            const isCurrent = idx === activePhaseIndex;
            return (
              <button
                key={item.code}
                role="tab"
                aria-selected={isCurrent}
                onClick={() => setActivePhaseIndex(idx)}
                className={`px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-500 text-slate-950 font-semibold'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                }`}
              >
                <div className={`text-[11px] font-mono ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.code}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">{item.title}</div>
              </button>
            );
          })}
        </div>

        {/* Gesture-Enabled Swipeable Phase Detail Surface */}
        <div
          key={activePhase.code}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="animate-view-enter rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] p-6 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="text-amber-600 dark:text-[#D4AF37] font-semibold">
                  Phase {activePhase.code} · {activePhase.title}
                </span>
                <span>·</span>
                <span>System: {activePhase.systemOwner}</span>
                <span>·</span>
                <span>Artifact: {activePhase.requiredArtifact}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activePhase.subtitle}
              </h3>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activePhase.keyMethodologyRule}
              </p>

              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-1">
                  Falsification & Quality Control Criterion
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activePhase.falsificationCheck}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-5 space-y-4">
              <div>
                <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37] mb-1.5">
                  Verifiable Phase Artifact Output
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {activePhase.requiredArtifact}
                </div>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0B0D14] p-3.5 rounded border border-slate-200 dark:border-white/10">
                  {activePhase.sampleCharterOrOutput}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
                <span>Swipe card left/right to switch phases</span>
                <button
                  onClick={() => {
                    if (activePhase.phase <= 3 || activePhase.phase === 5 || activePhase.phase === 7) {
                      onNavigateTab('ledger');
                    } else if (activePhase.phase === 4) {
                      onNavigateTab('mindprint');
                    } else {
                      onNavigateTab('askintros');
                    }
                  }}
                  className="font-semibold text-amber-600 dark:text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Instrument</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reader's Guide: Evidence Classification Protocol (D, E, C, X, S, V) */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              03. Reader’s Guide: Evidence Classification Convention
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Distinguishing evidence of a software function from evidence of an independently audited business recovery (Page 4).
            </p>
          </div>

          {/* Interactive Filter Controls (Functional Buttons) */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mx-2" />
            {(['ALL', 'D', 'E', 'C', 'X', 'S', 'V'] as const).map((code) => (
              <button
                key={code}
                onClick={() => setSelectedEvidenceCode(code)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedEvidenceCode === code
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {code === 'ALL' ? 'All Codes' : `Class ${code}`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 w-20">Code</th>
                <th className="py-3 px-4 w-64">Evidence Classification</th>
                <th className="py-3 px-4">Permissible Scientific Statement</th>
                <th className="py-3 px-4">Reviewed Manuscript Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-sm">
              {filteredEvidence.map((item) => (
                <tr
                  key={item.code}
                  className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-[#D4AF37] tabular-nums">
                    {item.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {item.classification}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {item.permissibleStatement}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {item.manuscriptExamples}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
