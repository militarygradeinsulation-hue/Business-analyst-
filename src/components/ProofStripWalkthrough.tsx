import React from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ProofStripWalkthrough: React.FC = () => {
  return (
    <section className="py-16 border-t border-white/10 bg-[#070707]">
      <div className="wrap space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="badge">
              <i></i>
              <span>VERIFICATION &amp; ACCEPTANCE PROOF</span>
            </div>
            <h3 className="font-display text-3xl uppercase tracking-tight text-white">
              Deterministic Evidence &amp; Acceptance Walkthrough
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              Every workflow integration goes through rigorous end-to-end acceptance testing before handoff. Zero guesswork.
            </p>
          </div>
          <div className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Acceptance Pass Rate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-5 rounded-xl border border-white/10 bg-[#111] space-y-3">
            <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>01. Pathway Audit</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              Automated and manual audit of website forms, click-to-call links, schema markup, and webhook endpoints.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-[#111] space-y-3">
            <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>02. Isolated Staging</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              Workflows are tested in isolated environments with real test payloads before connecting to live CRM and carrier APIs.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-[#111] space-y-3">
            <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>03. Guaranteed Handoff</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              Delivered with documentation, SOP checklist, 30-day verification window, and our delivery guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
