import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  Lock,
  RotateCcw,
} from 'lucide-react';
import {
  calculateAskIntrosMatchScore,
  calculateOpportunityReadiness,
  calculateCrmExposureBounds,
  normalizeAskIntrosOverlap,
  DEFAULT_ASK_INTROS_MATCH_INPUTS,
  AskIntrosMatchInputs,
} from '../lib/forensicMath';
import { PersonScanReport } from '../lib/urlScannerBrain';

interface AskIntrosViewProps {
  personScan?: PersonScanReport;
}

export const AskIntrosView: React.FC<AskIntrosViewProps> = ({ personScan }) => {
  // Section 23: Exact Relationship Ranking Mathematics
  const [matchInputs, setMatchInputs] = useState<AskIntrosMatchInputs>(
    DEFAULT_ASK_INTROS_MATCH_INPUTS
  );

  useEffect(() => {
    if (personScan) {
      setMatchInputs(personScan.askIntrosExecution.matchInputs);
    }
  }, [personScan]);

  // Section 24: Consent-Aware Opportunity Readiness
  const [consentGranted, setConsentGranted] = useState<boolean>(true);
  const [readinessFactors, setReadinessFactors] = useState({
    profileFit: { score: 82, valid: true },
    demonstratedNeed: { score: 88, valid: true },
    timing: { score: 74, valid: true },
    evidenceQuality: { score: 70, valid: true },
    engagement: { score: 65, valid: false },
  });

  // Section 30: Two-Sided Opt-In Consent Simulator
  const [requesterOptIn, setRequesterOptIn] = useState<boolean>(true);
  const [counterpartyOptIn, setCounterpartyOptIn] = useState<boolean>(true);
  const [outcomeFollowUpDay, setOutcomeFollowUpDay] = useState<7 | 30 | 90>(90);

  // Section 25.2 & 32: CRM Stalled Opportunity & Cohort Simulator
  const [crmDealValue, setCrmDealValue] = useState<number>(80_000);
  const [crmWinProb, setCrmWinProb] = useState<number>(0.4);

  const matchResult = useMemo(() => calculateAskIntrosMatchScore(matchInputs), [matchInputs]);
  const readinessResult = useMemo(
    () =>
      calculateOpportunityReadiness({
        consentGranted,
        factors: readinessFactors,
      }),
    [consentGranted, readinessFactors]
  );
  const crmBounds = useMemo(
    () => calculateCrmExposureBounds(crmDealValue, crmWinProb),
    [crmDealValue, crmWinProb]
  );
  const overlapFixture = useMemo(
    () =>
      normalizeAskIntrosOverlap([
        { id: 'OF-1', overlapGroup: 'opp-alpha-shared', upperBound: 100_000 },
        { id: 'OF-2', overlapGroup: 'opp-alpha-shared', upperBound: 80_000 },
        { id: 'OF-3', overlapGroup: 'opp-beta-distinct', upperBound: 50_000 },
      ]),
    []
  );

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-12 pb-16">
      {/* Header & Five-Stage Operating Method (Diagnose -> Map -> Score -> Connect -> Compound) */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
              Part II · Sections 20–34 · Ask Intros Relationship Intervention & Outcome Layer [B1–B23]
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Ask Intros: Consent-Gated Relationship Execution & Ranking Math
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Turns diagnostic hypotheses into consented introductions, accountable actions, and longitudinal outcome records. Preserves the strict mathematical boundary between ordinal relevance scores, empirical cohort probabilities, and realized financial recoveries.
            </p>
          </div>

          <button
            onClick={() => {
              setMatchInputs(DEFAULT_ASK_INTROS_MATCH_INPUTS);
              setConsentGranted(true);
              setCrmDealValue(80_000);
              setCrmWinProb(0.4);
            }}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 self-start whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Manuscript Fixtures</span>
          </button>
        </div>

        {/* Figure 14: 5-Stage Sequence with Evidentiary Safeguards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            {
              code: '01',
              stage: 'Diagnose',
              sub: 'Need + records',
              rule: 'Goal & constraints',
              ban: 'No fabricated need',
            },
            {
              code: '02',
              stage: 'Map',
              sub: 'Roles + paths',
              rule: 'Source-backed edge',
              ban: 'No inferred trust',
            },
            {
              code: '03',
              stage: 'Score',
              sub: 'Fit + evidence',
              rule: 'Confidence & unknowns',
              ban: 'No probability claim',
            },
            {
              code: '04',
              stage: 'Connect',
              sub: 'Two-sided consent',
              rule: 'Consent & approval',
              ban: 'No silent outreach',
            },
            {
              code: '05',
              stage: 'Compound',
              sub: 'Result + memory',
              rule: '7 / 30 / 90 day checks',
              ban: 'No invented recovery',
            },
          ].map((item) => (
            <div
              key={item.code}
              className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-1.5"
            >
              <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
                {item.code} · {item.stage}
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                {item.sub}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/10">
                {item.rule} · {item.ban}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 23: Exact Relationship Ranking Mathematics & Figure 15 (Score = 71/100) */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              01. Exact Relationship Ranking Mathematics (Section 23 & Figure 15)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              S = round[(0.24 − w)R + 0.20H + 0.18Y + 0.18T + 0.12D + 0.08A + wO + B], where w = min(0.12, 0.12n/(n+5)) for n ≥ 3 and O = 100(s+2)/(n+4).
            </p>
          </div>
          <div className="text-right font-mono shrink-0">
            <div className="text-xs text-slate-500 dark:text-slate-400">Ordinal Relevance Score</div>
            <div className="text-2xl font-bold text-amber-600 dark:text-[#D4AF37] tabular-nums">
              {matchResult.score} / 100
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 6 cols: Interactive Sliders for R, H, Y, T, D, A, n, s, B */}
          <div className="lg:col-span-6 space-y-4 bg-slate-50 dark:bg-[#0B0D14] p-5 rounded-lg border border-slate-200 dark:border-white/10">
            <div className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
              Adjust Input Signals (Default Fixture: R=75, H=80, Y=70, T=60, D=50, A=90, n=8, s=5)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'R', label: 'R · Strategic Relevance', val: matchInputs.R },
                { key: 'H', label: 'H · Their Offer Fits Need', val: matchInputs.H },
                { key: 'Y', label: 'Y · Your Offer Fits Need', val: matchInputs.Y },
                { key: 'T', label: 'T · Trust Path Evidence', val: matchInputs.T },
                { key: 'D', label: 'D · Timing / Recency', val: matchInputs.D },
                { key: 'A', label: 'A · Stated Availability', val: matchInputs.A },
              ].map((slider) => (
                <div key={slider.key}>
                  <label
                    htmlFor={`match-${slider.key}`}
                    className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1"
                  >
                    <span>{slider.label}</span>
                    <span className="font-mono font-bold tabular-nums">{slider.val}</span>
                  </label>
                  <input
                    id={`match-${slider.key}`}
                    type="range"
                    min={0}
                    max={100}
                    value={slider.val}
                    onChange={(e) =>
                      setMatchInputs((prev) => ({
                        ...prev,
                        [slider.key]: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <div>
                <label htmlFor="match-n" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Shared Partners (n ≥ 3)
                </label>
                <input
                  id="match-n"
                  type="number"
                  min={0}
                  max={50}
                  value={matchInputs.eligibleSharedPartnersN}
                  onChange={(e) =>
                    setMatchInputs((prev) => ({
                      ...prev,
                      eligibleSharedPartnersN: Number(e.target.value),
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="match-s" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Positive Outcomes (s)
                </label>
                <input
                  id="match-s"
                  type="number"
                  min={0}
                  max={matchInputs.eligibleSharedPartnersN}
                  value={matchInputs.positiveOutcomesS}
                  onChange={(e) =>
                    setMatchInputs((prev) => ({
                      ...prev,
                      positiveOutcomesS: Number(e.target.value),
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="match-b" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Giver Bonus B (≤ 3)
                </label>
                <input
                  id="match-b"
                  type="number"
                  step={0.5}
                  min={0}
                  max={3}
                  value={matchInputs.contributorBonusB}
                  onChange={(e) =>
                    setMatchInputs((prev) => ({
                      ...prev,
                      contributorBonusB: Number(e.target.value),
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Right 6 cols: Explainable Matching Decomposition Bar Chart (Figure 15) */}
          <div className="lg:col-span-6 space-y-3 bg-slate-50 dark:bg-[#0B0D14] p-5 rounded-lg border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-white/10">
              <span>Explainable Component Decomposition</span>
              <span>w = {matchResult.w} · O = {matchResult.O} · Raw = {matchResult.rawTotal}</span>
            </div>

            {[
              { label: 'Strategic relevance (0.24 − w)R', pts: matchResult.components.strategicRelevance, max: 24 },
              { label: 'Their offer fits your goal (0.20 H)', pts: matchResult.components.theirOfferFitsYourGoal, max: 20 },
              { label: 'Your offer fits their need (0.18 Y)', pts: matchResult.components.yourOfferFitsTheirNeed, max: 18 },
              { label: 'Trust path evidence (0.18 T)', pts: matchResult.components.trustPath, max: 18 },
              { label: 'Timing recency (0.12 D)', pts: matchResult.components.timing, max: 12 },
              { label: 'Availability (0.08 A)', pts: matchResult.components.availability, max: 8 },
              { label: 'Shared outcomes (w O)', pts: matchResult.components.sharedOutcomes, max: 12 },
              { label: 'Approved giver boost (B)', pts: matchResult.components.approvedGiverBoost, max: 3 },
            ].map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300">{bar.label}</span>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {bar.pts.toFixed(2)} pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(100, (bar.pts / 20) * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Section 31.1 Safeguard: A match score of {matchResult.score} is an ordinal ranking, NOT a {matchResult.score}% probability of sale. Never multiply $80,000 × 0.{matchResult.score} to claim expected revenue.
            </div>
          </div>
        </div>
      </section>

      {/* Section 24 & 25: Consent-Aware Opportunity Readiness + CRM Exposure & Overlap Normalization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 24.1: Consent-Gated Opportunity Readiness (6 cols) */}
        <section className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                02. Opportunity Readiness Gate (Section 24.1)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Returns no score if consent is absent, observed weight &lt; 0.65, or &lt; 3 valid signals exist.
              </p>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">Readiness</div>
              <div className="text-xl font-bold text-amber-500 tabular-nums">
                {readinessResult.score !== null ? `${readinessResult.score}/100` : 'WITHHELD'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14]">
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Member Consent to Opportunity Matching
            </div>
            <button
              type="button"
              onClick={() => setConsentGranted((c) => !c)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                consentGranted
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
              }`}
            >
              {consentGranted ? 'Consent Active' : 'Consent Revoked'}
            </button>
          </div>

          <div className="space-y-2.5">
            {(
              [
                { key: 'profileFit', label: 'Profile Fit (Weight 0.25)' },
                { key: 'demonstratedNeed', label: 'Demonstrated Need (Weight 0.30)' },
                { key: 'timing', label: 'Timing Signal (Weight 0.20)' },
                { key: 'evidenceQuality', label: 'Evidence Quality (Weight 0.15)' },
                { key: 'engagement', label: 'Engagement History (Weight 0.10)' },
              ] as const
            ).map((item) => {
              const factor = readinessFactors[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 p-2.5 rounded border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#0B0D14]"
                >
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={factor.valid}
                      onChange={(e) =>
                        setReadinessFactors((prev) => ({
                          ...prev,
                          [item.key]: { ...prev[item.key], valid: e.target.checked },
                        }))
                      }
                      className="rounded accent-amber-500"
                    />
                    <span>{item.label}</span>
                  </label>
                  <span className="font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                    {factor.valid ? `${factor.score}/100` : 'Missing (Excluded)'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] text-xs font-mono flex items-center justify-between">
            <span>
              Observed Weight: {readinessResult.observedWeight} (Min 0.65) · Signals: {readinessResult.validSignalCount} (Min 3)
            </span>
            <span className="text-amber-500 font-bold uppercase">{readinessResult.band}</span>
          </div>
        </section>

        {/* Section 25 & 32: CRM Revenue Diagnosis & Overlap Normalization (6 cols) */}
        <section className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 space-y-5">
          <div className="border-b border-slate-200 dark:border-white/10 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              03. CRM Stalled Deal Exposure & Overlap Reducer (Section 25)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              21-day touch inactivity triggers investigation. Pipeline heuristic L_CRM = round(V·p), U_CRM = V.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="crm-val" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Open Deal Value (V)
                </label>
                <input
                  id="crm-val"
                  type="number"
                  step={5000}
                  value={crmDealValue}
                  onChange={(e) => setCrmDealValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="crm-prob" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  CRM Win Probability (p = {Math.round(crmWinProb * 100)}%)
                </label>
                <input
                  id="crm-prob"
                  type="range"
                  min={0.1}
                  max={0.9}
                  step={0.05}
                  value={crmWinProb}
                  onChange={(e) => setCrmWinProb(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 font-mono text-xs">
              <span className="text-slate-500 dark:text-slate-400">Displayed Pipeline Exposure Heuristic:</span>
              <span className="text-base font-bold text-amber-500 tabular-nums">
                {formatUSD(crmBounds.lowerBound)} to {formatUSD(crmBounds.upperBound)}
              </span>
            </div>
          </div>

          {/* Section 25.4 Overlap Fixture */}
          <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-2.5">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Section 25.4 · Overlap Normalization Fixture ($100k + $80k Shared Group + $50k Distinct)
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
              <div className="p-2.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C]">
                <div className="text-[10px] text-slate-400">E_gross</div>
                <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatUSD(overlapFixture.grossExposure)}
                </div>
              </div>
              <div className="p-2.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C]">
                <div className="text-[10px] text-slate-400">E_normalized</div>
                <div className="font-bold text-emerald-500 tabular-nums">
                  {formatUSD(overlapFixture.normalizedExposure)}
                </div>
              </div>
              <div className="p-2.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C]">
                <div className="text-[10px] text-slate-400">E_overlap Removed</div>
                <div className="font-bold text-amber-500 tabular-nums">
                  {formatUSD(overlapFixture.overlapRemoved)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 30: Two-Party Consent Integrity & 100-Introduction Outcome Funnel (Figure 17) */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              04. Introduction Outcome Science & Two-Party Consent Spine (Section 30)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              An acceptance timestamp is server-owned and assigned only when both participants opt in [B13]. Check-ins occur at 7, 30, and 90 days.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 shrink-0">
            {([7, 30, 90] as const).map((day) => (
              <button
                key={day}
                onClick={() => setOutcomeFollowUpDay(day)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                  outcomeFollowUpDay === day
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Day {day} Cohort
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Two-Sided Opt-In Simulator (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-4">
            <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
              Two-Sided Opt-In Database Contract (0022_introduction_outcome_spine.sql)
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] cursor-pointer">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  1. Requester Opt-In (Account Owner)
                </span>
                <input
                  type="checkbox"
                  checked={requesterOptIn}
                  onChange={(e) => setRequesterOptIn(e.target.checked)}
                  className="rounded accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] cursor-pointer">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  2. Counterparty Opt-In (Target Domain Expert)
                </span>
                <input
                  type="checkbox"
                  checked={counterpartyOptIn}
                  onChange={(e) => setCounterpartyOptIn(e.target.checked)}
                  className="rounded accent-amber-500"
                />
              </label>
            </div>

            <div className="p-3.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] text-xs font-mono">
              {requesterOptIn && counterpartyOptIn ? (
                <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Server Stamp Assigned: 2026-11-02T13:40:00Z · Outcome Spine Active</span>
                </div>
              ) : (
                <div className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Pending Mutual Consent · Requester cannot forge counterparty approval</span>
                </div>
              )}
            </div>
          </div>

          {/* Figure 17: Worked 100-Introduction Outcome Funnel (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Figure 17 · Illustrative {outcomeFollowUpDay}-Day Outcome Funnel</span>
              <span>p_meet = 65% · p_next = 46.2% · p_outcome = 40%</span>
            </div>

            {[
              { label: 'N_I · Consent-complete introductions', count: 100, pct: 100, color: 'bg-amber-500' },
              {
                label: 'N_M · Verified meeting reached',
                count: outcomeFollowUpDay === 7 ? 42 : outcomeFollowUpDay === 30 ? 58 : 65,
                pct: outcomeFollowUpDay === 7 ? 42 : outcomeFollowUpDay === 30 ? 58 : 65,
                color: 'bg-amber-400',
              },
              {
                label: 'N_N · Concrete next step recorded',
                count: outcomeFollowUpDay === 7 ? 14 : outcomeFollowUpDay === 30 ? 24 : 30,
                pct: outcomeFollowUpDay === 7 ? 14 : outcomeFollowUpDay === 30 ? 24 : 30,
                color: 'bg-sky-400',
              },
              {
                label: 'N_O · Qualifying reported outcome',
                count: outcomeFollowUpDay === 7 ? 2 : outcomeFollowUpDay === 30 ? 7 : 12,
                pct: outcomeFollowUpDay === 7 ? 2 : outcomeFollowUpDay === 30 ? 7 : 12,
                color: 'bg-emerald-500',
              },
              {
                label: 'Commercial outcomes supported by transaction records',
                count: outcomeFollowUpDay === 7 ? 1 : outcomeFollowUpDay === 30 ? 4 : 8,
                pct: outcomeFollowUpDay === 7 ? 1 : outcomeFollowUpDay === 30 ? 4 : 8,
                color: 'bg-emerald-400',
              },
            ].map((stage) => (
              <div key={stage.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300">{stage.label}</span>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {stage.count} ({stage.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${stage.color}`}
                    style={{ width: `${stage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
