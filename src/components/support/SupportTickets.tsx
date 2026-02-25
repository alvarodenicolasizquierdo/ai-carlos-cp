import { useState } from 'react';
import { motion } from 'framer-motion';
import { TicketDetailView } from './TicketDetailView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';

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

const mockTickets: Ticket[] = [
  {
    id: 'TKT-003',
    title: 'Order status says it is still processing',
    description: 'My order has been processing for 5 days.',
    status: 'open',
    priority: 'urgent',
    category: 'Reports & Exports',
    createdBy: 'Carlos Garcia',
    createdAt: '2026-02-06T09:09:00Z',
    updatedAt: '2026-02-06T09:09:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 3,
    lastComment: 'Yes, please cancel the order.',
  },
  {
    id: 'TKT-010',
    title: 'Missing assembly instructions',
    description: 'Product arrived without assembly guide.',
    status: 'open',
    priority: 'urgent',
    category: 'Components',
    createdBy: 'Jakub Wójcik',
    createdAt: '2026-02-06T09:09:00Z',
    updatedAt: '2026-02-06T09:09:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 2,
    lastComment: "Amazing, I'll send that right away.",
  },
  {
    id: 'TKT-013',
    title: 'Need less items than ordered',
    description: 'I ordered 50 but only need 30.',
    status: 'open',
    priority: 'urgent',
    category: 'TRFs',
    createdBy: 'Boonsri Saeli',
    createdAt: '2026-02-06T09:09:00Z',
    updatedAt: '2026-02-06T09:09:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 4,
    lastComment: "It's 34612846",
  },
  {
    id: 'TKT-002',
    title: 'Damaged product received',
    description: 'Product was damaged during shipping.',
    status: 'open',
    priority: 'urgent',
    category: 'Components',
    createdBy: 'Taylor Moore',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 2,
    lastComment: 'I would like a replacement, thank you.',
  },
  {
    id: 'TKT-007',
    title: 'Wrong address on shipment',
    description: 'Delivery address is incorrect.',
    status: 'open',
    priority: 'urgent',
    category: 'Account & Access',
    createdBy: 'Soobin Do',
    createdAt: '2026-02-06T09:11:00Z',
    updatedAt: '2026-02-06T09:11:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 3,
    lastComment: "Yes, that's the one!",
  },
  {
    id: 'TKT-001',
    title: 'Cannot export TRF reports to PDF',
    description: 'When clicking export, the page loads indefinitely.',
    status: 'open',
    priority: 'normal',
    category: 'Reports & Exports',
    createdBy: 'Sarah Chen',
    createdAt: '2026-02-03T14:30:00Z',
    updatedAt: '2026-02-04T09:15:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 3,
    lastComment: 'Still seeing the issue after clearing cache.',
  },
  {
    id: 'TKT-014',
    title: "Where's it made?",
    description: 'Need country of origin info.',
    status: 'open',
    priority: 'normal',
    category: 'Testing & Compliance',
    createdBy: 'Taylor Moore',
    createdAt: '2026-02-04T09:08:00Z',
    updatedAt: '2026-02-04T09:08:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 1,
  },
  {
    id: 'TKT-016',
    title: "Where's my order?",
    description: 'Tracking not updating.',
    status: 'open',
    priority: 'normal',
    category: 'Other',
    createdBy: 'Ella Rivera',
    createdAt: '2026-02-04T09:08:00Z',
    updatedAt: '2026-02-04T09:08:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 1,
  },
  {
    id: 'TKT-018',
    title: 'Shipping cost inquiry',
    description: 'Need breakdown of shipping costs.',
    status: 'open',
    priority: 'normal',
    category: 'Other',
    createdBy: 'Zhang Wei Xu',
    createdAt: '2026-02-04T09:08:00Z',
    updatedAt: '2026-02-04T09:08:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 0,
  },
  {
    id: 'TKT-006',
    title: 'Are products ethically sourced',
    description: 'Requesting ethical sourcing documentation.',
    status: 'open',
    priority: 'low',
    category: 'Testing & Compliance',
    createdBy: 'Zhang Wei Xu',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
    assignee: 'Sam Lee',
    group: 'Support',
    messages: 2,
  },
  {
    id: 'TKT-030',
    title: "I can't reset my password",
    description: 'Password reset email not arriving.',
    status: 'new',
    priority: 'normal',
    category: 'Account & Access',
    createdBy: 'Luka Jensen',
    createdAt: '2026-02-05T22:44:00Z',
    updatedAt: '2026-02-05T22:44:00Z',
    group: 'Support',
    messages: 0,
  },
];

const statusBadge = (status: Ticket['status']) => {
  const map: Record<string, { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-red-500/90 text-white border-0' },
    new: { label: 'New', className: 'bg-amber-500/90 text-white border-0' },
    in_progress: { label: 'In Progress', className: 'bg-primary/90 text-primary-foreground border-0' },
    resolved: { label: 'Resolved', className: 'bg-emerald-500/90 text-white border-0' },
    closed: { label: 'Closed', className: 'bg-muted text-muted-foreground border-0' },
  };
  const c = map[status];
  return <Badge className={cn('text-[11px] px-2 py-0.5 font-medium', c.className)}>{c.label}</Badge>;
};

const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

