// store/chat-store.ts
import { Message } from "@/types";
import { create } from "zustand";

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  typingUsers: string[];
  addMessage: (message: Message) => void;
  setConnected: (isConnected: boolean) => void;
  setTypingUsers: (users: string[]) => void;
  addTypingUser: (user: string) => void;
  removeTypingUser: (user: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isConnected: false,
  typingUsers: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setConnected: (isConnected) => set({ isConnected }),
  setTypingUsers: (users) => set({ typingUsers: users }),
  addTypingUser: (user) =>
    set((state) => ({
      typingUsers: [...state.typingUsers.filter((u) => u !== user), user],
    })),
  removeTypingUser: (user) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u !== user),
    })),
}));
