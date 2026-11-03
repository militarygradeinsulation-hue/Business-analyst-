import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  Cpu,
  Database,
  Lock,
  Layers,
} from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  category: 'fsm' | 'crm' | 'phone' | 'web';
  supported: boolean;
}

const TOOLS_CATALOG: ToolItem[] = [
  { id: 'jobber', name: 'Jobber', category: 'fsm', supported: true },
  { id: 'servicetitan', name: 'ServiceTitan', category: 'fsm', supported: true },
  { id: 'housecall', name: 'Housecall Pro', category: 'fsm', supported: true },
  { id: 'hubspot', name: 'HubSpot CRM', category: 'crm', supported: true },
  { id: 'twilio', name: 'Twilio / SMS', category: 'phone', supported: true },
  { id: 'callrail', name: 'CallRail Tracking', category: 'phone', supported: true },
  { id: 'wordpress', name: 'WordPress / Gravity Forms', category: 'web', supported: true },
  { id: 'webflow', name: 'Webflow Forms', category: 'web', supported: true },
  { id: 'zapier', name: 'Zapier / Make', category: 'web', supported: true },
  { id: 'custom_legacy', name: 'Custom Legacy In-House DB', category: 'crm', supported: false },
];

const ISSUE_TYPES = [
  {
    id: 'missed_call',
    title: 'Missed Call Auto-Text Back & Dispatch Notification',
    baseComplexity: 'single',
    description: 'Instant SMS response to missed calls within 30 seconds; alerts on-call tech.',
  },
  {
    id: 'form_lead_sync',
    title: 'Website Form to Instant CRM Ticket Dispatch',
    baseComplexity: 'single',
    description: 'Bypasses slow email inboxes; creates verified lead in Jobber/ServiceTitan immediately.',
  },
  {
    id: 'estimate_followup',
    title: 'Unbooked Estimate Automated Follow-Up Cadence',
    baseComplexity: 'connected',
    description: '3-stage SMS/email check-in at Day 2, Day 5, and Day 10 if customer hasn’t signed.',
  },
  {
    id: 'multi_channel',
    title: 'Omnichannel Inbound Router (Web + Phone + Google Msg)',
    baseComplexity: 'bundle',
    description: 'Aggregates all inquiry channels into a single deduplicated queue with auto-acknowledgments.',
  },
];

