import React, { useState } from 'react';
import {
  BookOpen,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
  Layers,
  ShieldCheck,
  Scale,
  Network,
  Compass,
} from 'lucide-react';

export const AETHERIS_CODEX_URL = 'https://aetheriscodex.ai.studio/';

interface AetherisCodexViewProps {
  onOpenModal?: () => void;
}

export const AetherisCodexView: React.FC<AetherisCodexViewProps> = ({ onOpenModal }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <section id="codex" className="sec">
      <div className="gridlines" aria-hidden="true" />
      <div className="wrap space-y-10">
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <div className="eyebrow">
              <span className="badge">
                <i></i>
                <span>03 // THE METHOD BEHIND THE METHODOLOGY</span>
              </span>
            </div>
            <h2 className="h2">
              The Aetheris Codex. <span className="soft">Interactive 3D Digital Flipbook.</span>
            </h2>
          </div>
          <p className="lede">
            The complete theoretical foundation, mathematical proofs, and 7-phase operational
            protocols behind the Aetheris Integrated Forensic Methodology by Joseph Toney.
          </p>
        </div>

        {/* 3D Flipbook Embed Container */}
        <div className="plan space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl uppercase tracking-tight text-white">
                  The Aetheris Codex // Live 3D Digital Edition
                </h3>
                <p className="font-mono text-xs text-[#9a9a9a]">
                  Featuring realistic page-turning physics, touch gestures, customizable typography,
                  studio lighting controls, and procedural ambient audio.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded((e) => !e)}
                className="daemon-chip inline-flex items-center gap-1.5"
                title={isExpanded ? 'Restore Normal Height' : 'Expand Viewport'}
              >
                {isExpanded ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Collapse Frame</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand Frame</span>
                  </>
                )}
              </button>

              {onOpenModal && (
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="daemon-chip inline-flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen Studio</span>
                </button>
              )}

              <a
                href={AETHERIS_CODEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-skeu"
                style={{ padding: '8px 16px', fontSize: '11px' }}
              >
                <span className="dot" />
                <span>Open Direct</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div
            className={`relative w-full rounded-2xl overflow-hidden border border-white/15 bg-[#050505] transition-all duration-500 ${
              isExpanded ? 'h-[920px]' : 'h-[620px] sm:h-[720px]'
            }`}
          >
            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070707] z-10 text-center p-6 space-y-3">
                <div className="logo-mark animate-pulse" aria-hidden="true" style={{ width: 24, height: 24 }}>
                  <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-[#9a9a9a]">
                  Mounting 3D Physics Flipbook Engine...
                </div>
                <div className="font-mono text-[11px] text-[#6b6b6b]">
                  {AETHERIS_CODEX_URL}
                </div>
              </div>
            )}
            <iframe
              src={AETHERIS_CODEX_URL}
              title="Aetheris — 3D Interactive Forensic Methodology Codex"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-[11px] text-[#9a9a9a]">
            <span>Tip: Drag page corners or use arrow keys to flip pages · Scroll to zoom</span>
            <span className="text-white/60">Source: Joseph Toney, Founder, Aetheris Technology</span>
          </div>
        </div>

        {/* The Method Behind The Methodology Cards */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="badge">
              <i></i>
              <span>CANONICAL CHAPTERS DOCUMENTED IN THE CODEX</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-white/10 bg-[#070707] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[#9a9a9a]">
                <span>CHAPTER 1.2</span>
                <Compass className="w-4 h-4 text-white/70" />
              </div>
              <h4 className="font-display text-lg uppercase text-white tracking-tight">
                The Founder&apos;s Forensic Principle
              </h4>
              <p className="text-xs text-[#9a9a9a] leading-relaxed">
                Public digital artifacts contain the exact mathematical footprint of internal
                capacity constraints. Public observations invert into internal friction without
                confusing evidence with hypotheses.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-[#070707] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[#9a9a9a]">
                <span>CHAPTER 8</span>
                <Layers className="w-4 h-4 text-white/70" />
              </div>
              <h4 className="font-display text-lg uppercase text-white tracking-tight">
                Seven-Phase Operating Protocol
              </h4>
              <p className="text-xs text-[#9a9a9a] leading-relaxed">
                The strict sequence of operational verification: 01 Identify → 02 Baseline → 03 Trace
                → 04 Human Layer → 05 Price → 06 Correct → 07 Verify.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-[#070707] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[#9a9a9a]">
                <span>CHAPTER 5</span>
                <Scale className="w-4 h-4 text-white/70" />
              </div>
              <h4 className="font-display text-lg uppercase text-white tracking-tight">
                Financial Leak Ledger Model v6
              </h4>
              <p className="text-xs text-[#9a9a9a] leading-relaxed">
                Deterministic deduplication, primary chapter ownership, roll-up exclusions, and the
                Two-Reference Safeguard ensuring exact zero-overlap accounting.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-[#070707] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[#9a9a9a]">
                <span>CHAPTER 20 &amp; 21</span>
                <Network className="w-4 h-4 text-white/70" />
              </div>
              <h4 className="font-display text-lg uppercase text-white tracking-tight">
                Relationship Forensics &amp; Butler Brief
              </h4>
              <p className="text-xs text-[#9a9a9a] leading-relaxed">
                The scientific foundations of relationship execution: why business forensics
                requires an executive action protocol with Laplace-smoothed matching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
