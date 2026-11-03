import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
  Layers,
  Activity,
  AlertCircle,
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  badge?: string;
  replaces: string;
  description: string;
  features: string[];
  recommended?: boolean;
  deliveryTime: string;
}

export const PricingLadderView: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('connected_stack');
  const [showGuaranteeModal, setShowGuaranteeModal] = useState<boolean>(false);

  const threeTiers: PricingTier[] = [
    {
      id: 'single_bridge',
      name: 'Single System Bridge',
      price: '$2,499',
      cadence: 'one-time investment',
      badge: 'Core Fix',
      replaces: 'Replaces manual double-entry & lost after-hours leads',
      description:
        'Connects two disconnected tools where customer inquiries leak (e.g. Website Form → ServiceTitan or Jobber).',
      deliveryTime: '3–5 business days',
      features: [
        'Custom-engineered API / webhook bridge between 2 core tools',
        'Instant automated customer SMS text-back (< 30 seconds)',
        'Automatic field dispatcher notification & CRM lead ticket creation',
        'Complete written forensic blueprint & data flow schema',
        'Acceptance test checklist & 100% money-back delivery guarantee',
      ],
    },
    {
      id: 'connected_stack',
      name: 'Connected Operations Stack',
      price: '$4,999',
      cadence: 'one-time investment',
      badge: 'Most Popular · High ROI',
      recommended: true,
      replaces: 'Replaces hiring a full-time dispatcher ($45K–$60K/yr salary)',
      description:
        'Multi-step custom architecture connecting up to three disconnected systems with automated routing and deduplication.',
      deliveryTime: '5–7 business days',
      features: [
        'Multi-step custom bridge across up to 3 tools (Web, Phone/VoIP, CRM)',
        'Missed-call instant auto-text response + automatic lead creation',
        'Intelligent lead deduplication & custom field synchronization',
        'Complete written Standard Operating Procedure (SOP) & team handoff',
        '30-day live verification window & full delivery guarantee',
      ],
    },
    {
      id: 'co_ceo_os',
      name: 'Co-CEO Operations OS',
      price: '$9,999',
      cadence: 'one-time investment',
      badge: 'Full System Architecture',
      replaces: 'Replaces ongoing agency retainers ($3K–$5K/mo) & ops headcount',
      description:
        'Full custom-engineered ecosystem unifying your entire software stack from inquiry to dispatch to executive reconciliation.',
      deliveryTime: '7–10 business days',
      features: [
        'Full custom architecture connecting your entire software ecosystem',
        'End-to-end automation: Web, Missed Calls, Estimate Follow-ups & CRM sync',
        'Written master system blueprint & executive leak reconciliation ledger',
        'Dedicated lead workflow engineer & priority deployment sprint',
        'Comprehensive staff training, rollback safeguards & delivery guarantee',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 border-t border-white/10 bg-[#060606]">
      <div className="wrap space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="badge">
            <i></i>
            <span>TRANSPARENT PRICING // 3 SIMPLE FIXED-SCOPE TIERS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
            Simple, competitive pricing. No sales calls. No bloated retainers.
          </h2>
          <p className="text-base text-zinc-200 leading-relaxed font-normal">
            Agencies charge open-ended $3,000–$5,000/month retainers without fixing your disconnected tools. We diagnose where your inquiries leak and engineer custom system bridges for a one-time fixed price backed by a 100% delivery guarantee.
          </p>
        </div>

        {/* 3 SIMPLE PRICING TIERS */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
              Fixed-Scope System Engineering Tiers
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
              <span>All Tiers Protected by 100% Delivery Guarantee</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {threeTiers.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-7 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer relative ${
                    tier.recommended
                      ? 'border-white bg-[#121212] ring-2 ring-white/30 shadow-2xl lg:-translate-y-2'
                      : 'border-white/15 bg-[#0a0a0a] hover:border-white/30 hover:bg-[#0e0e0e]'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Badge & Name */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
                        {tier.name}
                      </span>
                      {tier.badge && (
                        <span
                          className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded font-bold ${
                            tier.recommended
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white border border-white/15'
                          }`}
                        >
                          {tier.badge}
                        </span>
                      )}
                    </div>

                    {/* Price & Cadence */}
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white font-bold">
                          {tier.price}
                        </span>
                        <span className="font-mono text-xs text-zinc-300 font-medium">
                          {tier.cadence}
                        </span>
                      </div>
                      <div className="inline-block mt-2 font-mono text-[11px] text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        ✓ {tier.replaces}
                      </div>
                      <p className="text-xs text-zinc-200 mt-3 leading-relaxed font-normal">
                        {tier.description}
                      </p>
                    </div>

                    {/* Feature Checklist */}
                    <div className="pt-5 border-t border-white/10 space-y-3">
                      {tier.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-100 font-medium">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer & CTA Button */}
                  <div className="pt-6 mt-6 border-t border-white/10 space-y-2.5">
                    <div className="font-mono text-[11px] text-zinc-400 flex items-center justify-between">
                      <span>Delivery Timeline:</span>
                      <span className="text-white font-bold">{tier.deliveryTime}</span>
                    </div>
                    <a
                      href="#quote-builder"
                      className={`w-full py-3 px-4 rounded-lg font-mono text-xs text-center block transition-all font-bold ${
                        tier.recommended
                          ? 'bg-white text-black hover:bg-[#e4e4e7] shadow-lg'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      Select {tier.name} →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OPTIONAL ONGOING HEALTH MONITORING & DIAGNOSTIC ALTERNATIVES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#0d0d0d] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                  Optional Ongoing Health Watch
                </span>
                <span className="font-mono text-xs text-emerald-400 font-bold">$499 / month</span>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-normal">
                Continuous 15-minute ping tests across webhooks and APIs, instant carrier SMS failover alerts, and monthly uptime logs. Completely optional; can be added or canceled anytime with zero contract lock-in.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 font-mono text-[11px] text-zinc-400">
              Zero monthly obligation unless your fix requires dedicated cloud hosting.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#0d0d0d] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                  Diagnostic First or Custom APIs?
                </span>
                <span className="font-mono text-xs text-zinc-300 font-bold">Free or $199</span>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-normal">
                Want to identify where your customer inquiries leak first? Run our <a href="#intake" className="text-white underline font-semibold hover:text-emerald-400">Free Business Scan</a> above. Have legacy on-premise databases or need a technical review? Book a 45-minute <a href="#quote-builder" className="text-white underline font-semibold hover:text-emerald-400">Expert Consultation ($199)</a>.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 font-mono text-[11px] text-zinc-400">
              Consultation fees are 100% credited toward implementation within 30 days.
            </div>
          </div>
        </div>

        {/* PRICING DISCLOSURES & EXCLUSIONS */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0d0d0d] space-y-2 text-xs text-zinc-200 font-mono leading-relaxed">
          <div className="text-white uppercase font-bold tracking-wider">
            Important Pricing Disclosures &amp; Boundaries:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>• Third-party software licenses (Jobber, ServiceTitan, Twilio SMS carrier fees) are billed directly by those providers.</div>
            <div>• Monitoring verifies health &amp; alerts on failures; it does not include free endless software rebuilds.</div>
            <div>• Custom in-house APIs, legacy data migrations, and unsupported CRMs are excluded from instant fixed pricing.</div>
            <div>• Monitoring is completely optional unless a fix technically requires our cloud relay; disclosed prior to purchase.</div>
          </div>
        </div>

        {/* DELIVERY GUARANTEE BANNER */}
        <div className="p-8 rounded-2xl border border-white/20 bg-gradient-to-r from-[#141414] via-[#101010] to-[#141414] shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>DELIVERY ACCEPTANCE GUARANTEE</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white">
                Your agreed fix works—or your implementation fee comes back.
              </h3>
              <p className="text-sm text-zinc-100 leading-relaxed font-normal">
                Before you pay, we define exactly what the workflow must do and how we&apos;ll test it. If it fails those acceptance tests and we can&apos;t correct it within 14 days of your report, we&apos;ll refund the implementation fee for that fix.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowGuaranteeModal(true)}
              className="btn-skeu shrink-0"
            >
              <span>View Full Terms &amp; Scope</span>
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-zinc-200">
            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.04]">
              <span className="text-white block font-bold mb-1">30-Day Reporting Window</span>
              You have 30 days post-handoff to verify live incoming calls and web leads.
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.04]">
              <span className="text-white block font-bold mb-1">Clear Acceptance Tests</span>
              Every fix has a documented checklist: test lead submitted → SMS arrives → ticket created.
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.04]">
              <span className="text-white block font-bold mb-1">Honest Outcome Boundary</span>
              We guarantee technical execution, not market revenue or job counts.
            </div>
          </div>
        </div>
      </div>

      {/* GUARANTEE TERMS MODAL */}
      {showGuaranteeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/20 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                  Delivery Guarantee Policy &amp; Terms
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuaranteeModal(false)}
                className="p-1.5 text-zinc-300 hover:text-white rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-100 leading-relaxed font-mono">
              <div className="space-y-1">
                <div className="text-white font-bold uppercase">1. Scope of the Guarantee:</div>
                <p>
                  Before payment, we specify the required acceptance criteria in writing (e.g. &quot;When an inquiry form is submitted, an SMS is delivered to the customer within 30 seconds and a new lead record appears in ServiceTitan&quot;). If the delivered workflow fails this test, we have 14 days to resolve the failure. If unresolved, 100% of the implementation fee is refunded.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-white font-bold uppercase">2. Reporting Window:</div>
                <p>
                  The guarantee is active for 30 calendar days following the formal delivery notification and testing handoff.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-white font-bold uppercase">3. Customer Responsibilities:</div>
                <p>
                  Customer must provide required read-only or administrative API credentials and maintain an active account with connected providers (e.g. valid Twilio phone balance).
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-white font-bold uppercase">4. Exclusions:</div>
                <p>
                  Excludes general third-party outages (e.g. Twilio or AWS regional downtime), customer changes that override installed webhooks, and revoked API tokens. Third-party usage fees are nonrefundable.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200">
                <strong>Important Boundary:</strong> We guarantee the delivery and functionality of the workflow. We do not guarantee more jobs, closed revenue, or advertising ROI, as those depend on pricing, trade reputation, and macroeconomic factors.
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuaranteeModal(false)}
                className="btn-skeu"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
