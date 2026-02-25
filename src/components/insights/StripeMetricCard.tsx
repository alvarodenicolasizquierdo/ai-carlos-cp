/**
 * StripeMetricCard - A Stripe-style metric tile with sparkline trend
 */

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

export interface MetricCardData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  sparkline: { v: number }[];
  detail?: string;
}

export function StripeMetricCard({ data }: { data: MetricCardData }) {
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const trendColor = data.trend === 'up' ? 'text-emerald-600' : data.trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  const chartColor = data.trend === 'up' ? 'hsl(var(--chart-3))' : data.trend === 'down' ? 'hsl(var(--chart-5))' : 'hsl(var(--chart-1))';

  return (
    <Card className="hover-lift">
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground mb-1">{data.label}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold tracking-tight">{data.value}</p>
            <div className={cn('flex items-center gap-1 mt-1', trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{data.change}</span>
            </div>
          </div>
          <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sparkline}>
                <defs>
                  <linearGradient id={`spark-${data.label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={chartColor}
                  fill={`url(#spark-${data.label.replace(/\s/g, '')})`}
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {data.detail && (
          <p className="text-xs text-muted-foreground mt-2">{data.detail}</p>
        )}
      </CardContent>
    </Card>
  );
}
