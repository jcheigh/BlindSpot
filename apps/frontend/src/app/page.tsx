'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DifficultySelector } from '@/components/game/difficulty-selector';
import { Instructions } from '@/components/game/instructions';
import { useGame } from '@/lib/game-context';
import { Difficulty } from '@/lib/types';

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const { startGame, isLoading } = useGame();

  const handleStartGame = () => {
    if (selectedDifficulty) {
      startGame(selectedDifficulty);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">BlindSpot</h1>
          <p className="text-lg text-gray-600">
            Ask questions to find the AI's blind spot!
          </p>
        </div>

        <div className="space-y-8">
          <DifficultySelector onSelect={setSelectedDifficulty} />
          
          <Instructions className="mt-8" />
          
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              disabled={!selectedDifficulty || isLoading}
              onClick={handleStartGame}
              className="bg-red-500 text-white px-8 py-2 text-lg"
            >
              {isLoading ? 'Starting Game...' : 'Start Game'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
