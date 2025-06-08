'use client';

import { useState, FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GuessPanelProps {
  onGuess: (guess: string) => Promise<boolean>;
  onReveal: () => Promise<void>;
  targetConcept?: string;
  revealed: boolean;
  isLoading: boolean;
  className?: string;
}

export function GuessPanel({
  onGuess,
  onReveal,
  targetConcept,
  revealed,
  isLoading,
  className,
}: GuessPanelProps) {
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !isLoading) {
      const isCorrect = await onGuess(guess);
      setResult(isCorrect ? 'correct' : 'incorrect');
      if (!isCorrect) {
        setGuess('');
      }
    }
  };

  const handleReveal = async () => {
    if (!isLoading && !revealed) {
      await onReveal();
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>Make a Guess</CardTitle>
      </CardHeader>
      <CardContent>
        {revealed ? (
          <div className="text-center p-4">
            <p className="text-lg font-semibold mb-2">The concept was:</p>
            <div className="bg-green-100 text-green-800 p-3 rounded-md text-xl font-bold">
              {targetConcept}
            </div>
            {result === 'correct' && (
              <p className="mt-4 text-green-600">Congratulations! You guessed correctly!</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="guess" className="block text-sm font-medium text-gray-700 mb-1">
                What do you think the concept is?
              </label>
              <input
                id="guess"
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess..."
                disabled={isLoading}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {result === 'incorrect' && (
              <p className="text-red-500 text-sm">That's not correct. Try again!</p>
            )}
            <div className="flex justify-between gap-4">
              <Button
                type="submit"
                disabled={!guess.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Checking...' : 'Submit Guess'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleReveal}
                className="flex-1"
              >
                Reveal Answer
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        {!revealed && (
          <p>Try to guess with as few attempts as possible!</p>
        )}
      </CardFooter>
    </Card>
  );
}