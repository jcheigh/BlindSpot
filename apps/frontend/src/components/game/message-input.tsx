'use client';

import { useState, FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  isLoading = false,
  className,
  placeholder = 'Ask a question about the concept...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-end gap-2', className)}>
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          rows={2}
          disabled={isLoading}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!message.trim() || isLoading}
        className="mb-1"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending
          </span>
        ) : (
          'Send'
        )}
      </Button>
    </form>
  );
}