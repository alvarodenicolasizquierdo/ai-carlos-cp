/**
 * StripeOverviewTab - Stripe Reporting Overview-style layout
 * Main area: sub-tabs → 2×2 metric grid → breakdown charts → AI narrative
 * Right sidebar: contextual "More reports" links per sub-tab
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { StripeMetricCard, MetricCardData } from './StripeMetricCard';
import { AINarrativeCard } from './AINarrativeCard';
import { DateRangeToolbar } from './DateRangeToolbar';
import { RiskSummaryDashboard } from '@/components/reports/RiskSummaryDashboard';
import { ComplianceHealthView } from '@/components/reports/ComplianceHealthView';
import { PipelineFlowDashboard } from '@/components/reports/PipelineFlowDashboard';
import { ReportOverview } from '@/components/reports/ReportOverview';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
} from 'recharts';
import { ArrowRight, BarChart3, FileText, Code2, Shield, Activity } from 'lucide-react';

const spark = (vals: number[]) => vals.map(v => ({ v }));

/* ---------- breakdown chart data per tab ---------- */
const breakdownData: Record<string, { monthly: { name: string; value: number; yoy: number }[]; summary: string }> = {
  risk: {
    monthly: [
      { name: 'Jul', value: 5, yoy: -10 }, { name: 'Aug', value: 4, yoy: -15 },
      { name: 'Sep', value: 4, yoy: -12 }, { name: 'Oct', value: 3, yoy: -20 },
      { name: 'Nov', value: 3, yoy: -18 }, { name: 'Dec', value: 2, yoy: -25 },
    ],
    summary: 'High-risk factory count for the last 6 months is trending down. Current count is 2.',
  },
  compliance: {
    monthly: [
      { name: 'Jul', value: 84, yoy: 5 }, { name: 'Aug', value: 86, yoy: 6 },
      { name: 'Sep', value: 85, yoy: 4 }, { name: 'Oct', value: 88, yoy: 7 },
      { name: 'Nov', value: 90, yoy: 8 }, { name: 'Dec', value: 92, yoy: 10 },
    ],
    summary: 'Overall compliance score for the current quarter is 92%, up 4% from last quarter.',
  },
  pipeline: {
    monthly: [
      { name: 'Jul', value: 88, yoy: 12 }, { name: 'Aug', value: 92, yoy: 14 },
      { name: 'Sep', value: 95, yoy: 10 }, { name: 'Oct', value: 99, yoy: 15 },
      { name: 'Nov', value: 102, yoy: 18 }, { name: 'Dec', value: 107, yoy: 20 },
    ],
    summary: 'Pipeline volume for the current month is 107 items, exceeding target by 12%.',
  },
  dpp: {
    monthly: [
      { name: 'Jul', value: 18, yoy: 0 }, { name: 'Aug', value: 20, yoy: 0 },
      { name: 'Sep', value: 24, yoy: 0 }, { name: 'Oct', value: 28, yoy: 0 },
      { name: 'Nov', value: 30, yoy: 0 }, { name: 'Dec', value: 34, yoy: 0 },
    ],
    summary: 'DPP coverage has reached 34%. At current pace, 100% coverage projected by Q3 2026.',
  },
};

/* ---------- sidebar links per tab ---------- */
const sidebarConfig: Record<string, { heading: string; description: string; links: { icon: React.ComponentType<{ className?: string }>; label: string; badge?: string }[] }> = {
  risk: {
    heading: 'Tracking risk trends',
    description: 'See a record of your risk metrics for the last 12 months.',
    links: [
      { icon: BarChart3, label: 'Risk Summary Dashboard' },
      { icon: Shield, label: 'Supplier Risk Matrix' },
      { icon: Code2, label: 'Custom risk reports' },
      { icon: ArrowRight, label: 'Explore all reports' },
    ],
  },
  compliance: {
    heading: 'Compliance tracking',
    description: 'Monitor compliance health across all suppliers and regions.',
    links: [
      { icon: BarChart3, label: 'Compliance Health' },
      { icon: Activity, label: 'Audit trail analytics' },
      { icon: Code2, label: 'Custom compliance reports' },
      { icon: ArrowRight, label: 'Explore all reports' },
    ],
  },
  pipeline: {
    heading: 'Pipeline analytics',
    description: 'Track throughput, cycle times, and bottlenecks.',
    links: [
      { icon: BarChart3, label: 'Pipeline Flow Dashboard' },
      { icon: FileText, label: 'Throughput analytics' },
      { icon: Code2, label: 'Custom pipeline reports' },
      { icon: ArrowRight, label: 'Explore all reports' },
    ],
  },
  dpp: {
    heading: 'DPP readiness',
    description: 'Digital Product Passport coverage and data completeness.',
    links: [
      { icon: BarChart3, label: 'DPP Coverage Report' },
      { icon: FileText, label: 'Data completeness audit' },
      { icon: Code2, label: 'Custom DPP reports' },
      { icon: ArrowRight, label: 'Explore all reports' },
    ],
  },
};

