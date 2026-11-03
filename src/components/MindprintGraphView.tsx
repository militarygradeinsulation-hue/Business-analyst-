import React from 'react';
import { Network, UserCheck } from 'lucide-react';
import { PersonScanReport } from '../lib/urlScannerBrain';

interface MindprintGraphViewProps {
  personScan?: PersonScanReport;
}

export const MindprintGraphView: React.FC<MindprintGraphViewProps> = ({ personScan }) => {
  return (
    <div className="p-6 rounded-2xl border border-white/15 bg-[#0e0e0e] space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5 text-white">
          <Network className="w-5 h-5 text-white" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Mindprint Intelligence // Executive Thinking Graph
          </span>
        </div>
        <span className="text-zinc-300 font-semibold">
          {personScan?.personName || 'Executive Target'}
        </span>
      </div>

      <p className="text-zinc-200 font-sans text-sm leading-relaxed">
        Maps executive communication DNA, decision sequence, and competing hypotheses without intrusive scraping.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase">Communication DNA</span>
          <p className="text-zinc-300 font-sans text-xs">Direct, operational, concise preference for evidence over vague claims.</p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase">Decision Sequence</span>
          <p className="text-zinc-300 font-sans text-xs">Verify problem → review technical architecture → test acceptance criteria.</p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase">ACH Casebook</span>
          <p className="text-zinc-300 font-sans text-xs">Analysis of competing hypotheses for operational friction points.</p>
        </div>
      </div>
    </div>
  );
};
