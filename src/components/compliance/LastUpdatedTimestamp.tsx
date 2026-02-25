/**
 * Last Updated Timestamp [FIX 10]
 * Shows "Last updated: X ago" or "Data as of: date" on metrics.
 */

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LastUpdatedTimestampProps {
  timestamp?: Date;
  className?: string;
}

export function LastUpdatedTimestamp({ timestamp, className }: LastUpdatedTimestampProps) {
  const now = new Date();
  const ts = timestamp || new Date(now.getTime() - 2 * 60 * 60 * 1000); // default: 2 hours ago
  
  const diffMs = now.getTime() - ts.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  let label: string;
  if (diffMins < 1) label = 'Just now';
  else if (diffMins < 60) label = `${diffMins} min ago`;
  else if (diffHours < 24) label = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  else label = ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <span className={cn("text-[10px] text-muted-foreground flex items-center gap-1", className)}>
      <Clock className="w-2.5 h-2.5" />
      Last updated: {label}
    </span>
  );
}