const overviewSections: Record<string, {
  metrics: MetricCardData[];
  whatChanged: string[];
  whyItMatters: string[];
}> = {
  risk: {
    metrics: [
      { label: 'High-Risk Factories', value: '2', change: '-1 vs last month', trend: 'down', sparkline: spark([5, 4, 4, 3, 3, 2]), detail: 'Sunrise Textiles improved after corrective actions' },
      { label: 'Avg Risk Score', value: '38', change: '-5 pts MoM', trend: 'down', sparkline: spark([52, 48, 45, 42, 40, 38]) },
      { label: 'Critical Issues', value: '17', change: '+2 new this week', trend: 'up', sparkline: spark([12, 13, 14, 15, 15, 17]) },
      { label: 'Pass Rate', value: '86%', change: '+2.3% MoM', trend: 'up', sparkline: spark([80, 81, 82, 84, 84, 86]) },
    ],
    whatChanged: [
      'Sunrise Textiles risk score dropped from 85 to 78 after Feb audit.',
      '2 new critical issues flagged in Cambodia region.',
      'Overall pass rate improved for 3rd consecutive month.',
    ],
    whyItMatters: [
      'High-risk count is at a 6-month low — consider reallocating audit capacity.',
      'Cambodia issues may affect Q2 delivery timelines if unresolved.',
      'Pass-rate uptrend supports expanding self-approval scope.',
    ],
  },
  compliance: {
    metrics: [
      { label: 'Overall Score', value: '92%', change: '+4% this quarter', trend: 'up', sparkline: spark([84, 86, 85, 88, 90, 92]) },
      { label: 'Compliant Suppliers', value: '42', change: '+3 this month', trend: 'up', sparkline: spark([35, 36, 38, 39, 40, 42]) },
      { label: 'Non-Compliant', value: '3', change: '-1 resolved', trend: 'down', sparkline: spark([6, 5, 5, 4, 4, 3]) },
      { label: 'Pending Reviews', value: '8', change: '2 overdue', trend: 'up', sparkline: spark([5, 6, 6, 7, 7, 8]) },
    ],
    whatChanged: [
      'Chemical Safety score rose to 94% after new lab protocols.',
      'Environmental compliance jumped 5% with updated RSL testing.',
      'Product Safety dipped 2% — 2 failed flammability tests.',
    ],
    whyItMatters: [
      '3 remaining non-compliant suppliers risk shipment holds.',
      '8 pending reviews include 2 overdue > 14 days — escalate.',
      'Environmental gains unlock green-certification eligibility for 12 styles.',
    ],
  },
  pipeline: {
    metrics: [
      { label: 'In Pipeline', value: '107', change: '+8 this week', trend: 'up', sparkline: spark([88, 92, 95, 99, 102, 107]) },
      { label: 'Total Value', value: '$29.6K', change: '+$3.2K', trend: 'up', sparkline: spark([22, 23, 24, 26, 27, 29.6]) },
      { label: 'Avg Cycle Time', value: '3.2d', change: '-0.3d', trend: 'down', sparkline: spark([4.1, 3.9, 3.7, 3.5, 3.4, 3.2]) },
      { label: 'Completed (MTD)', value: '156', change: '+12% vs target', trend: 'up', sparkline: spark([120, 128, 135, 142, 149, 156]) },
    ],
    whatChanged: [
      'Testing stage backlog grew 25% — potential bottleneck.',
      'Cycle time improved due to parallel testing rollout.',
      'Completion rate exceeding target for 4th consecutive week.',
    ],
    whyItMatters: [
      'Bottleneck in "Testing In Progress" may delay 12 shipments due by Feb 28.',
      'Parallel testing saved est. $4.2K in expedite fees this month.',
      'Strong throughput supports increasing seasonal volume without added headcount.',
    ],
  },
  dpp: {
    metrics: [
      { label: 'DPP Coverage', value: '34%', change: '+8% this quarter', trend: 'up', sparkline: spark([18, 20, 24, 28, 30, 34]) },
      { label: 'Styles with DPP', value: '89', change: '+14 new', trend: 'up', sparkline: spark([55, 60, 68, 72, 80, 89]) },
      { label: 'Data Completeness', value: '71%', change: '+5% MoM', trend: 'up', sparkline: spark([58, 60, 63, 65, 68, 71]) },
      { label: 'Missing Fields', value: '312', change: '-45 resolved', trend: 'down', sparkline: spark([420, 400, 385, 365, 340, 312]) },
    ],
    whatChanged: [
      '14 new styles received full DPP data packages this month.',
      'Material composition field completion rate crossed 90%.',
      'Care labelling still the weakest field at 52% completion.',
    ],
    whyItMatters: [
      'EU DPP regulation effective Jan 2027 — current pace reaches 100% by Q3 2026.',
      'Care labelling gaps block full compliance for 47 styles.',
      'Completing top-selling SKUs first covers 60% of revenue with 34% of effort.',
    ],
  },
};

