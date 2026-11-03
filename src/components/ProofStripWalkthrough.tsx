import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  Search,
  Wrench,
  Activity,
  FileCheck,
} from 'lucide-react';

export const ProofStripWalkthrough: React.FC = () => {
  const [showBoundariesModal, setShowBoundariesModal] = useState<boolean>(false);

  const proofSteps = [
    {
      step: '01',
      title: 'Public Signal Capture',
      tag: 'Zero Credential Required',
      desc: 'We scan your public website, form endpoints, click-to-call numbers, and Google profile to identify where leads first encounter friction.',
      evidence: 'DOM form inspection, CTA routing, phone link consistency, after-hours detection.',
    },
    {
      step: '02',
      title: 'Gap & Evidence Separation',
      tag: 'Integrity Boundary',
      desc: 'We strictly separate confirmed public breaks from suspected CRM internal delays. We never guess internal metrics without read-only account tokens.',
      evidence: 'Clear classification: [CONFIRMED ISSUE] vs [SUSPECTED] vs [NEEDS ACCESS].',
    },
    {
      step: '03',
      title: 'Custom Integration Blueprint',
      tag: 'Written Architecture',
      desc: 'Before touching your systems, we document the exact webhook and API logic connecting your forms, phone system, and field dispatch board.',
      evidence: 'Visual data-flow schema, prerequisite credential checklist, field mappings.',
    },
    {
      step: '04',
      title: 'Tested Delivery Guarantee',
      tag: '100% Working Guarantee',
      desc: 'We execute live end-to-end acceptance tests. If the automated workflow does not pass agreed criteria within 14 days, you receive a full refund.',
      evidence: 'Test lead submitted → instant SMS delivered → CRM ticket generated.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-white/10 bg-[#070707]">
      <div className="wrap space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="badge">
              <i></i>
              <span>VERIFICATION METHODOLOGY // NO GUESSWORK</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              Evidence-first delivery. Tested before handoff.
            </h2>
            <p className="text-base text-zinc-200 leading-relaxed font-normal">
              Most software setups fail because nobody tests the seams. Here is our 4-stage forensic process to diagnose, wire, and verify your workflows.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowBoundariesModal(true)}
            className="btn-skeu shrink-0 self-start lg:self-auto"
          >
            <span>Read Evidence Boundaries</span>
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Proof Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {proofSteps.map((s) => (
            <div
              key={s.step}
              className="p-6 rounded-2xl border border-white/10 bg-[#0c0c0c] flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-400 font-bold">STAGE {s.step}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400 font-semibold">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-white">
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 font-mono text-[11px] text-zinc-400">
                <span className="text-white font-bold block mb-1">Verification Standard:</span>
                <span>{s.evidence}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Operating Safeguard Callout */}
        <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-r from-[#111] via-[#0b0b0b] to-[#111] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-white font-bold block">
              Core Technical Principle:
            </span>
            <span className="text-zinc-300">
              Never invent lost revenue numbers. State exact operational consequences, test every handoff, and protect delivery with a money-back guarantee.
            </span>
          </div>

          <a
            href="#intake"
            className="btn-skeu shrink-0"
          >
            <span>Start Free Diagnostic Scan</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Evidence Boundaries Modal */}
      {showBoundariesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-[#0d0d0d] border border-white/20 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                  Evidence Integrity Boundaries
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBoundariesModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-200 leading-relaxed font-mono">
              <div className="space-y-1">
                <div className="text-white font-bold uppercase">1. Public Signals vs Private Access:</div>
                <p>
                  A public website audit can verify broken form webhooks, slow call response, and missing schema. It cannot see internal CRM pipelines, tech dispatch boards, or gross margins without read-only API access.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-white font-bold uppercase">2. Operational Consequences Over Guesses:</div>
                <p>
                  We report exact operational friction (e.g. &quot;Inquiries submitted after 5 PM sit unacknowledged in an inbox until 8 AM next morning&quot;) rather than guessing fictitious lost-dollar amounts without your ticket averages.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-white font-bold uppercase">3. Fixed Delivery Guarantee:</div>
                <p>
                  We guarantee that the custom bridge delivers as documented in the acceptance checklist. If it fails and we cannot correct it within 14 days, your fee is 100% refunded.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBoundariesModal(false)}
                className="btn-skeu"
              >
                <span>Understood</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