export const DeterministicScopeEngine: React.FC = () => {
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'servicetitan',
    'twilio',
    'wordpress',
  ]);
  const [selectedIssue, setSelectedIssue] = useState<string>('form_lead_sync');
  const [workflowCount, setWorkflowCount] = useState<number>(1);
  const [locationsCount, setLocationsCount] = useState<number>(1);
  const [needsDataCleanup, setNeedsDataCleanup] = useState<boolean>(false);
  const [volumeTier, setVolumeTier] = useState<'low' | 'mid' | 'high'>('low');
  const [includeMonitoring, setIncludeMonitoring] = useState<boolean>(false);

  // Deterministic evaluation logic
  const evaluation = useMemo(() => {
    const hasUnsupportedTool = selectedTools.some((tId) => {
      const tool = TOOLS_CATALOG.find((t) => t.id === tId);
      return tool && !tool.supported;
    });

    if (hasUnsupportedTool) {
      return {
        quoteState: 'outside_scope' as const,
        packageName: 'Outside Standard Scope',
        price: null,
        statusLabel: 'Asynchronous Technical Review Required',
        description:
          'Your selection includes a custom or legacy database that is outside our instant fixed-price catalog. We will review your API documentation asynchronously—no sales pressure or phone call required.',
        estimatedDelivery: '3–5 days review',
      };
    }

    if (selectedTools.length < 2) {
      return {
        quoteState: 'access_needed' as const,
        packageName: 'Access & Tool Selection Needed',
        price: null,
        statusLabel: 'Minimum 2 Tools Required',
        description:
          'Handoff fixes bridge at least two distinct tools (e.g. your website form + your field service CRM). Select the tools you want to connect.',
        estimatedDelivery: 'Instant once selected',
      };
    }

    // Determine package based on workflows, tools, and complexity
    let basePrice = 2499;
    let pkg = 'Single System Bridge';
    let deliveryDays = '3–5 business days';

    if (workflowCount === 1 && selectedTools.length <= 2 && !needsDataCleanup) {
      basePrice = 2499;
      pkg = 'Single System Bridge ($2,499 one-time)';
    } else if (
      (workflowCount === 1 && selectedTools.length <= 3) ||
      (workflowCount === 2 && !needsDataCleanup)
    ) {
      basePrice = 4999;
      pkg = 'Connected Operations Architecture ($4,999 one-time)';
      deliveryDays = '5–7 business days';
    } else {
      basePrice = 9999;
      pkg = 'Co-CEO Custom Operations OS ($9,999 one-time)';
      deliveryDays = '7–10 business days';
    }

    // Location / account adjustment
    if (locationsCount > 1) {
      basePrice += (locationsCount - 1) * 500;
    }

    if (needsDataCleanup) {
      basePrice += 500;
    }

    // Third-party messaging estimate (disclosed separately)
    const thirdPartyMessagingEst =
      volumeTier === 'low'
        ? '$10–$25/mo (direct to Twilio/carrier)'
        : volumeTier === 'mid'
        ? '$25–$65/mo (direct to Twilio/carrier)'
        : '$65–$140/mo (direct to Twilio/carrier)';

    return {
      quoteState: 'ready_to_fix' as const,
      packageName: pkg,
      price: basePrice,
      statusLabel: 'Ready to Fix · Deterministic Quote',
      description:
        'All selected tools are in our pre-validated integration catalog. We can deliver this fixed-scope handoff with full acceptance testing and our delivery guarantee.',
      estimatedDelivery: deliveryDays,
      thirdPartyMessagingEst,
      monitoringMonthly: includeMonitoring ? 499 : 0,
    };
  }, [
    selectedTools,
    selectedIssue,
    workflowCount,
    locationsCount,
    needsDataCleanup,
    volumeTier,
    includeMonitoring,
  ]);

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <section id="quote-builder" className="py-20 border-t border-white/10 bg-[#070707]">
      <div className="wrap space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="badge">
              <i></i>
              <span>DETERMINISTIC SCOPE ENGINE // AUTONOMOUS PRICING</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white">
              Autonomous Quoting. No Speculation. No Sales Call.
            </h2>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
              We calculate scope using a deterministic formula based on your confirmed handoff issues, supported tools, and workflow volume. You see an exact fixed price before you commit.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#101010] font-mono text-xs text-zinc-200 space-y-1">
            <div className="text-white font-bold uppercase tracking-wider">
              Deterministic Scope Formula:
            </div>
            <div>Confirmed Issue + Tool Combination + Workflow Count + Data Cleanup</div>
            <div className="text-white font-semibold">= Eligible Package + Disclosed Operating Fees</div>
          </div>
        </div>

        {/* Interactive Scope Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Controls (8 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Tool Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-wider text-white flex items-center gap-2 font-bold">
                  <Database className="w-3.5 h-3.5" />
                  <span>1. Select Tools in Your Current Stack:</span>
                </label>
                <span className="font-mono text-xs text-zinc-300 font-semibold">
                  {selectedTools.length} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TOOLS_CATALOG.map((tool) => {
                  const isChecked = selectedTools.includes(tool.id);
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className={`p-3 rounded-lg border text-left transition-all font-mono text-xs flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-white bg-white/10 text-white font-bold ring-1 ring-white/20'
                          : 'border-white/10 bg-[#0b0b0b] text-zinc-200 hover:border-white/25 hover:text-white font-medium'
                      }`}
                    >
                      <span className="truncate mr-1">{tool.name}</span>
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-white/40 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-zinc-300 font-mono font-medium">
                Supported tools carry instant fixed pricing. Custom in-house or unsupported databases are routed to an asynchronous technical scope review.
              </p>
            </div>

            {/* 2. Issue Type */}
            <div className="space-y-3">
              <label className="font-mono text-xs uppercase tracking-wider text-white flex items-center gap-2 font-bold">
                <Sliders className="w-3.5 h-3.5" />
                <span>2. Select Primary Handoff Gap to Fix:</span>
              </label>
              <div className="space-y-2">
                {ISSUE_TYPES.map((issue) => {
                  const isSelected = selectedIssue === issue.id;
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => setSelectedIssue(issue.id)}
                      className={`w-full p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-white bg-[#131313] text-white shadow-md'
                          : 'border-white/10 bg-[#0a0a0a] text-zinc-200 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          {issue.title}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-200 font-semibold">
                          {issue.baseComplexity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 mt-1 leading-relaxed">
                        {issue.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Operational Variables (Workflows, Locations, Data Cleanup) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0b0b0b] space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-zinc-200 font-semibold block">
                  Workflows: {workflowCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={workflowCount}
                  onChange={(e) => setWorkflowCount(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-300 font-bold">
                  <span>1 (Single)</span>
                  <span>2 (Connected)</span>
                  <span>3+ (Bundle)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0b0b0b] space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-zinc-200 font-semibold block">
                  Locations: {locationsCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={locationsCount}
                  onChange={(e) => setLocationsCount(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-300 font-bold">
                  <span>1 branch</span>
                  <span>2 branches</span>
                  <span>4 branches</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0b0b0b] space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-zinc-200 font-semibold block">
                  Monthly Inquiries:
                </label>
                <select
                  value={volumeTier}
                  onChange={(e) => setVolumeTier(e.target.value as any)}
                  className="w-full bg-[#141414] border border-white/15 rounded p-1.5 text-xs text-white font-mono cursor-pointer"
                >
                  <option value="low">Under 500 inquiries/mo</option>
                  <option value="mid">500 – 2,500 inquiries/mo</option>
                  <option value="high">2,500+ inquiries/mo</option>
                </select>
                <span className="text-[10px] font-mono text-zinc-300 font-medium block">
                  Direct carrier SMS usage
                </span>
              </div>
            </div>

            {/* Checkbox options: Data cleanup & ongoing monitor */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#090909] cursor-pointer hover:border-white/20">
                <input
                  type="checkbox"
                  checked={needsDataCleanup}
                  onChange={(e) => setNeedsDataCleanup(e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="text-white font-semibold">Include Custom Field Normalization &amp; CRM Tag Deduplication (+$300)</span>
                  <p className="text-zinc-300 mt-0.5">Clean up messy custom drop-down fields and lead tags before wiring automated sync.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#090909] cursor-pointer hover:border-white/20">
                <input
                  type="checkbox"
                  checked={includeMonitoring}
                  onChange={(e) => setIncludeMonitoring(e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="text-white font-semibold">Add Optional Continuous Health Monitoring (+$79/month)</span>
                  <p className="text-zinc-300 mt-0.5">Automated ping tests, API token expiration alerts, and failure notifications. Can be canceled anytime.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Right Instant Quote Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 p-6 sm:p-7 rounded-2xl border border-white/20 bg-gradient-to-b from-[#111111] to-[#0a0a0a] shadow-2xl space-y-6">
              {/* Quote State Header */}
              <div className="space-y-2 border-b border-white/10 pb-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                    GENERATED SCOPE STATE
                  </span>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded font-bold ${
                      evaluation.quoteState === 'ready_to_fix'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : evaluation.quoteState === 'access_needed'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {evaluation.quoteState.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                  {evaluation.packageName}
                </h3>
                <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                  {evaluation.description}
                </p>
              </div>

              {/* Price Breakdown */}
              {evaluation.price !== null ? (
                <div className="space-y-3 font-mono">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-zinc-300 uppercase font-semibold">Implementation Fee:</span>
                    <span className="text-3xl font-display uppercase tracking-tight text-white font-bold">
                      ${evaluation.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-zinc-200">
                    <div className="flex justify-between">
                      <span className="text-zinc-300 font-medium">Delivery Turnaround:</span>
                      <span className="text-white font-bold">{evaluation.estimatedDelivery}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-300 font-medium">Direct Carrier/SMS Fees:</span>
                      <span className="text-white font-bold">{evaluation.thirdPartyMessagingEst}</span>
                    </div>

                    {includeMonitoring && (
                      <div className="flex justify-between pt-1 border-t border-white/10 text-white font-bold">
                        <span>Ongoing Monitoring:</span>
                        <span>$79/month</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2 text-xs">
                  <div className="font-bold text-white uppercase tracking-wider">
                    Next Step:
                  </div>
                  <p className="text-zinc-200 leading-relaxed">
                    {evaluation.quoteState === 'access_needed'
                      ? 'Select at least two tools to establish the handoff boundary between inquiry and dispatch.'
                      : 'Submit your custom stack details for asynchronous API validation. We do not require a live sales meeting to review your architecture.'}
                  </p>
                </div>
              )}

              {/* Strict Scope Guardrails */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#090909] space-y-2 text-[11.5px] text-zinc-200 font-mono leading-relaxed">
                <div className="text-white uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scope Guardrails</span>
                </div>
                <ul className="space-y-1">
                  <li>• Never charge for implementation based only on a suspected issue.</li>
                  <li>• Explicit customer approval required before modifying production systems.</li>
                  <li>• Backups, test records, and instant rollback procedures enforced.</li>
                  <li>• Scope changes pause work for approval; no hidden fees.</li>
                </ul>
              </div>

              {/* CTA Button */}
              <div>
                {evaluation.quoteState === 'ready_to_fix' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('pricing');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-skeu w-full text-center justify-center py-3.5 font-bold"
                  >
                    <span>Proceed With Guaranteed Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('scanner');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-skeu w-full text-center justify-center py-3.5"
                  >
                    <span>Start Free Inquiry Scan First</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
