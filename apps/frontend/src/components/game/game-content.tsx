'use client';

import { useState, useEffect } from 'react';
import { CustomRuntime } from "@/components/assistant-ui/custom-runtime";
import { Thread } from '@/components/assistant-ui/thread';
import { Button } from '@/components/ui/button';
import { useGame } from '@/lib/game-context';
import { sendGuess } from '@/lib/api';

export function GameContent() {
  const { session, setSession } = useGame();
  const [guessInput, setGuessInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isGuessing, setIsGuessing] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  
  const maxGuesses = 5;
  const maxMessages = 20;
  
  // Update message count when it changes
  useEffect(() => {
    if (session) {
      setMessageCount(session.messages.length);
    }
  }, [session]);
  
  useEffect(() => {
    const handleMessageSent = (event: CustomEvent) => {
      if (event.detail.sessionId === session?.id) {
        setMessageCount(prev => prev + 2); 
        setSession(prev => {
          if (!prev) return null;
          const newMessages = [...prev.messages];
          // Add placeholder messages to track count
          newMessages.push(
            {
              id: Date.now().toString() + '-user',
              content: '',
              role: 'user' as const,
              timestamp: new Date().toISOString()
            },
            {
              id: Date.now().toString() + '-assistant', 
              content: '',
              role: 'assistant' as const,
              timestamp: new Date().toISOString()
            }
          );
          return { ...prev, messages: newMessages };
        });
      }
    };

    window.addEventListener('messageSent', handleMessageSent as EventListener);
    return () => window.removeEventListener('messageSent', handleMessageSent as EventListener);
  }, [session?.id, setSession]);

  const handleGuess = async () => {
    if (!session || !guessInput.trim()) return;
    
    setIsGuessing(true);
    try {
      const result = await sendGuess(session.id, guessInput.trim());
      
      // Update session guess count
      setSession(prev => {
        if (!prev) return null;
        const newGuessCount = prev.guessCount + 1;
        return {
          ...prev,
          guessCount: newGuessCount
        };
      });
      
      if ('correct' in result && result.correct) {
        setShowCelebration(true);
      } else {
        // Check if max guesses reached
        if (session.guessCount + 1 >= maxGuesses) {
          setShowGameOver(true);
        }
      }
    } catch (error) {
      console.error('Failed to submit guess:', error);
    } finally {
      setIsGuessing(false);
      setGuessInput('');
    }
  };
  
  // Check for game over conditions
  useEffect(() => {
    if (session && ((session.guessCount ?? 0) >= maxGuesses || messageCount >= maxMessages) && !showCelebration && !showGameOver) {
      setShowGameOver(true);
    }
  }, [session, messageCount, maxGuesses, maxMessages, showCelebration, showGameOver]);

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-8">🎉</div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Congratulations!
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            You&apos;ve successfully uncovered the hidden concept!
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
  
  if (showGameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-8">💔</div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Game Over!
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            {(session?.guessCount ?? 0) >= maxGuesses ? 
              `You&apos;ve used all ${maxGuesses} guesses!` : 
              `You&apos;ve reached the maximum of ${maxMessages} messages!`}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
              BlindSpot
            </h1>
            <p className="text-slate-300">Find the AI&apos;s Blind Spot!</p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl border border-blue-700/40 shadow-xl overflow-hidden">
              <CustomRuntime sessionId={session.id}>
                <Thread />
              </CustomRuntime>
            </div>
  
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl border border-blue-700/40 shadow-xl p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Make Your Guess</h3>
                <p className="text-slate-300 text-sm">Think you know what the AI doesn&apos;t?</p>
              </div>
              <div className="space-y-4">
                <textarea
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="What do you think the hidden concept is?"
                  className="w-full h-32 p-4 bg-blue-800/30 border border-blue-600/50 rounded-lg text-white placeholder-blue-300/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Button
                  onClick={handleGuess}
                  disabled={!guessInput.trim() || isGuessing}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 font-semibold rounded-lg"
                >
                  {isGuessing ? "Submitting..." : "Submit Guess"}
                </Button>
              </div>
  
              <div className="mt-8 pt-8 border-t border-blue-700/50">
                <div className="bg-blue-800/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Messages Used:</span>
                    <span className="text-lg font-bold text-blue-400">{messageCount / 2}/{maxMessages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Guesses Left:</span>
                    <span className="text-lg font-bold text-red-400">{maxGuesses - session.guessCount}/{maxGuesses}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-700/50">
                    <div className="text-xs text-slate-400 text-center">
                      {messageCount / 2 >= maxMessages || session.guessCount >= maxGuesses ? 
                        "⚠️ Limit reached!" : 
                        "Keep exploring to find the blind spot!"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}