import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import { persistEntity } from "@/lib/backend-client";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface ContactState {
  messages: ContactMessage[];
  setMessages: (messages: ContactMessage[]) => void;
  sendMessage: (input: Omit<ContactMessage, "id" | "createdAt">) => ContactMessage;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      sendMessage: (input) => {
        const message: ContactMessage = { ...input, id: generateId("contact"), createdAt: new Date().toISOString() };
        set({ messages: [message, ...get().messages] });
        persistEntity("contact", message);
        return message;
      },
    }),
    { name: "emmapresh-contact" }
  )
);
