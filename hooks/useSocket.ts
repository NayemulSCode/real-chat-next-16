// hooks/useSocket.ts
import { useChatStore } from "@/store/chat-store";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (room: string) => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const { addMessage, setConnected, addTypingUser, removeTypingUser } =
    useChatStore();

  useEffect(() => {
    if (!session) return;

    // Initialize socket connection with the correct path
    socketRef.current = io("http://localhost:3000", {
      path: "/api/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    socketRef.current.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
      setConnected(false);
    });
    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);

      // Join the room
      socketRef.current?.emit("join-room", room);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected from server. Reason:", reason);
      setConnected(false);
    });

    socketRef.current.on("new-message", (data) => {
      console.log("Received new message:", data);
      // Add the message to the store
      addMessage({
        id: Date.now().toString(),
        text: data.message.text,
        sender: data.message.sender,
        timestamp: new Date(data.timestamp),
        isOwn: data.senderId === socketRef.current?.id,
      });
    });

    socketRef.current.on("user-typing", (user) => {
      addTypingUser(user);
    });

    socketRef.current.on("user-stop-typing", (user) => {
      removeTypingUser(user);
    });

    // Clean up on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [
    session,
    room,
    addMessage,
    setConnected,
    addTypingUser,
    removeTypingUser,
  ]);

  const sendMessage = (message: any) => {
    console.log("Sending message:", message);
    socketRef.current?.emit("send-message", { room, message });
  };

  const startTyping = () => {
    socketRef.current?.emit("typing", {
      room,
      user: session?.user?.name || "",
    });
  };

  const stopTyping = () => {
    socketRef.current?.emit("stop-typing", {
      room,
      user: session?.user?.name || "",
    });
  };

  return { sendMessage, startTyping, stopTyping };
};
