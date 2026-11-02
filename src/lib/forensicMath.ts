/**
 * Pure deterministic mathematical and forensic calculation library
 * implementing the exact equations from the Aetheris Integrated Forensic Methodology (AIFM) manuscript.
 */

export type EvidenceCode = 'D' | 'E' | 'C' | 'X' | 'S' | 'V';

export type FinancialBasis =
  | 'measured'
  | 'evidence_based_model'
  | 'illustrative_scenario'
  | 'not_evaluated';

export type EconomicClass =
  | 'revenue_opportunity'
  | 'contribution'
  | 'expense_capacity'
  | 'billing_cash';

export interface LedgerEntryInput {
  id: string;
  title: string;
  chapter: string;
  isRollupSection?: boolean; // Executive summary, Top Ten, Appendix, Remediation Plan
  chapterHasAuthoritativeAmount?: boolean;
  isChapterAuthoritativeEntry?: boolean;
  rootCauseFingerprint: string;
  basis: FinancialBasis;
  economicClass: EconomicClass;
  lowAmount: number;
  highAmount: number;
  evidenceRefs: string[];
  sourceSystems?: string[]; // Independent source check
  overlapGroup?: string;
  currency?: string;
}

export interface ReconciledLedgerResult {
  activeEntries: LedgerEntryInput[];
  excludedEntries: { entry: LedgerEntryInput; reason: string }[];
  headlineLowTotal: number;
  headlineHighTotal: number;
  byChapter: Record<string, { low: number; high: number }>;
  byEconomicClass: Record<EconomicClass, { low: number; high: number }>;
  topTenLowSubtotal: number;
  remainderLowSubtotal: number;
  invariants: {
    chapterSumMatchesActiveSum: boolean;
    topTenPlusRemainderMatchesActiveSum: boolean;
    uniqueRootCauseFingerprints: boolean;
    singleLeakUnder50M: boolean;
    chapterUnder10M: boolean;
    totalPlausibilityWarning25M: boolean;
    exceedsCompanyRevenueWarning: boolean;
  };
}

/**
 * Section 3.2: Corpus metrics from October 29, 2026 production snapshot
 */
export function computeCorpusMetrics(reports: number, companies: number, findings: number) {
  return {
    findingsPerReport: Number((findings / reports).toFixed(2)),
    reportsPerCompany: Number((reports / companies).toFixed(2)),
  };
}

/**
 * Section 25.3: Two-reference safeguard & source independence check
 * Requires at least two distinct evidence references for a finding to remain classified as a priced leak.
 */
export function applyTwoReferenceSafeguard(entry: LedgerEntryInput): {
  status: 'priced_leak' | 'unknown_worth_checking';
  effectiveLow: number;
  effectiveHigh: number;
  distinctReferenceCount: number;
  independentSourceCount: number;
} {
  const uniqueRefs = Array.from(new Set(entry.evidenceRefs.filter(Boolean)));
  const uniqueSources = Array.from(new Set((entry.sourceSystems || uniqueRefs).filter(Boolean)));

  if (uniqueRefs.length < 2) {
    return {
      status: 'unknown_worth_checking',
      effectiveLow: 0,
      effectiveHigh: 0,
      distinctReferenceCount: uniqueRefs.length,
      independentSourceCount: uniqueSources.length,
    };
  }

  const normalizedLow = Math.min(entry.lowAmount, entry.highAmount);
  const normalizedHigh = Math.max(entry.lowAmount, entry.highAmount);

  return {
    status: 'priced_leak',
    effectiveLow: normalizedLow,
    effectiveHigh: normalizedHigh,
    distinctReferenceCount: uniqueRefs.length,
    independentSourceCount: uniqueSources.length,
  };
}

/**
 * Section 5: Canonical Financial Leak Ledger (Model Version 6)
 * Enforces eligibility rules, roll-up exclusion, chapter ownership, root-cause fingerprint deduplication,
 * sanity thresholds ($50M single leak, $10M chapter, $25M report warning), and reconciliation invariants.
 */
