import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';

interface KPI {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

const kpis: KPI[] = [
  { label: 'TRFs In Progress', value: '24', change: 8, changeLabel: 'vs last week' },
  { label: 'Avg Turnaround', value: '4.2d', change: -12, changeLabel: 'improved' },
  { label: 'Pass Rate', value: '94%', change: 2, changeLabel: 'vs last month' },
  { label: 'Pending Approvals', value: '7', change: 0, changeLabel: 'no change' },
];

export function KPISummaryWidget() {
  return (
    <div className="space-y-1">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="p-3 md:p-4 rounded-lg bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 animate-fade-in"
        >
          <p className="text-[10px] md:text-xs text-muted-foreground font-medium mb-0.5 md:mb-1 truncate">{kpi.label}</p>
          <p className="text-lg md:text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
          <div className="flex items-center gap-1 mt-0.5 md:mt-1">
            {kpi.change > 0 ? (
              <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
            ) : kpi.change < 0 ? (
              <TrendingDown className="w-3 h-3 text-red-600 shrink-0" />
            ) : (
              <Minus className="w-3 h-3 text-muted-foreground shrink-0" />
            )}
            <span className={cn(
              "text-[10px] md:text-xs truncate",
              kpi.change > 0 && "text-emerald-600",
              kpi.change < 0 && "text-red-600",
              kpi.change === 0 && "text-muted-foreground"
            )}>
              {kpi.change !== 0 && (kpi.change > 0 ? '+' : '')}{kpi.change}%
              <span className="hidden sm:inline"> {kpi.changeLabel}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
    <LastUpdatedTimestamp className="px-1" />
    </div>
  );
}
