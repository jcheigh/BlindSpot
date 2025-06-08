'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';

interface ChatWindowProps {
  messages: Message[];
  className?: string;
}

export function ChatWindow({ messages, className }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={cn('h-full flex items-center justify-center', className)}>
        <p className="text-gray-500 text-center">
          Start the conversation by asking a question about the hidden concept.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4 p-4 overflow-y-auto', className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'max-w-[80%] rounded-lg p-3',
            message.role === 'user'
              ? 'bg-primary text-white self-end rounded-br-none'
              : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="text-xs opacity-70 mt-1 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}