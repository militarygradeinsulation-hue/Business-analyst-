import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';
import { PersonScanReport } from '../lib/urlScannerBrain';

interface AskIntrosViewProps {
  personScan?: PersonScanReport;
}

export const AskIntrosView: React.FC<AskIntrosViewProps> = ({ personScan }) => {
  return (
    <div className="p-6 rounded-2xl border border-white/15 bg-[#0e0e0e] space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5 text-white">
          <UserCheck className="w-5 h-5 text-white" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Ask Intros &amp; Butler Meeting Brief
          </span>
        </div>
        <span className="text-emerald-400 font-bold">
          Match Score: {personScan?.askIntrosExecution.matchResult.score ?? 78}/100
        </span>
      </div>

      <p className="text-zinc-200 font-sans text-sm leading-relaxed">
        Connects verified operational bottlenecks to the right executive with Laplace-smoothed match scores and pre-meeting briefs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase">Why Them</span>
          <p className="text-zinc-300 font-sans text-xs">
            {personScan?.askIntrosExecution.butlerMeetingBrief.whyThem || 'Direct ownership over inquiry-to-booking workflows and CRM allocation.'}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase">First Meeting Objective</span>
          <p className="text-zinc-300 font-sans text-xs">
            {personScan?.askIntrosExecution.butlerMeetingBrief.firstMeetingObjective || 'Review verification audit and confirm acceptance test parameters.'}
          </p>
        </div>
      </div>
    </div>
  );
};
