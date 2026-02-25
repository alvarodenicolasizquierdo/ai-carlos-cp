import { useState, useRef, useEffect, useMemo } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Search,
  BookOpen,
  FileText,
  ExternalLink,
  Ticket,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { matchArticleByQuery, HelpArticle as KBArticle } from '@/data/helpKnowledgeBase';
import {
  mockArticles,
  helpCategories,
  HelpArticle,
  HelpCategory,
} from '@/data/helpData';
import { Link, useLocation } from 'react-router-dom';

// ── Types ──────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

type PanelView = 'home' | 'search' | 'article' | 'chat';

// ── Helpers ────────────────────────────────────────
const quickPrompts = [
  "Can't submit TRF",
  "Care label wrong",
  "Send to Lab disabled",
  "Component linking",
  "Export test results",
  "Supplier tabs missing",
];

// ── Route-aware content configs ────────────────────
type TopicEntry = { label: string; category: HelpCategory; icon: typeof BookOpen };
type DiscoverEntry = { title: string; desc: string; category: HelpCategory };

const defaultDiscoverCards: DiscoverEntry[] = [
  { title: 'Quick start guide', desc: 'Learn the basics and get to work in CARLOS', category: 'getting_started' },
  { title: 'Stay on track with testing', desc: 'Organize work and stay on top of results', category: 'testing' },
  { title: 'Supplier management', desc: 'Set up and manage your supplier network', category: 'suppliers' },
];

const defaultExploreTopics: TopicEntry[] = [
  { label: 'Getting started with CARLOS', category: 'getting_started', icon: BookOpen },
  { label: 'TRF submissions & tracking', category: 'trfs', icon: FileText },
  { label: 'Testing & compliance', category: 'testing', icon: FileText },
  { label: 'Approvals & workflows', category: 'approvals', icon: FileText },
  { label: 'Supplier management', category: 'suppliers', icon: FileText },
];

const routeContentMap: Record<string, { discover: DiscoverEntry[]; topics: TopicEntry[] }> = {
  '/inspections': {
    discover: [
      { title: 'Schedule an inspection', desc: 'Learn how to create and assign inspections', category: 'testing' },
      { title: 'Inspection statuses explained', desc: 'Understand each stage of the workflow', category: 'approvals' },
      { title: 'Bulk actions for inspections', desc: 'Manage multiple inspections at once', category: 'testing' },
    ],
    topics: [
      { label: 'Creating inspections', category: 'testing', icon: FileText },
      { label: 'Inspection results & defects', category: 'testing', icon: FileText },
      { label: 'Approvals & workflows', category: 'approvals', icon: FileText },
      { label: 'Supplier performance', category: 'suppliers', icon: FileText },
    ],
  },
  '/suppliers': {
    discover: [
      { title: 'Add a new supplier', desc: 'Step-by-step supplier onboarding guide', category: 'suppliers' },
      { title: 'Supplier compliance', desc: 'Track certifications and audit status', category: 'suppliers' },
      { title: 'Performance scoring', desc: 'How supplier scores are calculated', category: 'suppliers' },
    ],
    topics: [
      { label: 'Supplier onboarding', category: 'suppliers', icon: FileText },
      { label: 'Compliance & certifications', category: 'suppliers', icon: FileText },
      { label: 'Supplier tiers & scoring', category: 'suppliers', icon: FileText },
      { label: 'Linking suppliers to styles', category: 'testing', icon: FileText },
    ],
  },
  '/trfs': {
    discover: [
      { title: 'Submit a TRF', desc: 'How to create and submit test request forms', category: 'trfs' },
      { title: 'TRF approval flow', desc: 'Understand the review and approval process', category: 'approvals' },
      { title: 'Attach test results', desc: 'Upload lab results to a TRF', category: 'trfs' },
    ],
    topics: [
      { label: 'TRF submissions & tracking', category: 'trfs', icon: FileText },
      { label: 'Test results & documents', category: 'testing', icon: FileText },
      { label: 'Approvals & workflows', category: 'approvals', icon: FileText },
      { label: 'Care labelling', category: 'testing', icon: FileText },
    ],
  },
  '/products': {
    discover: [
      { title: 'Product setup', desc: 'Add products and link styles', category: 'getting_started' },
      { title: 'Component linking', desc: 'Associate components to products', category: 'testing' },
      { title: 'Import products via CSV', desc: 'Bulk import your product catalog', category: 'getting_started' },
    ],
    topics: [
      { label: 'Products & styles', category: 'getting_started', icon: BookOpen },
      { label: 'Component management', category: 'testing', icon: FileText },
      { label: 'Testing requirements', category: 'testing', icon: FileText },
      { label: 'Supplier links', category: 'suppliers', icon: FileText },
    ],
  },
  '/insight': {
    discover: [
      { title: 'Reading your dashboard', desc: 'Understand KPIs and trend charts', category: 'getting_started' },
      { title: 'Custom reports', desc: 'Build and schedule tailored reports', category: 'testing' },
      { title: 'Export data', desc: 'Download reports in CSV or PDF', category: 'getting_started' },
    ],
    topics: [
      { label: 'Dashboard metrics', category: 'getting_started', icon: BookOpen },
      { label: 'Transaction history', category: 'testing', icon: FileText },
      { label: 'Custom reports & AI', category: 'testing', icon: FileText },
      { label: 'Compliance health', category: 'approvals', icon: FileText },
    ],
  },
  '/lab': {
    discover: [
      { title: 'Lab queue overview', desc: 'Manage pending and in-progress tests', category: 'testing' },
      { title: 'Recording test results', desc: 'How to enter and submit lab findings', category: 'testing' },
      { title: 'Lab turnaround times', desc: 'Track and improve testing speed', category: 'testing' },
    ],
    topics: [
      { label: 'Lab testing workflows', category: 'testing', icon: FileText },
      { label: 'Test standards & methods', category: 'testing', icon: FileText },
      { label: 'TRF submissions', category: 'trfs', icon: FileText },
      { label: 'Approvals', category: 'approvals', icon: FileText },
    ],
  },
  '/settings': {
    discover: [
      { title: 'User roles & permissions', desc: 'Configure who can do what', category: 'getting_started' },
      { title: 'Notification preferences', desc: 'Control your alert settings', category: 'getting_started' },
      { title: 'API & integrations', desc: 'Connect external tools and services', category: 'getting_started' },
    ],
    topics: [
      { label: 'Account settings', category: 'getting_started', icon: BookOpen },
      { label: 'Roles & permissions', category: 'approvals', icon: FileText },
      { label: 'Integrations', category: 'getting_started', icon: FileText },
    ],
  },
};

