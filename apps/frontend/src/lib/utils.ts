import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function useTimer(startTime?: string) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const start = new Date(startTime).getTime();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - start) / 1000);
      setElapsed(elapsedSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return formatTime(elapsed);
}