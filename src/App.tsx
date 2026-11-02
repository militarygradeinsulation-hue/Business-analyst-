/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Globe,
  UserCheck,
  Scale,
  Network,
  BookOpen,
  ExternalLink,
  X,
} from 'lucide-react';
import { UrlScannerCommandView } from './components/UrlScannerCommandView';
import { AetherisCodexView, AETHERIS_CODEX_URL } from './components/AetherisCodexView';
import {
  compilePersonScanReport,
  type CompanyScanReport,
  type PersonScanReport,
} from './lib/urlScannerBrain';

const MANUSCRIPT_PDF_PATH =
  '/assets/aistudio/Aetheris_Forensic_Methodology_Book_Edition_db032cfe.pdf';
const GOLDEN_REPORT_PDF_PATH =
  '/assets/aistudio/Golden_Report_-_Complete_d8af8aab.pdf';
const MINDPRINT_PDF_PATH =
  '/assets/aistudio/1_MINDPRINT_Intelligence_Report_312e49f4.pdf';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isCodexModalOpen, setIsCodexModalOpen] = useState<boolean>(false);
  const [activePdfModal, setActivePdfModal] = useState<{
    title: string;
    path: string;
  } | null>(null);

  const [companyScan, setCompanyScan] = useState<CompanyScanReport | null>(null);
  const [personScan, setPersonScan] = useState<PersonScanReport | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setActivePdfModal(null);
        setIsCodexModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* FIXED DAEMON HEADER */}
      <header className={`nav ${isScrolled || isMenuOpen ? 'scrolled' : ''}`}>
        <div className="nav-in">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="logo"
          >
            <div className="logo-mark" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
            <span>
              AETHERIS{' '}
              <span className="hidden sm:inline font-mono text-xs font-normal text-[#9a9a9a] ml-1">
                // FORENSIC OS
              </span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-[#9a9a9a]">
            <button
              type="button"
              onClick={() => scrollToSection('intake')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              01. URL Scanner
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('architecture')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              02. Architecture
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('codex')}
              className="hover:text-white transition-colors cursor-pointer text-white/90"
            >
              03. The Codex (Method)
            </button>
            <button
              type="button"
              onClick={() =>
                setActivePdfModal({
                  title: 'Golden Report Complete (discflo.com)',
                  path: GOLDEN_REPORT_PDF_PATH,
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              04. Golden Report PDF
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('codex')}
              className="daemon-chip hidden xl:inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3D Codex</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('intake')}
              className="btn-skeu hidden sm:inline-flex"
              style={{ padding: '10px 16px', fontSize: '11px' }}
            >
              <span className="dot" />
              <span>Launch Scanner</span>
            </button>

            <button
              type="button"
              className="burger"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((o) => !o)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN DAEMON MENU OVERLAY */}
      <div className={`menu ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
        <ol>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => scrollToSection('intake')}
            >
              Forensic URL Intake
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => scrollToSection('architecture')}
            >
              System Architecture
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => scrollToSection('codex')}
            >
              The Codex // Method Behind Methodology
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => {
                setIsMenuOpen(false);
                setIsCodexModalOpen(true);
              }}
            >
              Open 3D Flipbook Studio
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => {
                setIsMenuOpen(false);
                setActivePdfModal({
                  title: 'Aetheris Integrated Forensic Methodology (Book Edition)',
                  path: MANUSCRIPT_PDF_PATH,
                });
              }}
            >
              Methodology Manuscript
            </button>
          </li>
        </ol>
        <div className="menu-foot">
          <span>AETHERIS FORENSIC OS · MODEL VERSION 6</span>
          <span>GOLDEN REPORT · MINDPRINT · ASK INTROS · COLLECTIVE BRAIN</span>
        </div>
      </div>

      <main id="top">
        {/* DAEMON HERO + TOP-MOUNTED FORENSIC URL SCANNER COMMAND CENTER */}
        <section id="intake" className="hero">
          <div className="hero-bg" />
          <div className="hero-video" />
          <div className="hero-shade" />
          <div className="noise" />

          {/* Reticle Grid & Coordinates */}
          <div className="reticle" aria-hidden="true">
            <div className="v" style={{ left: '8%' }} />
            <div className="v" style={{ left: '36%' }} />
            <div className="v" style={{ left: '68%' }} />
            <div className="h" style={{ top: '22%' }} />
            <div className="h" style={{ top: '76%' }} />
            <div className="plus" style={{ top: '22%', left: '8%' }} />
            <div className="plus" style={{ top: '22%', left: '68%' }} />
            <div className="plus" style={{ top: '76%', left: '36%' }} />
            <div className="coord" style={{ top: 'calc(22% + 8px)', left: 'calc(8% + 12px)' }}>
              SYS.AIFM // V6.2 · LIVE URL SCANNER
            </div>
          </div>

          <div className="hero-main wrap">
            {/* Compact Top Hero Header */}
            <div className="hero-top-bar">
              <h1 className="headline">
                <span>We Expose</span>
                <span>Hidden</span>
                <span>Bleed.</span>
              </h1>

              <div className="aux">
                <ul className="tags">
                  <li>Golden Report v6</li>
                  <li>Mindprint OSINT</li>
                  <li>Leak Ledger</li>
                  <li>Ask Intros</li>
                </ul>
                <p>
                  Enter a Company URL, a LinkedIn Executive URL, or run both together below to
                  generate a 22-chapter Forensic Audit and 12-section Mindprint Dossier.
                </p>
              </div>
            </div>

            {/* TOP-OF-PAGE DUAL-URL FORENSIC SCANNER CONSOLE */}
            <UrlScannerCommandView
              companyScan={companyScan}
              personScan={personScan}
              onCompanyScanComplete={(newCompanyReport) => {
                setCompanyScan(newCompanyReport);
                if (personScan) {
                  setPersonScan(
                    compilePersonScanReport({
                      rawUrl: personScan.normalizedUrl,
                      activeCompanyScan: newCompanyReport,
                      aiSynthesisNote: personScan.aiSynthesisNote,
                      scrapedSources: personScan.scrapedSources,
                      extractedPersonName: personScan.personName,
                      extractedRoleTitle: personScan.inferredRoleTitle,
                    })
                  );
                }
              }}
              onPersonScanComplete={(newPersonReport) => {
                setPersonScan(newPersonReport);
              }}
              onBothScansComplete={(newCompany, newPerson) => {
                setCompanyScan(newCompany);
                setPersonScan(newPerson);
              }}
              onClearScans={() => {
                setCompanyScan(null);
                setPersonScan(null);
              }}
            />
          </div>

          {/* Partners / Capabilities Marquee Strip */}
          <div className="partners">
            <div className="badge-row">
              <div className="badge">
                <i></i>
                <span>CANONICAL FORENSIC ENGINES · DETERMINISTIC RECONCILIATION</span>
              </div>
            </div>
            <div className="marquee">
              <div className="track">
                {[
                  { name: 'GOLDEN REPORT', sub: '22-CHAPTER AUDIT' },
                  { name: 'CANONICAL LEDGER', sub: 'MODEL VERSION 6' },
                  { name: 'MINDPRINT OSINT', sub: '12-SECTION DOSSIER' },
                  { name: 'ASK INTROS', sub: 'BUTLER BRIEF ENGINE' },
                  { name: 'COLLECTIVE BRAIN', sub: 'N=412 COHORT LIFT' },
                  { name: 'TWO-REF SAFEGUARD', sub: 'ZERO DOUBLE COUNT' },
                  { name: 'GOLDEN REPORT', sub: '22-CHAPTER AUDIT' },
                  { name: 'CANONICAL LEDGER', sub: 'MODEL VERSION 6' },
                  { name: 'MINDPRINT OSINT', sub: '12-SECTION DOSSIER' },
                  { name: 'ASK INTROS', sub: 'BUTLER BRIEF ENGINE' },
                  { name: 'COLLECTIVE BRAIN', sub: 'N=412 COHORT LIFT' },
                  { name: 'TWO-REF SAFEGUARD', sub: 'ZERO DOUBLE COUNT' },
                ].map((item, i) => (
                  <div key={i} className="pl">
                    <span>{item.name}</span>
                    <small>// {item.sub}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: 4-PILLAR SYSTEM ARCHITECTURE (.svc / .svc-card / .steps from Daemon Template) */}
        <section id="architecture" className="sec">
          <div className="gridlines" aria-hidden="true" />
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow">
                  <span className="badge">
                    <i></i>
                    <span>02 // INTEGRATED METHODOLOGY</span>
                  </span>
                </div>
                <h2 className="h2">
                  Four Engines. <span className="soft">One Truth.</span>
                </h2>
              </div>
              <p className="lede">
                Every URL scan passes through four deterministic engines so public observations,
                inferred cohort models, and executive communication hypotheses never blur together.
              </p>
            </div>

            <div className="svc">
              <div className="svc-card">
                <div className="svc-num">
                  <span>01 // ENGINE</span>
                  <span>[T3, T4]</span>
                </div>
                <div className="svc-ico">
                  <Globe />
                </div>
                <h3>Golden Report</h3>
                <p>
                  22-chapter website &amp; pipeline autopsy that prices active revenue leaks across
                  SEO, CTA hierarchy, contact hygiene, and owner capacity.
                </p>
                <ul>
                  <li>22 Chapters</li>
                  <li>30/60/90 Plan</li>
                  <li>12 Social Posts</li>
                </ul>
              </div>

              <div className="svc-card">
                <div className="svc-num">
                  <span>02 // ENGINE</span>
                  <span>[MODEL V6]</span>
                </div>
                <div className="svc-ico">
                  <Scale />
                </div>
                <h3>Canonical Ledger</h3>
                <p>
                  Eliminates double counting through root-cause fingerprints, chapter ownership,
                  roll-up exclusions, and the Two-Reference Safeguard.
                </p>
                <ul>
                  <li>Deduplicated</li>
                  <li>Profit Bridge</li>
                  <li>Sensitivity 4×5</li>
                </ul>
              </div>

              <div className="svc-card">
                <div className="svc-num">
                  <span>03 // ENGINE</span>
                  <span>[OSINT 10-STAGE]</span>
                </div>
                <div className="svc-ico">
                  <UserCheck />
                </div>
                <h3>Mindprint Dossier</h3>
                <p>
                  12-section executive intelligence report mapping Communication DNA, Thinking Core
                  Graph, MBTI Hypothesis, and ACH competing explanations.
                </p>
                <ul>
                  <li>Multi-Source OSINT</li>
                  <li>Thinking Graph</li>
                  <li>ACH Casebook</li>
                </ul>
              </div>

              <div className="svc-card">
                <div className="svc-num">
                  <span>04 // ENGINE</span>
                  <span>[CONSENT-GATED]</span>
                </div>
                <div className="svc-ico">
                  <Network />
                </div>
                <h3>Ask Intros &amp; Brain</h3>
                <p>
                  Connects the company&apos;s verified bottleneck to the right executive with a
                  Laplace-smoothed match score and Butler Meeting Brief.
                </p>
                <ul>
                  <li>Match Score</li>
                  <li>Butler Brief</li>
                  <li>Cohort Lift</li>
                </ul>
              </div>
            </div>

            <div className="steps">
              <div className="step">
                <b>STEP 01 // INTAKE</b>
                <h4>Public Signal Capture</h4>
                <p>
                  Extracts DOM forms, CTAs, phone/email consistency, schema markup, and multi-source
                  OSINT passages.
                </p>
              </div>
              <div className="step">
                <b>STEP 02 // RECONCILE</b>
                <h4>Canonical Deduplication</h4>
                <p>
                  Applies root-cause fingerprints and two-reference gates so Top 10 + Remainder
                  equals the exact ledger total.
                </p>
              </div>
              <div className="step">
                <b>STEP 03 // TRIANGULATE</b>
                <h4>Mindprint &amp; ACH Lab</h4>
                <p>
                  Synthesizes executive communication style, decision sequence, and falsification
                  questions.
                </p>
              </div>
              <div className="step">
                <b>STEP 04 // EXECUTE</b>
                <h4>30/60/90 &amp; Butler Brief</h4>
                <p>
                  Generates ready-to-publish remediation assets and a source-constrained pre-meeting
                  brief.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03: THE METHOD BEHIND THE METHODOLOGY — 3D FLIPBOOK CODEX */}
        <AetherisCodexView onOpenModal={() => setIsCodexModalOpen(true)} />

      </main>

      {/* DAEMON FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#9a9a9a]">
          <div className="flex items-center gap-3">
            <div className="logo-mark" style={{ width: 16, height: 16 }} aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
            <span>AETHERIS INTEGRATED FORENSIC METHODOLOGY OS</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('codex')}
              className="hover:text-white transition-colors cursor-pointer text-white"
            >
              The Codex (3D Flipbook)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() =>
                setActivePdfModal({
                  title: 'Golden Report Complete (PDF)',
                  path: GOLDEN_REPORT_PDF_PATH,
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              Golden Report PDF
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() =>
                setActivePdfModal({
                  title: 'Mindprint Intelligence Report (PDF)',
                  path: MINDPRINT_PDF_PATH,
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mindprint PDF
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() =>
                setActivePdfModal({
                  title: 'Aetheris Forensic Methodology Manuscript (PDF)',
                  path: MANUSCRIPT_PDF_PATH,
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              Methodology Book PDF
            </button>
          </div>
        </div>
      </footer>

      {/* REFERENCE PDF VIEWER MODAL */}
      {activePdfModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-view-enter"
          role="dialog"
          aria-modal="true"
          aria-label={activePdfModal.title}
        >
          <div className="w-full max-w-6xl h-[88vh] rounded border border-white/20 bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5 font-mono text-xs text-white">
                <BookOpen className="w-4 h-4" />
                <span>{activePdfModal.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activePdfModal.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="daemon-chip inline-flex items-center gap-1.5"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  aria-label="Close PDF Viewer"
                  className="daemon-chip p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black">
              <iframe
                src={activePdfModal.path}
                title={activePdfModal.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3D AETHERIS CODEX FLIPBOOK STUDIO MODAL */}
      {isCodexModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-view-enter"
          role="dialog"
          aria-modal="true"
          aria-label="Aetheris 3D Digital Flipbook Codex Studio"
        >
          <div className="w-full max-w-7xl h-[94vh] rounded-2xl border border-white/20 bg-[#0a0a0a] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#070707]">
              <div className="flex items-center gap-2.5 font-mono text-xs text-white">
                <BookOpen className="w-4 h-4 text-white" />
                <span className="font-semibold uppercase tracking-wider">
                  The Aetheris Codex // The Method Behind The Methodology
                </span>
                <span className="hidden sm:inline text-[#9a9a9a] text-[11px]">
                  (Interactive 3D Digital Flipbook by Joseph Toney)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={AETHERIS_CODEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="daemon-chip inline-flex items-center gap-1.5"
                >
                  <span>Open Direct</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsCodexModalOpen(false)}
                  aria-label="Close Codex Studio"
                  className="daemon-chip p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black relative">
              <iframe
                src={AETHERIS_CODEX_URL}
                title="Aetheris — 3D Interactive Forensic Methodology Codex"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
