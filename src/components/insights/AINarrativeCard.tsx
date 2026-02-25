/**
 * AINarrativeCard - AI "What changed" / "Why it matters" placeholder
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface AINarrativeCardProps {
  title: string;
  bullets: string[];
}

export function AINarrativeCard({ title, bullets }: AINarrativeCardProps) {
  return (
    <Card className="border-l-4 border-l-accent">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full ai-gradient flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm">{title}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">AI</Badge>
        </div>
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              {b}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