export function reconcileCanonicalLedger(
  entries: LedgerEntryInput[],
  companyAnnualRevenue = 15_000_000
): ReconciledLedgerResult {
  const activeEntries: LedgerEntryInput[] = [];
  const excludedEntries: { entry: LedgerEntryInput; reason: string }[] = [];
  const seenFingerprints = new Set<string>();

  for (const raw of entries) {
    // Normalize reversed ranges
    const lowAmount = Math.min(raw.lowAmount, raw.highAmount);
    const highAmount = Math.max(raw.lowAmount, raw.highAmount);
    const entry: LedgerEntryInput = { ...raw, lowAmount, highAmount };

    if (entry.currency && entry.currency !== 'USD') {
      excludedEntries.push({ entry, reason: `Cross-currency refusal (${entry.currency} != USD)` });
      continue;
    }

    if (entry.isRollupSection) {
      excludedEntries.push({
        entry,
        reason: 'Roll-up section excluded (Executive Summary / Top Ten / Appendix / Remediation)',
      });
      continue;
    }

    const safeguard = applyTwoReferenceSafeguard(entry);
    if (safeguard.status === 'unknown_worth_checking') {
      excludedEntries.push({
        entry,
        reason: 'Downgraded to Unknown worth checking (< 2 distinct evidence references)',
      });
      continue;
    }

    if (entry.basis !== 'measured' && entry.basis !== 'evidence_based_model') {
      excludedEntries.push({
        entry,
        reason: `Basis '${entry.basis}' excluded from headline total (only measured or evidence_based_model eligible)`,
      });
      continue;
    }

    if (entry.chapterHasAuthoritativeAmount && !entry.isChapterAuthoritativeEntry) {
      excludedEntries.push({
        entry,
        reason: `Chapter '${entry.chapter}' has an authoritative total; individual finding retained as explanatory cross-reference`,
      });
      continue;
    }

    const normalizedKey = entry.rootCauseFingerprint.trim().toLowerCase();
    if (seenFingerprints.has(normalizedKey)) {
      excludedEntries.push({
        entry,
        reason: `Deduplicated via root-cause fingerprint '${normalizedKey}'`,
      });
      continue;
    }

    seenFingerprints.add(normalizedKey);
    activeEntries.push(entry);
  }

  let headlineLowTotal = 0;
  let headlineHighTotal = 0;
  const byChapter: Record<string, { low: number; high: number }> = {};
  const byEconomicClass: Record<EconomicClass, { low: number; high: number }> = {
    revenue_opportunity: { low: 0, high: 0 },
    contribution: { low: 0, high: 0 },
    expense_capacity: { low: 0, high: 0 },
    billing_cash: { low: 0, high: 0 },
  };

  let singleLeakUnder50M = true;

  for (const item of activeEntries) {
    headlineLowTotal += item.lowAmount;
    headlineHighTotal += item.highAmount;

    if (item.highAmount > 50_000_000) {
      singleLeakUnder50M = false;
    }

    if (!byChapter[item.chapter]) {
      byChapter[item.chapter] = { low: 0, high: 0 };
    }
    byChapter[item.chapter].low += item.lowAmount;
    byChapter[item.chapter].high += item.highAmount;

    byEconomicClass[item.economicClass].low += item.lowAmount;
    byEconomicClass[item.economicClass].high += item.highAmount;
  }

  const chapterLowSum = Object.values(byChapter).reduce((acc, c) => acc + c.low, 0);
  const chapterHighSum = Object.values(byChapter).reduce((acc, c) => acc + c.high, 0);
  const chapterUnder10M = Object.values(byChapter).every((c) => c.high <= 10_000_000);

  const sortedByLowDesc = [...activeEntries].sort((a, b) => b.lowAmount - a.lowAmount);
  const topTen = sortedByLowDesc.slice(0, 10);
  const remainder = sortedByLowDesc.slice(10);

  const topTenLowSubtotal = topTen.reduce((acc, item) => acc + item.lowAmount, 0);
  const remainderLowSubtotal = remainder.reduce((acc, item) => acc + item.lowAmount, 0);

  return {
    activeEntries,
    excludedEntries,
    headlineLowTotal,
    headlineHighTotal,
    byChapter,
    byEconomicClass,
    topTenLowSubtotal,
    remainderLowSubtotal,
    invariants: {
      chapterSumMatchesActiveSum:
        chapterLowSum === headlineLowTotal && chapterHighSum === headlineHighTotal,
      topTenPlusRemainderMatchesActiveSum:
        topTenLowSubtotal + remainderLowSubtotal === headlineLowTotal,
      uniqueRootCauseFingerprints: seenFingerprints.size === activeEntries.length,
      singleLeakUnder50M,
      chapterUnder10M,
      totalPlausibilityWarning25M: headlineHighTotal > 25_000_000,
      exceedsCompanyRevenueWarning: headlineHighTotal > companyAnnualRevenue,
    },
  };
}

