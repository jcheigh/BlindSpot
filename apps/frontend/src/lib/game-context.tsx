'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Difficulty, GameContextType, GameSession } from './types';
import * as api from './api';

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const startGame = async (difficulty: Difficulty) => {
    try {
      setIsLoading(true);
      setError(null);
      const newSession = await api.startGame(difficulty);
      setSession(newSession);
      router.push('/game');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!session) {
      throw new Error('No active game session');
    }

    try {
      setIsLoading(true);
      const message = await api.sendMessage(session.id, content);
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    } finally {
      setIsLoading(false);
    }
  };

  const makeGuess = async (guess: string): Promise<boolean> => {
    if (!session) {
      throw new Error('No active game session');
    }

    try {
      setIsLoading(true);
      const result = await api.makeGuess(session.id, guess);
      
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          guessCount: prev.guessCount + 1,
          targetConcept: result.correct ? result.targetConcept : prev.targetConcept,
          revealed: result.correct ? true : prev.revealed,
        };
      });
      
      return result.correct;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit guess'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const revealAnswer = async () => {
    if (!session) {
      throw new Error('No active game session');
    }

    try {
      setIsLoading(true);
      const result = await api.revealAnswer(session.id);
      
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          targetConcept: result.targetConcept,
          revealed: true,
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reveal answer'));
    } finally {
      setIsLoading(false);
    }
  };

  const value: GameContextType = {
    session,
    isLoading,
    error,
    startGame,
    sendMessage,
    makeGuess,
    revealAnswer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}