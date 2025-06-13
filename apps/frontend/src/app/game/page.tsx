'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { GameContent } from '@/components/game/game-content';
import { useGame } from '@/lib/game-context';

export default function GamePage() {
  const { session } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);
  console.log(session?.messages)
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-slate-300">No active game session. Redirecting to home...</p>
      </div>
    );
  }

  return <GameContent />;
}



