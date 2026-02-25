/**
 * AI Disclaimer Banner [FIX 2]
 * Global banner for AI panels indicating evaluation mode.
 */

import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIDisclaimerBannerProps {
  className?: string;
}

export function AIDisclaimerBanner({ className }: AIDisclaimerBannerProps) {
  return (
    <div className={cn(
      "rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 flex items-start gap-2",
      className
    )}>
      <FlaskConical className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <p className="text-xs text-amber-700">
        <span className="font-semibold">🔬 AI features are in evaluation mode.</span>{' '}
        All decisions are made by authorised human reviewers. AI provides prioritisation and pattern analysis only.
      </p>
    </div>
  );
}
