import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";

export type CrmStage = "new" | "active" | "vip" | "at-risk" | "corporate" | "lead";
export type CrmTaskStatus = "open" | "done";
export type CrmDealStage = "new-lead" | "qualified" | "proposal-sent" | "won" | "lost";

export interface CrmNote {
  id: string;
  customerEmail: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface CrmTask {
  id: string;
  customerEmail: string;
  title: string;
  dueDate: string;
  status: CrmTaskStatus;
  owner: string;
  createdAt: string;
}

export interface CrmDeal {
  id: string;
  customerEmail: string;
  title: string;
  value: number;
  stage: CrmDealStage;
  expectedCloseDate: string;
  createdAt: string;
}

export interface CrmProfileOverride {
  email: string;
  stage: CrmStage;
  tags: string[];
  owner: string;
}

interface CrmState {
  profileOverrides: CrmProfileOverride[];
  notes: CrmNote[];
  tasks: CrmTask[];
  deals: CrmDeal[];
  setProfileOverride: (email: string, patch: Partial<Omit<CrmProfileOverride, "email">>) => void;
  addNote: (input: Omit<CrmNote, "id" | "createdAt">) => void;
  addTask: (input: Omit<CrmTask, "id" | "status" | "createdAt">) => void;
  updateTaskStatus: (id: string, status: CrmTaskStatus) => void;
  addDeal: (input: Omit<CrmDeal, "id" | "createdAt">) => void;
  updateDealStage: (id: string, stage: CrmDealStage) => void;
}

export const useCrmStore = create<CrmState>()(
  persist(
    (set, get) => ({
      profileOverrides: [
        { email: "ada.eze@example.com", stage: "vip", tags: ["family-orders", "high-value"], owner: "Customer Success" },
        { email: "kunle.adisa@example.com", stage: "corporate", tags: ["catering", "office"], owner: "Corporate Desk" },
      ],
      notes: [
        {
          id: "note-ada-1",
          customerEmail: "ada.eze@example.com",
          body: "Prefers low spice and usually orders for weekend family meals.",
          author: "Customer Success",
          createdAt: "2026-07-12T10:00:00.000Z",
        },
      ],
      tasks: [
        {
          id: "task-kunle-1",
          customerEmail: "kunle.adisa@example.com",
          title: "Follow up on corporate catering quote",
          dueDate: "2026-07-22",
          status: "open",
          owner: "Corporate Desk",
          createdAt: "2026-07-15T09:00:00.000Z",
        },
      ],
      deals: [
        {
          id: "deal-kunle-1",
          customerEmail: "kunle.adisa@example.com",
          title: "Monthly office lunch catering",
          value: 850000,
          stage: "proposal-sent",
          expectedCloseDate: "2026-08-01",
          createdAt: "2026-07-15T09:00:00.000Z",
        },
      ],
      setProfileOverride: (email, patch) => {
        const existing = get().profileOverrides.find((profile) => profile.email === email);
        const next = existing
          ? get().profileOverrides.map((profile) => (profile.email === email ? { ...profile, ...patch } : profile))
          : [...get().profileOverrides, { email, stage: "active" as CrmStage, tags: [], owner: "Unassigned", ...patch }];
        set({ profileOverrides: next });
      },
      addNote: (input) =>
        set({
          notes: [{ ...input, id: generateId("note"), createdAt: new Date().toISOString() }, ...get().notes],
        }),
      addTask: (input) =>
        set({
          tasks: [{ ...input, id: generateId("task"), status: "open", createdAt: new Date().toISOString() }, ...get().tasks],
        }),
      updateTaskStatus: (id, status) => set({ tasks: get().tasks.map((task) => (task.id === id ? { ...task, status } : task)) }),
      addDeal: (input) =>
        set({
          deals: [{ ...input, id: generateId("deal"), createdAt: new Date().toISOString() }, ...get().deals],
        }),
      updateDealStage: (id, stage) => set({ deals: get().deals.map((deal) => (deal.id === id ? { ...deal, stage } : deal)) }),
    }),
    { name: "emmapresh-crm" }
  )
);
