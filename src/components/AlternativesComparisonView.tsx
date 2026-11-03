import React from 'react';
import { Layers, ArrowRight, Check, X, Shield, RefreshCw } from 'lucide-react';

export const AlternativesComparisonView: React.FC = () => {
  const alternatives = [
    {
      option: 'Field-service software',
      sub: 'e.g. Jobber, ServiceTitan, Housecall Pro',
      whereItFits: 'Managing scheduling, technician dispatch, invoicing, and on-site job completion.',
      whatWeDoInstead: 'Diagnose workflow breaks, then build custom bridges between your existing tools so inquiries land instantly on the dispatch board.',
      whyNotReplace: 'Your dispatch board works fine. The leak happens between Google/website forms and ticket creation.',
    },
    {
      option: 'Marketing agency',
      sub: 'Paid ads, SEO & lead generation',
      whereItFits: 'Generating new demand, running ad campaigns, and driving phone calls to your website.',
      whatWeDoInstead: 'Define custom inquiry-to-booking flows so leads are categorized, nurtured, and pushed to your CRM instantly.',
      whyNotReplace: 'Buying more ad leads doesn’t fix a 4-hour delay in calling back an emergency water heater leak.',
    },
    {
      option: 'Consultant',
      sub: 'Advisory audits & roadmaps',
      whereItFits: 'Diagnosing operational problems, creating change-management roadmaps, and advising leadership.',
      whatWeDoInstead: 'Perform technical diagnosis on your current stack, then write and implement custom-configured integration workflows.',
      whyNotReplace: 'You need working automated handoffs tested and delivered—not a 60-page PDF slide deck.',
    },
    {
      option: 'Office hire',
      sub: 'Full-time administrative assistant',
      whereItFits: 'Handling human judgment, customer relationships, complex trade exceptions, and field nuance.',
      whatWeDoInstead: 'Write automation scripts for repetitive data movement so your team focuses on high-value exception handling.',
      whyNotReplace: 'Automation handles 2-second after-hours confirmations; human staff close the complex jobs.',
    },
  ];

  return (
    <section id="what-we-fix" className="py-20 border-t border-white/10 bg-[#080808]">
      <div className="wrap space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="badge">
            <i></i>
            <span>RECOMMENDED POSITIONING // GAP REMEDIATION</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
            You may not need another system. You may need your systems to work together.
          </h2>
          <p className="text-base text-zinc-200 leading-relaxed font-normal">
            Most trade contractors don&apos;t have a software deficit. They have handoff gaps between the phone, website forms, Google Business, and their field CRM. We don&apos;t rip out what works; we wire the seams.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-white/15 bg-[#0d0d0d] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
                  <th className="py-4 px-6 w-1/4">Alternative</th>
                  <th className="py-4 px-6 w-1/3">Typical Investment Model</th>
                  <th className="py-4 px-6 w-5/12 text-white">Us (Aetheris Forensic OS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {alternatives.map((alt, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 align-top">
                      <div className="font-bold text-white text-base">
                        {alt.option}
                      </div>
                      <div className="text-xs text-zinc-300 font-mono mt-1 font-semibold">
                        {alt.sub}
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top text-zinc-200 leading-relaxed font-mono text-xs">
                      <div className="font-bold text-rose-300 mb-1">THEM: Recurring Retainers</div>
                      {alt.whereItFits}
                    </td>
                    <td className="py-5 px-6 align-top bg-white/[0.02]">
                      <div className="font-bold text-emerald-300 mb-1">US: Fixed-Scope Engineering</div>
                      <div className="text-white font-medium leading-relaxed">
                        {alt.whatWeDoInstead}
                      </div>
                      <div className="text-xs text-zinc-300 mt-2 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{alt.whyNotReplace}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Callout */}
          <div className="p-6 bg-gradient-to-r from-[#121212] via-[#0c0c0c] to-[#121212] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                Core Operating Thesis: Them vs. Us
              </span>
              <div className="font-display text-2xl uppercase tracking-tight text-white">
                Agencies rent your attention. We engineer your infrastructure.
              </div>
            </div>

            <a
              href="#quote-builder"
              className="btn-skeu shrink-0"
            >
              <span>Build a Fixed-Price Fix</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