/** Resolve the best matching route key (supports prefix matching for detail pages) */
function getRouteContent(pathname: string) {
  if (routeContentMap[pathname]) return routeContentMap[pathname];
  // Prefix match: /inspections/123 → /inspections
  const prefix = Object.keys(routeContentMap).find(k => k !== '/' && pathname.startsWith(k));
  if (prefix) return routeContentMap[prefix];
  return { discover: defaultDiscoverCards, topics: defaultExploreTopics };
}

function generateResponse(query: string): { content: string; suggestions: string[] } {
  const matched = matchArticleByQuery(query);
  if (matched) {
    const causes = matched.why_usually_happens.slice(0, 2).join(' or ');
    return {
      content: `**${matched.title}**\n\nThis usually happens when ${causes.toLowerCase()}.\n\n**Quick fix:**\n${matched.fix_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nIf that doesn't resolve it, you can create a support ticket from the Support Center.`,
      suggestions: ['Create support ticket', 'Show related articles', 'Try something else'],
    };
  }
  return {
    content: "I'm looking into that. Could you share more details?\n\n• What screen are you on?\n• Is a button disabled or missing?\n• Are you seeing an error?\n\nThe more context you share, the faster I can help!",
    suggestions: ["Can't submit TRF", "Component stuck", "Export issue"],
  };
}

// ── Component ──────────────────────────────────────
interface CarlosChatPanelProps {
  open: boolean;
  onClose: () => void;
}

