/**
 * Methodology Tooltip [FIX 5]
 * Info icon/tooltip showing calculation method, data period, sample size.
 */

import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MethodologyTooltipProps {
  method: string;
  dataPeriod: string;
  sampleSize: number;
  deterministicPct: number;
  aiEstimatedPct: number;
}

export function MethodologyTooltip({
  method,
  dataPeriod,
  sampleSize,
  deterministicPct,
  aiEstimatedPct,
}: MethodologyTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted transition-colors">
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-3 space-y-1.5">
        <p className="text-xs font-semibold">How is this calculated?</p>
        <div className="space-y-1 text-[10px] text-muted-foreground">
          <p><span className="font-medium text-foreground">Method:</span> {method}</p>
          <p><span className="font-medium text-foreground">Data period:</span> {dataPeriod}</p>
          <p><span className="font-medium text-foreground">Sample size:</span> {sampleSize} data points</p>
          <p>
            <span className="font-medium text-foreground">Split:</span>{' '}
            {deterministicPct}% deterministic (recorded history) · {aiEstimatedPct}% AI-estimated (pattern matching)
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground italic pt-1 border-t">
          Risk scores inform resource allocation — not test outcome predictions.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
