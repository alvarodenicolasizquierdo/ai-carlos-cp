/**
 * ScheduleDialog - Stripe Sigma-style schedule modal
 * Daily/Weekly/Monthly radio, subscribers input, timeline preview
 */

import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Mail } from 'lucide-react';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle?: string;
}

const scheduleInfo: Record<string, { description: string; next: string; expected: string }> = {
  daily: {
    description: 'The query will run when the data for each day, ending at 12:00 AM UTC, is processed.',
    next: 'Next run will include data until tomorrow at 12:00 AM UTC.',
    expected: new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  },
  weekly: {
    description: 'The query will run when the data for each week, ending Sunday at 12:00 AM UTC, is processed.',
    next: 'Next run will include data until Sunday at 12:00 AM UTC.',
    expected: (() => {
      const d = new Date();
      d.setDate(d.getDate() + (7 - d.getDay()));
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    })(),
  },
  monthly: {
    description: 'The query will run when the data for each month is processed, typically by the 3rd of the following month.',
    next: 'Next run will include data for the current month.',
    expected: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + 1, 3);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    })(),
  },
};

export function ScheduleDialog({ open, onOpenChange, reportTitle }: ScheduleDialogProps) {
  const [frequency, setFrequency] = useState('daily');
  const [email, setEmail] = useState('');
  const info = scheduleInfo[frequency];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Frequency */}
          <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-2">
            {['daily', 'weekly', 'monthly'].map(f => (
              <div key={f} className="flex items-center space-x-2">
                <RadioGroupItem value={f} id={`freq-${f}`} />
                <Label htmlFor={`freq-${f}`} className="capitalize cursor-pointer">{f}</Label>
              </div>
            ))}
          </RadioGroup>

          <p className="text-sm text-muted-foreground">{info.description}</p>

          {/* Subscribers */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" /> Subscribers
            </h4>
            <p className="text-xs text-muted-foreground">
              Enter the emails of users who should be notified when the query runs.
            </p>
            <Input
              placeholder="user@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You can add a webhook to use these results in an automated workflow.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" /> Timeline
            </h4>
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center mt-0.5">
                <Clock className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <p>{info.next}</p>
                <p className="text-muted-foreground">Expected {info.expected}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
