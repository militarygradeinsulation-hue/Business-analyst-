import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { PersonScanReport, MindprintFullIntelligence } from '../lib/urlScannerBrain';

interface MindprintIntelligenceReportViewProps {
  personScan?: PersonScanReport | null;
  intelligence?: MindprintFullIntelligence;
  aiSynthesisNote?: string;
}

export const MindprintIntelligenceReportView: React.FC<MindprintIntelligenceReportViewProps> = ({
  personScan,
  intelligence,
  aiSynthesisNote,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-white/15 bg-[#0e0e0e] space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5 text-white">
          <FileText className="w-5 h-5 text-white" />
          <span className="font-bold uppercase tracking-wider text-sm">
            12-Section Executive Intelligence Report
          </span>
        </div>
        <span className="text-zinc-300 font-semibold">
          {personScan?.personName || intelligence?.subjectName || 'Executive Dossier'}
        </span>
      </div>

      <p className="text-zinc-200 font-sans text-sm leading-relaxed">
        Complete executive dossier mapping communication DNA, thinking core graph, and operational priorities.
      </p>

      {aiSynthesisNote && (
        <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-xs">
          <strong>AI Synthesis Note:</strong> {aiSynthesisNote}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase">Primary Profile &amp; Focus</span>
          <p className="text-zinc-300 font-sans text-xs">
            {personScan?.askIntrosExecution.butlerMeetingBrief.whyThem || intelligence?.goal || 'Direct, evidence-oriented operational leadership.'}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-2">
          <span className="text-white font-bold block uppercase">Verification Status</span>
          <p className="text-emerald-300 font-sans text-xs flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Pre-Meeting Intelligence Verified</span>
          </p>
        </div>
      </div>
    </div>
  );
};
