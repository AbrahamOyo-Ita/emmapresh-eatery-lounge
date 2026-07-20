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
  hydrate: (data: { profileOverrides: CrmProfileOverride[]; notes: CrmNote[]; tasks: CrmTask[]; deals: CrmDeal[] }) => void;
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
      hydrate: (data) => set(data),
      setProfileOverride: (email, patch) => {
        const existing = get().profileOverrides.find((profile) => profile.email === email);
        const next = existing
          ? get().profileOverrides.map((profile) => (profile.email === email ? { ...profile, ...patch } : profile))
          : [...get().profileOverrides, { email, stage: "active" as CrmStage, tags: [], owner: "Unassigned", ...patch }];
        set({ profileOverrides: next });
        const profile = next.find((item) => item.email === email)!;
        void workspaceMutation("crm_profiles", { email: profile.email, stage: profile.stage, tags: profile.tags, owner: profile.owner, updated_at: new Date().toISOString() });
      },
      addNote: (input) => { const note = { ...input, id: generateId("note"), createdAt: new Date().toISOString() }; set({ notes: [note, ...get().notes] }); void workspaceMutation("crm_notes", { id: note.id, customer_email: note.customerEmail, body: note.body, author: note.author, created_at: note.createdAt }); },
      addTask: (input) => { const task = { ...input, id: generateId("task"), status: "open" as const, createdAt: new Date().toISOString() }; set({ tasks: [task, ...get().tasks] }); void workspaceMutation("crm_tasks", { id: task.id, customer_email: task.customerEmail, title: task.title, due_date: task.dueDate, status: task.status, owner: task.owner, created_at: task.createdAt }); },
      updateTaskStatus: (id, status) => { const tasks = get().tasks.map((task) => task.id === id ? { ...task, status } : task); set({ tasks }); const task = tasks.find((item) => item.id === id); if (task) void workspaceMutation("crm_tasks", { id: task.id, customer_email: task.customerEmail, title: task.title, due_date: task.dueDate, status: task.status, owner: task.owner, created_at: task.createdAt }); },
      addDeal: (input) => { const deal = { ...input, id: generateId("deal"), createdAt: new Date().toISOString() }; set({ deals: [deal, ...get().deals] }); void workspaceMutation("crm_deals", { id: deal.id, customer_email: deal.customerEmail, title: deal.title, value: deal.value, stage: deal.stage, expected_close_date: deal.expectedCloseDate || null, created_at: deal.createdAt }); },
      updateDealStage: (id, stage) => { const deals = get().deals.map((deal) => deal.id === id ? { ...deal, stage } : deal); set({ deals }); const deal = deals.find((item) => item.id === id); if (deal) void workspaceMutation("crm_deals", { id: deal.id, customer_email: deal.customerEmail, title: deal.title, value: deal.value, stage: deal.stage, expected_close_date: deal.expectedCloseDate || null, created_at: deal.createdAt }); },
    }),
    { name: "emmapresh-crm" }
  )
);

async function workspaceMutation(table: string, data: Record<string, unknown>) {
  await fetch("/api/admin/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table, operation: "upsert", data }) });
}
