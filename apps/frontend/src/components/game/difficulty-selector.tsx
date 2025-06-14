'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Difficulty } from '@/lib/types';

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
    icon: string;
    color: string;
  }> = [
    {
      value: 'Easy',
      label: 'Easy',
      icon: '🟢',
      color: 'from-green-500 to-emerald-600',
    },
    {
      value: 'Medium',
      label: 'Medium',
      icon: '🟡',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      value: 'Hard',
      label: 'Hard',
      icon: '🔴',
      color: 'from-red-500 to-pink-600',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-2xl font-bold text-center text-blue-200 tracking-wide">Choose Your Challenge</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {difficulties.map((difficulty) => (
          <div
            key={difficulty.value}
            className={cn(
              'relative group cursor-pointer transition-all duration-300 transform hover:scale-105',
              selected === difficulty.value ? 'scale-105' : ''
            )}
            onClick={() => handleSelect(difficulty.value)}
          >
            <div
              className={cn(
                'relative bg-blue-900/40 backdrop-blur-sm border-2 rounded-xl p-6 shadow-xl transition-all duration-300',
                selected === difficulty.value
                  ? 'border-blue-400 shadow-blue-400/50 shadow-2xl bg-blue-800/60'
                  : 'border-blue-700/40 hover:border-blue-600/60 hover:shadow-blue-500/30'
              )}
            >
              <div className="text-center space-y-3">
                <div className="text-4xl">{difficulty.icon}</div>
                <h3 className="text-xl font-bold text-white">{difficulty.label}</h3>
                <div className={cn(
                  'w-full h-1 rounded-full bg-gradient-to-r',
                  difficulty.color
                )}></div>
              </div>
              
              {selected === difficulty.value && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              )}
              
              <input
                type="radio"
                id={difficulty.value}
                name="difficulty"
                value={difficulty.value}
                checked={selected === difficulty.value}
                onChange={() => handleSelect(difficulty.value)}
                className="sr-only"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}