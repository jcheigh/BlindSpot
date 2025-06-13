'use client';

import { useState } from 'react';
import { CustomRuntime } from "@/components/assistant-ui/custom-runtime";
import { Thread } from '@/components/assistant-ui/thread';
import { Button } from '@/components/ui/button';
import { useGame } from '@/lib/game-context';
import { sendGuess } from '@/lib/api';

export function GameContent() {
  const { session } = useGame();
  const [guessInput, setGuessInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isGuessing, setIsGuessing] = useState(false);

  const handleGuess = async () => {
    if (!session || !guessInput.trim()) return;
    
    setIsGuessing(true);
    try {
      const result = await sendGuess(session.id, guessInput.trim());
      if ('correct' in result && result.correct) {
        setShowCelebration(true);
      }
    } catch (error) {
      console.error('Failed to submit guess:', error);
    } finally {
      setIsGuessing(false);
      setGuessInput('');
    }
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-8">🎉</div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Congratulations!
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            You've successfully uncovered the hidden concept!
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 text-xl font-bold rounded-xl"
          >
            Play Again
          </Button>
        </div>
      </div>
    );
  }
  return (
    session && (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              BlindSpot
            </h1>
            <p className="text-slate-300">Find the AI's Blind Spot!</p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <CustomRuntime sessionId={session.id}>
                <Thread />
              </CustomRuntime>
            </div>
  
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Make Your Guess</h3>
              <div className="space-y-4">
                <textarea
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="What do you think the hidden concept is?"
                  className="w-full h-32 p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleGuess}
                  disabled={!guessInput.trim() || isGuessing}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 font-semibold rounded-lg"
                >
                  {isGuessing ? "Submitting..." : "Submit Guess"}
                </Button>
              </div>
  
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="text-sm text-slate-400 space-y-2">
                  <div>Messages: {session.messages.length}</div>
                  <div>Guesses: {session.guessCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}