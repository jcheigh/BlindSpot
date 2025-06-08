'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/game/top-bar';
import { ChatWindow } from '@/components/game/chat-window';
import { MessageInput } from '@/components/game/message-input';
import { GuessPanel } from '@/components/game/guess-panel';
import { useGame } from '@/lib/game-context';

export default function GamePage() {
  const { session, isLoading, sendMessage, makeGuess, revealAnswer } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No active game session. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar 
        startTime={session.startTime} 
        messageCount={session.messages.length} 
        guessCount={session.guessCount} 
      />
      
      <div className="flex flex-1 p-4 gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ChatWindow messages={session.messages} className="h-full" />
          </div>
          <div className="p-4 border-t border-gray-200">
            <MessageInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        </div>
        
        <div className="w-96 hidden md:block">
          <GuessPanel 
            onGuess={makeGuess}
            onReveal={revealAnswer}
            targetConcept={session.targetConcept}
            revealed={session.revealed}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Mobile guess panel */}
      <div className="block md:hidden p-4">
        <GuessPanel 
          onGuess={makeGuess}
          onReveal={revealAnswer}
          targetConcept={session.targetConcept}
          revealed={session.revealed}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}