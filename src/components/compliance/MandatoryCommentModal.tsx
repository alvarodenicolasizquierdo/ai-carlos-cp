/**
 * Mandatory Comment Modal [FIX 7]
 * Requires min 10 chars before Query, Reject, Return, or Alert actions.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MandatoryCommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionLabel: string;
  actionVariant?: 'default' | 'destructive' | 'outline';
  onConfirm: (comment: string) => void;
}

export function MandatoryCommentModal({
  open,
  onOpenChange,
  actionLabel,
  actionVariant = 'destructive',
  onConfirm,
}: MandatoryCommentModalProps) {
  const [comment, setComment] = useState('');
  const isValid = comment.trim().length >= 10;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm(comment.trim());
      setComment('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comment Required — {actionLabel}</DialogTitle>
          <DialogDescription>
            Please provide a reason for this action. Minimum 10 characters required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your reason for this action..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {comment.trim().length}/10 characters minimum
            {!isValid && comment.trim().length > 0 && (
              <span className="text-destructive ml-1">
                ({10 - comment.trim().length} more needed)
              </span>
            )}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={actionVariant}
            disabled={!isValid}
            onClick={handleConfirm}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
