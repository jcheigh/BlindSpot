export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface GameSession {
  id: string;
  difficulty: Difficulty;
  startTime: string;
  messages: Message[];
  targetConcept?: string;
  guessCount: number;
  revealed: boolean;
}

export interface GameContextType {
  session: GameSession | null;
  isLoading: boolean;
  error: Error | null;
  startGame: (difficulty: Difficulty) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  makeGuess: (guess: string) => Promise<boolean>;
  revealAnswer: () => Promise<void>;
}