/**
 * Section 25.4: Ask Intros Financial Overlap Normalization
 * Groups open priced findings by overlapGroup and counts only the highest upper bound within each group.
 */
export function normalizeAskIntrosOverlap(
  findings: { id: string; overlapGroup: string; upperBound: number; currency?: string }[]
) {
  const validFindings = findings.filter((f) => !f.currency || f.currency === 'USD');
  const grossExposure = validFindings.reduce((sum, f) => sum + f.upperBound, 0);

  const maxByGroup = new Map<string, number>();
  for (const f of validFindings) {
    const currentMax = maxByGroup.get(f.overlapGroup) ?? 0;
    if (f.upperBound > currentMax) {
      maxByGroup.set(f.overlapGroup, f.upperBound);
    }
  }

  let normalizedExposure = 0;
  for (const val of maxByGroup.values()) {
    normalizedExposure += val;
  }

  return {
    grossExposure,
    normalizedExposure,
    overlapRemoved: grossExposure - normalizedExposure,
  };
}

/**
 * Section 10: Complete Four-Mechanism Numerical Case & Profit Bridge
 */
export interface SyntheticCaseParameters {
  // F01: Lead ownership & qualification gap
  f01EligibleLeads: number; // default 5000
  f01BaselineRate: number; // default 0.10
  f01ComparatorRate: number; // default 0.12
  f01TreatedPostRate: number; // default 0.126
  f01ControlPreRate: number; // default 0.120
  f01ControlPostRate: number; // default 0.130
  f01AvgRevenue: number; // default 4000

  // F02: Lost quote progression
  f02EligibleQuotes: number; // default 800
  f02ModeledDelta: number; // default 0.04
  f02AdjustedDelta: number; // default 0.025
  f02AvgQuoteRevenue: number; // default 6000

  // F03: Duplicated administrative work
  f03AnnualReworkHours: number; // default 1800
  f03EliminatedOvertimeHours: number; // default 600
  f03LoadedHourlyCost: number; // default 65

  // F04: Unbilled completed work
  f04UnbilledIdentified: number; // default 90000
  f04CashCollected: number; // default 55000

  // Program economics
  realizationFactor: number; // default 1.0 (0.50 to 1.00)
  incrementalMargin: number; // default 0.35 (0.25 to 0.45)
  implementationCost: number; // default 85000
  includeCashCollectionInIncome: boolean; // false = Base Accrual, true = Alternative scenario
}

