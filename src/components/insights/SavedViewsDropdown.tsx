/**
 * SavedViewsDropdown - Role-based saved filter views
 */

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bookmark, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SavedView {
  id: string;
  label: string;
  role: string;
  filters: Record<string, string>;
}

interface SavedViewsDropdownProps {
  views: SavedView[];
  onSelect: (view: SavedView) => void;
}

export function SavedViewsDropdown({ views, onSelect }: SavedViewsDropdownProps) {
  const grouped = views.reduce<Record<string, SavedView[]>>((acc, v) => {
    (acc[v.role] = acc[v.role] || []).push(v);
    return acc;
  }, {});

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bookmark className="w-4 h-4" />
          Saved views
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.entries(grouped).map(([role, items], gi) => (
          <div key={role}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="flex items-center gap-2">
              {role}
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{items.length}</Badge>
            </DropdownMenuLabel>
            {items.map(v => (
              <DropdownMenuItem key={v.id} onClick={() => onSelect(v)}>
                {v.label}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
