'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InstructionsProps {
  className?: string;
}

export function Instructions({ className }: InstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle>How to Play BlindSpot</CardTitle>
        <button className="text-gray-500 hover:text-gray-700" aria-label="Toggle Instructions">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          )}
        </button>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <div className="space-y-4">
            <p>
              BlindSpot is a concept guessing game where you need to figure out the hidden concept by asking questions.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Start by selecting a difficulty level - this determines how challenging the hidden concept will be.</li>
              <li>When the game begins, you'll be able to ask questions to an AI assistant to gather information about the concept.</li>
              <li>Use the chat window to ask questions. Be strategic! Ask questions that help narrow down possibilities.</li>
              <li>Once you have an idea of what the concept might be, use the Guess panel to submit your guess.</li>
              <li>You can make multiple guesses, but try to figure it out with as few guesses as possible!</li>
              <li>If you're stuck, you can always reveal the answer, but that means you didn't solve the puzzle.</li>
            </ol>
            <p className="font-semibold mt-4">Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Start with broad questions and gradually narrow down your focus.</li>
              <li>Ask about categories, properties, examples, and use cases.</li>
              <li>Pay attention to the AI's responses - they might contain subtle clues!</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}