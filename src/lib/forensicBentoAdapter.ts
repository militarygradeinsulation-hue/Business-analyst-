import { CompanyScanReport, PersonScanReport } from './urlScannerBrain';
import { buildGoldenReportFullDossier } from './goldenReportComplete';
import type { FinanceBentoData } from '../components/ui/finance-bento';

export interface ForensicBentoOptions {
  companyScan?: CompanyScanReport | null;
  personScan?: PersonScanReport | null;
}

export function generateForensicBentoData(options?: ForensicBentoOptions): FinanceBentoData {
  const company = options?.companyScan;
  const person = options?.personScan;

  // Compute reference annual exposure from company scan or golden benchmark
  let annualExposureLow = 1_386_000;
  let annualExposureHigh = 1_663_200;
  let companyName = 'Discflo Corporation';
  let frictionScore = 48;
  let leakCount = 13;

  if (company) {
    const dossier = buildGoldenReportFullDossier(company);
    annualExposureLow = dossier.totalAnnualLow;
    annualExposureHigh = dossier.totalAnnualHigh;
    companyName = dossier.companyName || company.domain;
    frictionScore = dossier.overallFrictionScore;
    leakCount = dossier.pricedLeaksCount;
  }

  const annualMid = (annualExposureLow + annualExposureHigh) / 2;
  const monthlyLeakBase = annualMid / 12;

  // 36 month history of cumulative exposure divided into 3 mechanisms:
  // Operational (Fiat), Pipeline (Stocks), Friction (Crypto)
  const history = Array.from({ length: 36 }, (_, i) => {
    const t = i / 35; // 0 to 1
    const d = new Date(2026, 9 - (35 - i), 1);
    const wave = Math.sin(i * 0.45) * 0.08;
    const wobble = Math.cos(i * 0.8) * 0.06;

    // Progression of exposure tracking historical drift
    const totalExposureAtMonth = annualMid * (0.55 + t * 0.45 + wave);

    // Splits: 45% operational capacity, 35% pipeline drift, 20% technical friction
    const fiat = Math.round(totalExposureAtMonth * 0.45 * (1 + wobble * 0.4));
    const stocks = Math.round(totalExposureAtMonth * 0.35 * (1 + wave * 0.8));
    const crypto = Math.round(totalExposureAtMonth * 0.20 * (1 + (wave + wobble) * 0.6));

    return {
      date: d.toISOString(),
      fiat,
      stocks,
      crypto,
    };
  });

  // Remediation Milestones
  const payments = [
    {
      name: `Triage: ${companyName} Founder Bottleneck`,
      date: 'Day 14',
      amount: Math.round(annualMid * 0.012),
    },
    {
      name: 'Sprint: High-Friction CTA Re-wire',
      date: 'Day 30',
      amount: Math.round(annualMid * 0.018),
    },
    {
      name: 'Architecture: Pipeline Attribution Engine',
      date: 'Day 60',
      amount: Math.round(annualMid * 0.024),
    },
    {
      name: person ? `Ask Intros Brief: ${person.personName}` : 'Execution: Proof Asset Matrix',
      date: 'Day 90',
      amount: Math.round(annualMid * 0.015),
    },
  ];

  // Remediation Goals
  const targetRecovered = Math.round(annualMid * 0.78);
  const goals = [
    {
      name: 'Recovered Margin Potential',
      progress: 0.78,
      target: targetRecovered,
    },
    {
      name: 'Friction Index Reduction',
      progress: Math.min(0.95, Math.max(0.35, (100 - frictionScore) / 100)),
      target: 100,
    },
  ];

  // 6 months of revenue vs friction burn (in thousands)
  const baseRevK = Math.max(80, Math.round(annualMid / 12 / 1000 * 1.6));
  const baseLeakK = Math.max(40, Math.round(monthlyLeakBase / 1000));

  const cashflow = {
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    income: [
      [
        (baseRevK * 0.85) / 10,
        (baseRevK * 0.92) / 10,
        (baseRevK * 1.05) / 10,
        (baseRevK * 1.15) / 10,
        (baseRevK * 1.10) / 10,
        (baseRevK * 1.25) / 10,
      ],
      [
        (baseRevK * 0.75) / 10,
        (baseRevK * 0.80) / 10,
        (baseRevK * 0.90) / 10,
        (baseRevK * 0.95) / 10,
        (baseRevK * 0.90) / 10,
        (baseRevK * 1.05) / 10,
      ],
      [
        (baseRevK * 0.65) / 10,
        (baseRevK * 0.70) / 10,
        (baseRevK * 0.75) / 10,
        (baseRevK * 0.80) / 10,
        (baseRevK * 0.75) / 10,
        (baseRevK * 0.85) / 10,
      ],
    ],
    spending: [
      [
        (baseLeakK * 0.80) / 10,
        (baseLeakK * 0.88) / 10,
        (baseLeakK * 0.95) / 10,
        (baseLeakK * 1.02) / 10,
        (baseLeakK * 0.98) / 10,
        (baseLeakK * 1.08) / 10,
      ],
      [
        (baseLeakK * 0.70) / 10,
        (baseLeakK * 0.75) / 10,
        (baseLeakK * 0.82) / 10,
        (baseLeakK * 0.88) / 10,
        (baseLeakK * 0.84) / 10,
        (baseLeakK * 0.92) / 10,
      ],
      [
        (baseLeakK * 0.60) / 10,
        (baseLeakK * 0.65) / 10,
        (baseLeakK * 0.70) / 10,
        (baseLeakK * 0.74) / 10,
        (baseLeakK * 0.70) / 10,
        (baseLeakK * 0.78) / 10,
      ],
    ],
  };

  // Signal & Friction Risk Indexes
  const crypto = [
    {
      name: 'DOM Friction Drag',
      symbol: 'DFI',
      share: 0.52,
      change: '+3.4%',
      ohlc: [
        [44.2, 46.0, 43.8, 45.4],
        [45.4, 47.1, 44.9, 46.8],
        [46.8, 48.0, 46.2, 47.5],
        [47.5, 49.2, 47.0, 48.9],
        [48.9, 50.4, 48.2, 49.8],
        [49.8, 51.0, 49.1, 50.6],
        [50.6, 52.2, 50.0, 51.8],
      ],
    },
    {
      name: 'Authority Deficit',
      symbol: 'ADX',
      share: 0.31,
      change: '−1.2%',
      ohlc: [
        [32.4, 33.1, 31.8, 32.6],
        [32.6, 33.4, 32.0, 32.9],
        [32.9, 33.6, 32.2, 32.5],
        [32.5, 33.0, 31.9, 32.2],
        [32.2, 32.8, 31.6, 31.9],
        [31.9, 32.5, 31.4, 31.7],
        [31.7, 32.2, 31.2, 31.5],
      ],
    },
    {
      name: 'Conversion Drift',
      symbol: 'CDG',
      share: 0.17,
      change: '+4.8%',
      ohlc: [
        [18.2, 19.4, 17.9, 18.8],
        [18.8, 19.8, 18.4, 19.2],
        [19.2, 20.4, 18.9, 20.0],
        [20.0, 21.0, 19.6, 20.5],
        [20.5, 21.6, 20.1, 21.2],
        [21.2, 22.0, 20.8, 21.7],
        [21.7, 22.8, 21.3, 22.4],
      ],
    },
  ];

  // Weekly Audit Density
  const stocks = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    values: [
      Number((1.8 + (frictionScore / 50)).toFixed(1)),
      Number((1.4 + (frictionScore / 60)).toFixed(1)),
      Number((2.6 + (frictionScore / 40)).toFixed(1)),
      Number((2.0 + (frictionScore / 45)).toFixed(1)),
      Number((3.2 + (frictionScore / 35)).toFixed(1)),
    ],
  };

  return {
    history,
    payments,
    goals,
    cashflow,
    crypto,
    stocks,
  };
}