export function CarlosChatPanel({ open, onClose }: CarlosChatPanelProps) {
  const location = useLocation();
  const { discover: discoverCards, topics: exploreTopics } = useMemo(
    () => getRouteContent(location.pathname),
    [location.pathname]
  );
  const [view, setView] = useState<PanelView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return mockArticles
      .filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [searchQuery]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setView('chat');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(msg);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        suggestions: response.suggestions,
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const goHome = () => {
    setView('home');
    setSearchQuery('');
    setSelectedArticle(null);
  };

  const openArticle = (article: HelpArticle) => {
    setSelectedArticle(article);
    setView('article');
    setSearchQuery('');
  };

  // ── Render helpers ────────────────────────────────
  const renderHeader = () => {
    const showBack = view !== 'home';
    return (
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={goHome} className="p-1 rounded hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <h3 className="font-semibold text-sm">Help</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Open Support Center">
            <Link to="/support-center" onClick={onClose}>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </button>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-5">
        {/* Search — Slack style */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Find answers quickly</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="How can we help?"
              className="pl-9 h-9 text-sm rounded-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) setView('search');
              }}
              onFocus={() => { if (searchQuery.trim()) setView('search'); }}
            />
          </div>
        </div>

        {/* Discover more — Slack horizontal carousel */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Discover more
            </p>
            <span className="text-[10px] text-muted-foreground">1/{discoverCards.length}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
            {discoverCards.map((card) => (
              <button
                key={card.title}
                onClick={() => {
                  const articles = mockArticles.filter(a => a.category === card.category);
                  if (articles.length > 0) openArticle(articles[0]);
                }}
                className="flex-shrink-0 w-[200px] snap-start rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors p-3 text-left"
              >
                <p className="text-xs font-semibold mb-0.5 line-clamp-1">{card.title}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{card.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Explore help topics — Slack list style */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Explore help topics
          </p>
          <div className="space-y-0.5">
            {exploreTopics.map((topic) => {
              const CatIcon = helpCategories[topic.category]?.icon || FileText;
              return (
                <button
                  key={topic.category}
                  onClick={() => {
                    setSearchQuery('');
                    // Show articles for this category in search view
                    const catArticles = mockArticles.filter(a => a.category === topic.category);
                    if (catArticles.length > 0) {
                      setSelectedArticle(null);
                      setSearchQuery(topic.label.split(' ')[0]); // trigger search
                      setView('search');
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CatIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors text-left flex-1">
                    {topic.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Help categories link */}
        <div className="pt-1">
          <Link to="/support-center" onClick={onClose}>
            <button className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-2">
              <BookOpen className="w-3 h-3" />
              Help categories
            </button>
          </Link>
        </div>
      </div>
    </ScrollArea>
  );

  const renderSearch = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search input persistent */}
      <div className="p-3 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Find answers quickly</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="How can we help?"
            className="pl-9 pr-8 h-9 text-sm rounded-lg"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value.trim()) setView('home');
            }}
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setView('home'); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Results list — Slack style with highlighted first result */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {searchResults.length > 0 ? (
            searchResults.map((article, i) => (
              <button
                key={article.id}
                onClick={() => openArticle(article)}
                className={cn(
                  'w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors',
                  i === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <FileText className={cn('w-4 h-4 shrink-0 mt-0.5', i === 0 ? 'text-primary-foreground/70' : 'text-muted-foreground')} />
                <span className={cn('text-sm leading-snug', i === 0 ? 'font-medium' : 'text-primary hover:underline')}>
                  {article.title}
                </span>
              </button>
            ))
          ) : (
            <div className="text-center py-10">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderArticle = () => {
    if (!selectedArticle) return null;
    return (
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Article title */}
          <div>
            <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
              {selectedArticle.title}
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </h3>
          </div>

          {/* Who can use callout — Slack style */}
          <div className="p-3 rounded-lg border border-border bg-muted/30">
            <p className="text-xs font-semibold mb-1.5">Who is this for?</p>
            <div className="space-y-1">
              {selectedArticle.roles.map(role => (
                <div key={role} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span className="capitalize">{role.replace('_', ' ')}s</span>
                </div>
              ))}
            </div>
          </div>

          {/* Article content */}
          <div className="text-sm leading-relaxed text-foreground space-y-3">
            <p>{selectedArticle.summary}</p>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  selectedArticle.content
                    .replace(/## (.*)/g, '<h3 class="text-sm font-bold mt-4 mb-2">$1</h3>')
                    .replace(/### (.*)/g, '<h4 class="text-sm font-semibold mt-3 mb-1">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/(\d+)\. (.*?)(?=\n|$)/g, '<div class="flex items-start gap-2 my-1"><span class="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">$1</span><span class="text-sm">$2</span></div>')
                    .replace(/\n\n/g, '</p><p class="mb-2">')
                    .replace(/\n/g, '<br/>')
                )
              }}
            />
          </div>
        </div>
      </ScrollArea>
    );
  };

  const renderChat = () => (
    <>
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">How can I help?</h4>
              <p className="text-xs text-muted-foreground mb-4 max-w-[220px] mx-auto">
                I can help with TRFs, testing, suppliers, and more.
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left px-2.5 py-2 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/30 transition-all text-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-2', message.role === 'user' ? 'flex-row-reverse' : '')}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-[10px]">
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  )}>
                    <div className="text-xs whitespace-pre-wrap leading-relaxed">
                      {message.content.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </div>
                    {message.suggestions && message.role === 'assistant' && (
                      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border/30">
                        {message.suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => handleSend(s)}
                            className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded bg-background border border-border hover:border-primary/40 hover:text-primary transition-colors"
                          >
                            {s} <ArrowRight className="w-2 h-2" />
                          </button>
                        ))}
                      </div>
                    )}
                    {message.role === 'assistant' && messages.indexOf(message) > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-border/20">
                        <span className="text-[9px] text-muted-foreground">Helpful?</span>
                        <button className="p-0.5 hover:text-primary transition-colors">
                          <ThumbsUp className="w-2.5 h-2.5 text-muted-foreground hover:text-primary" />
                        </button>
                        <button className="p-0.5 hover:text-destructive transition-colors">
                          <ThumbsDown className="w-2.5 h-2.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-[10px]">
                      <Bot className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Chat input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="flex-1 h-8 text-xs rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary px-4"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-8 w-8 rounded-full shrink-0 ai-gradient border-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </>
  );

  // ── Footer ──────────────────────────────────────
  const renderFooter = () => {
    if (view === 'chat') return null; // chat has its own input
    return (
      <div className="p-3 border-t border-border flex items-center justify-between">
        <Link to="/support-center" onClick={onClose} className="text-xs text-primary hover:underline flex items-center gap-1">
          <Ticket className="w-3 h-3" />
          Help requests
        </Link>
        <Link to="/support-center" onClick={onClose}>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Contact Us
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-20 right-6 z-50 w-[340px] h-[520px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
        >
          {renderHeader()}

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === 'home' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {view === 'home' && renderHome()}
              {view === 'search' && renderSearch()}
              {view === 'article' && renderArticle()}
              {view === 'chat' && renderChat()}
            </motion.div>
          </AnimatePresence>

          {renderFooter()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