export const DEFAULT_SYNTHETIC_CASE_PARAMS: SyntheticCaseParameters = {
  f01EligibleLeads: 5000,
  f01BaselineRate: 0.10,
  f01ComparatorRate: 0.12,
  f01TreatedPostRate: 0.126,
  f01ControlPreRate: 0.12,
  f01ControlPostRate: 0.13,
  f01AvgRevenue: 4000,

  f02EligibleQuotes: 800,
  f02ModeledDelta: 0.04,
  f02AdjustedDelta: 0.025,
  f02AvgQuoteRevenue: 6000,

  f03AnnualReworkHours: 1800,
  f03EliminatedOvertimeHours: 600,
  f03LoadedHourlyCost: 65,

  f04UnbilledIdentified: 90000,
  f04CashCollected: 55000,

  realizationFactor: 1.0,
  incrementalMargin: 0.35,
  implementationCost: 85000,
  includeCashCollectionInIncome: false,
};

export function evaluateSyntheticCase(params: SyntheticCaseParameters = DEFAULT_SYNTHETIC_CASE_PARAMS) {
  // F01
  const f01GrossExposure = Math.round(
    params.f01EligibleLeads * (params.f01ComparatorRate - params.f01BaselineRate) * params.f01AvgRevenue
  );
  const f01DidEffect =
    params.f01TreatedPostRate -
    params.f01BaselineRate -
    (params.f01ControlPostRate - params.f01ControlPreRate);
  const f01OutcomeRevenue = Math.round(
    params.f01EligibleLeads * f01DidEffect * params.f01AvgRevenue
  );

  // F02
  const f02GrossExposure = Math.round(
    params.f02EligibleQuotes * params.f02ModeledDelta * params.f02AvgQuoteRevenue
  );
  const f02OutcomeRevenue = Math.round(
    params.f02EligibleQuotes * params.f02AdjustedDelta * params.f02AvgQuoteRevenue
  );

  // F03
  const f03GrossCapacity = Math.round(params.f03AnnualReworkHours * params.f03LoadedHourlyCost);
  const f03AvoidedOvertime = Math.round(
    params.f03EliminatedOvertimeHours * params.f03LoadedHourlyCost
  );
  const f03NominalReleasedCapacityHours =
    params.f03AnnualReworkHours - params.f03EliminatedOvertimeHours;
  const f03NominalReleasedCapacityValue = Math.round(
    f03NominalReleasedCapacityHours * params.f03LoadedHourlyCost
  );

  // F04
  const f04GrossExposure = Math.round(params.f04UnbilledIdentified);
  const f04CashCollected = Math.round(params.f04CashCollected);

  // Mixed inventory totals (nominal orientation only, never homogeneous income loss)
  const mixedGrossExposure =
    f01GrossExposure + f02GrossExposure + f03GrossCapacity + f04GrossExposure;
  const mixedSyntheticOutcome =
    f01OutcomeRevenue + f02OutcomeRevenue + f03AvoidedOvertime + f04CashCollected;

  // Profit Bridge (Section 10.7 - 10.9)
  const totalIncrementalRevenue = f01OutcomeRevenue + f02OutcomeRevenue;
  const realizedIncrementalRevenue = totalIncrementalRevenue * params.realizationFactor;
  const incrementalContributionSales = Math.round(
    realizedIncrementalRevenue * params.incrementalMargin
  );

  const preCostBenefitBase = incrementalContributionSales + f03AvoidedOvertime;
  const preCostBenefit = params.includeCashCollectionInIncome
    ? preCostBenefitBase + f04CashCollected
    : preCostBenefitBase;

  const netEconomicBenefit = preCostBenefit - params.implementationCost;
  const roiPercent =
    params.implementationCost > 0
      ? Number(((netEconomicBenefit / params.implementationCost) * 100).toFixed(1))
      : 0;

  return {
    f01: {
      grossExposure: f01GrossExposure,
      didEffectPctPoints: Number((f01DidEffect * 100).toFixed(2)),
      outcomeRevenue: f01OutcomeRevenue,
    },
    f02: {
      grossExposure: f02GrossExposure,
      outcomeRevenue: f02OutcomeRevenue,
    },
    f03: {
      grossCapacity: f03GrossCapacity,
      avoidedOvertime: f03AvoidedOvertime,
      releasedCapacityHours: f03NominalReleasedCapacityHours,
      releasedCapacityValue: f03NominalReleasedCapacityValue,
    },
    f04: {
      grossExposure: f04GrossExposure,
      cashCollected: f04CashCollected,
    },
    mixedGrossExposure,
    mixedSyntheticOutcome,
    bridge: {
      totalIncrementalRevenue,
      realizedIncrementalRevenue: Math.round(realizedIncrementalRevenue),
      incrementalContributionSales,
      avoidedOvertime: f03AvoidedOvertime,
      preCostBenefit,
      implementationCost: params.implementationCost,
      netEconomicBenefit,
      roiPercent,
      separateCashFlowCollected: f04CashCollected,
    },
  };
}

