/**
 * Role-adaptive right column content for the dashboard.
 * Each role gets different widgets in the sidebar.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Shield, FlaskConical, Users, Settings, 
  CheckCircle2, Clock, AlertTriangle, FileText, Activity 
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { DPPEvidenceChecklist } from '@/components/compliance/DPPEvidenceChecklist';
import { cn } from '@/lib/utils';

function LabCapacityWidget() {
  const slots = [
    { name: 'Chemical Testing', used: 14, total: 20, priority: 'high' },
    { name: 'Physical Testing', used: 8, total: 15, priority: 'normal' },
    { name: 'Colorfastness', used: 5, total: 10, priority: 'normal' },
    { name: 'Flammability', used: 3, total: 5, priority: 'low' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">Lab Capacity</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">Current bench utilization</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {slots.map((slot) => (
          <div key={slot.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{slot.name}</span>
              <span className="text-muted-foreground">{slot.used}/{slot.total}</span>
            </div>
            <Progress 
              value={(slot.used / slot.total) * 100} 
              className={cn(
                "h-2",
                slot.used / slot.total > 0.8 && "[&>div]:bg-red-500",
                slot.used / slot.total > 0.5 && slot.used / slot.total <= 0.8 && "[&>div]:bg-amber-500"
              )} 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SupplierComplianceWidget() {
  const items = [
    { label: 'Certificate of Analysis', status: 'submitted', date: 'Feb 20' },
    { label: 'REACH Declaration', status: 'approved', date: 'Feb 18' },
    { label: 'Factory Audit Report', status: 'overdue', date: 'Feb 10' },
    { label: 'Social Compliance Cert', status: 'pending', date: 'Mar 01' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">Your Documents</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">Submission & compliance status</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/30 transition-colors">
            {item.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {item.status === 'submitted' && <Clock className="w-4 h-4 text-blue-500 shrink-0" />}
            {item.status === 'overdue' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
            {item.status === 'pending' && <Clock className="w-4 h-4 text-amber-500 shrink-0" />}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-foreground">{item.label}</span>
            </div>
            <Badge variant="outline" className={cn(
              "text-[10px] px-1.5 py-0 shrink-0",
              item.status === 'approved' && "bg-emerald-50 text-emerald-700 border-emerald-200",
              item.status === 'submitted' && "bg-blue-50 text-blue-700 border-blue-200",
              item.status === 'overdue' && "bg-red-50 text-red-700 border-red-200",
              item.status === 'pending' && "bg-amber-50 text-amber-700 border-amber-200",
            )}>
              {item.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ManagerRiskWidget() {
  const risks = [
    { area: 'Supplier Concentration', level: 'high', detail: '60% volume from 2 suppliers' },
    { area: 'Regulatory Exposure', level: 'medium', detail: 'REACH update affects 23 SKUs' },
    { area: 'Quality Trend', level: 'low', detail: 'Pass rates improving +2%' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">Risk Summary</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">Key operational risks</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {risks.map((risk) => (
          <div key={risk.area} className={cn(
            "p-3 rounded-lg border",
            risk.level === 'high' && "border-red-200 bg-red-50/50",
            risk.level === 'medium' && "border-amber-200 bg-amber-50/30",
            risk.level === 'low' && "border-emerald-200 bg-emerald-50/30",
          )}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{risk.area}</span>
              <Badge variant="outline" className={cn(
                "text-[10px] px-1.5 py-0",
                risk.level === 'high' && "bg-red-50 text-red-700 border-red-200",
                risk.level === 'medium' && "bg-amber-50 text-amber-700 border-amber-200",
                risk.level === 'low' && "bg-emerald-50 text-emerald-700 border-emerald-200",
              )}>
                {risk.level}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">{risk.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AdminSystemWidget() {
  const metrics = [
    { label: 'Database Size', value: '2.4 GB', status: 'ok' },
    { label: 'Edge Functions', value: '12 active', status: 'ok' },
    { label: 'Auth Sessions', value: '47 active', status: 'ok' },
    { label: 'Storage Used', value: '8.1 / 10 GB', status: 'warning' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">System Health</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">Platform infrastructure status</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/30 transition-colors">
            <span className="text-xs font-medium text-foreground">{m.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">{m.value}</span>
              <div className={cn(
                "w-2 h-2 rounded-full",
                m.status === 'ok' && "bg-emerald-500",
                m.status === 'warning' && "bg-amber-500",
              )} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RoleRightColumn() {
  const { currentUser } = useUser();

  switch (currentUser.role) {
    case 'lab_technician':
      return (
        <>
          <LabCapacityWidget />
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                { time: '09:00', task: 'Chemical batch #CB-412 — REACH panel' },
                { time: '11:00', task: 'Colorfastness retest — TRF-2026-001238' },
                { time: '14:00', task: 'Physical testing — SS26 denim samples' },
                { time: '16:00', task: 'Equipment calibration — pH meter' },
              ].map((s) => (
                <div key={s.time} className="flex gap-3 py-1.5 px-2 rounded hover:bg-muted/30">
                  <span className="text-muted-foreground font-mono w-12 shrink-0">{s.time}</span>
                  <span className="text-foreground">{s.task}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      );

    case 'supplier':
      return (
        <>
          <SupplierComplianceWidget />
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Your Contacts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2 rounded bg-muted/30">
                <p className="font-medium text-foreground">Sarah Chen</p>
                <p className="text-muted-foreground">QA Manager — RetailCo</p>
              </div>
              <div className="p-2 rounded bg-muted/30">
                <p className="font-medium text-foreground">Dr. Amm Martinez</p>
                <p className="text-muted-foreground">Lab Lead — THT</p>
              </div>
            </CardContent>
          </Card>
        </>
      );

    case 'manager':
      return (
        <>
          <ManagerRiskWidget />
          <Card data-tour="readiness-gauge">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">DPP Evidence Status</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Verified evidence checklist — no AI estimation
              </p>
            </CardHeader>
            <CardContent>
              <DPPEvidenceChecklist />
            </CardContent>
          </Card>
        </>
      );

    case 'admin':
      return (
        <>
          <AdminSystemWidget />
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">User Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                { user: 'Sarah Chen', action: 'Approved TRF-2026-001234', time: '2m ago' },
                { user: 'Dr. Amm Martinez', action: 'Started chemical testing batch', time: '15m ago' },
                { user: 'Marcus Wong', action: 'Uploaded certificate', time: '1h ago' },
                { user: 'Mark Richardson', action: 'Viewed compliance report', time: '2h ago' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{a.user}</p>
                    <p className="text-muted-foreground">{a.action}</p>
                  </div>
                  <span className="text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      );

    // buyer (default)
    default:
      return (
        <Card data-tour="readiness-gauge">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">DPP Evidence Status</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Verified evidence checklist — no AI estimation
            </p>
          </CardHeader>
          <CardContent>
            <DPPEvidenceChecklist />
          </CardContent>
        </Card>
      );
  }
}