const tabLabels: Record<string, string> = { risk: 'Risk', compliance: 'Compliance', pipeline: 'Pipeline', dpp: 'DPP' };

export function StripeOverviewTab() {
  const [subTab, setSubTab] = useState('risk');

  return (
    <div className="space-y-6">
      {/* Stripe-style sub-tabs */}
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="bg-transparent p-0 h-auto gap-0 border-b rounded-none w-full justify-start">
          {Object.entries(tabLabels).map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-1 text-sm font-medium"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Date range + granularity toolbar */}
        <DateRangeToolbar />

        {Object.keys(overviewSections).map(key => (
          <TabsContent key={key} value={key} className="mt-6">
            {/* Main + Sidebar layout (Stripe Reporting Overview) */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main content */}
              <div className="flex-1 min-w-0 space-y-6">
                {/* 2×2 Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {overviewSections[key].metrics.slice(0, 2).map(m => (
                    <StripeMetricCard key={m.label} data={m} />
                  ))}
                </div>

                {/* Breakdown chart — Stripe "by month" pattern */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">
                    {overviewSections[key].metrics[0].label} breakdown
                  </h3>
                  <p className="text-sm text-muted-foreground">{breakdownData[key].summary}</p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold">{overviewSections[key].metrics[0].label} by month</h4>
                        <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                          <BarChart3 className="w-3.5 h-3.5" /> Expand
                        </button>
                      </div>
                      <Card>
                        <CardContent className="p-4">
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={breakdownData[key].monthly}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                              <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                              <Tooltip
                                contentStyle={{
                                  background: 'hsl(var(--popover))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                  color: 'hsl(var(--popover-foreground))',
                                }}
                              />
                              <Legend />
                              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={overviewSections[key].metrics[0].label} />
                              <Line type="monotone" dataKey="yoy" stroke="hsl(var(--chart-2))" name="YoY (%)" strokeWidth={2} dot={false} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Second row metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {overviewSections[key].metrics.slice(2).map(m => (
                    <StripeMetricCard key={m.label} data={m} />
                  ))}
                </div>

                {/* AI Narrative Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AINarrativeCard title="What changed" bullets={overviewSections[key].whatChanged} />
                  <AINarrativeCard title="Why it matters" bullets={overviewSections[key].whyItMatters} />
                </div>

                {/* Existing detailed view */}
                {key === 'risk' && <RiskSummaryDashboard />}
                {key === 'compliance' && <ComplianceHealthView />}
                {key === 'pipeline' && <PipelineFlowDashboard />}
                {key === 'dpp' && <ReportOverview />}
              </div>

              {/* Right sidebar — Stripe "More reports" pattern */}
              <aside className="w-full lg:w-72 shrink-0 space-y-6">
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm">{sidebarConfig[key].heading}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{sidebarConfig[key].description}</p>
                    </div>

                    {/* Quick link: "Balance summary" equivalent */}
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{tabLabels[key]} summary</p>
                        <p className="text-xs text-muted-foreground">Dec 2025</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 space-y-1">
                    <h4 className="font-semibold text-sm mb-3">More reports</h4>
                    {sidebarConfig[key].links.map((link, i) => {
                      const Icon = link.icon;
                      const isLast = i === sidebarConfig[key].links.length - 1;
                      return (
                        <button
                          key={link.label}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm hover:bg-muted/50 transition-colors text-left ${isLast ? 'text-primary font-medium' : ''}`}
                        >
                          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">{link.badge}</span>
                          )}
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