/**
 * Section 10.9: Net Economic Benefit Sensitivity Surface
 * B_net(r, m) = $440,000 * r * m + $39,000 - $85,000
 */
export function computeSensitivityCell(
  realizationFactor: number,
  margin: number,
  modeledIncrementalRevenue = 440_000,
  avoidedExpense = 39_000,
  programCost = 85_000
): number {
  return Math.round(modeledIncrementalRevenue * realizationFactor * margin + avoidedExpense - programCost);
}

/**
 * Section 23.1 & 23.2: Exact Relationship Ranking Mathematics in Ask Intros
 * S = round[(0.24 - w)R + 0.20H + 0.18Y + 0.18T + 0.12D + 0.08A + wO + B]
 */
export interface AskIntrosMatchInputs {
  R: number; // Strategic relevance (0-100)
  H: number; // Their offer fits your need (0-100)
  Y: number; // Your offer fits their need (0-100)
  T: number; // Recorded relationship / trust path (0-100)
  D: number; // Timing from interaction recency (0-100)
  A: number; // Stated availability (0-100)
  eligibleSharedPartnersN: number; // n >= 3 required for w > 0
  positiveOutcomesS: number; // 0 <= s <= n
  contributorBonusB: number; // small capped tie-breaker (e.g., 1.5, max 3)
}

export const DEFAULT_ASK_INTROS_MATCH_INPUTS: AskIntrosMatchInputs = {
  R: 75,
  H: 80,
  Y: 70,
  T: 60,
  D: 50,
  A: 90,
  eligibleSharedPartnersN: 8,
  positiveOutcomesS: 5,
  contributorBonusB: 1.5,
};

export function calculateAskIntrosMatchScore(inputs: AskIntrosMatchInputs) {
  const n = Math.max(0, Math.floor(inputs.eligibleSharedPartnersN));
  const s = Math.max(0, Math.min(n, Math.floor(inputs.positiveOutcomesS)));

  let w = 0;
  let O = 0;
  if (n >= 3) {
    w = Math.min(0.12, (0.12 * n) / (n + 5));
    O = (100 * (s + 2)) / (n + 4);
  }

  const weightR = 0.24 - w;
  const contribR = weightR * inputs.R;
  const contribH = 0.20 * inputs.H;
  const contribY = 0.18 * inputs.Y;
  const contribT = 0.18 * inputs.T;
  const contribD = 0.12 * inputs.D;
  const contribA = 0.08 * inputs.A;
  const contribO = w * O;
  const contribB = Math.max(0, Math.min(3, inputs.contributorBonusB));

  const rawTotal =
    contribR + contribH + contribY + contribT + contribD + contribA + contribO + contribB;
  const finalScore = Math.min(100, Math.round(rawTotal));

  return {
    score: finalScore,
    rawTotal: Number(rawTotal.toFixed(2)),
    w: Number(w.toFixed(5)),
    O: Number(O.toFixed(2)),
    components: {
      strategicRelevance: Number(contribR.toFixed(2)),
      theirOfferFitsYourGoal: Number(contribH.toFixed(2)),
      yourOfferFitsTheirNeed: Number(contribY.toFixed(2)),
      trustPath: Number(contribT.toFixed(2)),
      timing: Number(contribD.toFixed(2)),
      availability: Number(contribA.toFixed(2)),
      sharedOutcomes: Number(contribO.toFixed(2)),
      approvedGiverBoost: Number(contribB.toFixed(2)),
    },
  };
}

