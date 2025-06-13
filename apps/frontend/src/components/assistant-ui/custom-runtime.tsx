"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ThreadMessage
} from "@assistant-ui/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function CustomRuntime({
  children,
  sessionId,
}: Readonly<{
  children: ReactNode;
  sessionId: string;
}>) {
    const CustomModelAdapter: ChatModelAdapter = {
        async run({ messages, abortSignal }) {
            const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  messages: (messages as ThreadMessage[]).map((m) => ({
                    role: m.role,
                    content: m.content
                      .filter((c) => c.type === "text")
                      .map((c) => c.text)
                      .join("\n"),
                  })),
                }),
                signal: abortSignal,
              });
        
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data: { message: string } = await response.json();
            return {
                content: [{ type: "text", text: data.message }],
            };
            },
        };

  const runtime = useLocalRuntime(CustomModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
