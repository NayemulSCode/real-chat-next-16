"use client";
// components/chat/message-input.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/chat-store";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: any) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  aiSuggestion?: string;
  onUseAiSuggestion?: (text: string) => void;
}

export const MessageInput = ({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  aiSuggestion,
  onUseAiSuggestion,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const { addMessage } = useChatStore();
  const { data: session } = useSession();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update the input when AI suggestion is used
  const handleUseAiSuggestion = () => {
    if (!aiSuggestion) return;
    setMessage(aiSuggestion);
    inputRef.current?.focus();
    onUseAiSuggestion?.(aiSuggestion);
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: {
        // @ts-ignore
        id: session?.user?.id || "",
        name: session?.user?.name || "",
        avatar: session?.user?.image || "",
      },
      timestamp: new Date(),
    };

    // Add the message to local state immediately for better UX
    addMessage({
      ...newMessage,
      isOwn: true,
    });

    // Send the message to the server
    onSendMessage(newMessage);

    setMessage("");
    onStopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (e.target.value.trim() === "") {
      onStopTyping();
      return;
    }

    // Start typing indicator
    onStartTyping();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 border-t">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2"
      >
        <Input
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
