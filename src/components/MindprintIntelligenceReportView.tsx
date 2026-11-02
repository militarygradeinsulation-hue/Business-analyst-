import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckSquare,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Search,
  Layers,
  GitBranch,
  FileText,
  MessageSquare,
} from 'lucide-react';
import {
  MindprintFullIntelligence,
  ThinkingCoreGraphNode,
  EvidenceExcerptRecord,
} from '../lib/mindprintIntelligence';

interface MindprintIntelligenceReportViewProps {
  intelligence: MindprintFullIntelligence;
  aiSynthesisNote?: string;
}

type ReportSectionTab =
  | 'all'
  | 'dossier'
  | 'thinking-graph'
  | 'dna-architecture'
  | 'strategy-prep'
  | 'pipeline-evidence';

export const MindprintIntelligenceReportView: React.FC<MindprintIntelligenceReportViewProps> = ({
  intelligence,
  aiSynthesisNote,
}) => {
  const [activeTab, setActiveTab] = useState<ReportSectionTab>('all');
  const [expandedConclusions, setExpandedConclusions] = useState<Record<string, boolean>>({
    [intelligence.investigativeDossier.triangulatedConclusions[0]?.id || 'tc-1']: true,
  });
  const [graphFilter, setGraphFilter] = useState<string>('All patterns');
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState<string>('tc-analytical');
  const [appendixCategoryFilter, setAppendixCategoryFilter] = useState<string>('ALL');

  const toggleConclusion = (id: string) => {
    setExpandedConclusions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const graphCategories = [
    'All patterns',
    'How they think',
    'Decisions',
    'Trust',
    'Expressed drivers',
    'Workplace friction',
    'Deeper hypotheses',
    'Work events',
  ];

  const visibleGraphNodes = intelligence.thinkingCoreGraph.nodes.filter(
    (n) => n.category === 'core' || graphFilter === 'All patterns' || n.category === graphFilter
  );

  const selectedGraphNode: ThinkingCoreGraphNode =
    intelligence.thinkingCoreGraph.nodes.find((n) => n.id === selectedGraphNodeId) ||
    intelligence.thinkingCoreGraph.nodes[0];

  const filteredExcerpts: EvidenceExcerptRecord[] =
    appendixCategoryFilter === 'ALL'
      ? intelligence.appendixEvidence
      : intelligence.appendixEvidence.filter((e) => e.category === appendixCategoryFilter);

  const showSection = (sectionGroup: ReportSectionTab) =>
    activeTab === 'all' || activeTab === sectionGroup;

  return (
    <div className="space-y-8 font-mono text-slate-900 dark:text-[#F1F5F9]">
      {/* COVER / SUBJECT HEADER (Page 1 of Mindprint Intelligence Report) */}
      <div className="rounded-xl border border-slate-200 dark:border-[#D97736]/30 bg-slate-950 text-[#F1F5F9] p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] tracking-[0.2em] text-[#D97736] uppercase">
          <span>MINDPRINT / INTELLIGENCE REPORT</span>
          <span>02 / METHODOLOGY · MULTI-SOURCE OSINT</span>
        </div>

        <div className="space-y-2 border-b border-white/15 pb-6">
          <div className="text-[11px] tracking-[0.18em] text-slate-400 uppercase">SUBJECT</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            {intelligence.subjectName}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {intelligence.headlineSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Version</div>
            <div className="text-white font-semibold mt-0.5">{intelligence.version}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Generated</div>
            <div className="text-white font-semibold mt-0.5">{intelligence.generatedAtUtc}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Signals &amp; Sources</div>
            <div className="text-white font-semibold mt-0.5">
              {intelligence.totalSignals} signals · {intelligence.sourceTypesCount} source types
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Passages Processed</div>
            <div className="text-white font-semibold mt-0.5">
              {intelligence.passagesProcessedCount} passages
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Goal</div>
            <div className="text-white font-semibold mt-0.5">{intelligence.goal}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Confidence</div>
            <div className="text-[#D97736] font-bold mt-0.5">
              {intelligence.overallConfidenceBand} ({intelligence.overallConfidenceScore})
            </div>
          </div>
        </div>

        {aiSynthesisNote && (
          <div className="p-4 rounded-lg border border-[#D97736]/40 bg-[#D97736]/10 text-xs text-slate-200 flex items-start gap-2.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-[#D97736] shrink-0 mt-0.5" />
            <span>{aiSynthesisNote}</span>
          </div>
        )}

        <div className="text-[11px] text-slate-400 border-t border-white/10 pt-3">
          Hypotheses derived from observable professional communication. Not a psychological assessment. No protected or sensitive attributes inferred.
        </div>
      </div>

      {/* SECTION FILTER BAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        {[
          { id: 'all', label: 'Full Report (All 12 Sections)', icon: Layers },
          { id: 'dossier', label: '01–01b Snapshot & Investigative Dossier', icon: Search },
          { id: 'thinking-graph', label: '01c–01f Thinking Core & Casebook', icon: GitBranch },
          { id: 'dna-architecture', label: '02–06 DNA, Thinking, Decision & Trust', icon: FileText },
          { id: 'strategy-prep', label: '07–10 Meeting & Message Strategy', icon: MessageSquare },
          { id: 'pipeline-evidence', label: 'Pipeline & 11–12 Evidence Appendix', icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ReportSectionTab)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#D97736] text-slate-950 font-bold'
                  : 'border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0B0D14] text-slate-600 dark:text-slate-300 hover:border-[#D97736]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 02 / METHODOLOGY: WHAT MINDPRINT SCANS FOR (Page 2) */}
      {showSection('pipeline-evidence') && (
        <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-5">
          <div className="flex items-center justify-between text-[11px] tracking-[0.18em] text-slate-400 uppercase border-b border-[#D97736]/40 pb-2">
            <span>ANALYSIS PIPELINE</span>
            <span>02 / METHODOLOGY</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-sans">WHAT MINDPRINT SCANS FOR</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {intelligence.subjectName} · Full Intelligence · Goal: {intelligence.goal}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded border border-white/10 bg-[#0B0D14]">
              <div className="text-lg font-bold text-white">{intelligence.textSourcesCount}</div>
              <div className="text-[11px] text-slate-400">Text sources</div>
            </div>
            <div className="p-3.5 rounded border border-white/10 bg-[#0B0D14]">
              <div className="text-lg font-bold text-white">{intelligence.totalSignals}</div>
              <div className="text-[11px] text-slate-400">Evidence signals</div>
            </div>
            <div className="p-3.5 rounded border border-white/10 bg-[#0B0D14]">
              <div className="text-lg font-bold text-white">
                {intelligence.areasWithSignalsCount}
              </div>
              <div className="text-[11px] text-slate-400">Areas with signals</div>
            </div>
            <div className="p-3.5 rounded border border-white/10 bg-[#0B0D14]">
              <div className="text-lg font-bold text-[#D97736]">
                {intelligence.overallConfidenceBand}
              </div>
              <div className="text-[11px] text-slate-400">Evidence confidence</div>
            </div>
          </div>

          <div className="pl-3 border-l-2 border-[#D97736] text-xs text-slate-300">
            LinkedIn URL is a reference, not proof of private retrieval. Multi-source public OSINT and supplied source text are analyzed.
          </div>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {intelligence.pipelineStages.map((st) => (
              <div
                key={st.number}
                className="py-3 flex items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="text-slate-500 mt-0.5">{st.number}</span>
                  <CheckSquare className="w-4 h-4 text-[#D97736] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">{st.name}</div>
                    <div className="text-slate-300 mt-0.5">{st.description}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{st.detailLine}</div>
                  </div>
                </div>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase shrink-0">
                  {st.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 01 EXECUTIVE SNAPSHOT & 01b INVESTIGATIVE DOSSIER (Pages 3–7) */}
      {showSection('dossier') && (
        <div className="space-y-6">
          {/* 01 EXECUTIVE SNAPSHOT */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">01</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                EXECUTIVE SNAPSHOT
              </h3>
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {intelligence.executiveSnapshot.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </section>

          {/* 01b INVESTIGATIVE DOSSIER */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-6">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">01b</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                INVESTIGATIVE DOSSIER
              </h3>
            </div>

            {/* INVESTIGATOR'S READ */}
            <div className="p-5 rounded-lg border border-white/10 bg-[#0B0D14] space-y-3">
              <div className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                INVESTIGATOR&apos;S READ
              </div>
              <div className="text-sm font-bold text-white">WHO THIS PERSON APPEARS TO BE</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {intelligence.investigativeDossier.investigatorRead}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                {intelligence.investigativeDossier.pagesExaminedCount} public pages examined ·{' '}
                {intelligence.scanAtUtc.slice(0, 10)}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {intelligence.investigativeDossier.inferredRoleBadges.map((badge, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded border border-white/10 bg-white/5 text-[11px] text-slate-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* MYERS-BRIGGS ESTIMATE · HYPOTHESIS */}
            <div className="p-5 rounded-lg border border-white/10 bg-[#0B0D14] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                    MYERS-BRIGGS ESTIMATE · HYPOTHESIS
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-bold tracking-widest text-white">
                      {intelligence.investigativeDossier.mbtiEstimate.code}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] border border-white/20 text-slate-300">
                      {intelligence.investigativeDossier.mbtiEstimate.badge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-white/10">
                {intelligence.investigativeDossier.mbtiEstimate.axes.map((ax) => (
                  <div key={ax.letter} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-white">{ax.letter}</span>
                      <span className="px-2 py-0.5 text-[10px] border border-white/15 text-slate-400">
                        {ax.confidenceLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{ax.leftPole}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded relative">
                        <div
                          className="w-2.5 h-2.5 bg-white rounded-xs absolute -top-0.5"
                          style={{ left: `calc(${ax.positionPct}% - 5px)` }}
                        />
                      </div>
                      <span>{ax.rightPole}</span>
                    </div>
                    <p className="text-xs text-slate-300">{ax.explanation}</p>
                    <div className="pl-2.5 border-l border-[#D97736] text-[11px] text-slate-400">
                      {ax.citationQuote} — {ax.citationSource}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                Estimated from public professional communication only. Not a validated assessment; people often present differently at work than elsewhere.
              </div>
            </div>

            {/* BACKGROUND & FOOTPRINT LINKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">BACKGROUND · EDUCATION</div>
                  <div className="text-slate-200 mt-0.5">
                    {intelligence.investigativeDossier.background.education}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="text-[10px] text-slate-400 uppercase">BACKGROUND · CAREER</div>
                  <div className="text-slate-200 mt-0.5">
                    {intelligence.investigativeDossier.background.career}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="text-[10px] text-slate-400 uppercase">
                    VENTURES · BUSINESSES &amp; AFFILIATIONS
                  </div>
                  <div className="text-slate-200 mt-0.5">
                    {intelligence.investigativeDossier.background.ventures}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-3 text-xs">
                <div className="text-[10px] text-slate-400 uppercase">
                  FOOTPRINT · LINKS &amp; SOCIAL PROFILES
                </div>
                <div className="divide-y divide-white/10">
                  {intelligence.investigativeDossier.footprintLinks.map((lnk, i) => (
                    <a
                      key={i}
                      href={lnk.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 flex items-center justify-between gap-3 text-slate-200 hover:text-[#D97736] transition-colors"
                    >
                      <span className="text-slate-400">{lnk.platform}</span>
                      <span className="truncate flex items-center gap-1.5">
                        <span>{lnk.displayUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* TRIANGULATED CONCLUSIONS · CALIBRATED PROBABILITIES */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div>
                  <div className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                    TRIANGULATED CONCLUSIONS · CALIBRATED PROBABILITIES
                  </div>
                  <div className="text-sm font-bold text-white">FILLING IN THE MISSING PIECES</div>
                </div>
                <span className="text-[11px] text-slate-400">
                  Higher % = more clues agree. Low % = a hunch worth testing.
                </span>
              </div>

              <div className="space-y-2.5">
                {intelligence.investigativeDossier.triangulatedConclusions.map((tc) => {
                  const isExpanded = Boolean(expandedConclusions[tc.id]);
                  return (
                    <div
                      key={tc.id}
                      className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2.5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-xl font-bold text-white tabular-nums w-12 shrink-0">
                          {tc.probabilityPct}%
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-slate-400 uppercase tracking-wider">
                              {tc.categoryLabel}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px]">
                              {tc.derivationType}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-white font-medium">
                            {tc.headline}
                          </div>
                          <div className="h-1 bg-white/10 rounded overflow-hidden">
                            <div
                              className="h-full bg-white"
                              style={{ width: `${tc.probabilityPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleConclusion(tc.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                        <span>Why this conclusion</span>
                      </button>

                      {isExpanded && (
                        <div className="pl-4 border-l border-white/15 space-y-2 text-xs text-slate-300 pt-1">
                          <p>{tc.whySummary}</p>
                          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                            {tc.reasoningSteps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                          {tc.supportingQuotes.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <div className="text-[10px] text-slate-400 uppercase">SUPPORTING</div>
                              {tc.supportingQuotes.map((sq, idx) => (
                                <div
                                  key={idx}
                                  className="pl-2.5 border-l-2 border-[#D97736] text-[11px] text-slate-300"
                                >
                                  {sq.quote} — <span className="text-slate-400">{sq.source}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 pt-1">
                            <strong className="text-slate-300">Would change if:</strong>{' '}
                            {tc.wouldChangeIf}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PORTABLE MINDSET & PROFESSIONAL PSYCHOLOGY (Pages 6–7) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4 p-5 rounded-lg border border-white/10 bg-[#0B0D14] space-y-3">
                <div className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                  PORTABLE MINDSET PROFILE
                </div>
                <div className="text-sm font-bold text-white">SIGNATURE VOCABULARY</div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-200">
                  {intelligence.investigativeDossier.signatureVocabulary.map((voc, i) => (
                    <li key={i}>{voc}</li>
                  ))}
                </ul>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                  For understanding and communicating with this person in your own systems. Not for writing as them.
                </div>
              </div>

              <div className="lg:col-span-8 p-5 rounded-lg border border-white/10 bg-[#0B0D14] space-y-4">
                <div>
                  <div className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                    PROFESSIONAL PSYCHOLOGY · EVIDENCE-BACKED HYPOTHESES
                  </div>
                  <div className="text-sm font-bold text-white">
                    HOW THEY APPEAR TO THINK AND OPERATE
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {intelligence.investigativeDossier.professionalPsychology.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded border border-white/10 bg-slate-950 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">MOTIVATORS</span>
                      <span className="text-[10px] px-1.5 py-0.5 border border-white/15 text-slate-300">
                        {intelligence.investigativeDossier.professionalPsychology.motivators.badge}
                      </span>
                    </div>
                    <div className="font-bold text-white">
                      {intelligence.investigativeDossier.professionalPsychology.motivators.title}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {intelligence.investigativeDossier.professionalPsychology.motivators.body}
                    </p>
                  </div>

                  <div className="p-3 rounded border border-white/10 bg-slate-950 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">WORKING STYLE</span>
                      <span className="text-[10px] px-1.5 py-0.5 border border-white/15 text-slate-300">
                        {intelligence.investigativeDossier.professionalPsychology.workingStyle.badge}
                      </span>
                    </div>
                    <div className="font-bold text-white">
                      {intelligence.investigativeDossier.professionalPsychology.workingStyle.title}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {intelligence.investigativeDossier.professionalPsychology.workingStyle.body}
                    </p>
                  </div>

                  <div className="p-3 rounded border border-white/10 bg-slate-950 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">DECISION STYLE</span>
                      <span className="text-[10px] px-1.5 py-0.5 border border-white/15 text-slate-300">
                        {intelligence.investigativeDossier.professionalPsychology.decisionStyle.badge}
                      </span>
                    </div>
                    <div className="font-bold text-white">
                      {intelligence.investigativeDossier.professionalPsychology.decisionStyle.title}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {intelligence.investigativeDossier.professionalPsychology.decisionStyle.body}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <div className="text-[10px] text-slate-400 uppercase">HOW TO ENGAGE THEM</div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-200">
                    {intelligence.investigativeDossier.professionalPsychology.howToEngage.map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 01c EVIDENCE VISUALIZATION, 01d THINKING CORE GRAPH, 01e FORENSIC CASEBOOK, 01f DECISION LAB (Pages 8–13) */}
      {showSection('thinking-graph') && (
        <div className="space-y-6">
          {/* 01c EVIDENCE VISUALIZATION */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-5">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">01c</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                EVIDENCE VISUALIZATION
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Observed evidence grouped by category, alongside relative signal strength. Descriptive only; not a diagnostic or psychometric assessment.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-white">
                  Evidence distribution ({intelligence.totalSignals} signals)
                </div>
                <div className="divide-y divide-white/10">
                  {intelligence.evidenceVisualization.distribution.map((row) => (
                    <div
                      key={row.category}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#D97736] inline-block" />
                        <span className="text-slate-200">{row.category}</span>
                      </div>
                      <div className="flex items-center gap-4 tabular-nums">
                        <span className="text-white font-semibold">{row.count}</span>
                        <span className="text-slate-400 w-9 text-right">{row.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-white">
                  Observed Thinking Signals (Normalized to 100)
                </div>
                <div className="space-y-2">
                  {intelligence.evidenceVisualization.thinkingRadar.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-[#D97736] font-bold">{item.score}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded overflow-hidden">
                        <div
                          className="h-full bg-[#D97736]"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 01d THINKING CORE GRAPH & SITUATIONAL FRICTION */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-5">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">01d</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                THINKING CORE GRAPH
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Explore how observable professional signals overlap. The center organizes the model; connections between outer nodes mean they cite the same material, not that one trait causes another.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {graphCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGraphFilter(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] cursor-pointer ${
                    graphFilter === cat
                      ? 'border border-white bg-white/10 text-white font-semibold'
                      : 'border border-white/15 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 rounded-lg border border-white/10 bg-[#07080C] p-3">
                <svg viewBox="0 0 560 360" className="w-full h-72 select-none">
                  {intelligence.thinkingCoreGraph.edges.map((edge, idx) => {
                    const fromNode = visibleGraphNodes.find((n) => n.id === edge.from);
                    const toNode = visibleGraphNodes.find((n) => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    return (
                      <line
                        key={idx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="rgba(217, 119, 54, 0.35)"
                        strokeWidth={1.2}
                        strokeDasharray={fromNode.id === 'tc-core' ? 'none' : '3 3'}
                      />
                    );
                  })}

                  {visibleGraphNodes.map((node) => {
                    const isCore = node.category === 'core';
                    const isSelected = node.id === selectedGraphNode.id;
                    return (
                      <g
                        key={node.id}
                        onClick={() => setSelectedGraphNodeId(node.id)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isCore ? 22 : isSelected ? 9 : 6}
                          fill={isCore ? '#090A0F' : isSelected ? '#D97736' : '#E2E8F0'}
                          stroke={isCore || isSelected ? '#D97736' : 'rgba(255,255,255,0.4)'}
                          strokeWidth={isCore ? 2.5 : 1.5}
                        />
                        {isCore && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={14}
                            fill="none"
                            stroke="#F8FAFC"
                            strokeWidth={1.5}
                          />
                        )}
                        <text
                          x={node.x}
                          y={node.y + (isCore ? 36 : -12)}
                          textAnchor="middle"
                          fill={isSelected ? '#D97736' : '#CBD5E1'}
                          fontSize={10}
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {node.label.length > 20 ? node.label.slice(0, 18) + '…' : node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                  {intelligence.thinkingCoreGraph.patternCount} evidence-backed patterns ·{' '}
                  {intelligence.thinkingCoreGraph.sharedCitationLinksCount} shared-citation links · Tap a node to inspect
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-lg border border-white/15 bg-[#0B0D14] space-y-2">
                  <div className="text-[10px] text-[#D97736] uppercase">
                    SELECTED NODE · {selectedGraphNode.category}
                  </div>
                  <div className="text-sm font-bold text-white">{selectedGraphNode.label}</div>
                  <div className="text-xs text-slate-300">{selectedGraphNode.evidenceSummary}</div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                    <strong className="text-slate-300">Competing explanation: </strong>
                    {selectedGraphNode.competingExplanation}
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase">
                    QUESTIONS THAT UNLOCK DEEPER UNDERSTANDING
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-200">
                    {intelligence.thinkingCoreGraph.unlockQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* SITUATIONAL FRICTION TO TEST (Page 9) */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div>
                <div className="text-sm font-bold text-white">SITUATIONAL FRICTION TO TEST</div>
                <p className="text-[11px] text-slate-400">
                  Conditional workplace examples based on communication samples. Not emotional triggers, diagnoses or predictions about personal life.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {intelligence.thinkingCoreGraph.situationalFriction.map((sf, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5 text-xs"
                  >
                    <div className="font-bold text-white">{sf.title}</div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">Scenario: </span>
                      {sf.scenario}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">Possible friction: </span>
                      {sf.possibleFriction}
                    </div>
                    <div className="text-white font-medium">
                      <span className="text-slate-400">Better approach: </span>
                      {sf.betterApproach}
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1">
                      {sf.observedSignalsCount} observed signal(s) · needs real-world validation
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 01e FORENSIC CASEBOOK & 01f DECISION AND EVIDENCE LAB (Pages 9–12) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
              <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
                <span className="text-xs text-slate-400">01e</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  FORENSIC CASEBOOK (ACH)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                ACH-inspired consistency review: Multiple explanations can fit the same evidence. Competing explanations may coexist.
              </p>

              <div className="space-y-3">
                {intelligence.forensicCasebook.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2 text-xs"
                  >
                    <div className="font-bold text-white">{item.title}</div>
                    <p className="text-slate-300">{item.summary}</p>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2 py-0.5 border border-white/15 text-slate-300">
                        {item.compatibleExcerpts} compatible excerpts
                      </span>
                      <span className="px-2 py-0.5 border border-white/15 text-slate-300">
                        {item.moreSpecificCount} more specific
                      </span>
                      <span className="px-2 py-0.5 border border-white/15 text-slate-300">
                        {item.knownOutlets} known outlets
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Alternative explanation: </strong>
                      {item.alternativeExplanation}
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-white/10 text-[11px]">
                      <div className="text-[10px] text-[#D97736] uppercase">
                        DISCRIMINATING QUESTION
                      </div>
                      <div className="text-white mt-0.5">{item.discriminatingQuestion}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
              <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
                <span className="text-xs text-slate-400">01f</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  DECISION AND EVIDENCE LAB
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Research principle: look for explanations besides personality, and ask what would prove the preferred explanation wrong.
              </p>

              <div className="space-y-3">
                {intelligence.decisionAndEvidenceLab.hypotheses.map((hyp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2 text-xs"
                  >
                    <div className="font-bold text-white">{hyp.title}</div>
                    <p className="text-slate-300">{hyp.summary}</p>
                    <div className="text-[11px] text-slate-400">
                      {hyp.matchingExcerpts} matching source excerpts · Communication examples only
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                      {hyp.otherExplanations.map((oe, i) => (
                        <li key={i}>{oe}</li>
                      ))}
                    </ul>
                    <div className="p-2.5 rounded bg-slate-950 border border-white/10 text-[11px] space-y-1">
                      <div className="text-[10px] text-[#D97736] uppercase">
                        POTENTIAL FALSIFICATION TEST
                      </div>
                      <div className="text-white">{hyp.falsificationQuestion}</div>
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Test with: </strong>
                        {hyp.testWith}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* 02 COMMUNICATION DNA, 03 THINKING ARCHITECTURE, 04 DECISION ARCHITECTURE, 05 TRUST, 06 LEDGER (Pages 14–21) */}
      {showSection('dna-architecture') && (
        <div className="space-y-6">
          {/* 02 COMMUNICATION DNA */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-5">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">02</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                COMMUNICATION DNA
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'DIRECTNESS', data: intelligence.communicationDna.quadrants.directness },
                { label: 'LENGTH', data: intelligence.communicationDna.quadrants.length },
                { label: 'REGISTER', data: intelligence.communicationDna.quadrants.register },
                { label: 'MODE', data: intelligence.communicationDna.quadrants.mode },
              ].map((q) => (
                <div
                  key={q.label}
                  className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] border-l-2 border-l-[#D97736]"
                >
                  <div className="text-[10px] text-slate-400 uppercase">{q.label}</div>
                  <div className="text-base font-bold text-white mt-0.5">{q.data.value}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {q.data.records} records · {q.data.confidence} confidence
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 divide-y divide-white/10">
              {intelligence.communicationDna.spectrums.map((sp, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200">{sp.leftLabel}</span>
                    <span className="px-2 py-0.5 text-[10px] border border-white/20 text-slate-300">
                      {sp.confidenceBadge} {sp.confidenceScore}
                    </span>
                    <span className="text-slate-200">{sp.rightLabel}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded relative">
                    <div
                      className="w-3 h-3 border-2 border-[#D97736] bg-slate-950 absolute -top-0.5"
                      style={{ left: `calc(${sp.markerPct}% - 6px)` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">{sp.summaryLine}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 03 THINKING ARCHITECTURE */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-5">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">03</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  THINKING ARCHITECTURE
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Ranked relative signal strength · not a personality diagnosis
              </span>
            </div>

            <div className="space-y-3">
              {intelligence.thinkingArchitecture.signals.map((sig) => (
                <div
                  key={sig.rank}
                  className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 mr-2">#{sig.rank}</span>
                      <span className="font-bold text-white text-sm">{sig.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] border border-white/20 text-slate-300">
                        {sig.confidenceBadge}
                      </span>
                      <span className="font-bold text-[#D97736]">{sig.relativeScore}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded overflow-hidden">
                    <div
                      className="h-full bg-[#D97736]"
                      style={{ width: `${sig.relativeScore}%` }}
                    />
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] text-slate-400 uppercase">OBSERVED INDICATORS</div>
                    {sig.observedIndicators.map((ind, i) => (
                      <p key={i} className="text-[11px] text-slate-300 leading-relaxed">
                        {ind}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 04 DECISION ARCHITECTURE & 05 TRUST ARCHITECTURE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
              <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
                <span className="text-xs text-slate-400">04</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  DECISION ARCHITECTURE
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {intelligence.decisionArchitecture.sequenceSteps.map((st, i) => (
                  <React.Fragment key={st.label}>
                    <div className="p-2.5 rounded border border-white/15 bg-[#0B0D14] text-xs">
                      <div className="text-white font-semibold">{st.label}</div>
                      {st.badge && (
                        <div className="text-[9px] text-[#D97736] mt-0.5">{st.badge}</div>
                      )}
                    </div>
                    {i < intelligence.decisionArchitecture.sequenceSteps.length - 1 && (
                      <span className="text-slate-500">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="divide-y divide-white/10 border-t border-white/10">
                {intelligence.decisionArchitecture.attributes.map((attr) => (
                  <div
                    key={attr.label}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-400">{attr.label}</span>
                    <span className="text-white font-semibold">{attr.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
              <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
                <span className="text-xs text-slate-400">05</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  TRUST ARCHITECTURE
                </h3>
              </div>

              <div className="space-y-3">
                {intelligence.trustArchitecture.signals.map((ts) => (
                  <div key={ts.label} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{ts.label}</span>
                      <span className="text-slate-400">
                        {ts.records} records · <strong className="text-[#D97736]">{ts.relativeScore}</strong>
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded overflow-hidden">
                      <div
                        className="h-full bg-[#D97736]"
                        style={{ width: `${Math.max(3, ts.relativeScore)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 06 ATTENTION MAP */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase">
                  06 · EVIDENCE LEDGER ATTENTION MAP
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {intelligence.evidenceLedgerSummary.attentionMap.map((tok) => (
                    <span
                      key={tok.token}
                      className="px-2 py-1 rounded border border-white/10 bg-[#0B0D14] text-[11px] text-slate-200"
                    >
                      {tok.token} <span className="text-slate-500">{tok.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* 07 WHY ME / WHY THEM / WHY NOW, 08 MEETING STRATEGY, 09 QUESTIONS & OBJECTIONS, 10 MESSAGE STRATEGY (Pages 21–24) */}
      {showSection('strategy-prep') && (
        <div className="space-y-6">
          {/* 07 WHY ME / WHY THEM / WHY NOW */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">07</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                WHY ME / WHY THEM / WHY NOW
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2">
                <div className="text-[10px] text-[#D97736] uppercase">WHY THEM</div>
                {intelligence.whyMeWhyThemWhyNow.whyThem.map((w, i) => (
                  <p key={i} className="text-slate-200">
                    {w.text} <span className="text-slate-500">[{w.evidenceCount} ev]</span>
                  </p>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2">
                <div className="text-[10px] text-[#D97736] uppercase">WHY ME</div>
                {intelligence.whyMeWhyThemWhyNow.whyMe.map((w, i) => (
                  <p key={i} className="text-slate-200">
                    {w.text} <span className="text-slate-500">[{w.evidenceCount} ev]</span>
                  </p>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2">
                <div className="text-[10px] text-[#D97736] uppercase">WHY NOW</div>
                {intelligence.whyMeWhyThemWhyNow.whyNow.map((w, i) => (
                  <p key={i} className="text-slate-200">
                    {w.text} <span className="text-slate-500">[{w.evidenceCount} ev]</span>
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* 08 MEETING STRATEGY BRIEF */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-5">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">08</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                MEETING STRATEGY · BRIEF
              </h3>
            </div>

            <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2 text-xs">
              <div className="text-[10px] text-slate-400 uppercase">30-SECOND READ</div>
              {intelligence.meetingStrategy.thirtySecondRead.map((line, i) => (
                <p key={i} className="text-slate-200">
                  {line}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5">
                <div className="text-[10px] text-white uppercase font-bold">DO</div>
                {intelligence.meetingStrategy.doList.map((d, i) => (
                  <div key={i} className="text-slate-200">
                    › {d}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5">
                <div className="text-[10px] text-rose-400 uppercase font-bold">DON&apos;T</div>
                {intelligence.meetingStrategy.dontList.map((d, i) => (
                  <div key={i} className="text-slate-200">
                    › {d}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5">
                <div className="text-[10px] text-[#D97736] uppercase font-bold">LEAD WITH</div>
                {intelligence.meetingStrategy.leadWith.map((d, i) => (
                  <div key={i} className="text-slate-200">
                    › {d}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5">
                <div className="text-[10px] text-sky-400 uppercase font-bold">PROOF TO BRING</div>
                {intelligence.meetingStrategy.proofToBring.map((d, i) => (
                  <div key={i} className="text-slate-200">
                    › {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase">
                  3 STRATEGIC QUESTIONS TO ASK
                </div>
                {intelligence.meetingStrategy.strategicQuestionsToAsk.map((q, i) => (
                  <div key={i} className="text-slate-200">
                    › {q}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg border border-white/15 bg-[#0B0D14] text-xs">
                  <div className="text-[10px] text-slate-400 uppercase">OPENING ANGLE</div>
                  <div className="text-white mt-0.5">
                    {intelligence.meetingStrategy.openingAngle}
                  </div>
                </div>
                <div className="p-3.5 rounded-lg border border-white/15 bg-[#0B0D14] text-xs">
                  <div className="text-[10px] text-slate-400 uppercase">NEXT STEP</div>
                  <div className="text-white font-semibold mt-0.5">
                    {intelligence.meetingStrategy.nextStep}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 09 QUESTIONS & OBJECTIONS + 10 MESSAGE STRATEGY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
              <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
                <span className="text-xs text-slate-400">09</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  QUESTIONS &amp; OBJECTIONS
                </h3>
              </div>
              <div className="divide-y divide-white/10">
                {intelligence.questionsAndObjections.map((qo, i) => (
                  <div
                    key={i}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase mr-2">
                        {qo.category}
                      </span>
                      <span className="text-white">{qo.question}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] border border-white/20 text-slate-200 shrink-0">
                      {qo.badge} {qo.score}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
              <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
                <span className="text-xs text-slate-400">10</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  MESSAGE STRATEGY
                </h3>
              </div>
              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-3 text-xs">
                <div className="text-[10px] text-[#D97736] uppercase">
                  {intelligence.messageStrategy.structureLabel}
                </div>
                <div className="space-y-2 text-white font-medium p-3 rounded bg-slate-950 border border-white/10">
                  {intelligence.messageStrategy.templateLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  {intelligence.messageStrategy.guidanceNotes.map((note, i) => (
                    <div key={i}>› {note}</div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* 11 CONFIDENCE & METHODOLOGY + 12 APPENDIX: EVIDENCE (Pages 24–32) */}
      {showSection('pipeline-evidence') && (
        <div className="space-y-6">
          {/* 11 CONFIDENCE & METHODOLOGY */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
            <div className="border-b border-[#D97736]/50 pb-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">11</span>
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                CONFIDENCE &amp; METHODOLOGY
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {intelligence.confidenceAndMethodology.formulaText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D97736]" />
                  <span>BLIND SPOTS</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                  {intelligence.confidenceAndMethodology.blindSpots.map((bs, i) => (
                    <li key={i}>{bs}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase">
                  SCRAPED &amp; INDEXED SOURCES ({intelligence.confidenceAndMethodology.sources.length})
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  {intelligence.confidenceAndMethodology.sources.map((src) => (
                    <div key={src.id} className="truncate">
                      {src.capturedDate} · {src.sourceType} · {src.label} ·{' '}
                      <span className="text-[#D97736]">{src.originTag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 12 APPENDIX: EVIDENCE */}
          <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 text-[#F1F5F9] p-6 space-y-4">
            <div className="border-b border-[#D97736]/50 pb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">12</span>
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  APPENDIX: EVIDENCE ({intelligence.appendixEvidence.length} VERBATIM EXCERPTS)
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'ALL',
                  'COMMUNICATION',
                  'STRATEGIC THINKING',
                  'EXECUTION',
                  'LEADERSHIP',
                  'DECISION',
                  'TRUST',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAppendixCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                      appendixCategoryFilter === cat
                        ? 'bg-[#D97736] text-slate-950 font-bold'
                        : 'border border-white/15 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredExcerpts.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-lg border border-white/10 bg-[#0B0D14] space-y-2 text-xs"
                >
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-1.5 py-0.5 border border-white/15 text-slate-400">
                      OSINT / VERIFIED
                    </span>
                    <span className="px-1.5 py-0.5 border border-[#D97736]/40 text-[#D97736]">
                      {ev.category}
                    </span>
                  </div>
                  <blockquote className="pl-3 border-l-2 border-white/40 text-slate-200 leading-relaxed">
                    {ev.quote}
                  </blockquote>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                    <span>{ev.behavioralInterpretation}</span>
                    <span className="underline decoration-white/20">
                      {ev.sourceLabel} · w{ev.weight} · rel {ev.reliability} · rec {ev.recency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
