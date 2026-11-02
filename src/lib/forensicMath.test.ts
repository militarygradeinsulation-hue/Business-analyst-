import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCorpusMetrics,
  applyTwoReferenceSafeguard,
  reconcileCanonicalLedger,
  normalizeAskIntrosOverlap,
  evaluateSyntheticCase,
  computeSensitivityCell,
  calculateAskIntrosMatchScore,
  calculateOpportunityReadiness,
  calculateCrmExposureBounds,
  calculatePatternLift,
  DEFAULT_SYNTHETIC_CASE_PARAMS,
  DEFAULT_ASK_INTROS_MATCH_INPUTS,
} from './forensicMath';

test('Section 3.2: Corpus metrics match manuscript snapshot (11.67 findings/report, 1.79 reports/company)', () => {
  const res = computeCorpusMetrics(1910, 1067, 22282);
  assert.equal(res.findingsPerReport, 11.67);
  assert.equal(res.reportsPerCompany, 1.79);
});

test('Section 10: Synthetic 4-mechanism case & accrual profit bridge match exact manuscript values', () => {
  const res = evaluateSyntheticCase(DEFAULT_SYNTHETIC_CASE_PARAMS);
  assert.equal(res.f01.grossExposure, 400_000);
  assert.equal(res.f01.didEffectPctPoints, 1.6);
  assert.equal(res.f01.outcomeRevenue, 320_000);

  assert.equal(res.f02.grossExposure, 192_000);
  assert.equal(res.f02.outcomeRevenue, 120_000);

  assert.equal(res.f03.grossCapacity, 117_000);
  assert.equal(res.f03.avoidedOvertime, 39_000);
  assert.equal(res.f03.releasedCapacityHours, 1200);
  assert.equal(res.f03.releasedCapacityValue, 78_000);

  assert.equal(res.f04.grossExposure, 90_000);
  assert.equal(res.f04.cashCollected, 55_000);

  assert.equal(res.mixedGrossExposure, 799_000);
  assert.equal(res.mixedSyntheticOutcome, 534_000);

  // Base accrual-consistent profit bridge
  assert.equal(res.bridge.totalIncrementalRevenue, 440_000);
  assert.equal(res.bridge.incrementalContributionSales, 154_000);
  assert.equal(res.bridge.preCostBenefit, 193_000);
  assert.equal(res.bridge.netEconomicBenefit, 108_000);
  assert.equal(res.bridge.roiPercent, 127.1);

  // Alternative accounting scenario (Section 10.8)
  const alt = evaluateSyntheticCase({
    ...DEFAULT_SYNTHETIC_CASE_PARAMS,
    includeCashCollectionInIncome: true,
  });
  assert.equal(alt.bridge.netEconomicBenefit, 163_000);
  assert.equal(alt.bridge.roiPercent, 191.8);
});

test('Section 10.9: Sensitivity surface cells match Figure 11 ($9k, $108k, $152k)', () => {
  assert.equal(computeSensitivityCell(0.5, 0.25), 9_000);
  assert.equal(computeSensitivityCell(1.0, 0.35), 108_000);
  assert.equal(computeSensitivityCell(1.0, 0.45), 152_000);
});

test('Section 23.2: Ask Intros exact ranking mathematics reproduces 71/100 score and weights', () => {
  const res = calculateAskIntrosMatchScore(DEFAULT_ASK_INTROS_MATCH_INPUTS);
  assert.equal(res.w, 0.07385);
  assert.equal(res.O, 58.33);
  assert.equal(res.components.strategicRelevance, 12.46);
  assert.equal(res.components.theirOfferFitsYourGoal, 16.0);
  assert.equal(res.components.yourOfferFitsTheirNeed, 12.6);
  assert.equal(res.components.trustPath, 10.8);
  assert.equal(res.components.timing, 6.0);
  assert.equal(res.components.availability, 7.2);
  assert.equal(res.components.sharedOutcomes, 4.31);
  assert.equal(res.components.approvedGiverBoost, 1.5);
  assert.equal(res.score, 71);
});

test('Section 25.3 & 25.4: Two-reference safeguard and $100K/$80K/$50K overlap fixture', () => {
  const downgraded = applyTwoReferenceSafeguard({
    id: 'L1',
    title: 'Single-source claim',
    chapter: 'Sales',
    rootCauseFingerprint: 'rc-1',
    basis: 'measured',
    economicClass: 'revenue_opportunity',
    lowAmount: 40_000,
    highAmount: 80_000,
    evidenceRefs: ['CRM-001'],
  });
  assert.equal(downgraded.status, 'unknown_worth_checking');
  assert.equal(downgraded.effectiveHigh, 0);

  const overlapRes = normalizeAskIntrosOverlap([
    { id: '1', overlapGroup: 'grp-alpha', upperBound: 100_000 },
    { id: '2', overlapGroup: 'grp-alpha', upperBound: 80_000 },
    { id: '3', overlapGroup: 'grp-beta', upperBound: 50_000 },
  ]);
  assert.equal(overlapRes.grossExposure, 230_000);
  assert.equal(overlapRes.normalizedExposure, 150_000);
  assert.equal(overlapRes.overlapRemoved, 80_000);
});

