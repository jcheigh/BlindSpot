import { Difficulty, GameSession, Message, ErrorResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function startGame(difficulty: Difficulty): Promise<GameSession> {
  const response = await fetch(`${API_BASE_URL}/start?difficulty=${difficulty}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to start game session');
  }

  return response.json();
}

export async function sendChat(sessionId: string, prompt: string): Promise<Message | ErrorResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }), 
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}


export async function sendGuess(sessionId: string, guess: string): Promise<{ correct: boolean; targetConcept: string } | ErrorResponse> {
  const response = await fetch(`${API_BASE_URL}/guess/${sessionId}`, {
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
  const response = await fetch(`${API_BASE_URL}/reveal/${sessionId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to reveal answer');
  }

  return response.json();
}