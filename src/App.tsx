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
import { ProofStripWalkthrough } from './components/ProofStripWalkthrough';
import { AlternativesComparisonView } from './components/AlternativesComparisonView';
import { DeterministicScopeEngine } from './components/DeterministicScopeEngine';
import { PricingLadderView } from './components/PricingLadderView';
import { ReviewsAndCouncilView } from './components/ReviewsAndCouncilView';
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
              <span className="hidden sm:inline font-mono text-xs font-semibold text-zinc-300 ml-1">
                // FORENSIC OS
              </span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-zinc-200 font-semibold">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('intake');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              01. Free Scan
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('what-we-fix');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              02. What We Fix
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('quote-builder');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              03. Quote Builder
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('pricing');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              04. Pricing &amp; Guarantee
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('reviews-and-council');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              05. Sample Fixes
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('intake')}
              className="btn-skeu hidden sm:inline-flex"
              style={{ padding: '10px 18px', fontSize: '11.5px' }}
            >
              <span className="dot" />
              <span>Scan My Business Free</span>
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
              onClick={() => {
                setIsMenuOpen(false);
                scrollToSection('intake');
              }}
            >
              Scan My Business Free
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToSection('what-we-fix');
              }}
            >
              What We Fix (Alternatives)
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToSection('quote-builder');
              }}
            >
              Autonomous Quote Builder
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToSection('pricing');
              }}
            >
              Fixed Pricing &amp; Delivery Guarantee
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-link"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToSection('reviews-and-council');
              }}
            >
              Sample Fixes
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
            {/* Contractor Inquiry-to-Booking Gap Positioning Header */}
            <div className="hero-top-bar flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/20 bg-white/5 font-mono text-xs uppercase tracking-widest text-white/90">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>CONTRACTOR WORKFLOW GAP REMEDIATION // NO SOFTWARE REPLACEMENT</span>
                </div>
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[0.95]">
                  Stop losing jobs between the first call and the booked appointment.
                </h1>
                <p className="text-base sm:text-lg text-zinc-100 leading-relaxed max-w-2xl font-normal">
                  Get a free scan of your customer inquiry process. See the problems we can verify, then choose a fixed-price plan to build the fixes—without replacing your existing tools.
                </p>

                {/* DUAL PROPOSED CTAS */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('scanner')}
                    className="btn-skeu"
                    style={{ padding: '14px 26px', fontSize: '13px' }}
                  >
                    <span className="dot" />
                    <span>Scan my business free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('what-we-fix')}
                    className="daemon-chip py-3.5 px-6 text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
                  >
                    <span>See what we fix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="aux static lg:relative w-full lg:w-[380px] p-5 rounded-2xl border border-white/20 bg-black/80 backdrop-blur-md space-y-3 shadow-2xl">
                <div className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center justify-between">
                  <span>Core Positioning Principle</span>
                  <span className="text-[10px] text-zinc-200 font-bold bg-white/10 px-2 py-0.5 rounded">CONTRACTOR V6</span>
                </div>
                <p className="text-xs text-zinc-100 leading-relaxed font-medium">
                  You’re not buying another contractor app. You’re buying fixes to the gaps between the tools you already use—Jobber, ServiceTitan, Housecall Pro, phone logs, and your website.
                </p>
                <div className="pt-2 border-t border-white/15 flex flex-wrap gap-1.5 text-[10.5px] font-mono text-zinc-300 font-semibold">
                  <span>#1 Free Initial Scan</span>
                  <span>·</span>
                  <span>#2 Evidence-Backed</span>
                  <span>·</span>
                  <span>#3 Fixed Scope</span>
                </div>
              </div>
            </div>

            {/* TOP-OF-PAGE DUAL-URL FORENSIC SCANNER CONSOLE (PRESERVED & ENHANCED) */}
            <div id="scanner" className="pt-2">
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

        {/* SECTION: LAUNCH PROOF STRIP & 4-STEP EVIDENCE WALKTHROUGH */}
        <ProofStripWalkthrough />

        {/* SECTION: WHAT WE FIX (ALTERNATIVES COMPARISON TABLE) */}
        <AlternativesComparisonView />

        {/* SECTION: AUTONOMOUS DETERMINISTIC SCOPE & QUOTING ENGINE */}
        <DeterministicScopeEngine />

        {/* SECTION: TRANSPARENT PRICING LADDER & DELIVERY GUARANTEE */}
        <PricingLadderView />

        {/* SECTION: OWNER REVIEWS, LABELED SAMPLES & GOVERNANCE COUNCIL */}
        <ReviewsAndCouncilView />

        {/* SECTION 02: 4-PILLAR SYSTEM ARCHITECTURE (.svc / .svc-card / .steps from Daemon Template) */}
        <section id="architecture" className="sec">
          <div className="gridlines" aria-hidden="true" />
          <div className="wrap">
            <div className="sec-head">
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


      </main>

      {/* DAEMON FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-300 font-medium">
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

      {/* 3D AETHERIS CODEX FLIPBOOK STUDIO MODAL - REMOVED */}
    </div>
  );
}
