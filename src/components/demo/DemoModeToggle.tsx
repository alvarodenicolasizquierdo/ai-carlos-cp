import { useDemoMode } from '@/contexts/DemoModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={isDemoMode}
          onCheckedChange={toggleDemoMode}
          id="demo-mode"
        />
        <Label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer">
          Demo
        </Label>
      </div>
      {isDemoMode && (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold tracking-wide"
        >
          CLIENT VIEW
        </Badge>
      )}
    </div>
  );
};
