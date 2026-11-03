import React from 'react';
import { Network, Sparkles } from 'lucide-react';

export const CollectiveBrainView: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl border border-white/15 bg-[#0e0e0e] space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5 text-white">
          <Network className="w-5 h-5 text-white" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Collective Brain &amp; Synthesis Engine
          </span>
        </div>
        <span className="text-zinc-300 font-semibold">Active Synthesis</span>
      </div>

      <p className="text-zinc-200 font-sans text-sm leading-relaxed">
        Cross-references company scan findings, executive communication DNA, and benchmark profit bridges to generate verifiable remediation paths.
      </p>

      <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-3">
        <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Deterministic Consensus Engine</span>
        </div>
        <p className="text-zinc-300 font-sans text-xs">
          Ensures all recommendations map directly to pre-validated integration tiers ($2,499 / $4,999 / $9,999) with full delivery guarantees.
        </p>
      </div>
    </div>
  );
};
