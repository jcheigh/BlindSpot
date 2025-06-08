import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          variant === 'default' && 'bg-primary text-white',
          variant === 'secondary' && 'bg-secondary text-white',
          variant === 'outline' && 'border border-gray-200 text-gray-700',
          variant === 'success' && 'bg-green-100 text-green-800',
          variant === 'warning' && 'bg-yellow-100 text-yellow-800',
          variant === 'danger' && 'bg-red-100 text-red-800',
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };