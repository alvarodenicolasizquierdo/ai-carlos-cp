import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contactFormSchema } from '@/lib/validation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, BookOpen, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  helpCategories,
  HelpCategory,
  mockArticles,
  contextualQuestions,
} from '@/data/helpData';

type FormStep = 'form' | 'submitted';

const topicChips: { label: string; category: HelpCategory }[] = [
  { label: 'TRF Issues', category: 'trfs' },
  { label: 'Testing & Labs', category: 'testing' },
  { label: 'Approvals', category: 'approvals' },
  { label: 'Suppliers', category: 'suppliers' },
  { label: 'Components', category: 'components' },
  { label: 'Care Labelling', category: 'care_labelling' },
  { label: 'Reports', category: 'reporting' },
  { label: 'Admin & Settings', category: 'admin' },
];

// Related questions per topic
const topicQuestions: Record<string, { question: string; answer: string }[]> = {
  trfs: [
    { question: 'How do I submit a TRF?', answer: 'Navigate to TRFs from the sidebar, click "+ New TRF", fill in the product details and select tests, attach required documents, then click "Submit for Review".' },
    { question: 'Why is my TRF stuck in pending?', answer: 'Common reasons include: awaiting approver action, missing required documents, or the approver doesn\'t have a sufficient entitlement level. Check the TRF timeline for specific blockers.' },
    { question: 'How do I resubmit a failed TRF?', answer: 'Click "Create Retest Request" on the failed TRF. This creates a linked TRF that retains the original context but allows updated samples to be submitted.' },
    { question: 'What is the SLA for TRF approval?', answer: 'Standard SLA is 48 hours from test completion. Critical items have a 24-hour SLA. SLA timers are visible on each TRF card.' },
  ],
  testing: [
    { question: 'What are Base, Bulk, and Product testing?', answer: 'These are three sequential testing gates. Base tests raw materials, Bulk tests production samples (requires Base approval first), and Product tests finished garments before shipment.' },
    { question: 'Why is Bulk testing blocked?', answer: 'Bulk testing is blocked until Base testing is approved. This prevents wasted testing costs on materials that may fail initial screening.' },
    { question: 'How do I view test results?', answer: 'Open the TRF and navigate to the "Test Results" tab. You can also export results as PDF from the Export button.' },
  ],
  approvals: [
    { question: 'Why can\'t I approve this TRF?', answer: 'Your ability to approve depends on your Self-Approval Level (None/Bronze/Silver/Gold). Check Settings > Approval Levels for your current entitlement.' },
    { question: 'How do I request a higher approval level?', answer: 'Contact your admin or governance team. Higher levels require governance training completion.' },
    { question: 'What does each approval level allow?', answer: 'None = no approvals. Bronze = risk < 30. Silver = risk < 60. Gold = most TRFs except governance-flagged items.' },
  ],
  suppliers: [
    { question: 'How do I add a new supplier?', answer: 'Navigate to Suppliers and click "+ New Supplier". Fill in required fields including name, location, and compliance status.' },
    { question: 'How do I check supplier compliance?', answer: 'Open the supplier profile to see their compliance dashboard, including certificate status and audit history.' },
  ],
  components: [
    { question: 'Why can\'t I unlink this component?', answer: 'Components cannot be unlinked after Base testing has been approved to prevent invalidating completed tests. Contact QA for exceptions.' },
    { question: 'What is the 10% area rule?', answer: 'Components covering more than 10% of total garment area require full testing. Smaller components are eligible for reduced testing.' },
  ],
  care_labelling: [
    { question: 'How do I create a care label package?', answer: 'Go to Care Labelling, click "New Package", add fiber content, select care symbols, and specify target markets. AI can suggest instructions based on fabric composition.' },
  ],
  reporting: [
    { question: 'How do I export reports?', answer: 'Navigate to Analytics, select the report type, configure filters, and click the Export button. Reports are available in PDF and CSV formats.' },
  ],
  admin: [
    { question: 'How do I manage user roles?', answer: 'Go to Settings > Users & Roles. You can assign roles (buyer, supplier, lab technician, manager) and configure permissions.' },
  ],
};

