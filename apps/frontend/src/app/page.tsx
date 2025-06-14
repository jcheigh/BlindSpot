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
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent tracking-wide">
              BlindSpot
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 rounded-lg blur opacity-10"></div>
          </div>
          <p className="text-xl text-blue-200 font-medium tracking-wide">
            Find the AI&apos;s Blind Spot! 
          </p>
        </div>

        <div className="space-y-10">
          <DifficultySelector onSelect={setSelectedDifficulty} />
          
          <Instructions />
          
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              disabled={!selectedDifficulty || isLoading}
              onClick={handleStartGame}
              className="relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 text-xl font-bold rounded-xl shadow-2xl shadow-red-900/50 transform transition-all duration-200 hover:scale-105 hover:shadow-red-900/70 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            >
              <span className="relative z-10">
                {isLoading ? 'Initializing...' : 'Start Game'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 hover:opacity-20 rounded-xl transition-opacity duration-200"></div>
            </Button>
          </div>
        </div>
      </div> 
    </main>
  );
}
