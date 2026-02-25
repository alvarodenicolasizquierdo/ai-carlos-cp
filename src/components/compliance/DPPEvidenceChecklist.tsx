/**
 * DPP Evidence Checklist [FIX 4]
 * Replaces percentage gauge with verified evidence items.
 */

import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LastUpdatedTimestamp } from './LastUpdatedTimestamp';

interface EvidenceItem {
  label: string;
  status: 'verified' | 'partial' | 'pending' | 'not_started';
  detail?: string;
}

const defaultEvidenceItems: EvidenceItem[] = [
  { label: 'Material composition data', status: 'verified' },
  { label: 'Supply chain traceability', status: 'partial', detail: '2 of 5 tiers mapped' },
  { label: 'Care instruction compliance', status: 'verified' },
  { label: 'Chemical compliance (REACH)', status: 'pending', detail: 'Pending lab results' },
  { label: 'Sustainability metrics (LCA)', status: 'not_started' },
  { label: 'Country of origin declaration', status: 'verified' },
  { label: 'Manufacturing process data', status: 'partial', detail: '3 of 4 stages documented' },
];

interface DPPEvidenceChecklistProps {
  items?: EvidenceItem[];
  className?: string;
}

export function DPPEvidenceChecklist({ items = defaultEvidenceItems, className }: DPPEvidenceChecklistProps) {
  const verified = items.filter(i => i.status === 'verified').length;
  const total = items.length;
  const deterministicPct = Math.round((verified / total) * 100);

  const getIcon = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'pending':
        return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'not_started':
        return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />;
    }
  };

  const getStatusLabel = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'partial': return 'Partial';
      case 'pending': return 'Pending';
      case 'not_started': return 'Not Started';
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-foreground">DPP Evidence Status</h4>
        <LastUpdatedTimestamp />
      </div>

      {/* Summary */}
      <div className="p-2.5 rounded-lg bg-muted/50 border">
        <p className="text-xs text-foreground font-medium">
          {verified} of {total} evidence items verified ({deterministicPct}% deterministic)
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Remaining items require lab confirmation or supplier documentation.
        </p>
      </div>

      {/* Evidence Items */}
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-muted/30 transition-colors"
          >
            {getIcon(item.status)}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-foreground">{item.label}</span>
              {item.detail && (
                <span className="text-[10px] text-muted-foreground ml-1">— {item.detail}</span>
              )}
            </div>
            <Badge variant="outline" className={cn(
              "text-[10px] px-1.5 py-0 shrink-0",
              item.status === 'verified' && "bg-emerald-50 text-emerald-700 border-emerald-200",
              item.status === 'partial' && "bg-amber-50 text-amber-700 border-amber-200",
              item.status === 'pending' && "bg-red-50 text-red-700 border-red-200",
              item.status === 'not_started' && "bg-muted text-muted-foreground",
            )}>
              {getStatusLabel(item.status)}
            </Badge>
          </div>
        ))}
      </div>

      {/* Methodology note */}
      <div className="flex items-start gap-1.5 pt-1">
        <Info className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[10px] text-muted-foreground">
          Evidence verification is deterministic — based on uploaded documents and confirmed lab results.
          No AI estimation is used for evidence status.
        </p>
      </div>
    </div>
  );
}
