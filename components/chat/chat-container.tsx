// components/chat/chat-container.tsx
import { Card } from "@/components/ui/card";
import { useSocket } from "@/hooks/useSocket";
import { useChatStore } from "@/store/chat-store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AiSuggestion } from "./ai-suggestion";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { TypingIndicator } from "./typing-indicator";

export const ChatContainer = () => {
  const { data: session } = useSession();
  const { messages, isConnected, typingUsers } = useChatStore();
  // Use a specific room name for all users to join
  const roomName = "general-chat";
  const { sendMessage, startTyping, stopTyping } = useSocket(roomName);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const generateAiSuggestion = async (message: string) => {
    if (!message.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendMessage = (message: any) => {
    sendMessage(message);
    // Generate AI suggestion after sending a message
    // generateAiSuggestion(message.text);
  };

  const handleUseSuggestion = (suggestion: string) => {
    // This will be handled by the MessageInput component
    setAiSuggestion(""); // Clear the suggestion after using it
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chat Room</h1>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <MessageList
          messages={messages}
          currentUserId={session?.user?.id || ""}
        />
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
        <AiSuggestion
          suggestion={aiSuggestion}
          onUseSuggestion={handleUseSuggestion}
          isLoading={isAiLoading}
        />
        <MessageInput
          onSendMessage={handleSendMessage}
          onStartTyping={startTyping}
          onStopTyping={stopTyping}
          aiSuggestion={aiSuggestion}
          onUseAiSuggestion={handleUseSuggestion}
        />
      </Card>
    </div>
  );
};
