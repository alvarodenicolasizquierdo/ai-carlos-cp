import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types';

interface KPI {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

const kpisByRole: Record<UserRole, KPI[]> = {
  buyer: [
    { label: 'TRFs In Progress', value: '24', change: 8, changeLabel: 'vs last week' },
    { label: 'Avg Turnaround', value: '4.2d', change: -12, changeLabel: 'improved' },
    { label: 'Pass Rate', value: '94%', change: 2, changeLabel: 'vs last month' },
    { label: 'Pending Approvals', value: '7', change: 0, changeLabel: 'no change' },
  ],
  supplier: [
    { label: 'Open Requests', value: '5', change: -1, changeLabel: 'vs last week' },
    { label: 'Documents Due', value: '3', change: 2, changeLabel: 'new this week' },
    { label: 'Compliance Score', value: '88%', change: 3, changeLabel: 'improved' },
    { label: 'Avg Response Time', value: '1.8d', change: -15, changeLabel: 'faster' },
  ],
  lab_technician: [
    { label: 'Samples in Queue', value: '18', change: 12, changeLabel: 'vs yesterday' },
    { label: 'Tests Completed Today', value: '7', change: 40, changeLabel: 'vs avg' },
    { label: 'Avg Test Duration', value: '3.1h', change: -8, changeLabel: 'improved' },
    { label: 'Critical Priority', value: '4', change: 1, changeLabel: 'new today' },
  ],
  manager: [
    { label: 'Overall Compliance', value: '91%', change: 2, changeLabel: 'vs last quarter' },
    { label: 'Active Suppliers', value: '12', change: 0, changeLabel: 'no change' },
    { label: 'Revenue at Risk', value: '$48K', change: -25, changeLabel: 'reduced' },
    { label: 'On-Time Delivery', value: '96%', change: 4, changeLabel: 'improved' },
  ],
  admin: [
    { label: 'Active Users', value: '47', change: 5, changeLabel: 'vs last month' },
    { label: 'System Uptime', value: '99.9%', change: 0, changeLabel: 'stable' },
    { label: 'Pending Invites', value: '3', change: -2, changeLabel: 'vs last week' },
    { label: 'API Calls (24h)', value: '12.4K', change: 18, changeLabel: 'vs avg' },
  ],
};

export function KPISummaryWidget() {
  const { currentUser } = useUser();
  const kpis = kpisByRole[currentUser.role] || kpisByRole.buyer;

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
