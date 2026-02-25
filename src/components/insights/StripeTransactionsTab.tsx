/**
 * StripeTransactionsTab - Stripe-style transaction list with status tabs, filter chips,
 * edit columns popover, saved views per role, and transaction detail drawer
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Search, ChevronLeft, ChevronRight, Download, X, Plus,
  FileText, ClipboardCheck, Shield, Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { transactions, Transaction } from '@/data/mockReports';
import { EditColumnsPopover, ColumnDef } from './EditColumnsPopover';
import { SavedViewsDropdown, SavedView } from './SavedViewsDropdown';
import { TransactionDetailDrawer } from './TransactionDetailDrawer';

// --- Column definitions ---
const allColumns: ColumnDef[] = [
  { key: 'id', label: 'ID', defaultVisible: true, fixed: true },
  { key: 'date', label: 'Date', defaultVisible: true },
  { key: 'type', label: 'Type', defaultVisible: true },
  { key: 'reference', label: 'Reference', defaultVisible: true },
  { key: 'supplier', label: 'Supplier', defaultVisible: true },
  { key: 'status', label: 'Status', defaultVisible: true },
  { key: 'amount', label: 'Amount', defaultVisible: true },
  { key: 'currency', label: 'Currency', defaultVisible: false },
];

// --- Saved views ---
const savedViews: SavedView[] = [
  { id: 'sv1', label: 'My pending approvals', role: 'Quality Manager', filters: { status: 'pending', type: 'all' } },
  { id: 'sv2', label: 'Failed this month', role: 'Quality Manager', filters: { status: 'failed', type: 'all' } },
  { id: 'sv3', label: 'Active inspections', role: 'Inspector', filters: { status: 'in_progress', type: 'inspection' } },
  { id: 'sv4', label: 'All test requests', role: 'Lab Analyst', filters: { status: 'all', type: 'test_request' } },
  { id: 'sv5', label: 'Completed audits', role: 'Auditor', filters: { status: 'completed', type: 'audit' } },
];

// --- Status tab config ---
const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Succeeded' },
  { value: 'failed', label: 'Failed' },
];

const typeLabels: Record<Transaction['type'], string> = {
  test_request: 'Test Request',
  inspection: 'Inspection',
  audit: 'Audit',
  certification: 'Certification',
};

const typeIcons: Record<Transaction['type'], React.ComponentType<{ className?: string }>> = {
  test_request: FileText,
  inspection: ClipboardCheck,
  audit: Shield,
  certification: Award,
};

const statusColors: Record<Transaction['status'], string> = {
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-destructive/10 text-destructive',
};

const typeChips: { value: string; label: string }[] = [
  { value: 'test_request', label: 'Tests' },
  { value: 'inspection', label: 'Inspections' },
  { value: 'audit', label: 'TRFs' },
  { value: 'certification', label: 'Approvals' },
];

export function StripeTransactionsTab() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState<string[]>(
    allColumns.filter(c => c.defaultVisible).map(c => c.key)
  );
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const pageSize = 15;

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchSearch =
        !search ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.reference.toLowerCase().includes(search.toLowerCase()) ||
        t.supplier.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [statusFilter, typeFilter, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: transactions.length };
    transactions.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return counts;
  }, []);

  const applyView = (view: SavedView) => {
    setStatusFilter(view.filters.status || 'all');
    setTypeFilter(view.filters.type || 'all');
    setSearch('');
    setPage(1);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || search;

  return (
    <div className="space-y-4">
      {/* Status count cards (Stripe-style bordered cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {statusTabs.map(tab => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={cn(
                'rounded-lg border px-4 py-3 text-left transition-colors',
                isActive
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <span className={cn('text-sm', isActive ? 'text-primary font-medium' : 'text-muted-foreground')}>
                {tab.label}
              </span>
              <p className={cn('text-lg font-semibold mt-0.5', isActive ? 'text-primary' : 'text-foreground')}>
                {statusCounts[tab.value] || 0}
              </p>
            </button>
          );
        })}
      </div>

      {/* Toolbar: search + filter chips + edit columns + saved views */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ID, reference, or supplier…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 h-9"
          />
        </div>

        {/* Filter chips with + prefix (Stripe-style) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {typeChips.map(chip => {
            const active = typeFilter === chip.value;
            return (
              <Button
                key={chip.value}
                variant={active ? 'default' : 'outline'}
                size="sm"
                className={cn('h-7 text-xs rounded-full px-3 gap-1', !active && 'text-muted-foreground')}
                onClick={() => { setTypeFilter(active ? 'all' : chip.value); setPage(1); }}
              >
                {active ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {chip.label}
              </Button>
            );
          })}
          {hasActiveFilters && (
            <button className="text-xs text-primary hover:underline ml-1" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <SavedViewsDropdown views={savedViews} onSelect={applyView} />
          <EditColumnsPopover columns={allColumns} visible={visibleCols} onChange={setVisibleCols} />
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleCols.map(key => {
                  const col = allColumns.find(c => c.key === key);
                  if (!col) return null;
                  return (
                    <TableHead key={key} className={key === 'amount' ? 'text-right' : ''}>
                      {col.label}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(t => {
                const TypeIcon = typeIcons[t.type];
                const cellRenderers: Record<string, () => React.ReactNode> = {
                  id: () => <TableCell key="id" className="font-mono text-xs">{t.id}</TableCell>,
                  date: () => <TableCell key="date" className="text-sm">{t.date}</TableCell>,
                  type: () => (
                    <TableCell key="type">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{typeLabels[t.type]}</span>
                      </div>
                    </TableCell>
                  ),
                  reference: () => <TableCell key="reference" className="font-mono text-xs">{t.reference}</TableCell>,
                  supplier: () => <TableCell key="supplier" className="text-sm">{t.supplier}</TableCell>,
                  status: () => (
                    <TableCell key="status">
                      <Badge className={cn('capitalize text-xs', statusColors[t.status])}>
                        {t.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  ),
                  amount: () => <TableCell key="amount" className="text-right font-medium text-sm">${t.amount.toLocaleString()}</TableCell>,
                  currency: () => <TableCell key="currency" className="text-xs text-muted-foreground">{t.currency}</TableCell>,
                };
                return (
                  <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTxn(t)}>
                    {visibleCols.map(key => cellRenderers[key]?.())}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <TransactionDetailDrawer
        transaction={selectedTxn}
        open={!!selectedTxn}
        onOpenChange={(open) => { if (!open) setSelectedTxn(null); }}
      />
    </div>
  );
}
