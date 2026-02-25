import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Scenario = "high" | "medium" | "low";

interface ScenarioData {
  score: number;
  trend: "improving" | "stable" | "declining";
  confidence: "high" | "medium" | "low";
  gaps: { attribute: string; severity: "critical" | "major" | "minor"; action: string }[];
}

const scenarios: Record<Scenario, ScenarioData> = {
  high: {
    score: 87,
    trend: "improving",
    confidence: "high",
    gaps: [
      { attribute: "Chemical test report pending", severity: "minor", action: "Upload CoA for Lot #2891" },
    ],
  },
  medium: {
    score: 67,
    trend: "stable",
    confidence: "medium",
    gaps: [
      { attribute: "Missing fiber composition data", severity: "major", action: "Request lab analysis" },
      { attribute: "Supplier cert expired", severity: "major", action: "Renew OEKO-TEX cert" },
      { attribute: "Care label not finalized", severity: "minor", action: "Complete care symbols" },
    ],
  },
  low: {
    score: 42,
    trend: "declining",
    confidence: "low",
    gaps: [
      { attribute: "No traceability data", severity: "critical", action: "Map full supply chain" },
      { attribute: "Missing sustainability metrics", severity: "critical", action: "Conduct LCA assessment" },
      { attribute: "Supplier audit overdue", severity: "major", action: "Schedule factory audit" },
      { attribute: "Chemical compliance unknown", severity: "major", action: "Run REACH screening" },
    ],
  },
};

interface MockReadinessGaugeProps {
  scenario?: Scenario;
}

export function MockReadinessGauge({ scenario = "medium" }: MockReadinessGaugeProps) {
  const data = scenarios[scenario];

  const scoreColor = data.score >= 80 ? "text-emerald-600" : data.score >= 60 ? "text-amber-600" : "text-red-600";
  const gradientFrom = data.score >= 80 ? "#10b981" : data.score >= 60 ? "#f59e0b" : "#ef4444";
  const gradientTo = data.score >= 80 ? "#34d399" : data.score >= 60 ? "#fbbf24" : "#f87171";
  const TrendIcon = data.trend === "improving" ? TrendingUp : data.trend === "declining" ? TrendingDown : Minus;
  const trendColor = data.trend === "improving" ? "text-emerald-600" : data.trend === "declining" ? "text-red-500" : "text-muted-foreground";

  const circumference = 2 * Math.PI * 40;

  return (
    <div className="space-y-4">
      {/* Gauge */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
            <motion.circle
              cx="50" cy="50" r="40" fill="none"
              stroke={`url(#demoGradient-${scenario})`}
              strokeWidth="8" strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${(data.score / 100) * circumference} ${circumference}` }}
              transition={{ duration: 1, ease: "easeOut" }}
              key={scenario}
            />
            <defs>
              <linearGradient id={`demoGradient-${scenario}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientFrom} />
                <stop offset="100%" stopColor={gradientTo} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={data.score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn("text-xl font-bold", scoreColor)}
            >
              {data.score}%
            </motion.span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground">DPP Readiness</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn("text-xs flex items-center gap-1 capitalize", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              {data.trend}
            </span>
            <span className="text-xs text-muted-foreground">· {data.confidence} confidence</span>
          </div>
        </div>
      </div>

      {/* To Improve Score */}
      {data.gaps.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            To Improve Score
          </h5>
          {data.gaps.map((gap, i) => (
            <motion.div
              key={`${scenario}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-2.5 rounded-lg border-l-4 border bg-card text-xs",
                gap.severity === "critical" ? "border-l-red-500" :
                gap.severity === "major" ? "border-l-amber-500" : "border-l-blue-500"
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className={cn(
                  "w-3.5 h-3.5 shrink-0 mt-0.5",
                  gap.severity === "critical" ? "text-red-500" :
                  gap.severity === "major" ? "text-amber-500" : "text-blue-500"
                )} />
                <div>
                  <p className="font-medium text-foreground">{gap.attribute}</p>
                  <p className="text-muted-foreground mt-0.5">{gap.action}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
