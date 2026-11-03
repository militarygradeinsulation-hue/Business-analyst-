import React from 'react';
import { Scale, CheckCircle2 } from 'lucide-react';
import { CompanyScanReport } from '../lib/urlScannerBrain';

interface GoldenLedgerViewProps {
  companyScan?: CompanyScanReport;
}

export const GoldenLedgerView: React.FC<GoldenLedgerViewProps> = ({ companyScan }) => {
  return (
    <div className="p-6 rounded-2xl border border-white/15 bg-[#0e0e0e] space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5 text-white">
          <Scale className="w-5 h-5 text-white" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Canonical Ledger // Profit &amp; Leak Reconciliation
          </span>
        </div>
        <span className="text-zinc-300 font-semibold">Model Version 6</span>
      </div>

      <p className="text-zinc-200 font-sans text-sm leading-relaxed">
        Eliminates double counting through root-cause fingerprints, chapter ownership, and the Two-Reference Safeguard.
      </p>

      <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-3 font-mono">
        <div className="text-white font-bold uppercase tracking-wider">
          Reconciliation Guardrails:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
          <div>• Top 10 Leaks deduplicated against secondary findings.</div>
          <div>• Two-Reference Safeguard applied to all high-risk assertions.</div>
          <div>• Sensitivity 4×5 matrix validated against historical benchmarks.</div>
          <div>• Full audit trail with zero sentiment gating.</div>
        </div>
      </div>
    </div>
  );
};
