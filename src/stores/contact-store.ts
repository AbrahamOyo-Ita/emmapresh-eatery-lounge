import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";

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
  sendMessage: (input: Omit<ContactMessage, "id" | "createdAt">) => ContactMessage;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      messages: [],
      sendMessage: (input) => {
        const message: ContactMessage = { ...input, id: generateId("contact"), createdAt: new Date().toISOString() };
        set({ messages: [message, ...get().messages] });
        return message;
      },
    }),
    { name: "emmapresh-contact" }
  )
);
