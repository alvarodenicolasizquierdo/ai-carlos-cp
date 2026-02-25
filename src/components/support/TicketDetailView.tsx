import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  Upload,
  FileText,
  Clock,
  User,
  Mail,
  Building,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  group?: string;
  messages: number;
  lastComment?: string;
}

interface TicketDetailViewProps {
  ticket: Ticket;
  onBack: () => void;
}

// Mock submission details for the detail view
const getSubmissionDetails = (ticket: Ticket) => ({
  email: `${ticket.createdBy.toLowerCase().replace(/\s+/g, '.')}@company.com`,
  name: ticket.createdBy,
  role: 'Quality Manager',
  company: 'SGS',
  topic: ticket.category,
  description: ticket.description,
});

export function TicketDetailView({ ticket, onBack }: TicketDetailViewProps) {
  const [comment, setComment] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const details = getSubmissionDetails(ticket);
  const timeAgo = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: false });

  const statusBadge = (status: Ticket['status']) => {
    const map: Record<string, { label: string; className: string }> = {
      open: { label: 'Open', className: 'bg-red-500/90 text-white border-0' },
      new: { label: 'New', className: 'bg-amber-500/90 text-white border-0' },
      in_progress: { label: 'In Progress', className: 'bg-primary/90 text-primary-foreground border-0' },
      resolved: { label: 'Resolved', className: 'bg-emerald-500/90 text-white border-0' },
      closed: { label: 'Closed', className: 'bg-muted text-muted-foreground border-0' },
    };
    const c = map[status];
    return <Badge className={cn('text-xs px-2.5 py-0.5', c.className)}>{c.label}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-0">
      {/* Header — Slack style with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
            <ChevronLeft className="w-4 h-4" />
            Your Help Requests
          </Button>
        </div>
        <Button variant="default" size="sm" className="gap-1.5">
          Contact Us
        </Button>
      </div>

      {/* Title + Request ID — Slack style */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight mb-1">{ticket.title}</h2>
          <p className="text-sm text-muted-foreground">
            Support Request #{ticket.id}
          </p>
        </div>

        {/* Submission details — Slack style key/value pairs */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{details.name}</span>
            <span className="text-muted-foreground">{timeAgo} ago</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailField icon={User} label="Name" value={details.name} />
            <DetailField icon={Mail} label="Email" value={details.email} isLink />
            <DetailField icon={Building} label="Company" value={details.company} />
            <DetailField icon={Tag} label="Role" value={details.role} />
            <DetailField icon={AlertCircle} label="Topic" value={details.topic} />
            <DetailField icon={Clock} label="Opened" value={format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')} />
          </div>

          {/* Status + Priority */}
          <div className="flex items-center gap-4 pt-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              {statusBadge(ticket.status)}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Priority</p>
              <Badge variant="outline" className="text-xs capitalize">{ticket.priority}</Badge>
            </div>
            {ticket.assignee && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                <span className="text-sm">{ticket.assignee}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm leading-relaxed">{ticket.description}</p>
          </div>

          {/* Last comment if any */}
          {ticket.lastComment && (
            <div className="rounded-lg bg-muted/50 border border-border p-4">
              <p className="text-xs font-semibold mb-1">Latest Comment</p>
              <p className="text-sm text-muted-foreground">{ticket.lastComment}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Comment + Attachment section — Slack/Stripe style */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-bold mb-2">Comment</p>
            <Textarea
              placeholder="Add a comment or reply..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>

          <div>
            <p className="text-sm font-bold mb-2">Attach files (optional)</p>
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
            >
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop a file to attach it, or
              </p>
              <button className="text-sm text-primary hover:underline font-medium mt-1">
                Browse for a file
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              disabled={!comment.trim()}
              className="px-6"
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailField({
  icon: Icon,
  label,
  value,
  isLink,
}: {
  icon: typeof User;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-muted-foreground">{label}:</p>
      {isLink ? (
        <a href={`mailto:${value}`} className="text-sm text-primary hover:underline">{value}</a>
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
}
