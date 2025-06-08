'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          // Variants
          variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary text-white hover:bg-secondary/90',
          variant === 'outline' && 'border border-gray-300 bg-transparent hover:bg-gray-50',
          variant === 'ghost' && 'bg-transparent hover:bg-gray-50',
          // Sizes
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-10 px-4 py-2',
          size === 'lg' && 'h-11 px-8 py-2',
          // Disabled
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };