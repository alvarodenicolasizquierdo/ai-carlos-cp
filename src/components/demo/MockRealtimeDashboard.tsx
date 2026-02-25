import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Bell, Zap, Radio, PauseCircle, Plus, Clock, Shield, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { InternalOnly } from "@/components/demo/InternalOnly";


interface PriorityItem {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  entity_type: "trf" | "style" | "supplier" | "gsw";
  entity_id: string;
  reason: string;
  timestamp: string;
  isNew?: boolean;
}

const initialPriorities: PriorityItem[] = [
  {
    id: "p1",
    title: "TRF-1003 chemical test failure – REACH non-compliance",
    severity: "critical",
    entity_type: "trf",
    entity_id: "TRF-1003",
    reason: "AI detected formaldehyde levels exceeding EU limit (75 mg/kg vs 30 mg/kg threshold)",
    timestamp: "2 min ago",
  },
  {
    id: "p2",
    title: "Supplier Golden Textiles audit score dropped below threshold",
    severity: "high",
    entity_type: "supplier",
    entity_id: "SUP-042",
    reason: "Social compliance score fell from 82% to 61% after re-assessment",
    timestamp: "15 min ago",
  },
  {
    id: "p3",
    title: "Style SS24-POLO missing fiber composition for DPP",
    severity: "medium",
    entity_type: "style",
    entity_id: "STY-108",
    reason: "DPP submission deadline in 5 days; fiber data still incomplete",
    timestamp: "1 hr ago",
  },
];

const delayedAlert: PriorityItem = {
  id: "p-new-1",
  title: "Urgent: GSW submission deadline tomorrow – 3 styles incomplete",
  severity: "critical",
  entity_type: "gsw",
  entity_id: "GSW-BATCH-12",
  reason: "AI identified 3 styles missing mandatory test results for GSW batch submission",
  timestamp: "Just now",
  isNew: true,
};

const manualAlert: PriorityItem = {
  id: "p-manual",
  title: "New TRF-1047 requires immediate review – elevated lead content",
  severity: "critical",
  entity_type: "trf",
  entity_id: "TRF-1047",
  reason: "Lab results show lead content at 92 ppm (limit: 90 ppm). Marginal fail requires expert review.",
  timestamp: "Just now",
  isNew: true,
};

export function MockRealtimeDashboard() {
  const navigate = useNavigate();
  const [priorities, setPriorities] = useState<PriorityItem[]>(initialPriorities);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [hasAutoAdded, setHasAutoAdded] = useState(false);
  const [manualCount, setManualCount] = useState(0);

  // Auto-add delayed alert after 5s
  useEffect(() => {
    if (!liveUpdates || hasAutoAdded) return;
    const timer = setTimeout(() => {
      setPriorities((prev) => [delayedAlert, ...prev]);
      setHasAutoAdded(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [liveUpdates, hasAutoAdded]);

  const handleSimulate = useCallback(() => {
    const newItem: PriorityItem = {
      ...manualAlert,
      id: `p-manual-${manualCount}`,
      timestamp: "Just now",
      isNew: true,
    };
    setPriorities((prev) => [newItem, ...prev]);
    setManualCount((c) => c + 1);
  }, [manualCount]);

  const handleTakeAction = useCallback((item: PriorityItem) => {
    const routes: Record<PriorityItem["entity_type"], string> = {
      trf: "/trfs",
      style: "/styles",
      supplier: "/suppliers",
      gsw: "/gsw",
    };
    navigate(routes[item.entity_type]);
  }, [navigate]);

  const severityConfig = {
    critical: { bg: "bg-red-50 border-red-200", icon: "text-red-500", badge: "bg-red-100 text-red-700 border-red-200" },
    high: { bg: "bg-amber-50 border-amber-200", icon: "text-amber-500", badge: "bg-amber-100 text-amber-700 border-amber-200" },
    medium: { bg: "bg-blue-50 border-blue-200", icon: "text-blue-500", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  };

  const entityIcon = {
    trf: FileText,
    style: Shield,
    supplier: AlertTriangle,
    gsw: Clock,
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Priority Feed</h3>
          <Badge variant="secondary" className="text-xs">{priorities.length} items</Badge>
        </div>
          <div className="flex items-center gap-3">
            <InternalOnly>
              <div className="flex items-center gap-2">
                {liveUpdates ? (
                  <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                ) : (
                  <PauseCircle className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">
                  {liveUpdates ? "Live Updates Active" : "Paused"}
                </span>
                <Switch checked={liveUpdates} onCheckedChange={setLiveUpdates} />
              </div>
              <Button size="sm" variant="outline" onClick={handleSimulate} className="text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Simulate New Priority
              </Button>
            </InternalOnly>
          </div>
      </div>

      {/* Priority List */}
      <div className="divide-y">
        <AnimatePresence initial={false}>
          {priorities.map((item) => {
            const config = severityConfig[item.severity];
            const EntityIcon = entityIcon[item.entity_type];
            return (
              <motion.div
                key={item.id}
                initial={item.isNew ? { opacity: 0, height: 0, y: -20 } : false}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn("p-4", item.isNew && "bg-primary/5")}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                    <EntityIcon className={cn("w-4 h-4", config.icon)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                      {item.isNew && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 animate-pulse">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.reason}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={cn("text-[10px] capitalize", config.badge)}>
                        {item.severity}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 text-xs gap-1 text-primary hover:text-primary"
                    onClick={() => handleTakeAction(item)}
                  >
                    Take Action
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
