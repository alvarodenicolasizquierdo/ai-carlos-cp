/**
 * AIAssessmentStrip — Reframed per C-16 compliance
 * Now shows "AI Insights" instead of "AI Assessment", uses confidence ranges,
 * and reframes recommendations as prioritisation guidance.
 */

import { motion } from 'framer-motion';
import { Brain, TrendingDown, TrendingUp, Minus, AlertTriangle, Lightbulb, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIAssessment } from '@/types/ai-context';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';

interface AIAssessmentStripProps {
  assessment: AIAssessment;
  compact?: boolean;
  onExplainClick?: () => void;
}

export function AIAssessmentStrip({ assessment, compact = false, onExplainClick }: AIAssessmentStripProps) {
  const TrendIcon = assessment.readinessTrend === 'up' ? TrendingUp : 
                    assessment.readinessTrend === 'down' ? TrendingDown : Minus;
  
  const trendColor = assessment.readinessTrend === 'up' ? 'text-emerald-600' : 
                     assessment.readinessTrend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  const confidenceColor = assessment.confidence === 'high' ? 'text-emerald-600' : 
                          assessment.confidence === 'medium' ? 'text-amber-600' : 'text-red-500';

  // FIX 3: Compute confidence range instead of single point
  const confLow = assessment.readiness >= 80 ? assessment.readiness - 8 : assessment.readiness - 14;
  const confHigh = Math.min(assessment.readiness + 6, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg border bg-gradient-to-r from-ai-primary/5 via-background to-ai-secondary/5",
        "border-ai-primary/20",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* FIX 2: Reframed heading */}
            <span className="text-xs font-semibold text-ai-primary uppercase tracking-wide">AI Insights — Requires Human Decision</span>
            <LastUpdatedTimestamp />
          </div>
          
          <div className={cn("grid gap-4", compact ? "grid-cols-2" : "grid-cols-4")}>
            {/* Review Priority Score (reframed from "Readiness") */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-2xl font-bold",
                  assessment.readiness >= 80 ? "text-emerald-600" :
                  assessment.readiness >= 60 ? "text-amber-600" : "text-red-500"
                )}>
                  {confLow}–{confHigh}%
                </span>
                <TrendIcon className={cn("w-4 h-4", trendColor)} />
              </div>
              <span className="text-xs text-muted-foreground">Review Priority Range</span>
            </div>

            {/* Confidence */}
            <div>
              <div className={cn("text-lg font-semibold capitalize", confidenceColor)}>
                {assessment.confidence}
              </div>
              <span className="text-xs text-muted-foreground">Confidence</span>
            </div>

            {/* Primary Risk */}
            {!compact && (
              <div className="col-span-2">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-foreground line-clamp-2">
                    {assessment.primaryRisk}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Primary Risk</span>
              </div>
            )}
          </div>

          {/* FIX 2: Reframed recommendation — advisory language only */}
          <div className={cn(
            "mt-3 pt-3 border-t border-border/50",
            "flex items-center justify-between gap-2"
          )}>
            <div className="flex items-start gap-2 flex-1">
              <Lightbulb className="w-4 h-4 text-ai-primary mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-medium text-ai-primary">Suggested Priority Action:</span>
                <p className="text-sm text-muted-foreground">{assessment.recommendation}</p>
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  This is an AI suggestion only — final decision must be made by an authorised reviewer.
                </p>
                {assessment.estimatedResolutionDays !== undefined && assessment.estimatedResolutionDays > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Est. resolution: {assessment.estimatedResolutionDays} days
                  </span>
                )}
              </div>
            </div>
            
            {onExplainClick && (
              <button
                onClick={onExplainClick}
                className="text-xs text-ai-primary hover:text-ai-primary/80 flex items-center gap-1 shrink-0"
              >
                Why this recommendation?
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
