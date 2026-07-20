import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerNotification { id: string; subject: string; message: string; actionUrl?: string; reference?: string; createdAt: string; }

interface NotificationsState {
  notifications: CustomerNotification[];
  readIds: string[];
  loading: boolean;
  refresh: (email: string, phone: string) => Promise<void>;
  markAllRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(persist((set) => ({
  notifications: [], readIds: [], loading: false,
  refresh: async (email, phone) => {
    set({ loading: true });
    try {
      const response = await fetch("/api/customer/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, phone }), cache: "no-store" });
      const result = await response.json();
      if (response.ok && result.ok) set({ notifications: result.notifications.map((item: Record<string, string>) => ({ id: item.id, subject: item.subject, message: item.message, actionUrl: item.action_url || undefined, reference: item.entity_reference || undefined, createdAt: item.created_at })) });
    } finally { set({ loading: false }); }
  },
  markAllRead: () => set((state) => ({ readIds: [...new Set([...state.readIds, ...state.notifications.map((item) => item.id)])] })),
}), { name: "emmapresh-notifications", partialize: (state) => ({ readIds: state.readIds }) }));