test('Section 5 & 24.1 & 25.2 & 13.2: Canonical ledger deduplication, readiness gate, CRM bounds, and Lift', () => {
  const ledger = reconcileCanonicalLedger([
    {
      id: 'C1',
      title: 'Lead handoff SLA breach',
      chapter: 'Sales Operations',
      rootCauseFingerprint: 'lead-handoff-sla',
      basis: 'evidence_based_model',
      economicClass: 'revenue_opportunity',
      lowAmount: 250_000,
      highAmount: 400_000,
      evidenceRefs: ['CRM-LOG-11', 'DOM-FORM-02'],
    },
    {
      id: 'C2',
      title: 'Duplicate mention in Leadership chapter',
      chapter: 'Leadership',
      rootCauseFingerprint: 'lead-handoff-sla',
      basis: 'evidence_based_model',
      economicClass: 'revenue_opportunity',
      lowAmount: 250_000,
      highAmount: 400_000,
      evidenceRefs: ['CRM-LOG-11', 'DOM-FORM-02'],
    },
    {
      id: 'C3',
      title: 'Executive Summary Rollup',
      chapter: 'Executive Summary',
      isRollupSection: true,
      rootCauseFingerprint: 'exec-rollup',
      basis: 'measured',
      economicClass: 'revenue_opportunity',
      lowAmount: 500_000,
      highAmount: 800_000,
      evidenceRefs: ['SUM-1', 'SUM-2'],
    },
  ]);

  assert.equal(ledger.activeEntries.length, 1);
  assert.equal(ledger.excludedEntries.length, 2);
  assert.equal(ledger.headlineLowTotal, 250_000);
  assert.equal(ledger.headlineHighTotal, 400_000);
  assert.equal(ledger.invariants.chapterSumMatchesActiveSum, true);
  assert.equal(ledger.invariants.uniqueRootCauseFingerprints, true);

  const crm80 = calculateCrmExposureBounds(80_000, 0.4);
  assert.equal(crm80.lowerBound, 32_000);
  assert.equal(crm80.upperBound, 80_000);

  const readinessWithheld = calculateOpportunityReadiness({
    consentGranted: true,
    factors: {
      profileFit: { score: 85, valid: true },
      demonstratedNeed: { score: 90, valid: true },
      timing: { score: 70, valid: false },
      evidenceQuality: { score: 60, valid: false },
      engagement: { score: 50, valid: false },
    },
  });
  assert.equal(readinessWithheld.status, 'withheld_insufficient_coverage');
  assert.equal(readinessWithheld.score, null);

  const lift = calculatePatternLift(1000, 200, 150, 60);
  assert.equal(lift.lift, 2.0);
  assert.equal(lift.meetsScreeningRule, true);
});

test('URL Scanner Brain: Company URL scan and Person URL scan compile valid forensic artifacts', async () => {
  const { compileCompanyScanReport, compilePersonScanReport } = await import('./urlScannerBrain');

  const companyReport = compileCompanyScanReport({
    rawUrl: 'https://stripe.com',
    pageTitle: 'Stripe | Financial Infrastructure for the Internet',
  });
  assert.equal(companyReport.domain, 'stripe.com');
  assert.equal(companyReport.genericDetectorState, 'compiled');
  assert.equal(companyReport.reconciledLedger.activeEntries.length, 4);
  assert.equal(companyReport.reconciledLedger.excludedEntries.length, 3);
  assert.equal(companyReport.reconciledLedger.invariants.uniqueRootCauseFingerprints, true);

  const personReport = compilePersonScanReport({
    rawUrl: 'https://linkedin.com/in/joseph-toney',
    activeCompanyScan: companyReport,
  });
  assert.equal(personReport.personName, 'Joseph Toney');
  assert.equal(personReport.tenStages.length, 10);
  assert.equal(personReport.stats.observedAreasCount, 8);
  assert.equal(personReport.stats.unobservedAreasCount, 3);
  assert.equal(personReport.integratedGraph.nodes.length, 7);
  assert.equal(personReport.fullIntelligence.pipelineStages.length, 10);

  const tiffanyReport = compilePersonScanReport({
    rawUrl: 'https://www.linkedin.com/in/tiffany-spahl-nally',
    activeCompanyScan: companyReport,
  });
  assert.equal(tiffanyReport.fullIntelligence.subjectName, 'TIFFANY SPAHL-NALLY');
  assert.equal(tiffanyReport.fullIntelligence.totalSignals, 48);
  assert.equal(tiffanyReport.fullIntelligence.overallConfidenceScore, 66);
  assert.equal(tiffanyReport.fullIntelligence.overallConfidenceBand, 'Strong');
  assert.equal(
    tiffanyReport.fullIntelligence.investigativeDossier.triangulatedConclusions.length,
    12
  );
  assert.equal(
    tiffanyReport.fullIntelligence.investigativeDossier.mbtiEstimate.code,
    'ENFJ'
  );
  assert.equal(tiffanyReport.fullIntelligence.communicationDna.spectrums.length, 7);
  assert.equal(tiffanyReport.fullIntelligence.thinkingArchitecture.signals.length, 9);
});


