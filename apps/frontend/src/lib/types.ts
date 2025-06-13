import React from 'react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ErrorResponse {
  error: string;
}
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface GameSession {
  id: string;
  difficulty: Difficulty;
  messages: Message[];
  targetConcept: string;
  guessCount: number;
  revealed: boolean;
}

export interface GameContextType {
  session: GameSession | null;
  setSession: React.Dispatch<React.SetStateAction<GameSession | null>>;
  isLoading: boolean;
  error: Error | null;
  startGame: (difficulty: Difficulty) => Promise<void>;
  sendChat: (content: string) => Promise<void>;
  sendGuess: (guess: string) => Promise<boolean>;
  revealAnswer: () => Promise<void>;
}