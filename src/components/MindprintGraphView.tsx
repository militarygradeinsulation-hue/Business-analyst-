import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  CheckCircle2,
  AlertTriangle,
  Link2,
} from 'lucide-react';
import {
  INITIAL_EVIDENCE_GRAPH_NODES,
  INITIAL_EVIDENCE_GRAPH_EDGES,
  GraphNodeData,
  GraphEdgeData,
} from '../data/aifmCorpus';
import { PersonScanReport } from '../lib/urlScannerBrain';

interface MindprintGraphViewProps {
  personScan?: PersonScanReport;
}

export const MindprintGraphView: React.FC<MindprintGraphViewProps> = ({ personScan }) => {
  const [nodes, setNodes] = useState<GraphNodeData[]>(
    personScan ? personScan.integratedGraph.nodes : INITIAL_EVIDENCE_GRAPH_NODES
  );
  const [edges, setEdges] = useState<GraphEdgeData[]>(
    personScan ? personScan.integratedGraph.edges : INITIAL_EVIDENCE_GRAPH_EDGES
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-mech-test');
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (personScan) {
      setNodes(personScan.integratedGraph.nodes);
      setEdges(personScan.integratedGraph.edges);
    }
  }, [personScan]);

  // Form state to test Section 6.6: "No invented relationship edges"
  const [edgeFrom, setEdgeFrom] = useState<string>('node-role-mkt');
  const [edgeTo, setEdgeTo] = useState<string>('node-role-sales');
  const [edgeRelation, setEdgeRelation] = useState<GraphEdgeData['relation']>('hands_off_to');
  const [edgeConsentRef, setEdgeConsentRef] = useState<string>('');
  const [edgeNote, setEdgeNote] = useState<string>('Inferred from LinkedIn job titles alone');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleAddEdgeTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (edgeFrom === edgeTo) return;
    const hasVerifiedConsentAndSource =
      edgeConsentRef.trim().length >= 5 &&
      !edgeNote.toLowerCase().includes('title') &&
      !edgeNote.toLowerCase().includes('inferred');

    const newEdge: GraphEdgeData = {
      id: `edge-custom-${edges.length + 1}`,
      from: edgeFrom,
      to: edgeTo,
      relation: edgeRelation,
      confirmed: hasVerifiedConsentAndSource,
      consentRef: edgeConsentRef.trim() || 'UNCONFIRMED-NO-CONSENT-REF',
      evidenceNote:
        edgeNote.trim() ||
        'Unconfirmed relationship edge; requires process map, signed RACI matrix, or system event.',
    };

    setEdges((prev) => [newEdge, ...prev]);
  };

  const resetGraph = () => {
    setNodes(INITIAL_EVIDENCE_GRAPH_NODES);
    setEdges(INITIAL_EVIDENCE_GRAPH_EDGES);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const mindprintTenStages = [
    { step: '01', name: 'Intake', detail: '3 saved text sources · LinkedIn URL treated as reference only' },
    { step: '02', name: 'Normalization', detail: '17 normalized passages · Source origin & timestamp preserved' },
    { step: '03', name: 'Signal Extraction', detail: '8 extracted/rebuilt signals across 3 observed areas' },
    { step: '04', name: 'Pattern Clustering', detail: 'Communication, trust, and strategic thinking grouped' },
    { step: '05', name: 'Contradiction Check', detail: '0 personal tensions · Applied to work policy vs CRM logs' },
    { step: '06', name: 'Confidence Vector', detail: '50/100 Moderate system confidence (not a 50% probability)' },
    { step: '07', name: 'Behavioral Hypothesis', detail: 'Missing observations remain explicitly marked missing' },
    { step: '08', name: 'Goal-Specific Strategy', detail: 'Questions about workplace coordination & handoff rules' },
    { step: '09', name: 'Meeting Preparation', detail: 'Consent-scoped brief without clinical or hiring claims' },
    { step: '10', name: 'Evidence Graph Save', detail: 'Golden Report findings imported strictly as hypotheses' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header & Section 6-7 Summary */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
              Sections 6, 7 & 9.8 · Provenance-Aware Company Evidence Graph G = (V, E) [T14–T19]
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Mindprint Intelligence & Source-Linked Evidence Graph
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Connects Golden Report organizational hypotheses, Mindprint professional observations, verified role links, intervention decisions, and measured outcomes. Missing observations remain missing; inferred job-title links remain unconfirmed until backed by workflow evidence.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.1).toFixed(2))))}
              aria-label="Zoom out evidence graph"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 px-1.5">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.35, Number((z + 0.1).toFixed(2))))}
              aria-label="Zoom in evidence graph"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={resetGraph}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Graph</span>
            </button>
          </div>
        </div>

        {/* Interactive Spatial Canvas + Selected Node Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Pan/Drag Canvas (8 cols) */}
          <div className="lg:col-span-8 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-950 relative overflow-hidden h-[440px]">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded border border-white/10 pointer-events-none">
              <Move className="w-3.5 h-3.5 text-amber-400" />
              <span>Drag canvas or nodes · Solid = Verified Edge · Dashed = Unconfirmed</span>
            </div>

            <div
              onPointerDown={(e) => {
                isPanning.current = true;
                panStart.current = {
                  x: e.clientX - panOffset.x,
                  y: e.clientY - panOffset.y,
                };
              }}
              onPointerMove={(e) => {
                if (!isPanning.current) return;
                setPanOffset({
                  x: e.clientX - panStart.current.x,
                  y: e.clientY - panStart.current.y,
                });
              }}
              onPointerUp={() => {
                isPanning.current = false;
              }}
              onPointerLeave={() => {
                isPanning.current = false;
              }}
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: 'top left',
              }}
              className="w-[1220px] h-[440px] relative cursor-grab active:cursor-grabbing select-none"
            >
              {/* SVG Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrow-confirmed"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#D4AF37" />
                  </marker>
                  <marker
                    id="arrow-unconfirmed"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748B" />
                  </marker>
                </defs>

                {edges.map((edge) => {
                  const source = nodes.find((n) => n.id === edge.from);
                  const target = nodes.find((n) => n.id === edge.to);
                  if (!source || !target) return null;

                  const x1 = source.x + 85;
                  const y1 = source.y + 34;
                  const x2 = target.x + 85;
                  const y2 = target.y + 34;
                  const midX = (x1 + x2) / 2;
                  const midY = (y1 + y2) / 2;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={edge.confirmed ? '#D4AF37' : '#64748B'}
                        strokeWidth={edge.confirmed ? 2 : 1.5}
                        strokeDasharray={edge.confirmed ? undefined : '5,5'}
                        markerEnd={
                          edge.confirmed ? 'url(#arrow-confirmed)' : 'url(#arrow-unconfirmed)'
                        }
                      />
                      <text
                        x={midX}
                        y={midY - 6}
                        textAnchor="middle"
                        fill={edge.confirmed ? '#FDE68A' : '#94A3B8'}
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {edge.relation}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Interactive Nodes */}
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: node.x, top: node.y }}
                    className={`absolute w-[166px] p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-slate-900 ring-2 ring-amber-400/40 z-20'
                        : 'border-white/15 bg-slate-900/95 hover:border-amber-500/60 z-10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 text-[10px] font-mono text-slate-400 mb-1">
                      <span className="truncate">{node.evidenceKind}</span>
                      <span
                        className={`shrink-0 ${
                          node.status === 'validated'
                            ? 'text-emerald-400'
                            : node.status === 'hypothesis'
                            ? 'text-amber-400'
                            : 'text-sky-400'
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white leading-snug">
                      {node.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 4 cols: Selected Node & 5D Confidence Vector Q_k = (S_k, I_k, M_k, A_k, V_k) */}
          <div className="lg:col-span-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
                Node Provenance & Confidence Vector Q_k
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedNode.label}
              </h2>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Status: {selectedNode.status} · Kind: {selectedNode.evidenceKind}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedNode.summary}
              </p>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                Source Ref: {selectedNode.sourceRef}
              </div>
            </div>

            {/* Section 9.8: 5-Dimensional Confidence Vector */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Section 9.8 · Evidence Quality Vector Q_k = (S, I, M, A, V)
              </div>
              {[
                { label: 'S_k · Source Reliability', val: selectedNode.confidenceVector.S },
                { label: 'I_k · Source Independence', val: selectedNode.confidenceVector.I },
                { label: 'M_k · Measurement Quality', val: selectedNode.confidenceVector.M },
                { label: 'A_k · Causal Attribution Fit', val: selectedNode.confidenceVector.A },
              ].map((dim) => (
                <div key={dim.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-400">{dim.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {dim.val}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-200"
                      style={{ width: `${dim.val}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-1 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">V_k · Validation Status</span>
                <span className="text-amber-600 dark:text-[#D4AF37] font-semibold">
                  {selectedNode.confidenceVector.V}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6.6: "No Invented Relationship Edges" Live Tester & Edge Registry */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            01. Workflow Relationship Verification Gate (Section 6.6)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            A title such as “Director of Marketing” is insufficient to infer who approves a budget or accepts a sales handoff. Test adding a relationship edge to see how `workflow-evidence.ts` [T16] classifies confirmed vs unconfirmed edges.
          </p>
        </div>

        <form
          onSubmit={handleAddEdgeTest}
          className="p-5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label htmlFor="edge-from" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              Origin Node
            </label>
            <select
              id="edge-from"
              value={edgeFrom}
              onChange={(e) => setEdgeFrom(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edge-to" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              Target Node
            </label>
            <select
              id="edge-to"
              value={edgeTo}
              onChange={(e) => setEdgeTo(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edge-relation" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              Edge Relation Type
            </label>
            <select
              id="edge-relation"
              value={edgeRelation}
              onChange={(e) => setEdgeRelation(e.target.value as GraphEdgeData['relation'])}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
            >
              <option value="hands_off_to">hands_off_to</option>
              <option value="depends_on">depends_on</option>
              <option value="supported_by">supported_by</option>
              <option value="contradicted_by">contradicted_by</option>
              <option value="evaluated_by">evaluated_by</option>
            </select>
          </div>

          <div>
            <label htmlFor="edge-consent" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              Consent / RACI Reference (Optional)
            </label>
            <input
              id="edge-consent"
              type="text"
              value={edgeConsentRef}
              onChange={(e) => setEdgeConsentRef(e.target.value)}
              placeholder="Leave blank to test unconfirmed"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Test Link Rule</span>
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-4">From → To</th>
                <th className="py-2.5 px-4">Relation</th>
                <th className="py-2.5 px-4">Consent / Source Reference</th>
                <th className="py-2.5 px-4">Supporting Evidence Note</th>
                <th className="py-2.5 px-4">Graph Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {edges.map((edge) => {
                const src = nodes.find((n) => n.id === edge.from)?.label || edge.from;
                const dst = nodes.find((n) => n.id === edge.to)?.label || edge.to;
                return (
                  <tr key={edge.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      {src} → {dst}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-amber-600 dark:text-[#D4AF37]">
                      {edge.relation}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {edge.consentRef}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {edge.evidenceNote}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {edge.confirmed ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmed Edge</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Unconfirmed · Request RACI/Log</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 6.2: The 10 Named Processing Stages Observed in the Supplied 21-Page Mindprint Report [T19] */}
      <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] p-6 lg:p-8 space-y-6">
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            02. Mindprint 10-Stage Processing Architecture & Boundary Rules (Section 6.2)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Documented from the supplied 21-page Mindprint Intelligence Report v2 (October 30, 2026) [T19]. Distinguishes observable communication signals from unobserved dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {mindprintTenStages.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0D14]"
            >
              <div className="text-xs font-mono text-amber-600 dark:text-[#D4AF37]">
                Stage {s.step}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {s.name}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
