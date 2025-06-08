'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CounterProps {
  label: string;
  value: number | string;
  className?: string;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger';
}

export function Counter({ label, value, className, variant = 'default' }: CounterProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <span className="text-xs text-gray-500 mb-1">{label}</span>
      <Badge variant={variant} className="text-xs font-medium px-3 py-1">
        {value}
      </Badge>
    </div>
  );
}