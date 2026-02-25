/**
 * Year 1 Mode Banner [FIX 9]
 * Persistent banner indicating AI is advisory-only during Year 1.
 */

import { Brain, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Year1ModeBannerProps {
  className?: string;
  variant?: 'banner' | 'badge';
}

export function Year1ModeBanner({ className, variant = 'banner' }: Year1ModeBannerProps) {
  if (variant === 'badge') {
    return (
      <Badge variant="outline" className={cn(
        "gap-1.5 bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium",
        className
      )}>
        <Brain className="w-3 h-3" />
        Year 1 Mode — Human Approval Required
      </Badge>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-2 flex items-center gap-2",
      className
    )}>
      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <Info className="w-3.5 h-3.5 text-blue-600" />
      </div>
      <p className="text-xs text-blue-700 flex-1">
        <span className="font-semibold">Year 1 Mode</span> — AI Recommendations Active | All approval decisions require human review.
        AI provides prioritisation and pattern analysis only.
      </p>
    </div>
  );
}
