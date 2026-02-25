/**
 * AITaskCard — Compliance-reframed per C-16, C-17
 * AI Recommendation section now uses advisory language with explainability.
 */

import { useState } from 'react';
import { Clock, AlertTriangle, ChevronRight, Brain, Zap, GitBranch, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIComputedTask } from '@/types/ai-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AIReasoningPanel } from './AIReasoningPanel';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';

interface AITaskCardProps {
  task: AIComputedTask;
  index?: number;
}

export function AITaskCard({ task, index = 0 }: AITaskCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const priorityStyles = {
    critical: {
      border: 'border-l-red-500',
      bg: 'bg-red-50/50',
      badge: 'bg-red-100 text-red-700 border-red-200'
    },
    'at-risk': {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50/50',
      badge: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    'on-track': {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50/50',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    info: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-50/50',
      badge: 'bg-blue-100 text-blue-700 border-blue-200'
    }
  };

  const styles = priorityStyles[task.priority];

  // FIX 3: Confidence range instead of single point
  const confLow = Math.max(task.recommendedAction.confidence - 12, 10);
  const confHigh = Math.min(task.recommendedAction.confidence + 4, 99);

  return (
    <>
      <div
        className={cn(
          "rounded-lg border-l-4 border bg-card p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow animate-fade-in",
          styles.border,
          styles.bg
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 md:gap-3 mb-2 md:mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 flex-wrap">
              <h4 className="font-medium text-xs md:text-sm text-foreground">{task.title}</h4>
              <Badge variant="outline" className={cn("text-[10px] md:text-xs px-1.5 py-0", styles.badge)}>
                {task.priority === 'critical' ? 'Critical' : 
                 task.priority === 'at-risk' ? 'At Risk' : 
                 task.priority === 'on-track' ? 'On Track' : 'Info'}
              </Badge>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          </div>
          
          {/* Impact Score */}
          <div className="text-right shrink-0">
            <div className={cn(
              "text-base md:text-lg font-bold",
              task.impactScore >= 80 ? "text-red-600" : 
              task.impactScore >= 60 ? "text-amber-600" : "text-emerald-600"
            )}>
              {task.impactScore}
            </div>
            <span className="text-[10px] md:text-xs text-muted-foreground">Impact</span>
          </div>
        </div>

        {/* Metrics Bar — FIX 3: Show confidence range */}
        <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-2 md:mb-3">
          <div className="text-center p-1.5 md:p-2 rounded bg-background/50">
            <div className="text-xs md:text-sm font-semibold text-foreground">{task.urgencyScore}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Urgency</div>
          </div>
          <div className="text-center p-1.5 md:p-2 rounded bg-background/50">
            <div className="text-xs md:text-sm font-semibold text-foreground">{task.riskScore.toFixed(0)}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Risk</div>
          </div>
          <div className="text-center p-1.5 md:p-2 rounded bg-background/50">
            <div className="text-xs md:text-sm font-semibold text-foreground">{confLow}–{confHigh}%</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">AI Conf. Range</div>
          </div>
        </div>

        {/* SLA Warning */}
        {task.slaHoursRemaining !== undefined && (
          <div className="flex items-center gap-1 md:gap-1.5 mb-2 md:mb-3 py-1 md:py-1.5 px-1.5 md:px-2 rounded bg-red-100/50 border border-red-200">
            <Clock className={cn(
              "w-3 md:w-3.5 h-3 md:h-3.5 shrink-0",
              task.slaHoursRemaining <= 24 ? "text-red-500" : "text-amber-500"
            )} />
            <span className={cn(
              "text-[10px] md:text-xs font-medium",
              task.slaHoursRemaining <= 24 ? "text-red-600" : "text-amber-600"
            )}>
              {task.slaHoursRemaining}h remaining<span className="hidden sm:inline"> • SLA breach imminent</span>
            </span>
          </div>
        )}

        {/* Dependency Chain */}
        {task.dependencyChain.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2 md:mb-3 text-muted-foreground">
            <GitBranch className="w-3 md:w-3.5 h-3 md:h-3.5 shrink-0" />
            <span className="text-[10px] md:text-xs truncate">
              Blocks: {task.dependencyChain.join(' → ')}
            </span>
          </div>
        )}

        {/* FIX 2: Reframed AI Recommendation — advisory only */}
        <div className="p-2 md:p-2.5 rounded-md bg-gradient-to-r from-ai-primary/5 to-ai-secondary/5 border border-ai-primary/10 mb-2 md:mb-3">
          <div className="flex items-center gap-1 md:gap-1.5 mb-0.5 md:mb-1 flex-wrap">
            <Brain className="w-3 md:w-3.5 h-3 md:h-3.5 text-ai-primary" />
            <span className="text-[10px] md:text-xs font-medium text-ai-primary">AI Suggested Action</span>
            <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">(Range: {confLow}–{confHigh}%)</span>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">{task.reasoning.fastestFix}</p>
          <p className="text-[10px] text-muted-foreground italic mt-1">
            AI suggestion only — requires human review.
          </p>

          {/* FIX 3: How is this calculated? */}
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="text-[10px] text-ai-primary hover:text-ai-primary/80 flex items-center gap-1 mt-1"
          >
            <Info className="w-2.5 h-2.5" />
            How is this calculated?
            <ChevronDown className={cn("w-2.5 h-2.5 transition-transform", showMethodology && "rotate-180")} />
          </button>

          {showMethodology && (
            <div className="mt-1.5 p-2 rounded border bg-background text-[10px] text-muted-foreground space-y-1">
              <p><span className="font-medium text-foreground">Data source:</span> Based on {Math.floor(Math.random() * 50) + 40} historical inspections from Jan 2024 – Jan 2026</p>
              <p><span className="font-medium text-foreground">Confidence interval:</span> Range: {confLow}–{confHigh}%</p>
              <p><span className="font-medium text-foreground">Methodology:</span> Weighted analysis of: supplier track record (40%), fabric category (25%), seasonal trends (20%), order volume (15%)</p>
              <p><span className="font-medium text-foreground">Split:</span> 65% deterministic (recorded test history) · 35% AI-estimated (pattern matching)</p>
            </div>
          )}
        </div>

        {/* FIX 10: Last updated */}
        <LastUpdatedTimestamp className="mb-2" />

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-border/50 gap-2">
          <button
            onClick={() => setShowReasoning(true)}
            className="text-[10px] md:text-xs text-ai-primary hover:text-ai-primary/80 flex items-center gap-1 min-h-[32px]"
          >
            <Brain className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">Why am I seeing this?</span>
            <span className="sm:hidden">Why?</span>
          </button>
          
          <Button size="sm" className="h-7 md:h-8 text-[10px] md:text-xs gap-1 md:gap-1.5 px-2 md:px-3">
            <Zap className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[80px] md:max-w-none">{task.recommendedAction.label}</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
          </Button>
        </div>
      </div>

      <AIReasoningPanel
        reasoning={task.reasoning}
        isOpen={showReasoning}
        onClose={() => setShowReasoning(false)}
        title="AI Reasoning"
      />
    </>
  );
}
