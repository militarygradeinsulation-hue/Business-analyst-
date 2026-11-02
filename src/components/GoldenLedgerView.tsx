import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  RotateCcw,
  Calculator,
  Layers,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  INITIAL_CANONICAL_LEDGER_ENTRIES,
} from '../data/aifmCorpus';
import {
  reconcileCanonicalLedger,
  evaluateSyntheticCase,
  computeSensitivityCell,
  DEFAULT_SYNTHETIC_CASE_PARAMS,
  SyntheticCaseParameters,
  LedgerEntryInput,
  FinancialBasis,
  EconomicClass,
} from '../lib/forensicMath';
import { CompanyScanReport } from '../lib/urlScannerBrain';

interface GoldenLedgerViewProps {
  companyScan?: CompanyScanReport;
}

export const GoldenLedgerView: React.FC<GoldenLedgerViewProps> = ({ companyScan }) => {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntryInput[]>(
    companyScan ? companyScan.ledgerEntries : INITIAL_CANONICAL_LEDGER_ENTRIES
  );
  const [caseParams, setCaseParams] = useState<SyntheticCaseParameters>(
    companyScan ? companyScan.syntheticCaseParams : DEFAULT_SYNTHETIC_CASE_PARAMS
  );
  const [entryFilter, setEntryFilter] = useState<'active' | 'excluded' | 'all'>('all');

  useEffect(() => {
    if (companyScan) {
      setLedgerEntries(companyScan.ledgerEntries);
      setCaseParams(companyScan.syntheticCaseParams);
    }
  }, [companyScan]);

  // Form state to test adding a new finding to the Canonical Ledger
  const [newTitle, setNewTitle] = useState('');
  const [newChapter, setNewChapter] = useState('Ch 2: Lead Capture & Routing');
  const [newFingerprint, setNewFingerprint] = useState('');
  const [newBasis, setNewBasis] = useState<FinancialBasis>('evidence_based_model');
  const [newEconClass, setNewEconClass] = useState<EconomicClass>('revenue_opportunity');
  const [newLow, setNewLow] = useState('45000');
  const [newHigh, setNewHigh] = useState('80000');
  const [newRefsInput, setNewRefsInput] = useState('CRM-LOG-901, DOM-FORM-22');
  const [newIsRollup, setNewIsRollup] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const reconciled = useMemo(() => reconcileCanonicalLedger(ledgerEntries), [ledgerEntries]);
  const caseEval = useMemo(() => evaluateSyntheticCase(caseParams), [caseParams]);

  // Group active entries by chapter
  const groupedEntries = useMemo(() => {
    const active = entryFilter === 'excluded' ? [] : reconciled.activeEntries;
    const excluded = entryFilter === 'active' ? [] : reconciled.excludedEntries.map((e) => e.entry);
    const all = [...active, ...excluded];

    return all.reduce((acc, entry) => {
      const chapter = entry.chapter || 'Uncategorized';
      if (!acc[chapter]) acc[chapter] = [];
      acc[chapter].push(entry);
      return acc;
    }, {} as Record<string, LedgerEntryInput[]>);
  }, [reconciled, entryFilter]);

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const toggleChapter = (chapter: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chapter]: !prev[chapter] }));
  };

  const realizationRows = [0.5, 0.65, 0.8, 1.0];
  const marginCols = [0.25, 0.3, 0.35, 0.4, 0.45];

  const handleAddFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFingerprint.trim()) {
      setFormError('Finding title and root-cause fingerprint are required.');
      return;
    }
    const parsedLow = Number(newLow);
    const parsedHigh = Number(newHigh);
    if (Number.isNaN(parsedLow) || Number.isNaN(parsedHigh) || parsedLow < 0 || parsedHigh < 0) {
      setFormError('Low and High exposure amounts must be valid non-negative numbers.');
      return;
    }

    const refs = newRefsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newEntry: LedgerEntryInput = {
      id: `GR-CUSTOM-${ledgerEntries.length + 1}`,
      title: newTitle.trim(),
      chapter: newChapter,
      rootCauseFingerprint: newFingerprint.trim(),
      basis: newBasis,
      economicClass: newEconClass,
      lowAmount: parsedLow,
      highAmount: parsedHigh,
      evidenceRefs: refs,
      isRollupSection: newIsRollup,
    };

    setLedgerEntries((prev) => [newEntry, ...prev]);
    setNewTitle('');
    setNewFingerprint('');
    setFormError(null);
  };

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-12 pb-16">
      {/* Section Header & Reconciliation Invariants */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
          <div>
            <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
              Sections 5, 9 & 10 · Canonical Financial Leak Ledger (Model Version 6) [T3, T8]
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Deterministic Financial Leak Ledger & Accrual Profit Bridge
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Prevents arithmetic double counting through chapter ownership, root-cause fingerprints, excluded roll-up sections, two-reference safeguards, and strict separation of revenue, contribution margin, avoided overtime, and cash collections.
            </p>
          </div>

          <button
            onClick={() => {
              setLedgerEntries(INITIAL_CANONICAL_LEDGER_ENTRIES);
              setCaseParams(DEFAULT_SYNTHETIC_CASE_PARAMS);
            }}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 self-start whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Ledger & Case Parameters</span>
          </button>
        </div>

        {/* Reconciliation Invariants Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14]">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Active Deduplicated Range (K = {reconciled.activeEntries.length})
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
              {formatUSD(reconciled.headlineLowTotal)} – {formatUSD(reconciled.headlineHighTotal)}
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              {reconciled.excludedEntries.length} duplicate/ineligible entries excluded
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14]">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Chapter Allocation Invariant (∑ L_i = ∑ L_c)
            </div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {reconciled.invariants.chapterSumMatchesActiveSum
                  ? 'Verified Equal Across Chapters'
                  : 'Reconciliation Mismatch'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              Top 10 + Remainder = {formatUSD(reconciled.topTenLowSubtotal + reconciled.remainderLowSubtotal)}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14]">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Root-Cause Fingerprint Uniqueness
            </div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {reconciled.invariants.uniqueRootCauseFingerprints
                  ? '100% Unique Active Root Causes'
                  : 'Duplicate Fingerprint Violation'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              Max single leak &lt; $50M · Max chapter &lt; $10M
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14]">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Modeled Net Economic Benefit (Case F01–F04)
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-[#D4AF37] mt-1">
              {formatUSD(caseEval.bridge.netEconomicBenefit)} ({caseEval.bridge.roiPercent}% ROI)
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              {caseParams.includeCashCollectionInIncome
                ? 'Alternative Unrecognized Income Basis'
                : 'Accrual-Consistent Base Interpretation'}
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Interactive Four-Mechanism Numerical Case & Profit Bridge */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              01. Complete Four-Mechanism Numerical Case & Profit Bridge (Section 10)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Demonstrates why $799,000 in nominal mixed exposure and $534,000 in mixed outcomes must be decomposed by economic class into $108,000 of net economic benefit (127.1% ROI).
            </p>
          </div>

          {/* Accounting Basis Switch */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 shrink-0">
            <button
              onClick={() =>
                setCaseParams((prev) => ({ ...prev, includeCashCollectionInIncome: false }))
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !caseParams.includeCashCollectionInIncome
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Base Accrual (127.1% ROI)
            </button>
            <button
              onClick={() =>
                setCaseParams((prev) => ({ ...prev, includeCashCollectionInIncome: true }))
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                caseParams.includeCashCollectionInIncome
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Alt Unrecognized Income (191.8% ROI)
            </button>
          </div>
        </div>

        {/* 4 Mechanisms Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Case F01 */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Case F01 · Process A (Non-Overlapping Inquiries)</span>
              <span className="text-amber-600 dark:text-[#D4AF37]">Lost Sales Revenue</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lead Ownership & Qualification Gap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              5,000 eligible inquiries · 10.0% baseline vs 12.0% comparator · $4,000 realized sale. Treated improves 10.0% → 12.6% vs Control 12.0% → 13.0% (DiD τ̂ = +{caseEval.f01.didEffectPctPoints}pp).
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10 font-mono">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Modeled Exposure</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatUSD(caseEval.f01.grossExposure)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">DiD Adjusted Uplift</div>
                <div className="text-base font-bold text-amber-600 dark:text-[#D4AF37] tabular-nums">
                  {formatUSD(caseEval.f01.outcomeRevenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Case F02 */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Case F02 · Process B (Independent Quote Cohort)</span>
              <span className="text-amber-600 dark:text-[#D4AF37]">Lost Sales Revenue</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lost Quote Progression & Aging Bottleneck
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              800 eligible quotes · $6,000 realized quote value · 4.0pp modeled opportunity vs 2.5pp comparison-adjusted outcome after named owner & aging escalation.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10 font-mono">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Modeled Exposure</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatUSD(caseEval.f02.grossExposure)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Adjusted Outcome</div>
                <div className="text-base font-bold text-amber-600 dark:text-[#D4AF37] tabular-nums">
                  {formatUSD(caseEval.f02.outcomeRevenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Case F03 */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Case F03 · Process C (Payroll & Time Logs)</span>
              <span className="text-sky-500">Labor Capacity / Expense</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Duplicated Administrative Rework
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              1,800 rework hours at $65/hr = $117,000 gross capacity. Eliminates 600 paid overtime hours ($39,000 cash saving); remaining 1,200 hrs ($78,000) reported as non-cash released capacity.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10 font-mono">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Gross Capacity Value</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatUSD(caseEval.f03.grossCapacity)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Verified Avoided Overtime</div>
                <div className="text-base font-bold text-emerald-500 tabular-nums">
                  {formatUSD(caseEval.f03.avoidedOvertime)}
                </div>
              </div>
            </div>
          </div>

          {/* Case F04 */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Case F04 · Process D (Work-to-Invoice Join)</span>
              <span className="text-emerald-500">Unbilled / Cash Collection</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Unbilled Completed Service Deliveries
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              $90,000 identified in unbilled completed work; $55,000 collected. Held in separate cash-flow register under base accrual unless proven unrecognized revenue.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10 font-mono">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Identified Unbilled</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatUSD(caseEval.f04.grossExposure)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Cash Collected</div>
                <div className="text-base font-bold text-emerald-500 tabular-nums">
                  {formatUSD(caseEval.f04.cashCollected)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Profit Bridge & Sensitivity Matrix Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Left 6 cols: Profit Bridge Waterfall & Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-500" />
                <span>Figure 10 · Economic Profit Bridge</span>
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                B_net = ΔR·r·m + C_avoided − I
              </span>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-[#0B0D14] p-5 rounded-lg border border-slate-200 dark:border-white/10">
              {/* Sliders for Realization Factor r and Contribution Margin m */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <label
                    htmlFor="realization-slider"
                    className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    <span>Sales Realization (r)</span>
                    <span className="font-mono font-bold text-amber-500">
                      {Math.round(caseParams.realizationFactor * 100)}%
                    </span>
                  </label>
                  <input
                    id="realization-slider"
                    type="range"
                    min={0.5}
                    max={1.0}
                    step={0.05}
                    value={caseParams.realizationFactor}
                    onChange={(e) =>
                      setCaseParams((p) => ({
                        ...p,
                        realizationFactor: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label
                    htmlFor="margin-slider"
                    className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    <span>Contribution Margin (m)</span>
                    <span className="font-mono font-bold text-amber-500">
                      {Math.round(caseParams.incrementalMargin * 100)}%
                    </span>
                  </label>
                  <input
                    id="margin-slider"
                    type="range"
                    min={0.25}
                    max={0.45}
                    step={0.05}
                    value={caseParams.incrementalMargin}
                    onChange={(e) =>
                      setCaseParams((p) => ({
                        ...p,
                        incrementalMargin: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Bridge Bars */}
              {[
                {
                  label: '1. Realized Incremental Sales (F01 + F02)',
                  amount: caseEval.bridge.realizedIncrementalRevenue,
                  barPct: Math.min(100, (caseEval.bridge.realizedIncrementalRevenue / 440_000) * 100),
                  color: 'bg-slate-400 dark:bg-slate-500',
                  note: 'Gross revenue is not profit',
                },
                {
                  label: `2. Incremental Contribution (@${Math.round(caseParams.incrementalMargin * 100)}% margin)`,
                  amount: caseEval.bridge.incrementalContributionSales,
                  barPct: Math.min(100, (caseEval.bridge.incrementalContributionSales / 440_000) * 100),
                  color: 'bg-amber-500',
                  note: 'After variable fulfillment & servicing',
                },
                {
                  label: '3. Verified Avoided Overtime Expense (F03)',
                  amount: caseEval.bridge.avoidedOvertime,
                  barPct: Math.min(100, (caseEval.bridge.avoidedOvertime / 440_000) * 100),
                  color: 'bg-sky-500',
                  note: '600 overtime hrs × $65/hr',
                },
                {
                  label: '4. Pre-Cost Economic Benefit',
                  amount: caseEval.bridge.preCostBenefit,
                  barPct: Math.min(100, (caseEval.bridge.preCostBenefit / 440_000) * 100),
                  color: 'bg-emerald-500',
                  note: caseParams.includeCashCollectionInIncome
                    ? 'Includes $55k unrecognized income'
                    : 'Excludes $55k AR cash collection',
                },
                {
                  label: '5. First-Year Program & Operating Cost (I)',
                  amount: -caseEval.bridge.implementationCost,
                  barPct: Math.min(100, (caseEval.bridge.implementationCost / 440_000) * 100),
                  color: 'bg-rose-500',
                  note: 'Deduplicated total implementation cost',
                },
                {
                  label: '6. Net Attributable Economic Benefit (B_net)',
                  amount: caseEval.bridge.netEconomicBenefit,
                  barPct: Math.min(100, (Math.max(0, caseEval.bridge.netEconomicBenefit) / 440_000) * 100),
                  color: 'bg-[#D4AF37]',
                  note: `ROI = ${caseEval.bridge.roiPercent}%`,
                },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {row.label}
                    </span>
                    <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {formatUSD(row.amount)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${row.color}`}
                      style={{ width: `${Math.max(4, row.barPct)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {row.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 6 cols: Interactive Sensitivity Surface Heatmap (Figure 11) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Figure 11 · Counterfactual Sensitivity Surface</span>
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Click any cell to apply (r, m)
              </span>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Net economic benefit under alternative sales realization (50%–100%) and incremental contribution margin (25%–45%) assumptions (cash collection excluded).
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                      <th className="py-2 px-2 text-left">Realization \ Margin</th>
                      {marginCols.map((m) => (
                        <th key={m} className="py-2 px-2">
                          {Math.round(m * 100)}%
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {realizationRows.map((r) => (
                      <tr key={r}>
                        <td className="py-2.5 px-2 text-left font-semibold text-slate-700 dark:text-slate-300">
                          {Math.round(r * 100)}% uplift
                        </td>
                        {marginCols.map((m) => {
                          const cellVal = computeSensitivityCell(r, m);
                          const isSelected =
                            Math.abs(caseParams.realizationFactor - r) < 0.01 &&
                            Math.abs(caseParams.incrementalMargin - m) < 0.01;
                          return (
                            <td key={m} className="p-1">
                              <button
                                onClick={() =>
                                  setCaseParams((prev) => ({
                                    ...prev,
                                    realizationFactor: r,
                                    incrementalMargin: m,
                                  }))
                                }
                                className={`w-full py-2.5 px-2 rounded font-bold tabular-nums transition-all cursor-pointer ${
                                  isSelected
                                    ? 'ring-2 ring-amber-400 bg-amber-500 text-slate-950'
                                    : cellVal >= 100_000
                                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30'
                                    : cellVal >= 50_000
                                    ? 'bg-emerald-500/10 text-slate-800 dark:text-slate-200 hover:bg-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                                }`}
                              >
                                ${Math.round(cellVal / 1000)}k
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                At 50% realization & 25% margin: $9k net benefit · At 100% & 35%: $108k · At 100% & 45%: $152k.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5.3 & 25.3: Canonical Ledger Entries Table + Live Deduplication & Two-Reference Tester */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              02. Canonical Ledger Resolver & Safeguard Inspector
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Inspect active priced entries vs entries automatically excluded by root-cause deduplication, roll-up section rules, or the Two-Reference Safeguard.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 shrink-0">
            {[
              { id: 'all', label: `All Submissions (${ledgerEntries.length})` },
              { id: 'active', label: `Active Priced (${reconciled.activeEntries.length})` },
              { id: 'excluded', label: `Excluded / Guardrailed (${reconciled.excludedEntries.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEntryFilter(tab.id as 'active' | 'excluded' | 'all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  entryFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Custom Finding Form to Test Ledger Deduplication & Safeguards */}
        <form
          onSubmit={handleAddFinding}
          className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Test Canonical Ledger Guardrails (Submit a Candidate Finding)
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Try submitting &lt;2 evidence refs or an existing root-cause fingerprint (e.g. rc-lead-qualification-handoff-gap)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label htmlFor="finding-title" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Finding Title
              </label>
              <input
                id="finding-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Delayed Enterprise Demo Handoff"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="finding-fingerprint" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Root-Cause Fingerprint
              </label>
              <input
                id="finding-fingerprint"
                type="text"
                value={newFingerprint}
                onChange={(e) => setNewFingerprint(e.target.value)}
                placeholder="e.g. rc-enterprise-demo-sla"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="finding-basis" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Financial Basis
              </label>
              <select
                id="finding-basis"
                value={newBasis}
                onChange={(e) => setNewBasis(e.target.value as FinancialBasis)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
              >
                <option value="measured">measured (Eligible)</option>
                <option value="evidence_based_model">evidence_based_model (Eligible)</option>
                <option value="illustrative_scenario">illustrative_scenario (Excluded)</option>
                <option value="not_evaluated">not_evaluated (Excluded)</option>
              </select>
            </div>

            <div>
              <label htmlFor="finding-econ" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Economic Class
              </label>
              <select
                id="finding-econ"
                value={newEconClass}
                onChange={(e) => setNewEconClass(e.target.value as EconomicClass)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
              >
                <option value="revenue_opportunity">revenue_opportunity</option>
                <option value="contribution">contribution</option>
                <option value="expense_capacity">expense_capacity</option>
                <option value="billing_cash">billing_cash</option>
              </select>
            </div>

            <div>
              <label htmlFor="finding-low" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Annual Low ($)
              </label>
              <input
                id="finding-low"
                type="number"
                value={newLow}
                onChange={(e) => setNewLow(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="finding-high" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Annual High ($)
              </label>
              <input
                id="finding-high"
                type="number"
                value={newHigh}
                onChange={(e) => setNewHigh(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="finding-refs" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Evidence References (comma-separated)
              </label>
              <input
                id="finding-refs"
                type="text"
                value={newRefsInput}
                onChange={(e) => setNewRefsInput(e.target.value)}
                placeholder="CRM-01, DOM-02"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-end justify-between gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsRollup}
                  onChange={(e) => setNewIsRollup(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Roll-up Section</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Compile Finding</span>
              </button>
            </div>
          </div>

          {formError && (
            <div className="text-xs text-rose-500 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{formError}</span>
            </div>
          )}
        </form>

        {/* Ledger Chapters Table - Now Grouped & Collapsible */}
        <div className="space-y-4">
          {Object.entries(groupedEntries).map(([chapter, entries]) => {
            const isExpanded = expandedChapters[chapter] !== false;
            return (
              <div
                key={chapter}
                className="rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleChapter(chapter)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0B0D14] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {chapter} ({entries.length} findings)
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {isExpanded && (
                  <div className="divide-y divide-slate-200 dark:divide-white/10">
                    {entries.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.id} · Fingerprint: {item.rootCauseFingerprint}
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold tabular-nums text-amber-600 dark:text-[#D4AF37] whitespace-nowrap ml-4">
                          {formatUSD(item.lowAmount)} – {formatUSD(item.highAmount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
