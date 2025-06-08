import { Difficulty, GameSession, Message } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function startGame(difficulty: Difficulty): Promise<GameSession> {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ difficulty }),
  });

  if (!response.ok) {
    throw new Error('Failed to start game session');
  }

  return response.json();
}

export async function sendMessage(sessionId: string, content: string): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function makeGuess(sessionId: string, guess: string): Promise<{ correct: boolean; targetConcept?: string }> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guess }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit guess');
  }

  return response.json();
}

export async function revealAnswer(sessionId: string): Promise<{ targetConcept: string }> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/reveal`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to reveal answer');
  }

  return response.json();
}

export async function getSession(sessionId: string): Promise<GameSession> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to get session');
  }

  return response.json();
}