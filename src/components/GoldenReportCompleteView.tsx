import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { CompanyScanReport } from '../lib/urlScannerBrain';

interface GoldenReportCompleteViewProps {
  companyScan?: CompanyScanReport | null;
}

export const GoldenReportCompleteView: React.FC<GoldenReportCompleteViewProps> = ({ companyScan }) => {
  return (
    <div className="p-6 rounded-2xl border border-white/15 bg-[#0e0e0e] space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5 text-white">
          <FileText className="w-5 h-5 text-white" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Golden Report Complete // 22-Chapter Autopsy
          </span>
        </div>
        <span className="text-zinc-300 font-semibold">
          {companyScan?.domain || 'Enterprise Target'}
        </span>
      </div>

      <p className="text-zinc-200 font-sans text-sm leading-relaxed">
        Comprehensive 22-chapter audit pricing active revenue leaks across SEO, CTA hierarchy, contact hygiene, and owner capacity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase tracking-wide">
            01. Inquiry &amp; CTA Hygiene
          </span>
          <p className="text-zinc-300 font-sans text-xs">
            Evaluates form response latency, mobile click-to-call responsiveness, and tracking attribution.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase tracking-wide">
            02. Pipeline Leak Valuation
          </span>
          <p className="text-zinc-300 font-sans text-xs">
            Quantifies annual missed opportunity cost using verified local trade benchmark conversion models.
          </p>
        </div>
      </div>
    </div>
  );
};
