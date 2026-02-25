/**
 * EditColumnsPopover - Stripe-style column visibility toggle
 * with Fixed columns section + Active (reorderable) columns + drag handles
 */

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Columns3, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnDef {
  key: string;
  label: string;
  defaultVisible: boolean;
  /** If true, column is always visible and pinned at the top ("Fixed columns") */
  fixed?: boolean;
}

interface EditColumnsPopoverProps {
  columns: ColumnDef[];
  visible: string[];
  onChange: (visible: string[]) => void;
}

export function EditColumnsPopover({ columns, visible, onChange }: EditColumnsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const fixedCols = columns.filter(c => c.fixed);
  const activeCols = columns.filter(c => !c.fixed);

  // Reorder active columns based on visible order
  const orderedActive = [...activeCols].sort((a, b) => {
    const ai = visible.indexOf(a.key);
    const bi = visible.indexOf(b.key);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const toggle = (key: string) => {
    onChange(
      visible.includes(key)
        ? visible.filter(k => k !== key)
        : [...visible, key]
    );
  };

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;

    const newOrder = [...orderedActive];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(targetIdx, 0, moved);

    // Rebuild visible: fixed keys first, then reordered active keys that are visible
    const fixedKeys = fixedCols.map(c => c.key).filter(k => visible.includes(k));
    const activeKeys = newOrder.map(c => c.key).filter(k => visible.includes(k));
    onChange([...fixedKeys, ...activeKeys]);
    setDragIdx(targetIdx);
  }, [dragIdx, orderedActive, fixedCols, visible, onChange]);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns3 className="w-4 h-4" />
          Edit columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3" align="end">
        {/* Fixed columns */}
        {fixedCols.length > 0 && (
          <>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Fixed columns</p>
            <div className="space-y-1 mb-3">
              {fixedCols.map(col => (
                <div key={col.key} className="flex items-center gap-2 text-sm py-1 text-muted-foreground">
                  {col.label}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Active columns */}
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Active columns</p>
        <div className="space-y-0.5">
          {orderedActive.map((col, idx) => (
            <div
              key={col.key}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={cn(
                'flex items-center gap-2 cursor-grab text-sm py-1.5 px-1 rounded-sm hover:bg-muted/50 transition-colors',
                dragIdx === idx && 'opacity-50 bg-muted'
              )}
            >
              <Checkbox
                checked={visible.includes(col.key)}
                onCheckedChange={() => toggle(col.key)}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <span className="flex-1">{col.label}</span>
              <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => onChange(columns.filter(c => c.defaultVisible || c.fixed).map(c => c.key))}
        >
          Reset to default
        </Button>
      </PopoverContent>
    </Popover>
  );
}
