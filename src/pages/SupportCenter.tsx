import { useState, useRef, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { sanitizeHtml, markdownToSafeHtml } from '@/lib/sanitize';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  BookOpen,
  Ticket,
  ShieldCheck,
  Search,
  Eye,
  Clock,
  Video,
  Mail,
  FileText,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types';
import { aiDemoResponses } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import {
  mockArticles,
  helpCategories,
  HelpCategory,
  HelpArticle,
} from '@/data/helpData';
import { SupportTickets } from '@/components/support/SupportTickets';
import { ContactUsForm } from '@/components/support/ContactUsForm';

// Import the HelpAdmin content
import HelpAdminContent from './HelpAdmin';

const suggestedQueries = [
  "How do I submit a TRF?",
  "Why is my component stuck pending?",
  "Export test results to PDF",
  "Flammability testing requirements"
];

// Ask Carlos Tab Content
function AskCarlosTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm CARLOS, your AI-powered support assistant. I can help you with:\n\n• **How-to questions** - "How do I submit a TRF?"\n• **Troubleshooting** - "Why is my component stuck pending?"\n• **Documentation** - "What tests are required for children's sleepwear?"\n• **Quick guides** - "Export test results to PDF"\n\nWhat can I help you with today?`,
      timestamp: new Date().toISOString(),
      suggestions: suggestedQueries
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let responseData = aiDemoResponses.default;

      if (lowerMessage.includes('trf') || lowerMessage.includes('submit')) {
        responseData = {
          response: "To submit a TRF:\n\n1. Navigate to **TRFs** from the sidebar\n2. Click **+ New TRF** button\n3. Fill in the product details and select tests\n4. Attach required documents\n5. Click **Submit for Review**\n\nThe TRF will be sent to the lab queue for processing.",
          suggestions: ["What documents are required?", "How long does review take?", "Track my TRF status"]
        };
      } else if (lowerMessage.includes('pending') || lowerMessage.includes('stuck')) {
        responseData = {
          response: "Components may be stuck pending due to:\n\n• **Missing documentation** - Check if all required docs are uploaded\n• **Awaiting approval** - Review the approval workflow status\n• **Lab queue delay** - Check lab capacity in the dashboard\n\nWould you like me to help you diagnose the specific issue?",
          suggestions: ["Check my pending items", "Escalate to support", "View approval workflow"]
        };
      } else if (lowerMessage.includes('export') || lowerMessage.includes('pdf')) {
        responseData = {
          response: "To export test results to PDF:\n\n1. Open the TRF or test report you want to export\n2. Click the **Export** button in the top-right\n3. Select **PDF** from the format options\n4. Choose which sections to include\n5. Click **Download**\n\nThe PDF will include all test results, certificates, and compliance stamps.",
          suggestions: ["Export multiple TRFs", "Customize PDF template", "Share report via email"]
        };
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.response,
        timestamp: new Date().toISOString(),
        suggestions: responseData.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Card className="h-[calc(100vh-280px)] flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-sidebar-background/5 to-sidebar-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Ask Carlos</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              AI-powered support • Instant answers
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", message.role === 'user' && "flex-row-reverse")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  message.role === 'assistant' ? "ai-gradient" : "bg-primary"
                )}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>

                <div className={cn("max-w-[80%] space-y-2", message.role === 'user' && "items-end")}>
                  <div className={cn(message.role === 'assistant' ? "ai-bubble" : "user-bubble")}>
                    <div 
                      className={cn(
                        "text-sm prose prose-sm max-w-none",
                        message.role === 'user' && "text-primary-foreground prose-invert"
                      )}
                      dangerouslySetInnerHTML={{ 
                        __html: markdownToSafeHtml(message.content)
                      }}
                    />
                  </div>

                  {message.suggestions && message.role === 'assistant' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleSend(suggestion)}
                        >
                          {suggestion}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.role === 'assistant' && index > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="ai-bubble">
                <div className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Carlos is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2 max-w-3xl mx-auto"
        >
          <Input
            placeholder="Ask Carlos anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            className="ai-gradient border-0 shrink-0"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Carlos searches knowledge articles first. Can't find an answer? Create a support ticket.
        </p>
      </div>
    </Card>
  );
}

// Knowledge Hub Tab — Slack Help Center style
function KnowledgeHubTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'positive' | 'negative' | 'submitted'>('idle');
  const [feedbackText, setFeedbackText] = useState('');

  const filteredArticles = (() => {
    let articles = mockArticles;
    if (selectedCategory) {
      articles = articles.filter(a => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return articles.sort((a, b) => b.viewCount - a.viewCount);
  })();

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'webinar': return Video;
      case 'guide': return BookOpen;
      case 'sop': return FileText;
      default: return Sparkles;
    }
  };

  // Common troubleshooting topics
  const commonTopics = [
    { label: 'TRF submissions', category: 'trfs' as HelpCategory },
    { label: 'testing levels', category: 'testing' as HelpCategory },
    { label: 'approvals', category: 'approvals' as HelpCategory },
  ];

  // Extract section headings from article content for "IN THIS ARTICLE" sidebar
  const extractSections = (content: string): string[] => {
    const matches = content.match(/## (.*)/g);
    return matches ? matches.map(m => m.replace('## ', '')) : [];
  };

  // Article detail view — Slack style with "IN THIS ARTICLE" sidebar
  if (selectedArticle) {
    const SourceIcon = selectedArticle.source ? getSourceIcon(selectedArticle.source.type) : FileText;
    const sections = extractSections(selectedArticle.content);

    // Render article content with numbered steps, notes, and tips — Slack style
    const renderArticleContent = (content: string) => {
      return content
        // Headings with id anchors
        .replace(/## (.*)/g, (_match, title) => {
          const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return `<h2 id="section-${id}" class="text-xl font-bold mt-10 mb-4 pb-2 border-b border-border scroll-mt-4">${title}</h2>`;
        })
        .replace(/### (.*)/g, '<h3 class="text-base font-semibold mt-6 mb-2">$1</h3>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Note callouts
        .replace(/> Note: (.*?)(?=\n|$)/g, '<div class="my-4 p-4 rounded-lg border-l-4 border-primary bg-primary/5 flex gap-3"><span class="text-primary text-lg">✏️</span><p class="text-sm"><strong>Note:</strong> $1</p></div>')
        // Tip callouts
        .replace(/> Tip: (.*?)(?=\n|$)/g, '<div class="my-4 p-4 rounded-lg border-l-4 border-accent bg-accent/10 flex gap-3"><span class="text-lg">✨</span><p class="text-sm"><strong>Tip:</strong> $1</p></div>')
        // Numbered lists — Slack style with colored circles
        .replace(/(\d+)\. (.*?)(?=\n|$)/g, (_match, num, text) => {
          return `<div class="flex items-start gap-3 my-2"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">${num}</span><span class="text-sm leading-relaxed">${text}</span></div>`;
        })
        // Paragraphs
        .replace(/\n\n/g, '</p><p class="mb-3 text-sm leading-relaxed">')
        .replace(/\n/g, '<br/>');
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0">
        {/* Category hero banner — Slack style */}
        <div className="rounded-t-xl bg-gradient-to-br from-sidebar-background to-sidebar-accent p-6 text-sidebar-foreground">
          <h2 className="text-xl font-bold tracking-tight">{helpCategories[selectedArticle.category].label}</h2>
          <p className="text-xs text-sidebar-foreground/60 mt-1">{helpCategories[selectedArticle.category].description}</p>
        </div>

        {/* Category tabs — Slack style */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px bg-card rounded-none">
          {Object.entries(helpCategories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => { setSelectedArticle(null); setSelectedCategory(key as HelpCategory); }}
              className={cn(
                'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                selectedArticle.category === key
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Breadcrumbs — Slack style */}
        <div className="py-3 px-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button onClick={() => { setSelectedArticle(null); setSelectedCategory(null); }} className="hover:text-primary transition-colors">
              Knowledge Hub
            </button>
            <span>&gt;</span>
            <button onClick={() => { setSelectedArticle(null); setSelectedCategory(selectedArticle.category); }} className="hover:text-primary transition-colors">
              {helpCategories[selectedArticle.category].label}
            </button>
            <span>&gt;</span>
            <span className="text-foreground truncate max-w-[200px]">{selectedArticle.title}</span>
          </div>
        </div>

        {/* Main content + sidebar layout — Slack style */}
        <div className="flex gap-8 items-start">
          {/* Article content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight mb-2">{selectedArticle.title}</h1>
            <p className="text-muted-foreground text-sm mb-6">{selectedArticle.summary}</p>

            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderArticleContent(selectedArticle.content)) }}
            />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Was this article helpful? — Slack interactive feedback flow */}
            <div className="mt-10 pt-8 border-t border-border text-center">
              <AnimatePresence mode="wait">
                {feedbackState === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="text-sm font-medium flex items-center justify-center gap-2 mb-4">
                      ✏️ Was this article helpful?
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-6 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setFeedbackState('positive')}
                      >
                        Yes, thanks!
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-6 rounded-lg"
                        onClick={() => setFeedbackState('negative')}
                      >
                        Not really
                      </Button>
                    </div>
                  </motion.div>
                )}

                {(feedbackState === 'positive' || feedbackState === 'negative') && (
                  <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto text-left">
                    <Textarea
                      placeholder={feedbackState === 'positive' ? 'What did you like about this article?' : 'How could we improve this article?'}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value.slice(0, 600))}
                      className="min-h-[100px] resize-y"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{feedbackText.length}/600</p>
                    <Button
                      className="mt-3 px-6"
                      variant={feedbackText.trim() ? 'default' : 'outline'}
                      onClick={() => {
                        setFeedbackState('submitted');
                        setFeedbackText('');
                      }}
                    >
                      Submit article feedback
                    </Button>
                  </motion.div>
                )}

                {feedbackState === 'submitted' && (
                  <motion.div key="thanks" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                    <p className="text-base font-semibold flex items-center justify-center gap-2">😊 Awesome!</p>
                    <p className="text-sm text-muted-foreground mt-2">Thanks so much for your feedback!</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      If you'd like a member of our support team to respond, please{' '}
                      <button className="text-primary underline">create a ticket</button>.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* IN THIS ARTICLE sidebar — Slack style sticky */}
          {sections.length > 0 && (
            <div className="hidden lg:block w-56 shrink-0 sticky top-24">
              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">In this article</p>
                <div className="space-y-1">
                  {sections.map((section) => {
                    const sectionId = section.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    const isActive = activeSection === section;
                    return (
                      <button
                        key={section}
                        onClick={() => {
                          setActiveSection(section);
                          document.getElementById(`section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={cn(
                          'block w-full text-left text-sm py-1.5 px-2 rounded transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        {section}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mt-6">
          ← Back to Knowledge Hub
        </Button>
      </motion.div>
    );
  }

  // Category detail view — Slack-style two-column article links grouped by tag
  if (selectedCategory && !searchQuery) {
    const catInfo = helpCategories[selectedCategory];
    const CatIcon = catInfo.icon;
    const catArticles = mockArticles.filter(a => a.category === selectedCategory);

    // Group articles by first tag
    const tagGroups: Record<string, HelpArticle[]> = {};
    catArticles.forEach(a => {
      const tag = a.tags[0] || 'General';
      if (!tagGroups[tag]) tagGroups[tag] = [];
      tagGroups[tag].push(a);
    });

    return (
      <div className="space-y-6">
        {/* Category hero — Slack style */}
        <div className="rounded-xl bg-gradient-to-br from-sidebar-background to-sidebar-accent p-8 text-sidebar-foreground">
          <h2 className="text-2xl font-bold tracking-tight">{catInfo.label}</h2>
          <p className="text-sm text-sidebar-foreground/70 mt-1">{catInfo.description}</p>
        </div>

        {/* Category tabs — Slack style horizontal nav */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px">
          {Object.entries(helpCategories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as HelpCategory)}
              className={cn(
                'px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                selectedCategory === key
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Two-column article links grouped by tag — Slack style */}
        <div className="space-y-8 max-w-4xl">
          {Object.entries(tagGroups).map(([tag, articles]) => (
            <div key={tag} className="border-b border-border pb-8 last:border-0">
              <div className="flex items-center gap-2 mb-4">
                <CatIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold capitalize">{tag}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {articles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="text-left text-sm text-primary hover:underline py-1 flex items-start gap-1.5"
                  >
                    <span className="text-muted-foreground mt-1.5">•</span>
                    <span>{article.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="mt-4">
          ← Back to all categories
        </Button>
      </div>
    );
  }

  // Search results view
  if (searchQuery) {
    return (
      <div className="space-y-6">
        {/* Search bar persistent */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles, guides, and FAQs..."
              className="pl-12 h-12 text-base rounded-xl border-border focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="default" size="sm" className="rounded-full" onClick={() => setSelectedCategory(null)}>
            All Topics
          </Button>
          {Object.entries(helpCategories).map(([key, cat]) => (
            <Button
              key={key}
              variant={selectedCategory === (key as HelpCategory) ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === (key as HelpCategory) ? null : key as HelpCategory)}
              className="rounded-full"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
        </p>

        <div className="space-y-3 max-w-3xl">
          {filteredArticles.map((article, i) => (
            <motion.button
              key={article.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedArticle(article)}
              className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all group"
            >
              <h4 className="font-medium text-sm group-hover:text-primary transition-colors mb-1">
                {article.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                <Badge variant="secondary" className="text-[10px] h-5">{helpCategories[article.category].label}</Badge>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No articles found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your search.</p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>Clear search</Button>
          </div>
        )}
      </div>
    );
  }

  // Default: hero + category grid — Slack Help Center style
  return (
    <div className="space-y-8">
      {/* Hero — Slack style */}
      <div className="rounded-xl bg-gradient-to-br from-sidebar-background to-sidebar-accent p-10 text-center text-sidebar-foreground">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Hi. How can we help?</h2>
        <div className="max-w-lg mx-auto mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sidebar-foreground/50" />
            <Input
              placeholder="Find anything (e.g. TRF status, care labels, approvals)"
              className="pl-12 h-12 text-base rounded-xl bg-background text-foreground border-0 shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-sidebar-foreground/60 mt-4">
          Common troubleshooting topics:{' '}
          {commonTopics.map((t, i) => (
            <span key={t.label}>
              <button
                onClick={() => setSelectedCategory(t.category)}
                className="underline hover:text-sidebar-foreground transition-colors"
              >
                {t.label}
              </button>
              {i < commonTopics.length - 1 && ', '}
            </span>
          ))}
        </p>
      </div>

      {/* Category grid — 3x2 Slack style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(helpCategories).map(([key, cat]) => (
          <motion.button
            key={key}
            onClick={() => setSelectedCategory(key as HelpCategory)}
            className="p-6 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 hover:shadow-soft transition-all text-center group"
            whileHover={{ y: -3 }}
          >
            <cat.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm mb-1">{cat.label}</p>
            <p className="text-xs text-muted-foreground">{cat.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function SupportCenter() {
  useEffect(() => { tagScreen('ai-support'); }, []);
  const { currentUser } = useUser();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <AppLayout title="Support Center" subtitle="AI-powered help, knowledge base, and support tickets">
      <Tabs defaultValue="ask-carlos" className="space-y-6">
        <TabsList className={cn("grid w-full max-w-2xl mx-auto h-11", isAdmin ? "grid-cols-5" : "grid-cols-4")}>
          <TabsTrigger value="ask-carlos" className="gap-2 text-sm">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ask Carlos</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge-hub" className="gap-2 text-sm">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Knowledge</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Contact Us</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2 text-sm">
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Tickets</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="help-admin" className="gap-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="ask-carlos">
          <AskCarlosTab />
        </TabsContent>

        <TabsContent value="knowledge-hub">
          <KnowledgeHubTab />
        </TabsContent>

        <TabsContent value="contact">
          <ContactUsForm />
        </TabsContent>

        <TabsContent value="tickets">
          <SupportTickets />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="help-admin">
            <HelpAdminContent />
          </TabsContent>
        )}
      </Tabs>
    </AppLayout>
  );
}
