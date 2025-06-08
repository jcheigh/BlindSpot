'use client';

import Link from 'next/link';
import { cn, useTimer } from '@/lib/utils';
import { Counter } from './counter';

interface TopBarProps {
  startTime?: string;
  messageCount: number;
  guessCount: number;
  className?: string;
}

export function TopBar({ startTime, messageCount, guessCount, className }: TopBarProps) {
  const elapsed = useTimer(startTime);

  return (
    <div className={cn('bg-white border-b border-gray-200 py-2 px-4', className)}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          BlindSpot
        </Link>
        
        <div className="flex items-center gap-6">
          <Counter label="Time" value={elapsed} variant="outline" />
          <Counter label="Messages" value={messageCount} variant="secondary" />
          <Counter label="Guesses" value={guessCount} variant={guessCount > 0 ? 'warning' : 'outline'} />
        </div>
      </div>
    </div>
  );
}