import React, { useState } from 'react';
import {
  UserCheck,
  ChevronDown,
  ChevronUp,
  Brain,
  Shield,
  MessageSquare,
  Compass,
  FileCheck,
} from 'lucide-react';
import { MindprintIntelligenceReport } from '../lib/mindprintIntelligence';

interface MindprintIntelligenceReportViewProps {
  intelligence: MindprintIntelligenceReport;
  aiSynthesisNote?: string;
}

export const MindprintIntelligenceReportView: React.FC<MindprintIntelligenceReportViewProps> = ({
  intelligence,
  aiSynthesisNote,
}) => {
  const [activeTab, setActiveTab] = useState<'snapshot' | 'communication' | 'decision' | 'meeting'>('snapshot');

  return (
    <div className="rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="badge mb-2">
            <i></i>
            <span>MINDPRINT EXECUTIVE INTELLIGENCE DOSSIER // 12 SECTIONS</span>
          </div>
          <h3 className="font-display text-3xl uppercase tracking-tight text-white font-sans">
            {intelligence.targetPersonName}
          </h3>
          <p className="text-zinc-300 mt-1">
            {intelligence.roleTitle} · {intelligence.organizationName} · {intelligence.scrapedSourcesCount} OSINT Sources
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2">
          {(['snapshot', 'communication', 'decision', 'meeting'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 px-3 rounded-lg capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SNAPSHOT */}
      {activeTab === 'snapshot' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-2">
              <span className="text-zinc-400 font-bold block uppercase text-[10px]">
                Investigator&apos;s Read
              </span>
              <p className="text-zinc-200 leading-relaxed font-sans text-xs">
                {intelligence.investigativeDossier.investigatorsRead}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-2">
              <span className="text-zinc-400 font-bold block uppercase text-[10px]">
                Myers-Briggs Hypothesis
              </span>
              <div className="text-white font-bold text-lg font-sans">
                {intelligence.investigativeDossier.mbtiHypothesis.type}
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {intelligence.investigativeDossier.mbtiHypothesis.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <span className="text-emerald-300 font-bold block uppercase text-[10px]">
                Professional Mindset
              </span>
              <p className="text-zinc-100 leading-relaxed font-sans text-xs">
                {intelligence.investigativeDossier.professionalPsychologySummary}
              </p>
            </div>
          </div>

          {/* Triangulated Conclusions */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase text-[11px] block">
              Triangulated Behavioral Conclusions (Calibrated Probabilities)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {intelligence.investigativeDossier.triangulatedConclusions.map((c) => (
                <div key={c.id} className="p-3.5 rounded-lg border border-white/10 bg-[#070707] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[10px] uppercase font-bold">{c.categoryLabel}</span>
                    <span className="text-emerald-400 font-bold">{c.probabilityPct}% Probability</span>
                  </div>
                  <div className="text-white font-medium text-xs font-sans">{c.conclusionText}</div>
                  <div className="text-[10px] text-zinc-400">Basis: {c.evidenceBasis}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNICATION DNA */}
      {activeTab === 'communication' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(intelligence.communicationDna.quadrants).map(([key, item]) => (
              <div key={key} className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-1">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">{key}</span>
                <div className="text-white font-bold text-sm">{item.value}</div>
                <div className="text-[10px] text-zinc-400">{item.records} records · {item.confidence}% conf</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold uppercase text-[11px] block">Communication Spectrum Sliders</span>
            <div className="space-y-2">
              {intelligence.communicationDna.spectrums.map((s, i) => (
                <div key={i} className="p-3 rounded-lg border border-white/10 bg-[#070707] flex items-center justify-between gap-4">
                  <span className="w-28 text-zinc-400 text-[11px] text-right">{s.leftPole}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${s.positionPct}%` }}
                    />
                  </div>
                  <span className="w-28 text-white font-bold text-[11px]">{s.rightPole}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DECISION ARCHITECTURE */}
      {activeTab === 'decision' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{intelligence.decisionArchitecture.citedInterpretation.title}</span>
              <span className="text-emerald-400 font-bold">{intelligence.decisionArchitecture.citedInterpretation.badge}</span>
            </div>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {intelligence.decisionArchitecture.citedInterpretation.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(intelligence.decisionArchitecture.summaryCards).map(([key, val]) => (
              <div key={key} className="p-3 rounded-lg border border-white/10 bg-[#070707] space-y-1">
                <span className="text-zinc-400 uppercase text-[10px] block">{key}</span>
                <span className="text-white font-bold">{val.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MEETING STRATEGY */}
      {activeTab === 'meeting' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/10 bg-[#070707] space-y-2">
            <span className="text-white font-bold uppercase text-[10px] block">30-Second Briefing Read</span>
            <p className="text-zinc-200 font-sans text-xs leading-relaxed">
              {intelligence.meetingStrategy.thirtySecondRead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <span className="text-emerald-300 font-bold uppercase text-[10px] block">Lead With:</span>
              <ul className="text-zinc-100 space-y-1 list-disc pl-4 font-sans text-xs">
                {intelligence.meetingStrategy.leadWith.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2">
              <span className="text-rose-300 font-bold uppercase text-[10px] block">Avoid:</span>
              <ul className="text-zinc-100 space-y-1 list-disc pl-4 font-sans text-xs">
                {intelligence.meetingStrategy.avoid.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
