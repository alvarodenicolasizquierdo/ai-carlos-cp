import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAssessmentStrip } from "@/components/ai/AIAssessmentStrip";
import { AIReasoningPanel } from "@/components/ai/AIReasoningPanel";
import { FileText, ExternalLink, FlaskConical, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { InternalOnly } from "@/components/demo/InternalOnly";
import { toast } from "sonner";
import type { AIAssessment, AIReasoning } from "@/types/ai-context";

export type DemoScenario = "approve" | "escalate" | "reject";

interface MockAIAssessmentProps {
  trfId?: string;
  demoScenario?: DemoScenario;
}

const scenarioAssessments: Record<DemoScenario, Omit<AIAssessment, "objectType" | "objectId">> = {
  approve: {
    readiness: 92,
    readinessTrend: "up",
    confidence: "high",
    primaryRisk: "No critical issues detected — all tests within acceptable limits",
    recommendation: "Approve TRF and release product batch for shipment.",
    estimatedResolutionDays: 0,
  },
  escalate: {
    readiness: 55,
    readinessTrend: "stable",
    confidence: "medium",
    primaryRisk: "Color fastness borderline (Grade 3.5 vs Grade 4 minimum) — needs senior review",
    recommendation: "Escalate to QA lead for judgment call. Consider conditional approval with re-test on next batch.",
    estimatedResolutionDays: 3,
  },
  reject: {
    readiness: 38,
    readinessTrend: "down",
    confidence: "high",
    primaryRisk: "Formaldehyde levels exceed EU REACH limit (75 mg/kg vs 30 mg/kg threshold)",
    recommendation: "Request re-test from accredited lab with updated sample batch. Quarantine current stock.",
    estimatedResolutionDays: 5,
  },
};

const scenarioReasonings: Record<DemoScenario, AIReasoning> = {
  approve: {
    whyProblem: "No issues detected. All chemical safety and physical performance tests returned results within acceptable limits for the target market (EU, US).",
    evidence: [
      "Formaldehyde content measured at 12 mg/kg — well below the 30 mg/kg EU REACH threshold.",
      "All color fastness grades ≥ 4, meeting outerwear requirements.",
      "Tensile strength 285 N exceeds the 200 N minimum.",
      "Supplier has a clean 12-month compliance record with zero non-conformances.",
    ],
    consequenceIfIgnored: "N/A — this TRF is ready for approval. Delaying approval may push the shipment window and add unnecessary lead time.",
    fastestFix: "Approve immediately and release batch for shipment. No corrective action required.",
  },
  escalate: {
    whyProblem: "Color fastness result (Grade 3.5) is borderline — technically below the Grade 4 minimum for outerwear, but within margin of measurement uncertainty.",
    evidence: [
      "Color fastness to washing returned Grade 3.5 (limit ≥ 4). The 0.5 gap is within typical lab variability.",
      "All other tests (formaldehyde, pH, tensile strength) passed with comfortable margins.",
      "This supplier had a similar borderline result 6 months ago on a different product line — it was conditionally approved.",
      "The product is intended for a premium retail customer with strict QA standards.",
    ],
    consequenceIfIgnored: "If approved without review, the batch may face customer rejection or return claims. If rejected outright, it delays shipment by 2–3 weeks for re-testing.",
    fastestFix: "Escalate to QA lead for a judgment call. Recommend conditional approval with mandatory re-test on the next production batch.",
  },
  reject: {
    whyProblem: "Formaldehyde content (75 mg/kg) is 2.5× the EU REACH limit of 30 mg/kg, making this batch non-compliant for sale in the EU market.",
    evidence: [
      "Formaldehyde content measured at 75 mg/kg — exceeds the 30 mg/kg limit by 150%.",
      "Color fastness to washing returned Grade 3, failing the ≥ Grade 4 outerwear requirement.",
      "This supplier (Golden Textiles) had a similar formaldehyde exceedance 8 months ago on a different fabric.",
      "The product is destined for the EU market where REACH compliance is mandatory.",
    ],
    consequenceIfIgnored: "Shipping non-compliant goods risks regulatory fines, product recalls, brand damage, and potential market access restrictions.",
    fastestFix: "Reject TRF, quarantine current stock, and request a re-test from an accredited lab using a new sample from the same batch. Estimated resolution: 5 business days.",
  },
};

const testResults = [
  { test: "Formaldehyde Content", result: "75 mg/kg", limit: "≤ 30 mg/kg", status: "fail" as const },
  { test: "pH Value", result: "5.8", limit: "4.0–7.5", status: "pass" as const },
  { test: "Color Fastness (Wash)", result: "Grade 3", limit: "≥ Grade 4", status: "fail" as const },
  { test: "Tensile Strength", result: "285 N", limit: "≥ 200 N", status: "pass" as const },
  { test: "Fiber Composition", result: "Pending", limit: "—", status: "pending" as const },
];

export function MockAIAssessment({ trfId = "TRF-1003", demoScenario }: MockAIAssessmentProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  const activeScenario = demoScenario || "reject";
  const scenarioData = scenarioAssessments[activeScenario];
  const reasoning = scenarioReasonings[activeScenario];

  const trfAssessment: AIAssessment = {
    objectType: "trf",
    objectId: trfId,
    ...scenarioData,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">{trfId} Preview</CardTitle>
            <Badge variant="destructive" className="text-[10px]">Non-Compliant</Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5"
            onClick={() => toast.info(`Demo: Would navigate to full ${trfId} detail page`)}
          >
            Open Full TRF
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Chemical safety test — Eco Fleece Hoodie AW26 · Supplier: Golden Textiles
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Assessment Strip */}
        <AIAssessmentStrip
          assessment={trfAssessment}
          onExplainClick={() => setShowExplanation((v) => !v)}
        />

        {/* View AI Reasoning button — internal only */}
        <InternalOnly>
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 border-ai-primary/30 text-ai-primary hover:bg-ai-primary/10"
            onClick={() => setShowReasoning(true)}
          >
            <Brain className="w-3.5 h-3.5" />
            View AI Reasoning
          </Button>
        </InternalOnly>

        {/* AI Explanation (toggle) — internal only */}
        <InternalOnly>
          {showExplanation && (
            <div className="rounded-lg border border-ai-primary/20 bg-ai-primary/5 p-3 text-sm space-y-2">
              <p className="font-medium text-ai-primary">Why this assessment?</p>
              <ul className="list-disc pl-4 text-muted-foreground space-y-1 text-xs">
                <li>Formaldehyde result (75 mg/kg) is 2.5× above the EU REACH limit of 30 mg/kg.</li>
                <li>Color fastness (Grade 3) fails the minimum Grade 4 requirement for outerwear.</li>
                <li>Historical data shows this supplier had a similar formaldehyde issue 8 months ago.</li>
                <li>Confidence is <strong>high</strong> because both lab results and regulation thresholds are well-defined.</li>
              </ul>
            </div>
          )}
        </InternalOnly>

        {/* Mini Test Results Table */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Test Results Summary</span>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-xs text-muted-foreground">
                  <th className="text-left px-3 py-2 font-medium">Test</th>
                  <th className="text-left px-3 py-2 font-medium">Result</th>
                  <th className="text-left px-3 py-2 font-medium">Limit</th>
                  <th className="text-center px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {testResults.map((row) => (
                  <tr key={row.test} className={cn(row.status === "fail" && "bg-red-50/50")}>
                    <td className="px-3 py-2 font-medium text-foreground">{row.test}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.result}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.limit}</td>
                    <td className="px-3 py-2 text-center">
                      {row.status === "fail" && (
                        <Badge variant="destructive" className="text-[10px] gap-1">
                          <AlertTriangle className="w-3 h-3" /> Fail
                        </Badge>
                      )}
                      {row.status === "pass" && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Pass
                        </Badge>
                      )}
                      {row.status === "pending" && (
                        <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>

      {/* AI Reasoning Panel */}
      <AIReasoningPanel
        reasoning={reasoning}
        isOpen={showReasoning}
        onClose={() => setShowReasoning(false)}
        title={`AI Reasoning — ${trfId}`}
      />
    </Card>
  );
}
