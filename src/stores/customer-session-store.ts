import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerSession {
  name: string;
  phone: string;
  email: string;
}

interface CustomerSessionState {
  session: CustomerSession | null;
  setSession: (session: CustomerSession) => void;
  clearSession: () => void;
}

export const useCustomerSessionStore = create<CustomerSessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    { name: "emmapresh-customer-session" }
  )
);
