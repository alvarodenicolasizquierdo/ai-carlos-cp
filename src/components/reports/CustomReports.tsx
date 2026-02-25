/**
 * CustomReports - Stripe Sigma-style AI report generator
 * Left sidebar with templates, right panel with AI prompt + results
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Plus, Search, Play, Calendar, Clock, MoreHorizontal, FileText,
  Download, Pencil, Trash2, Sparkles, Send, ArrowLeft, History, Save,
} from 'lucide-react';
import { ScheduleDialog } from '@/components/insights/ScheduleDialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { customReports } from '@/data/mockReports';
import { ScrollArea } from '@/components/ui/scroll-area';

// Template categories matching Stripe Sigma pattern
const templateCategories = [
  {
    label: 'BASIC REPORTS',
    items: [
      { id: 't1', name: 'Daily activity', desc: 'Tests, inspections, and audits' },
      { id: 't2', name: 'Daily balance', desc: 'Credit balance and activity summary' },
      { id: 't3', name: 'Monthly summary', desc: 'Tests, pass rates, and net activity' },
    ],
  },
  {
    label: 'TESTING & INSPECTIONS',
    items: [
      { id: 't4', name: 'Test volume by month', desc: 'Total test count per category per month' },
      { id: 't5', name: 'Inspection breakdown', desc: 'Inspections by type and result' },
      { id: 't6', name: 'Pass/fail analysis', desc: 'Pass and fail rates by supplier' },
      { id: 't7', name: 'Turnaround times', desc: 'Avg turnaround by test type' },
    ],
  },
  {
    label: 'SUPPLIERS & RISK',
    items: [
      { id: 't8', name: 'Supplier performance', desc: 'Score and trend by supplier' },
      { id: 't9', name: 'Risk heatmap', desc: 'Geographic risk distribution' },
      { id: 't10', name: 'Compliance status', desc: 'Compliance by category and supplier' },
    ],
  },
];

// Mock AI-generated result
const mockResult = {
  title: 'Monthly test volume by category',
  rows: [
    { month: '2025-02-01', category: 'Chemical', count: 89, pass_rate: '94%' },
    { month: '2025-02-01', category: 'Physical', count: 72, pass_rate: '91%' },
    { month: '2025-02-01', category: 'Safety', count: 58, pass_rate: '96%' },
    { month: '2025-01-01', category: 'Chemical', count: 82, pass_rate: '92%' },
    { month: '2025-01-01', category: 'Physical', count: 68, pass_rate: '89%' },
    { month: '2025-01-01', category: 'Safety', count: 52, pass_rate: '95%' },
  ],
  summary: 'This report shows the monthly test volume broken down by testing category. Chemical testing leads with 89 tests in February, up 8.5% from January. Pass rates remain consistently above 89% across all categories.',
};

type ViewState = 'list' | 'generator';

export function CustomReports() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewState>('list');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const filteredReports = customReports.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setResult(null);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setResult(mockResult);
    }, 2000);
  };

  const openGenerator = (templateName?: string) => {
    setView('generator');
    if (templateName) {
      setPrompt(`Generate report for ${templateName.toLowerCase()}`);
      setSelectedTemplate(templateName);
    } else {
      setPrompt('');
      setSelectedTemplate(null);
    }
    setResult(null);
  };

  if (view === 'generator') {
    return (
      <div className="flex gap-0 h-[calc(100vh-240px)] min-h-[500px]">
        {/* Left sidebar — templates */}
        <div className="w-72 border-r flex flex-col bg-card rounded-l-lg">
          <div className="p-3 border-b flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => setView('list')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-sm">Sigma</span>
            <Button variant="outline" size="sm" className="ml-auto text-xs gap-1">
              <Plus className="w-3 h-3" /> New
            </Button>
          </div>
          <div className="px-3 py-2 border-b flex gap-4 text-sm">
            <span className="text-muted-foreground cursor-pointer hover:text-foreground">Reports</span>
            <span className="text-muted-foreground cursor-pointer hover:text-foreground">Schema</span>
            <span className="text-primary font-medium border-b-2 border-primary pb-1">Templates</span>
          </div>
          <div className="px-3 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 h-8 text-sm" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-4">
              {templateCategories.map(cat => (
                <div key={cat.label}>
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider mb-2">{cat.label}</p>
                  <div className="space-y-1">
                    {cat.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => openGenerator(item.name)}
                        className={cn(
                          'w-full text-left p-2 rounded-md transition-colors',
                          selectedTemplate === item.name ? 'bg-primary/10' : 'hover:bg-muted'
                        )}
                      >
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground">Help</span>
            <span className="cursor-pointer hover:text-foreground">Schema docs</span>
            <span className="cursor-pointer hover:text-foreground">Feedback</span>
          </div>
        </div>

        {/* Right panel — generator */}
        <div className="flex-1 flex flex-col bg-card rounded-r-lg">
          {/* Title bar */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {result ? result.title : 'Untitled report'}
              <Pencil className="inline-block w-4 h-4 ml-2 text-muted-foreground" />
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>Schedule</Button>
              <Button variant="outline" size="sm">Format</Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button size="sm" className="gap-1" onClick={handleGenerate} disabled={isProcessing || !prompt.trim()}>
                <Play className="w-4 h-4" /> Run
              </Button>
            </div>
          </div>

          {/* AI prompt bar */}
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs shrink-0">
              <Sparkles className="w-3 h-3" /> Generate
            </Badge>
            <Input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="Ask assistant to generate a report"
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-sm"
            />
            {isProcessing ? (
              <Badge className="bg-primary text-primary-foreground animate-pulse">Processing…</Badge>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={!prompt.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-1">
              <History className="w-4 h-4" /> History
            </Button>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-auto p-4">
            {!result && !isProcessing && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-1">Ask assistant to generate a report</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Or <button className="text-primary underline">write my own report with SQL</button>
                </p>
                {/* Code editor placeholder */}
                <div className="w-full max-w-2xl rounded-lg border bg-muted/30 p-4 text-left font-mono text-sm text-muted-foreground">
                  <span className="text-muted-foreground/50">1</span>{'  '}
                  <span className="italic">Type SQL here</span>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Generating report…</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Summary popover */}
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm mb-1">Summary</p>
                        <p className="text-sm text-muted-foreground">{result.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span>Help us improve Sigma. Was this response helpful?</span>
                      <Button variant="outline" size="sm" className="h-6 text-xs px-2">Yes</Button>
                      <Button variant="outline" size="sm" className="h-6 text-xs px-2">No</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Results meta */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {result.rows.length} rows • Data updated {new Date().toLocaleDateString()} at 08:00
                  </span>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-4 h-4" /> Download CSV
                  </Button>
                </div>

                {/* Results table */}
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>month</TableHead>
                        <TableHead>category</TableHead>
                        <TableHead className="text-right">count</TableHead>
                        <TableHead className="text-right">pass_rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.rows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-sm">{row.month}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell className="text-right">{row.count}</TableCell>
                          <TableCell className="text-right">{row.pass_rate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                <div className="text-center">
                  <Button variant="outline" size="sm" className="gap-1">
                    Show all {result.rows.length} results <Sparkles className="w-3 h-3" />
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Sigma Assistant is powered by AI and might contain errors. <button className="underline">Learn more.</button>
                </p>
              </div>
            )}
          </div>
        </div>
        <ScheduleDialog
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          reportTitle={result?.title || selectedTemplate || 'Untitled report'}
        />
      </div>
    );
  }

  // List view (existing)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Custom Reports</h2>
          <p className="text-sm text-muted-foreground">Create and manage custom report templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openGenerator()}>
            <Sparkles className="w-4 h-4 mr-2" />
            AI Report Generator
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{report.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">
                  {report.description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {report.lastRun}
                  </div>
                </TableCell>
                <TableCell>
                  {report.schedule ? (
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.schedule}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">Manual</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{report.createdBy}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Play className="w-4 h-4 mr-2" /> Run Now</DropdownMenuItem>
                        <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download Last</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem><Calendar className="w-4 h-4 mr-2" /> Schedule</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Quick Templates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Supplier Summary', desc: 'Performance by supplier', color: 'text-primary', bg: 'bg-primary/10' },
              { name: 'Test Results', desc: 'Pass/fail analysis', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
              { name: 'Risk Assessment', desc: 'Factory risk scores', color: 'text-amber-600', bg: 'bg-amber-500/10' },
            ].map(t => (
              <div key={t.name} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => openGenerator(t.name)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', t.bg)}>
                    <FileText className={cn('w-5 h-5', t.color)} />
                  </div>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
