import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Shield,
  Layers,
  Sparkles,
  UserCheck,
  Compass,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface SampleFix {
  id: string;
  trade: string;
  title: string;
  stack: string;
  problem: string;
  fixDelivered: string;
  acceptanceTest: string;
  measuredResult: string;
}

const SAMPLE_FIXES: SampleFix[] = [
  {
    id: 'sample_01',
    trade: 'HVAC & Heating Services',
    title: 'Emergency Missed-Call Auto-Text & On-Call Tech Dispatch',
    stack: 'ServiceTitan + Twilio + Slack Alerts',
    problem: 'Homeowners with frozen pipes or dead furnaces hung up when reaching voicemail; office only checked voicemails at 8 AM.',
    fixDelivered: 'Instant SMS text-back sent within 20 seconds of an abandoned call with an emergency address intake link, immediately pinging the on-call technician.',
    acceptanceTest: '1. Inbound test call disconnects on ring 4. 2. Automated SMS arrives on mobile within 25s. 3. Lead record created in ServiceTitan unassigned queue.',
    measuredResult: 'Zero emergency calls lost to voicemail during freezing weekend shift; 14 emergency furnace calls booked.',
  },
  {
    id: 'sample_02',
    trade: 'Residential & Commercial Plumbing',
    title: 'Custom Website Form to Instant Booking & Dispatch Sync',
    stack: 'Housecall Pro + WordPress Form + Webhook Relay',
    problem: 'Webform inquiries landed in a shared Gmail box. Staff manually re-keyed customer addresses into Housecall Pro with an average 3.8-hour delay.',
    fixDelivered: 'Automated webhook parser that normalizes customer contact data, checks service radius, and creates a draft job on the Housecall Pro dispatch board in real time.',
    acceptanceTest: '1. Customer submits test emergency quote form. 2. Address geocoded. 3. Customer receives confirmation SMS. 4. Job ticket appears on dispatch board in <15s.',
    measuredResult: 'Average customer response latency dropped from 228 minutes to 38 seconds.',
  },
  {
    id: 'sample_03',
    trade: 'Electrical Contracting',
    title: 'Unbooked Estimate Automated Follow-Up Cadence',
    stack: 'Jobber + SendGrid + Twilio',
    problem: 'Electricians sent $3,000–$12,000 rewiring bids via Jobber. If the customer didn’t sign immediately, technicians forgot to follow up.',
    fixDelivered: 'Automated 3-stage reminder cadence: Day 2 text-check, Day 5 email with FAQ sheet, and Day 10 courtesy closing reminder with a 1-click question button.',
    acceptanceTest: '1. Estimate marked "Sent" in Jobber. 2. Day 2 trigger verifies quote status is still pending. 3. Personalized reminder SMS delivered. 4. Pauses instantly if signed.',
    measuredResult: '24% of expired rewiring bids re-engaged and closed without manual administrative chasing.',
  },
];

export const ReviewsAndCouncilView: React.FC = () => {
  const [activeSampleTab, setActiveSampleTab] = useState<string>('sample_01');
  const [feedbackName, setFeedbackName] = useState<string>('');
  const [feedbackTrade, setFeedbackTrade] = useState<string>('');
  const [feedbackWorkflow, setFeedbackWorkflow] = useState<string>('');
  const [feedbackChange, setFeedbackChange] = useState<string>('');
  const [feedbackPermission, setFeedbackPermission] = useState<boolean>(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  const activeSample =
    SAMPLE_FIXES.find((s) => s.id === activeSampleTab) || SAMPLE_FIXES[0];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackChange.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackName('');
      setFeedbackTrade('');
      setFeedbackWorkflow('');
      setFeedbackChange('');
      setFeedbackSubmitted(false);
    }, 4000);
  };

  return (
    <section id="reviews-and-council" className="py-20 border-t border-white/10 bg-[#080808]">
      <div className="wrap space-y-16">
        {/* LABELED SAMPLE IMPLEMENTATIONS */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
              Labeled Sample Workflows &amp; Test Specifications
            </span>
            <div className="flex gap-2">
              {SAMPLE_FIXES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSampleTab(s.id)}
                  className={`py-1.5 px-3 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                    activeSampleTab === s.id
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 border border-white/10 text-zinc-200 hover:text-white font-medium'
                  }`}
                >
                  {s.trade.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Sample Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-[#0e0e0e] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Sample Implementation // {activeSample.trade}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white mt-1">
                  {activeSample.title}
                </h3>
              </div>

              <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 font-mono text-xs text-zinc-200">
                Stack: <strong className="text-white">{activeSample.stack}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
                    Operational Breakdown Checked:
                  </span>
                  <p className="text-zinc-100 leading-relaxed font-normal">
                    {activeSample.problem}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                    Fix Delivered &amp; Configured:
                  </span>
                  <p className="text-white leading-relaxed font-semibold">
                    {activeSample.fixDelivered}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/10 bg-[#141414] space-y-4">
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Documented Acceptance Test Criteria:</span>
                  </span>
                  <p className="text-xs text-zinc-200 font-mono leading-relaxed bg-black/40 p-3 rounded border border-white/10 font-medium">
                    {activeSample.acceptanceTest}
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-white/10">
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
                    Verified Operational Consequence:
                  </span>
                  <p className="text-xs text-white font-mono font-bold">
                    {activeSample.measuredResult}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AUTOMATED POST-ACCEPTANCE FEEDBACK COLLECTOR */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0a0a0a] space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
              Post-Acceptance Feedback System
            </span>
            <h3 className="font-display text-2xl uppercase tracking-tight text-white">
              Automated Review Engine Demo
            </h3>
            <p className="text-xs text-zinc-200 leading-relaxed font-normal">
              Once an agreed fix passes customer acceptance testing, this neutral prompt is triggered. No sentiment gates, no filtered surveys.
            </p>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Owner / Manager Name"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                className="daemon-input text-xs"
              />
              <input
                type="text"
                placeholder="Trade & Company (e.g. Apex Heating & Air)"
                value={feedbackTrade}
                onChange={(e) => setFeedbackTrade(e.target.value)}
                className="daemon-input text-xs"
              />
            </div>

            <input
              type="text"
              placeholder="Fix Delivered (e.g. Missed-call text back into ServiceTitan)"
              value={feedbackWorkflow}
              onChange={(e) => setFeedbackWorkflow(e.target.value)}
              className="daemon-input text-xs"
            />

            <textarea
              rows={3}
              required
              placeholder="What changed in your day-to-day workflow? (Neutral question asked to all customers post-handoff)"
              value={feedbackChange}
              onChange={(e) => setFeedbackChange(e.target.value)}
              className="daemon-input text-xs"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <label className="flex items-center gap-2 font-mono text-xs text-zinc-200 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={feedbackPermission}
                  onChange={(e) => setFeedbackPermission(e.target.checked)}
                  className="accent-white"
                />
                <span>I grant permission to publish this response verbatim.</span>
              </label>

              <button
                type="submit"
                className="btn-skeu shrink-0"
              >
                <span>{feedbackSubmitted ? 'Recorded in Log' : 'Submit Neutral Review'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {feedbackSubmitted && (
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Feedback recorded into transparent review ledger without sentiment filtering.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