/**
 * Section 24.1: Consent-Aware Opportunity Readiness Engine
 * Weights: profile fit 25%, demonstrated need 30%, timing 20%, evidence quality 15%, engagement 10%.
 * Returns no score if consent is absent, observed weight < 0.65, or < 3 valid signals present.
 */
export interface OpportunityReadinessInput {
  consentGranted: boolean;
  factors: {
    profileFit: { score: number; valid: boolean };
    demonstratedNeed: { score: number; valid: boolean };
    timing: { score: number; valid: boolean };
    evidenceQuality: { score: number; valid: boolean };
    engagement: { score: number; valid: boolean };
  };
}

export function calculateOpportunityReadiness(input: OpportunityReadinessInput): {
  status: 'scored' | 'withheld_no_consent' | 'withheld_insufficient_coverage';
  score: number | null;
  band: 'high' | 'developing' | 'early' | 'unscored';
  observedWeight: number;
  validSignalCount: number;
} {
  const weights = {
    profileFit: 0.25,
    demonstratedNeed: 0.30,
    timing: 0.20,
    evidenceQuality: 0.15,
    engagement: 0.10,
  };

  let weightedSum = 0;
  let observedWeight = 0;
  let validSignalCount = 0;

  (Object.keys(weights) as Array<keyof typeof weights>).forEach((key) => {
    const f = input.factors[key];
    if (f.valid) {
      weightedSum += weights[key] * f.score;
      observedWeight += weights[key];
      validSignalCount += 1;
    }
  });

  observedWeight = Number(observedWeight.toFixed(2));

  if (!input.consentGranted) {
    return {
      status: 'withheld_no_consent',
      score: null,
      band: 'unscored',
      observedWeight,
      validSignalCount,
    };
  }

  if (observedWeight < 0.65 || validSignalCount < 3) {
    return {
      status: 'withheld_insufficient_coverage',
      score: null,
      band: 'unscored',
      observedWeight,
      validSignalCount,
    };
  }

  const score = Math.round(weightedSum / observedWeight);
  const band = score >= 75 ? 'high' : score >= 50 ? 'developing' : 'early';

  return {
    status: 'scored',
    score,
    band,
    observedWeight,
    validSignalCount,
  };
}

/**
 * Section 25.2: CRM Pipeline Exposure Heuristic
 * L_CRM = round(V * p), U_CRM = V
 */
export function calculateCrmExposureBounds(dealValue: number, crmProbability: number) {
  const clampedP = Math.max(0, Math.min(1, crmProbability));
  return {
    lowerBound: Math.round(dealValue * clampedP),
    upperBound: Math.round(dealValue),
  };
}

/**
 * Section 13.2: Collective Brain Within-Report Co-Occurrence & Lift
 */
export function calculatePatternLift(
  eligibleReports: number,
  countA: number,
  countB: number,
  countBothAB: number
) {
  if (eligibleReports <= 0 || countA <= 0 || countB <= 0) {
    return { pA: 0, pB: 0, pAB: 0, lift: 0, meetsScreeningRule: false };
  }
  const pA = countA / eligibleReports;
  const pB = countB / eligibleReports;
  const pAB = countBothAB / eligibleReports;
  const lift = pAB / (pA * pB);

  return {
    pA: Number(pA.toFixed(4)),
    pB: Number(pB.toFixed(4)),
    pAB: Number(pAB.toFixed(4)),
    lift: Number(lift.toFixed(2)),
    meetsScreeningRule: countBothAB >= 3,
  };
}
