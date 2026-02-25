import { TRF, TRFStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageSquare,
  Sparkles,
  RotateCcw,
  Send,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { tagEvent } from '@/utils/clarityTracking';
import { DisabledButtonHelp } from '@/components/help/InlineHelpTooltip';
import { useUser } from '@/contexts/UserContext';
import { AIDisclaimerBanner } from '@/components/compliance/AIDisclaimerBanner';
import { MandatoryCommentModal } from '@/components/compliance/MandatoryCommentModal';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';

interface TRFApprovalWorkflowProps {
  trf: TRF;
}

export function TRFApprovalWorkflow({ trf }: TRFApprovalWorkflowProps) {
  const { currentUser } = useUser();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [retestModalOpen, setRetestModalOpen] = useState(false);
  const [showExplainability, setShowExplainability] = useState(false);

  // FIX 1: Buyers are read-only — no approval actions
  const isBuyer = currentUser.role === 'buyer';

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      tagEvent('trf_approved', trf.reference);
      toast.success('TRF Approved', {
        description: `${trf.reference} has been approved successfully.`
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleRejectConfirm = (reason: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      tagEvent('trf_rejected', trf.reference);
      toast.error('TRF Rejected', {
        description: `${trf.reference} has been rejected. Reason: ${reason.substring(0, 50)}...`
      });
      setIsSubmitting(false);
      setComment('');
    }, 1000);
  };

  const handleRetestConfirm = (reason: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      tagEvent('trf_retest_requested', trf.reference);
      toast.info('Retest Requested', {
        description: `Retest request sent for ${trf.reference}. Reason: ${reason.substring(0, 50)}...`
      });
      setIsSubmitting(false);
    }, 1000);
  };

  // FIX 2: Reframed AI recommendation — advisory only, with explainability
  const aiRecommendation = {
    confidence: { low: 72, high: 86 },
    basis: 'Analysis of 89 historical TRFs from this supplier, covering Jan 2024 – Jan 2026',
    factors: 'Supplier historical pass rate (92%), fabric category risk profile (medium), seasonal volume patterns',
    reasoning: 'Based on historical patterns, this submission has a higher-than-average review priority. All critical tests passed. pH level deviation (9.1 vs 9.0 threshold) is within acceptable tolerance per company guidelines.',
    methodology: 'Weighted analysis of: supplier track record (40%), fabric category (25%), seasonal trends (20%), order volume (15%)',
    deterministicSplit: '65% of this score is based on recorded test history (deterministic). 35% is AI-estimated from pattern matching against similar suppliers/fabrics.',
    sampleSize: 89,
    risks: [
      'Minor pH deviation may require documentation for EU export',
      'Recommend adding wash care instructions for pH-sensitive colors'
    ]
  };

  const isActionable = trf.status === 'pending_review' || trf.status === 'in_progress';

  return (
    <div className="space-y-4">
      {/* FIX 2: AI Disclaimer Banner */}
      <AIDisclaimerBanner />

      {/* FIX 2: Reframed AI Recommendation — advisory only */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">AI-Assisted Review Prioritisation (Beta)</h4>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Confidence: {aiRecommendation.confidence.low}–{aiRecommendation.confidence.high}%
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">
                  {aiRecommendation.sampleSize} data points
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                {aiRecommendation.reasoning}
              </p>

              {/* FIX 2: Prominent disclaimer */}
              <div className="p-2 rounded-md bg-amber-50 border border-amber-200 mb-3">
                <p className="text-[10px] font-semibold text-amber-800">
                  ⚠️ AI RECOMMENDATION ONLY — All approval decisions require human review. AI does not determine pass/fail outcomes.
                </p>
              </div>
              
              {aiRecommendation.risks.length > 0 && (
                <div className="space-y-1 mb-3">
                  <p className="text-xs font-medium text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Considerations:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                    {aiRecommendation.risks.map((risk, i) => (
                      <li key={i} className="list-disc">{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FIX 2: "Why this recommendation?" expandable */}
              <button
                onClick={() => setShowExplainability(!showExplainability)}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mb-2"
              >
                <Info className="w-3 h-3" />
                Why this recommendation?
                <ChevronDown className={cn("w-3 h-3 transition-transform", showExplainability && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showExplainability && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-lg border bg-background p-3 space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-foreground">Data basis: </span>
                        <span className="text-muted-foreground">{aiRecommendation.basis}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Key factors: </span>
                        <span className="text-muted-foreground">{aiRecommendation.factors}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Confidence range: </span>
                        <span className="text-muted-foreground">
                          {aiRecommendation.confidence.low}–{aiRecommendation.confidence.high}% — based on pattern similarity to 34 comparable past submissions
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Methodology: </span>
                        <span className="text-muted-foreground">{aiRecommendation.methodology}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Deterministic vs AI: </span>
                        <span className="text-muted-foreground">{aiRecommendation.deterministicSplit}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FIX 10: Last updated */}
              <LastUpdatedTimestamp className="mt-2" />

              {/* Feedback buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">Was this helpful?</span>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
        <span className="text-sm text-muted-foreground">Current Status</span>
        <Badge variant="outline" className={cn(
          trf.status === 'pending_review' && "bg-amber-100 text-amber-700 border-amber-200",
          trf.status === 'approved' && "bg-emerald-100 text-emerald-700 border-emerald-200",
          trf.status === 'rejected' && "bg-red-100 text-red-700 border-red-200",
          trf.status === 'in_progress' && "bg-blue-100 text-blue-700 border-blue-200"
        )}>
          {trf.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* FIX 1: Buyer sees read-only view — no action buttons */}
      {isBuyer ? (
        <div className="p-4 rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            Read-only view. Buyers cannot approve, reject, or modify test results.
          </p>
        </div>
      ) : (
        <>
          {/* Comment box */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Add Comment
            </label>
            <Textarea
              placeholder="Add notes or reasons for your decision..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <Separator />

          {/* Action buttons — FIX 7: Reject and Retest require mandatory comment modal */}
          {isActionable && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <div className="flex gap-2">
                {isSubmitting ? (
                  <DisabledButtonHelp reason="Your action is being processed.">
                    <Button className="flex-1 bg-emerald-600" disabled>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve TRF
                    </Button>
                  </DisabledButtonHelp>
                ) : (
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleApprove}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve TRF
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  disabled={isSubmitting}
                  onClick={() => setRejectModalOpen(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isSubmitting}
                onClick={() => setRetestModalOpen(true)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Request Retest
              </Button>

              {comment && (
                <Button variant="secondary" className="w-full" disabled={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  Add Comment Only
                </Button>
              )}
            </motion.div>
          )}

          {!isActionable && (
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">
                This TRF is not currently awaiting approval action.
              </p>
            </div>
          )}

          {/* FIX 7: Mandatory Comment Modals */}
          <MandatoryCommentModal
            open={rejectModalOpen}
            onOpenChange={setRejectModalOpen}
            actionLabel="Reject TRF"
            actionVariant="destructive"
            onConfirm={handleRejectConfirm}
          />
          <MandatoryCommentModal
            open={retestModalOpen}
            onOpenChange={setRetestModalOpen}
            actionLabel="Request Retest"
            actionVariant="default"
            onConfirm={handleRetestConfirm}
          />
        </>
      )}
    </div>
  );
}