// Left sidebar update item
function UpdateItem({ ticket }: { ticket: Ticket }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer">
      <p className="text-xs">
        <span className="font-semibold">{ticket.createdBy}</span>
        <span className="text-muted-foreground"> commented on </span>
        <span className="font-medium">"{ticket.title}"</span>
      </p>
      {ticket.lastComment && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.lastComment}</p>
      )}
      <p className="text-[11px] text-muted-foreground mt-1">
        {format(new Date(ticket.updatedAt), 'MMM dd, HH:mm')}
      </p>
    </div>
  );
}

export function SupportTickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'normal' as Ticket['priority'],
  });
  const { toast } = useToast();
  const { currentUser } = useUser();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group by priority
  const grouped = filteredTickets.reduce<Record<string, Ticket[]>>((acc, t) => {
    const key = t.priority;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort(
    ([a], [b]) => (priorityOrder[a] ?? 99) - (priorityOrder[b] ?? 99)
  );

  const recentUpdates = [...tickets]
    .filter(t => t.lastComment)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const handleCreateTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.category) {
      toast({ title: 'Missing information', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      title: newTicket.title,
      description: newTicket.description,
      status: 'new',
      priority: newTicket.priority,
      category: newTicket.category,
      createdBy: currentUser?.name || 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      group: 'Support',
      messages: 0,
    };
    setTickets([ticket, ...tickets]);
    setNewTicket({ title: '', description: '', category: '', priority: 'normal' });
    setCreateDialogOpen(false);
    toast({ title: 'Ticket created', description: `Ticket ${ticket.id} has been submitted.` });
  };

  const stats = {
    you: tickets.filter(t => t.status === 'open' || t.status === 'new').length,
    groups: tickets.length,
    good: 0,
    bad: 0,
    solved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  const toggleTicket = (id: string) => {
    setSelectedTickets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const priorityLabel: Record<string, string> = {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  };

  // Ticket detail view — Slack style
  if (selectedTicket) {
    return <TicketDetailView ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Ticket</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>Describe your issue and our support team will assist you.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Brief summary of your issue" value={newTicket.title} onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the issue in detail..." rows={4} value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reports & Exports">Reports & Exports</SelectItem>
                      <SelectItem value="Testing & Compliance">Testing & Compliance</SelectItem>
                      <SelectItem value="Components">Components</SelectItem>
                      <SelectItem value="TRFs">TRFs</SelectItem>
                      <SelectItem value="Account & Access">Account & Access</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v as Ticket['priority'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTicket}>Submit Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Zendesk-style layout: sidebar + table */}
      <div className="flex gap-4">
        {/* Left sidebar - Updates */}
        <div className="w-72 shrink-0 hidden lg:block">
          <h3 className="text-sm font-semibold mb-3">Updates to your tickets</h3>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 pr-2">
              {recentUpdates.map(t => (
                <UpdateItem key={t.id} ticket={t} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main table area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Stats bar */}
          <div className="flex items-center gap-6">
            <div className="border border-border rounded-lg flex divide-x divide-border">
              <div className="px-4 py-2 text-center">
                <p className="text-lg font-semibold">{stats.you}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">You</p>
              </div>
              <div className="px-4 py-2 text-center">
                <p className="text-lg font-semibold">{stats.groups}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Groups</p>
              </div>
            </div>
            <div className="border border-border rounded-lg flex divide-x divide-border">
              <div className="px-4 py-2 text-center">
                <p className="text-lg font-semibold">{stats.good}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Good</p>
              </div>
              <div className="px-4 py-2 text-center">
                <p className="text-lg font-semibold">{stats.bad}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Bad</p>
              </div>
              <div className="px-4 py-2 text-center">
                <p className="text-lg font-semibold">{stats.solved}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Solved</p>
              </div>
            </div>
          </div>

          {/* Ticket count */}
          <p className="text-sm text-muted-foreground">
            Tickets requiring your attention ({filteredTickets.length})
          </p>

          {/* Table */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <ScrollArea className="h-[520px]">
                {/* Table header */}
                <div className="grid grid-cols-[32px_80px_60px_1fr_120px_120px_100px_100px] gap-2 px-4 py-2 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30 sticky top-0 z-10">
                  <div></div>
                  <div>Status</div>
                  <div>ID</div>
                  <div>Subject</div>
                  <div>Requester</div>
                  <div>Updated</div>
                  <div>Group</div>
                  <div>Assignee</div>
                </div>

                {sortedGroups.map(([priority, groupTickets]) => (
                  <div key={priority}>
                    <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/20 border-b border-border">
                      Priority: {priorityLabel[priority] || priority}
                    </div>
                    {groupTickets.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-[32px_80px_60px_1fr_120px_120px_100px_100px] gap-2 px-4 py-2.5 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer items-center text-sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div>
                          <Checkbox
                            checked={selectedTickets.has(ticket.id)}
                            onCheckedChange={() => toggleTicket(ticket.id)}
                          />
                        </div>
                        <div>{statusBadge(ticket.status)}</div>
                        <div className="text-muted-foreground font-mono text-xs">#{ticket.id.split('-')[1]}</div>
                        <div className="truncate font-medium text-sm">{ticket.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{ticket.createdBy}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(ticket.updatedAt), 'MMM dd HH:mm')}</div>
                        <div className="text-xs text-muted-foreground">{ticket.group || '-'}</div>
                        <div className="text-xs text-muted-foreground">{ticket.assignee || '-'}</div>
                      </motion.div>
                    ))}
                  </div>
                ))}

                {filteredTickets.length === 0 && (
                  <div className="text-center py-16">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium mb-1">No tickets found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search.' : 'Create a ticket to get help.'}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="h-8 w-8 p-0">1</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
