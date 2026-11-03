import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { CompanyScanReport } from '../lib/urlScannerBrain';
import {
  evaluateSyntheticCase,
  DEFAULT_SYNTHETIC_CASE_PARAMS,
  computeSensitivityCell,
} from '../lib/forensicMath';

interface GoldenLedgerViewProps {
  companyScan?: CompanyScanReport;
}

const formatUSD = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

export const GoldenLedgerView: React.FC<GoldenLedgerViewProps> = ({ companyScan }) => {
  const [useCashInIncome, setUseCashInIncome] = useState<boolean>(false);

  const syntheticCase = evaluateSyntheticCase({
    ...DEFAULT_SYNTHETIC_CASE_PARAMS,
    includeCashCollectionInIncome: useCashInIncome,
  });

  return (
    <div className="rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="badge mb-2">
            <i></i>
            <span>CANONICAL FINANCIAL LEDGER // MODEL VERSION 6</span>
          </div>
          <h3 className="font-display text-3xl uppercase tracking-tight text-white">
            Accrual Profit Bridge &amp; Sensitivity Matrix
          </h3>
          <p className="font-mono text-xs text-zinc-300 mt-1">
            Reconciles gross financial exposure to net economic benefit using Section 10 accrual accounting standards.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
          <label className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10">
            <input
              type="checkbox"
              checked={useCashInIncome}
              onChange={(e) => setUseCashInIncome(e.target.checked)}
              className="accent-white"
            />
            <span>Include Cash Collection in Accrual Income (Sec 10.8)</span>
          </label>
        </div>
      </div>

      {/* KPI 4-Pillar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-1">
          <span className="text-zinc-400 font-semibold block text-[11px] uppercase">
            Gross Model Exposure
          </span>
          <div className="text-2xl font-bold text-white tabular-nums">
            {formatUSD(syntheticCase.mixedGrossExposure)}
          </div>
          <span className="text-[10px] text-zinc-400 block">4 Core Inefficiencies</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-1">
          <span className="text-zinc-400 font-semibold block text-[11px] uppercase">
            Synthetic Outcome Revenue
          </span>
          <div className="text-2xl font-bold text-white tabular-nums">
            {formatUSD(syntheticCase.mixedSyntheticOutcome)}
          </div>
          <span className="text-[10px] text-zinc-400 block">Recoverable Output</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <span className="text-emerald-300 font-semibold block text-[11px] uppercase">
            Net Economic Benefit
          </span>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
            {formatUSD(syntheticCase.bridge.netEconomicBenefit)}
          </div>
          <span className="text-[10px] text-emerald-300 block">After All Implementation Costs</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <span className="text-emerald-300 font-semibold block text-[11px] uppercase">
            Modeled Return on Investment
          </span>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
            {syntheticCase.bridge.roiPercent}%
          </div>
          <span className="text-[10px] text-emerald-300 block">Net Accrual Benefit / Cost</span>
        </div>
      </div>

      {/* Accrual Profit Bridge Table */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#070707]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase">
              <th className="py-3 px-4">Financial Bridge Metric</th>
              <th className="py-3 px-4">Accounting Rule</th>
              <th className="py-3 px-4 text-right">Modeled Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-zinc-200">
            <tr>
              <td className="py-3 px-4 font-bold text-white">Total Incremental Revenue</td>
              <td className="py-3 px-4 text-zinc-400">Sum of remediated pipeline conversions</td>
              <td className="py-3 px-4 text-right text-white font-bold">{formatUSD(syntheticCase.bridge.totalIncrementalRevenue)}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-white">Incremental Contribution Sales</td>
              <td className="py-3 px-4 text-zinc-400">Calculated at 35% contribution margin</td>
              <td className="py-3 px-4 text-right text-white font-bold">{formatUSD(syntheticCase.bridge.incrementalContributionSales)}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-white">Pre-Cost Economic Benefit</td>
              <td className="py-3 px-4 text-zinc-400">Contribution + Avoided Overtime ($39k)</td>
              <td className="py-3 px-4 text-right text-white font-bold">{formatUSD(syntheticCase.bridge.preCostBenefit)}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-white">Engineering &amp; Implementation Cost</td>
              <td className="py-3 px-4 text-zinc-400">Fixed deployment sprint fee</td>
              <td className="py-3 px-4 text-right text-rose-300 font-bold">-{formatUSD(DEFAULT_SYNTHETIC_CASE_PARAMS.implementationCost)}</td>
            </tr>
            <tr className="bg-emerald-500/10 font-bold">
              <td className="py-3.5 px-4 text-emerald-300">Net Economic Benefit (Bridge Total)</td>
              <td className="py-3.5 px-4 text-emerald-400">Accrual-consistent net cash &amp; capacity</td>
              <td className="py-3.5 px-4 text-right text-emerald-300 text-sm">{formatUSD(syntheticCase.bridge.netEconomicBenefit)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Safeguards Summary */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#070707] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-zinc-300">
            <strong className="text-white">Two-Reference Safeguard:</strong> Every reported leak requires 2 independent verifying signals to prevent double-counting.
          </span>
        </div>
        <span className="text-zinc-400 shrink-0">Model v6 Section 25.3</span>
      </div>
    </div>
  );
};
