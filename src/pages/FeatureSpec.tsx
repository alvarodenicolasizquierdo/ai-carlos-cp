import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { canonicalFeatureSpec } from '@/data/canonicalFeatureSpec';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileJson, FileText, Sparkles, BarChart3, Layers, Brain, Trophy, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function FeatureSpec() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const spec = canonicalFeatureSpec.canonical_feature_spec;

  const downloadJSON = () => {
    setDownloading('json');
    const blob = new Blob([JSON.stringify(canonicalFeatureSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tht-ai-carlos_canonical_feature_spec.json';
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  };

  const downloadMarkdown = () => {
    setDownloading('md');
    const md = generateMarkdown(spec);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tht-ai-carlos_canonical_feature_spec.md';
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  };

  // Count features
  const totalFeatures = spec.product_modules.reduce((acc, m) => acc + m.features.length, 0);
  const aiFeatures = spec.ai_capabilities.capabilities.length;
  const implementedModules = spec.product_modules.filter(m => m.maturity === 'implemented').length;
  const demoReadyModules = spec.product_modules.filter(m => m.demo_readiness === 'demo_ready').length;
  const avgWow = Math.round(spec.product_modules.reduce((a, m) => a + (m.demo_wow_factor as number), 0) / spec.product_modules.length * 10) / 10;

  // Maturity breakdown
  const statusCounts = spec.product_modules.reduce((acc, m) => {
    m.features.forEach(f => {
      const s = f.implementation_status;
      acc[s] = (acc[s] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Canonical Feature Specification</h1>
          <p className="text-muted-foreground mt-1">
            Exhaustive extraction of every feature, capability, and UI element in CARLOS AI.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-4">
          <Button onClick={downloadJSON} size="lg" className="gap-2" disabled={downloading === 'json'}>
            <FileJson className="w-5 h-5" />
            {downloading === 'json' ? 'Downloading...' : 'Download JSON'}
          </Button>
          <Button onClick={downloadMarkdown} size="lg" variant="outline" className="gap-2" disabled={downloading === 'md'}>
            <FileText className="w-5 h-5" />
            {downloading === 'md' ? 'Downloading...' : 'Download Markdown'}
          </Button>
        </div>

        <Separator />

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Layers className="w-5 h-5" />} label="Total Features" value={totalFeatures} />
          <StatCard icon={<Brain className="w-5 h-5" />} label="AI Capabilities" value={aiFeatures} />
          <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Product Modules" value={spec.product_modules.length} />
          <StatCard icon={<Sparkles className="w-5 h-5" />} label="Routes" value={spec.meta.total_routes} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Implemented Modules" value={`${implementedModules}/${spec.product_modules.length}`} />
          <StatCard icon={<Trophy className="w-5 h-5 text-amber-500" />} label="Demo Ready" value={`${demoReadyModules}/${spec.product_modules.length}`} />
          <StatCard icon={<Sparkles className="w-5 h-5 text-purple-500" />} label="Avg Wow Factor" value={`${avgWow}/10`} />
          <StatCard icon={<Clock className="w-5 h-5 text-blue-500" />} label="Components" value={spec.meta.total_components} />
        </div>

        <Separator />

        {/* Maturity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Maturity</CardTitle>
            <CardDescription>Feature implementation status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  <Badge variant={status === 'complete' ? 'default' : 'secondary'}>{status}</Badge>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Module Breakdown</CardTitle>
            <CardDescription>All product modules with feature counts and demo readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spec.product_modules.map((mod) => (
                <div key={mod.module_name} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{mod.module_name}</span>
                      <Badge variant="outline" className="text-xs">{mod.route}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">{mod.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{mod.features.length} features</div>
                      <div className="text-xs text-muted-foreground">Wow: {mod.demo_wow_factor}/10</div>
                    </div>
                    <Badge variant={mod.demo_readiness === 'demo_ready' ? 'default' : 'secondary'}>
                      {mod.demo_readiness === 'demo_ready' ? '✅ Demo Ready' : '⚠️ Needs Polish'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Wow Moments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Top 10 Wow Moments
            </CardTitle>
            <CardDescription>Features that will make clients say "we need this"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spec.demo_highlights.top_10_wow_moments.map((wow) => (
                <div key={wow.rank} className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold shrink-0">
                    #{wow.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{wow.feature}</span>
                      <Badge variant="outline" className="text-xs">{wow.route}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{wow.talk_track}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="secondary" className="text-xs">vs Inspectorio: {wow.vs_inspectorio.substring(0, 60)}...</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Capabilities ({aiFeatures})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spec.ai_capabilities.capabilities.map((cap) => (
                <div key={cap.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <span className="font-medium">{cap.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({cap.type})</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={cap.implementation === 'rule_based' ? 'default' : 'secondary'}>{cap.implementation}</Badge>
                    {cap.reasoning_transparency && cap.reasoning_transparency !== 'no' && (
                      <Badge variant="outline" className="text-xs">🔍 Transparent</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitive Positioning */}
        <Card>
          <CardHeader>
            <CardTitle>vs Inspectorio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> CARLOS Strengths</h4>
                <ul className="space-y-1 text-sm">
                  {spec.comparison_positioning.vs_inspectorio.carlos_strengths.map((s, i) => (
                    <li key={i} className="text-muted-foreground">• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Inspectorio Strengths</h4>
                <ul className="space-y-1 text-sm">
                  {spec.comparison_positioning.vs_inspectorio.inspectorio_strengths.map((s, i) => (
                    <li key={i} className="text-muted-foreground">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Debt */}
        <Card>
          <CardHeader>
            <CardTitle>Production Readiness Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {spec.technical_debt_and_gaps.production_readiness_gaps.map((g, i) => (
                <li key={i} className="text-muted-foreground">• {g}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function generateMarkdown(spec: typeof canonicalFeatureSpec.canonical_feature_spec): string {
  let md = `# CARLOS AI — Canonical Feature Specification\n\n`;
  md += `**Extracted:** ${spec.meta.extraction_date}\n`;
  md += `**Vendor:** ${spec.meta.vendor}\n`;
  md += `**Platform:** ${spec.meta.platform}\n`;
  md += `**Status:** ${spec.meta.build_status}\n\n`;
  md += `---\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Total Screens | ${spec.meta.total_screens} |\n`;
  md += `| Total Components | ${spec.meta.total_components} |\n`;
  md += `| Total Routes | ${spec.meta.total_routes} |\n`;
  md += `| Tech Stack | ${spec.meta.tech_stack.join(', ')} |\n\n`;

  md += `## Design Principles\n\n`;
  spec.design_principles.core_pillars.forEach(p => { md += `- **${p}**\n`; });
  md += `\n${spec.design_principles.ai_philosophy}\n\n`;

  md += `---\n\n## Product Modules\n\n`;
  spec.product_modules.forEach(mod => {
    md += `### ${mod.module_name}\n`;
    md += `- **Route:** ${mod.route}\n`;
    md += `- **Category:** ${mod.category}\n`;
    md += `- **Maturity:** ${mod.maturity}\n`;
    md += `- **Demo Readiness:** ${mod.demo_readiness}\n`;
    md += `- **Wow Factor:** ${mod.demo_wow_factor}/10\n`;
    md += `- **Talk Track:** ${mod.demo_talk_track}\n\n`;
    md += `#### Features\n\n`;
    mod.features.forEach(f => {
      md += `- **${f.name}** (${f.implementation_status}) — AI: ${f.ai_presence}\n`;
      md += `  ${f.description}\n`;
    });
    md += `\n`;
  });

  md += `---\n\n## AI Capabilities\n\n`;
  md += `${spec.ai_capabilities.summary}\n\n`;
  spec.ai_capabilities.capabilities.forEach(c => {
    md += `### ${c.name}\n`;
    md += `- **Type:** ${c.type}\n`;
    md += `- **Implementation:** ${c.implementation}\n`;
    md += `- **Where:** ${c.where_used.join(', ')}\n`;
    md += `- **Reasoning Visible:** ${c.reasoning_transparency}\n`;
    md += `- ${c.description}\n\n`;
  });

  md += `---\n\n## Top 10 Wow Moments\n\n`;
  spec.demo_highlights.top_10_wow_moments.forEach(w => {
    md += `**#${w.rank}: ${w.feature}** (${w.route})\n`;
    md += `> ${w.talk_track}\n\n`;
  });

  md += `---\n\n## Competitive Positioning\n\n`;
  md += `### CARLOS Strengths vs Inspectorio\n`;
  spec.comparison_positioning.vs_inspectorio.carlos_strengths.forEach(s => { md += `- ✅ ${s}\n`; });
  md += `\n### Inspectorio Strengths\n`;
  spec.comparison_positioning.vs_inspectorio.inspectorio_strengths.forEach(s => { md += `- ⚠️ ${s}\n`; });
  md += `\n**Key Differentiator:** ${spec.comparison_positioning.vs_inspectorio.key_differentiator}\n`;

  return md;
}
