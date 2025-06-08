'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Difficulty } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  className?: string;
}

export function DifficultySelector({ onSelect, className }: DifficultySelectorProps) {
  const [selected, setSelected] = useState<Difficulty | null>(null);

  const handleSelect = (difficulty: Difficulty) => {
    setSelected(difficulty);
    onSelect(difficulty);
  };

  const difficulties: Array<{
    value: Difficulty;
    label: string;
    description: string;
  }> = [
    {
      value: 'easy',
      label: 'Easy',
      description: 'Common everyday concepts that are easy to guess',
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Moderately challenging concepts that require some thought',
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'Difficult abstract concepts that will test your reasoning',
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-lg font-semibold">Select Difficulty</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {difficulties.map((difficulty) => (
          <Card
            key={difficulty.value}
            className={cn(
              'cursor-pointer transition-colors hover:border-primary',
              selected === difficulty.value
                ? 'border-2 border-primary bg-primary/5'
                : 'border border-gray-200'
            )}
            onClick={() => handleSelect(difficulty.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id={difficulty.value}
                  name="difficulty"
                  value={difficulty.value}
                  checked={selected === difficulty.value}
                  onChange={() => handleSelect(difficulty.value)}
                  className="h-4 w-4 accent-primary"
                />
                <label
                  htmlFor={difficulty.value}
                  className="text-base font-medium cursor-pointer"
                >
                  {difficulty.label}
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">{difficulty.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}