export function ContactUsForm() {
  const [step, setStep] = useState<FormStep>('form');
  const [email, setEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategory = topicChips.find(t => t.label === selectedTopic)?.category;
  const relatedQuestions = selectedCategory ? (topicQuestions[selectedCategory] || []) : [];
  const relatedArticles = selectedCategory
    ? mockArticles.filter(a => a.category === selectedCategory).slice(0, 3)
    : [];

  const handleSubmit = () => {
    const result = contactFormSchema.safeParse({
      email,
      topic: selectedTopic || '',
      details,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(e => {
        if (e.path[0]) fieldErrors[String(e.path[0])] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep('submitted');
  };

  const handleReset = () => {
    setStep('form');
    setEmail('');
    setSelectedTopic(null);
    setDetails('');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'submitted' ? (
        <motion.div
          key="submitted"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center py-16 max-w-2xl mx-auto"
        >
          {/* Thank you — Slack style */}
          <div className="rounded-xl bg-gradient-to-br from-sidebar-background to-sidebar-accent p-10 text-sidebar-foreground mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Thank you for contacting us!</h2>
            <p className="text-sidebar-foreground/70">
              We're looking forward to helping as quickly as we can. In the meantime, you can discover more about CARLOS in our Knowledge Hub.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleReset} className="px-8">
              Visit the Knowledge Hub
            </Button>
            <Button variant="outline" onClick={handleReset} className="px-8">
              See Your Support History
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Hero banner — Slack Contact Us style */}
          <div className="rounded-t-xl bg-gradient-to-br from-sidebar-background to-sidebar-accent p-8 text-sidebar-foreground mb-0">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h2>
            <p className="text-sidebar-foreground/70 text-sm">
              Already use CARLOS? We'll tailor your support experience. If that's not possible, we'd still like to hear from you.
            </p>
          </div>

          {/* Form card — Slack style */}
          <div className="max-w-2xl border border-border rounded-b-xl bg-card p-8 space-y-8">
            {/* Email */}
            <div>
              <label className="text-sm font-bold block mb-2">Your Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                className={cn("h-12 text-base", errors.email && "border-destructive")}
                maxLength={255}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Topic selection — Slack chip style */}
            {!selectedTopic ? (
              <div>
                <label className="text-sm font-bold block mb-3">Select a topic:</label>
                <div className="flex flex-wrap gap-2">
                  {topicChips.map(chip => (
                    <button
                      key={chip.label}
                      onClick={() => setSelectedTopic(chip.label)}
                      className="px-4 py-2 rounded-full border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-colors text-sm"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="text-sm font-bold block mb-2">Or tell us what you need help with:</label>
                  <Input
                    placeholder='Enter a topic, like "notifications"'
                    className="h-10"
                    maxLength={200}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                        setSelectedTopic((e.target as HTMLInputElement).value.trim());
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Selected topic badge — Slack style */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-bold">Topic</label>
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="text-xs text-primary hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <Badge className="px-4 py-1.5 text-sm rounded-full">
                    {selectedTopic}
                  </Badge>
                </div>

                {/* Related questions — Slack accordion style */}
                {relatedQuestions.length > 0 && (
                  <div>
                    <label className="text-sm font-bold block mb-3">Related questions</label>
                    <Accordion type="single" collapsible className="border border-border rounded-lg overflow-hidden">
                      {relatedQuestions.map((q, i) => (
                        <AccordionItem key={i} value={`q-${i}`} className="border-b border-border last:border-0">
                          <AccordionTrigger className="px-4 py-3 text-sm font-normal hover:no-underline hover:bg-muted/30">
                            {q.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                            {q.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Related articles — Slack style links */}
                {relatedArticles.length > 0 && (
                  <div>
                    <label className="text-sm font-bold block mb-3">Related articles</label>
                    <div className="space-y-2">
                      {relatedArticles.map(article => (
                        <a
                          key={article.id}
                          href="#"
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          onClick={(e) => e.preventDefault()}
                        >
                          {article.title}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details textarea — Slack style */}
                <div>
                  <label className="text-sm font-bold block mb-2">Can you give us more details?</label>
                  <Textarea
                    placeholder="Add any additional information we can use to help you."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="min-h-[120px] resize-y"
                    maxLength={5000}
                  />
                </div>

                {/* Submit button — Slack style */}
                <div className="space-y-4">
                  <Button
                    onClick={handleSubmit}
                    className="px-8 h-11 text-sm font-semibold uppercase tracking-wider"
                    disabled={!email.trim()}
                  >
                    Send Us a Message
                  </Button>
                  <p className="text-xs text-primary hover:underline cursor-pointer">
                    Privacy Policy
                  </p>
                </div>
              </motion.div>
            )}

            {/* GET HELP button when no topic selected yet */}
            {!selectedTopic && (
              <Button
                className="px-8 h-11 text-sm font-semibold uppercase tracking-wider"
                disabled
              >
                Get Help
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
