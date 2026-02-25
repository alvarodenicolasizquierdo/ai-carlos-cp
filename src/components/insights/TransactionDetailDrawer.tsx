/**
 * TransactionDetailDrawer - Stripe-style transaction detail with
 * Timeline, Breakdown, Details sidebar, Events & Logs
 */

import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2, Clock, AlertCircle, XCircle, Plus,
  ArrowLeft, MoreHorizontal, Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/data/mockReports';

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  completed: { icon: CheckCircle2, color: 'text-emerald-600', label: 'Succeeded' },
  pending: { icon: Clock, color: 'text-amber-600', label: 'Pending' },
  in_progress: { icon: AlertCircle, color: 'text-blue-600', label: 'In Progress' },
  failed: { icon: XCircle, color: 'text-destructive', label: 'Failed' },
};

const statusBadgeColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  failed: 'bg-destructive/10 text-destructive',
};

export function TransactionDetailDrawer({ transaction, open, onOpenChange }: TransactionDetailDrawerProps) {
  if (!transaction) return null;

  const sc = statusConfig[transaction.status] || statusConfig.pending;
  const StatusIcon = sc.icon;

  // Mock timeline events
  const timeline = [
    { icon: sc.icon, color: sc.color, label: `${sc.label}`, time: transaction.date },
    { icon: Clock, color: 'text-muted-foreground', label: 'Processing started', time: transaction.date },
    { icon: Plus, color: 'text-muted-foreground', label: 'Request created', time: transaction.date },
  ];

  // Mock breakdown
  const breakdown = [
    { label: 'Base amount', value: `$${transaction.amount.toLocaleString()}` },
    { label: 'Processing fees', value: `-$${(transaction.amount * 0.029).toFixed(2)}` },
    { label: 'Net amount', value: `$${(transaction.amount * 0.971).toFixed(2)}`, bold: true },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 border-b">
          <SheetHeader className="space-y-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <span>{transaction.type.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SheetTitle className="text-2xl font-bold">
                  ${transaction.amount.toLocaleString()} {transaction.currency}
                </SheetTitle>
                <Badge className={cn('text-xs', statusBadgeColors[transaction.status])}>
                  {sc.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Refund</Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Supplier: {transaction.supplier}
            </p>
          </SheetHeader>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main content */}
          <div className="flex-1 p-6 space-y-6 min-w-0">
            {/* Timeline */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Timeline</h3>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Plus className="w-3 h-3" /> Add note
                </Button>
              </div>
              <div className="space-y-0">
                {timeline.map((event, i) => {
                  const Icon = event.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 relative">
                      {i < timeline.length - 1 && (
                        <div className="absolute left-[11px] top-6 w-px h-6 bg-border" />
                      )}
                      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0', i === 0 ? 'bg-muted' : '')}>
                        <Icon className={cn('w-4 h-4', event.color)} />
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Breakdown */}
            <div>
              <h3 className="font-semibold mb-4">Breakdown</h3>
              <div className="space-y-3">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className={item.bold ? 'font-medium' : 'text-muted-foreground'}>
                      {item.label}
                    </span>
                    <span className={item.bold ? 'font-semibold' : ''}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Events and logs */}
            <div>
              <h3 className="font-semibold mb-4">Events and logs</h3>
              <div className="space-y-3">
                <div className="text-xs uppercase font-semibold text-muted-foreground">Latest Activity</div>
                <p className="text-sm">Status: <span className="font-medium">{sc.label.toLowerCase()}</span></p>

                <div className="text-xs uppercase font-semibold text-muted-foreground mt-4">All Activity</div>
                <div className="space-y-0">
                  {[
                    { msg: `The ${transaction.type.replace('_', ' ')} ${transaction.id} has ${sc.label.toLowerCase()}`, time: transaction.date },
                    { msg: `${transaction.reference} was processed for $${transaction.amount.toLocaleString()}`, time: transaction.date },
                    { msg: `A new ${transaction.type.replace('_', ' ')} ${transaction.id} was created`, time: transaction.date },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 relative">
                      {i < 2 && <div className="absolute left-[5px] top-4 w-px h-8 bg-border" />}
                      <div className="w-3 h-3 rounded-full bg-border mt-1 shrink-0" />
                      <Card className="flex-1 mb-3">
                        <CardContent className="p-3">
                          <p className="text-sm">{log.msg}</p>
                          <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Details */}
          <aside className="w-full lg:w-56 border-t lg:border-t-0 lg:border-l p-6 space-y-5 shrink-0">
            <h3 className="font-semibold">Details</h3>

            <div className="space-y-4">
              <DetailRow label="Transaction ID">
                <button className="font-mono text-xs text-primary flex items-center gap-1 hover:underline">
                  {transaction.id} <Copy className="w-3 h-3" />
                </button>
              </DetailRow>

              <DetailRow label="Reference">
                <span className="font-mono text-xs">{transaction.reference}</span>
              </DetailRow>

              <DetailRow label="Type">
                <span className="text-sm capitalize">{transaction.type.replace('_', ' ')}</span>
              </DetailRow>

              <DetailRow label="Supplier">
                <span className="text-sm">{transaction.supplier}</span>
              </DetailRow>

              <DetailRow label="Amount">
                <span className="text-sm font-medium">${transaction.amount.toLocaleString()} {transaction.currency}</span>
              </DetailRow>

              <DetailRow label="Last updated">
                <span className="text-sm">{transaction.date}</span>
              </DetailRow>

              <DetailRow label="Risk evaluation">
                <div className="flex items-center gap-1 text-sm">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </span>
                  Normal
                </div>
              </DetailRow>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Metadata</h3>
              <div className="border border-dashed rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground">No metadata</p>
              </div>
            </div>
          </aside>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
      {children}
    </div>
  );
}
