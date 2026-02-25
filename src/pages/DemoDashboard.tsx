import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MockRealtimeDashboard } from "@/components/demo/MockRealtimeDashboard";
import { MockReadinessGauge } from "@/components/demo/MockReadinessGauge";
import { MockAIAssessment } from "@/components/demo/MockAIAssessment";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Clock, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { InternalOnly } from "@/components/demo/InternalOnly";

type Scenario = "high" | "medium" | "low";

const kpis = [
  { label: "Active Styles", value: "24", delta: "↑ 3 this week", icon: TrendingUp, deltaColor: "text-emerald-600" },
  { label: "Pending TRFs", value: "12", delta: "3 overdue", icon: AlertTriangle, deltaColor: "text-amber-600" },
  { label: "Avg SLA Compliance", value: "94%", delta: "↑ 2% vs last month", icon: Clock, deltaColor: "text-emerald-600" },
  { label: "AI Confidence", value: "89%", delta: "Across all assessments", icon: Brain, deltaColor: "text-muted-foreground" },
];

const scenarioButtons: { value: Scenario; label: string; activeClass: string }[] = [
  { value: "high", label: "High (87%)", activeClass: "bg-emerald-600 text-white" },
  { value: "medium", label: "Medium (67%)", activeClass: "bg-amber-600 text-white" },
  { value: "low", label: "Low (42%)", activeClass: "bg-red-600 text-white" },
];

export default function DemoDashboard() {
  const [readinessScenario, setReadinessScenario] = useState<Scenario>("medium");

  return (
    <AppLayout title="Demo Dashboard" subtitle="AI Compliance Command Center">
      <div className="space-y-6">
        {/* Top Banner */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">AI-Powered Compliance Command Center</h1>
              <p className="text-blue-100 mt-1">
                Intelligent prioritization · Real-time updates · Transparent AI reasoning
              </p>
            </div>
            <InternalOnly>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-3 text-center shrink-0">
                <p className="text-xs text-blue-100">Demo Mode Active</p>
                <p className="text-2xl font-bold">3 High Priority</p>
              </div>
            </InternalOnly>
          </div>
        </div>

        {/* Readiness + KPI Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Readiness Gauge */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <MockReadinessGauge scenario={readinessScenario} />
              {/* Scenario Switcher — internal only */}
              <InternalOnly>
                <div className="pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Demo Scenario:</p>
                  <div className="flex gap-2">
                    {scenarioButtons.map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => setReadinessScenario(btn.value)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-md transition-colors font-medium",
                          readinessScenario === btn.value
                            ? btn.activeClass
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        )}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </InternalOnly>
            </CardContent>
          </Card>

          {/* Right: 2×2 KPI Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <kpi.icon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                  <p className={cn("text-xs mt-1", kpi.deltaColor)}>{kpi.delta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Assessment – TRF Preview Panel */}
        <MockAIAssessment />

        {/* Main Priority Feed */}
        <MockRealtimeDashboard />
      </div>
    </AppLayout>
  );
}
