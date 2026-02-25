import { useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const DemoResetButton = () => {
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        navigate('/');
        toast.success('Demo reset', { description: 'Ready for next presentation' });
      }}
      className="text-xs text-muted-foreground gap-1.5"
    >
      <RotateCcw className="w-3 h-3" />
      Reset Demo
    </Button>
  );
};
