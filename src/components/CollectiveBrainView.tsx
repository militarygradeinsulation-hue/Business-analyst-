import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Database,
  FlaskConical,
  FileCheck2,
} from 'lucide-react';
import {
  COLLECTIVE_BRAIN_PATTERNS,
  APPENDIX_B_AUDIT_QUESTIONS,
} from '../data/aifmCorpus';
import { calculatePatternLift } from '../lib/forensicMath';

export const CollectiveBrainView: React.FC = () => {
  // Section 13.2: Co-occurrence & Lift Calculator
  const [eligibleReports, setEligibleReports] = useState<number>(1067);
  const [countA, setCountA] = useState<number>(384);
  const [countB, setCountB] = useState<number>(312);
  const [countBothAB, setCountBothAB] = useState<number>(198);

  // Appendix B: 14-Question Reporting Standard Gate
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: false,
    13: true,
    14: true,
  });

  const liftMetrics = useMemo(
    () => calculatePatternLift(eligibleReports, countA, countB, countBothAB),
    [eligibleReports, countA, countB, countBothAB]
  );

  // Appendix B Rule Evaluation:
  // "When any of items 2, 4, 5, or 8 are missing, the record should not receive a verified monetary-loss classification.
  // When item 11 is absent, no realized improvement should be claimed.
  // When item 12 is absent, the report may document an operational improvement without a verified cash or profit recovery."
  const auditVerdict = useMemo(() => {
    const hasCoreLossGate =
      checkedQuestions[2] &&
      checkedQuestions[4] &&
      checkedQuestions[5] &&
      checkedQuestions[8];
    const hasItem11 = Boolean(checkedQuestions[11]);
    const hasItem12 = Boolean(checkedQuestions[12]);

    if (!hasCoreLossGate) {
      return {
        level: 'Unverified Exposure Claim',
        tone: 'text-rose-500',
        explanation:
          'Missing one or more mandatory baseline/observation items (Items 2, 4, 5, or 8). Record cannot receive a verified monetary-loss classification.',
      };
    }
    if (!hasItem11) {
      return {
        level: 'Verified Monetary-Loss Exposure (Pre-Intervention)',
        tone: 'text-amber-500',
        explanation:
          'Items 2, 4, 5, and 8 are satisfied, establishing defensible exposure. Because Item 11 (Post-intervention outcome) is absent, no realized improvement may be claimed.',
      };
    }
    if (!hasItem12) {
      return {
        level: 'Verified Operational Improvement (Non-Cash / Unsettled)',
        tone: 'text-sky-400',
        explanation:
          'Item 11 is satisfied, documenting a verified operational improvement. Because Item 12 (Actual sales transactions / paid costs / receipts) is absent, no verified cash or profit recovery may be claimed.',
      };
    }
    return {
      level: 'Class V · Audit-Ready Realized Cash / Profit Recovery',
      tone: 'text-emerald-400',
      explanation:
        'All mandatory observation, baseline, post-intervention comparison, and general-ledger transaction links (Items 2, 4, 5, 8, 11, 12) are verified.',
    };
  }, [checkedQuestions]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header & Section 13 Collective Brain Overview */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
            Sections 13, 14, 15 & Appendix B · Collective Brain & Scientific Validation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Statistical Science of the Collective Brain & Audit Gates
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Deduplicates repeated scans per organization (1.79 reports/company), computes unique-company root-cause prevalence P̂_k = n_k / N_k over eligible source coverage, evaluates co-occurrence Lift, and enforces Appendix B dollar reporting standards.
          </p>
        </div>

        {/* Unique-Company Prevalence Table + Lift Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <span>Section 13.1 · Unique-Company Prevalence (P̂_k = n_k / N_k)</span>
              </h2>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                701 normalized patterns · 339 pairs
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] font-mono text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3">Normalized Ontology Key</th>
                    <th className="py-2.5 px-3 text-right">Reports</th>
                    <th className="py-2.5 px-3 text-right">Firms (n_k / N_k)</th>
                    <th className="py-2.5 px-3 text-right">P̂_k</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {COLLECTIVE_BRAIN_PATTERNS.map((pat) => {
                    const prevalence = ((pat.companiesWithPattern / pat.eligibleCompaniesN) * 100).toFixed(1);
                    return (
                      <tr
                        key={pat.id}
                        onClick={() => {
                          setEligibleReports(pat.eligibleCompaniesN);
                          setCountA(pat.companiesWithPattern);
                          setCountBothAB(pat.coOccurrenceCount);
                        }}
                        className="hover:bg-slate-50 dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="font-mono font-semibold text-slate-900 dark:text-white">
                            {pat.normalizedLabel}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {pat.category} · Co-occurs with {pat.coOccursWith} ({pat.coOccurrenceCount})
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {pat.reportsWithPattern}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {pat.companiesWithPattern} / {pat.eligibleCompaniesN}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-amber-600 dark:text-[#D4AF37]">
                          {prevalence}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 13.2 Co-occurrence & Lift Calculator (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-4">
            <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
              Section 13.2 · Co-Occurrence & Lift Calculator
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lift(A, B) = P̂(A, B) / [P̂(A) · P̂(B)]
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A pair enters the Collective Brain co-occurrence table when it appears together in ≥ 3 reports [T2]. Lift &gt; 1.0 indicates association above independence baseline (descriptive, not causal).
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label htmlFor="lift-elig" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Eligible Population (N_eligible)
                </label>
                <input
                  id="lift-elig"
                  type="number"
                  min={10}
                  value={eligibleReports}
                  onChange={(e) => setEligibleReports(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="lift-ab" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Co-Occurrences N(A ∩ B)
                </label>
                <input
                  id="lift-ab"
                  type="number"
                  min={0}
                  value={countBothAB}
                  onChange={(e) => setCountBothAB(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="lift-a" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Pattern A Count N(A)
                </label>
                <input
                  id="lift-a"
                  type="number"
                  min={1}
                  value={countA}
                  onChange={(e) => setCountA(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="lift-b" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Pattern B Count N(B)
                </label>
                <input
                  id="lift-b"
                  type="number"
                  min={1}
                  value={countB}
                  onChange={(e) => setCountB(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] grid grid-cols-3 gap-2 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-400">P̂(A, B)</div>
                <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {(liftMetrics.pAB * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Lift(A, B)</div>
                <div className="font-bold text-amber-500 tabular-nums">{liftMetrics.lift}x</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">≥3 Gate</div>
                <div className="font-bold text-emerald-500">
                  {liftMetrics.meetsScreeningRule ? 'Passed' : 'Suppressed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appendix B: Interactive 14-Question Reporting Standard Gate for Every Dollar Figure */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-500" />
              <span>Appendix B · 14-Question Reporting Standard for Every Dollar Figure</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Toggle the evidentiary items below to test the exact manuscript rules for when a finding may be classified as a verified monetary loss (Items 2, 4, 5, 8), operational improvement (Item 11), or realized profit recovery (Item 12).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                setCheckedQuestions(
                  Object.fromEntries(APPENDIX_B_AUDIT_QUESTIONS.map((q) => [q.id, true]))
                )
              }
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/15 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            >
              Verify All 14 Items (Class V)
            </button>
          </div>
        </div>

        {/* Live Audit Gate Verdict Banner */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Permissible Financial Classification Verdict
            </div>
            <div className={`text-lg font-bold font-mono ${auditVerdict.tone}`}>
              {auditVerdict.level}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {auditVerdict.explanation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {APPENDIX_B_AUDIT_QUESTIONS.map((item) => {
            const isChecked = Boolean(checkedQuestions[item.id]);
            const isCriticalGate =
              item.requiredForVerifiedLoss ||
              item.requiredForRealizedImprovement ||
              item.requiredForCashProfitRecovery;
            return (
              <label
                key={item.id}
                className={`p-3.5 rounded-lg border flex items-start gap-3 transition-colors cursor-pointer ${
                  isChecked
                    ? 'border-slate-300 dark:border-white/15 bg-slate-50/70 dark:bg-[#0B0D14]'
                    : 'border-rose-500/40 bg-rose-500/5'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    setCheckedQuestions((prev) => ({
                      ...prev,
                      [item.id]: e.target.checked,
                    }))
                  }
                  className="mt-1 rounded accent-amber-500"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="font-mono text-amber-500">
                      #{String(item.id).padStart(2, '0')}
                    </span>
                    <span>{item.question}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.detail}</p>
                  {isCriticalGate && (
                    <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 pt-0.5">
                      {item.requiredForVerifiedLoss && 'Mandatory for Verified Loss Gate (#2, #4, #5, #8)'}
                      {item.requiredForRealizedImprovement && 'Mandatory for Realized Improvement (#11)'}
                      {item.requiredForCashProfitRecovery && 'Mandatory for Cash/Profit Recovery (#12)'}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Sections 15 & 34: Three-Arm Prospective Scientific Validation Protocol */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-500" />
            <span>Sections 15 & 34 · Three-Arm Prospective Comparative Validation Design</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Falsifiable experimental protocol testing whether Golden Report + Mindprint + Ask Intros (Arm C) improves adjudicated mechanism accuracy and net attributable contribution over standard audits (Arm A) and diagnostics alone (Arm B).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              arm: 'Arm A · Control A',
              title: 'Standard Process & Conventional Audit',
              scope: 'Existing CRM, conventional departmental KPIs, and manual networking follow-up.',
              hypothesis: 'Baseline reference for mechanism detection accuracy and time-to-diagnosis.',
            },
            {
              arm: 'Arm B · Control B',
              title: 'Golden Report + Mindprint Diagnosis',
              scope: 'Canonical Financial Leak Ledger v6 + Mindprint company evidence graph without Ask Intros execution.',
              hypothesis: 'Tests H1–H3: Higher adjudicated mechanism accuracy and fewer unsupported human-causation claims.',
            },
            {
              arm: 'Arm C · Integrated Execution',
              title: 'Golden Report + Mindprint + Ask Intros',
              scope: 'Full diagnostic evidence graph plus deterministic relationship scoring, two-sided consent, and 7/30/90-day outcome tracking.',
              hypothesis: 'Tests H4–H5 & H-AI1: Incremental verified contribution value per eligible case after intervention costs.',
            },
          ].map((item) => (
            <div
              key={item.arm}
              className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-2.5"
            >
              <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
                {item.arm}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.scope}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {item.hypothesis}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
