'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface InstructionsProps {
  className?: string;
}

export function Instructions({ className }: InstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const gameSteps = [
    { icon: '🎯', text: 'Pick your challenge level' },
    { icon: '❓', text: 'Ask strategic questions' },
    { icon: '🔍', text: 'Uncover hidden clues' },
    { icon: '💡', text: 'Make your guess' },
  ];

  return (
    <div className={cn('w-full', className)}>
      <div 
        className="bg-blue-900/40 backdrop-blur-sm border border-blue-700/40 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-600/60 hover:bg-blue-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <h3 className="text-xl font-bold text-blue-200">Game Rules</h3>
          </div>
          <button className="text-blue-300 hover:text-blue-100 transition-colors" aria-label="Toggle Instructions">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={cn('transition-transform duration-300', isOpen ? 'rotate-180' : '')}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
        
        {!isOpen && (
          <p className="text-blue-300/80 mt-2 text-sm">
            Discover the concept the model has forgotten through clever questioning.
          </p>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 bg-blue-900/50 backdrop-blur-sm border border-blue-700/40 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gameSteps.map((step, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl">{step.icon}</div>
                <p className="text-sm text-blue-200 font-medium">{step.text}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-blue-700/50 pt-4">
            <h4 className="text-lg font-semibold text-blue-200 mb-3">Pro Tips</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-200/90">
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▸</span>
                <span>Start broad, then narrow down</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">▸</span>
                <span>Ask about categories & properties</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">▸</span>
                <span>Watch for subtle AI clues</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">▸</span>
                <span>Fewer guesses = higher score</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}