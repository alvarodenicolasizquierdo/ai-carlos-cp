/**
 * DateRangeToolbar - Stripe-style date range picker with preset shortcuts + granularity
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Settings2 } from 'lucide-react';
import { format, subDays, subWeeks, subMonths, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import { cn } from '@/lib/utils';

export type Granularity = 'daily' | 'weekly' | 'monthly';

interface DateRangeToolbarProps {
  onRangeChange?: (start: Date, end: Date) => void;
  onGranularityChange?: (g: Granularity) => void;
}

const presets = [
  { label: 'Today', getRange: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Last 7 days', getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Last 4 weeks', getRange: () => ({ from: subWeeks(new Date(), 4), to: new Date() }) },
  { label: 'Last month', getRange: () => ({ from: subMonths(new Date(), 1), to: new Date() }) },
  { label: 'Last 3 months', getRange: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
  { label: 'Month to date', getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: 'Quarter to date', getRange: () => ({ from: startOfQuarter(new Date()), to: new Date() }) },
  { label: 'Year to date', getRange: () => ({ from: startOfYear(new Date()), to: new Date() }) },
  { label: 'All time', getRange: () => ({ from: new Date(2024, 0, 1), to: new Date() }) },
];

export function DateRangeToolbar({ onRangeChange, onGranularityChange }: DateRangeToolbarProps) {
  const [activePreset, setActivePreset] = useState('Last 7 days');
  const [granularity, setGranularity] = useState<Granularity>('daily');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(
    presets[1].getRange()
  );
  const [open, setOpen] = useState(false);

  const selectPreset = (preset: typeof presets[number]) => {
    const range = preset.getRange();
    setDateRange(range);
    setActivePreset(preset.label);
    onRangeChange?.(range.from, range.to);
  };

  const handleGranularity = (v: string) => {
    setGranularity(v as Granularity);
    onGranularityChange?.(v as Granularity);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Date range button with popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 font-normal">
            <CalendarIcon className="w-4 h-4" />
            {activePreset}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Preset sidebar */}
            <div className="border-r p-3 space-y-0.5 min-w-[140px]">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => { selectPreset(p); }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                    activePreset === p.label
                      ? 'text-primary font-medium bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Calendar + date inputs */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3 text-sm">
                <span className="text-muted-foreground">Start</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {format(dateRange.from, 'dd / MM / yyyy')}
                </Badge>
                <span className="text-muted-foreground">End</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {format(dateRange.to, 'dd / MM / yyyy')}
                </Badge>
              </div>
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                    setActivePreset(`${format(range.from, 'MMM d')} – ${format(range.to, 'MMM d')}`);
                    onRangeChange?.(range.from, range.to);
                  } else if (range?.from) {
                    setDateRange(prev => ({ ...prev, from: range.from! }));
                  }
                }}
                numberOfMonths={2}
                className="rounded-md"
              />
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                <Button variant="ghost" size="sm" onClick={() => { selectPreset(presets[1]); }}>
                  Clear
                </Button>
                <Button size="sm" onClick={() => setOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Granularity */}
      <Select value={granularity} onValueChange={handleGranularity}>
        <SelectTrigger className="w-[110px] h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto">
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Configure
        </Button>
      </div>
    </div>
  );
}
