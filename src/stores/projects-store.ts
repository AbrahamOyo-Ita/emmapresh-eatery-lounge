import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";

export type ProjectStatus = "backlog" | "planned" | "in-progress" | "review" | "done";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";
export interface ProjectCard { id: string; title: string; description: string; status: ProjectStatus; priority: ProjectPriority; owner: string; dueDate: string; labels: string[]; position: number; }

const seed: ProjectCard[] = [
  { id: "project-launch", title: "Launch production domain", description: "Connect DNS, SSL, analytics and production environment variables.", status: "planned", priority: "urgent", owner: "Technical Lead", dueDate: "2026-07-31", labels: ["launch", "infrastructure"], position: 0 },
  { id: "project-email", title: "Configure branded email", description: "Set up Workspace, SPF, DKIM, DMARC and Postmaster Tools.", status: "backlog", priority: "high", owner: "Operations", dueDate: "2026-08-05", labels: ["email"], position: 0 },
];

function persistCard(card: ProjectCard) {
  void fetch("/api/admin/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table: "project_cards", operation: "upsert", data: { id: card.id, title: card.title, description: card.description, status: card.status, priority: card.priority, owner: card.owner, due_date: card.dueDate || null, labels: card.labels, position: card.position, updated_at: new Date().toISOString() } }) });
}

interface ProjectState { cards: ProjectCard[]; setCards: (cards: ProjectCard[]) => void; addCard: (input: Omit<ProjectCard,"id"|"position">) => void; updateCard: (id: string, patch: Partial<ProjectCard>) => void; moveCard: (id: string, status: ProjectStatus) => void; removeCard: (id: string) => void; }
export const useProjectsStore = create<ProjectState>()(persist((set,get) => ({
  cards: seed,
  setCards: (cards) => set({ cards }),
  addCard: (input) => { const card = { ...input, id: generateId("project"), position: get().cards.filter((item) => item.status === input.status).length }; set({ cards: [...get().cards, card] }); persistCard(card); },
  updateCard: (id, patch) => { const cards = get().cards.map((card) => card.id === id ? { ...card, ...patch } : card); set({ cards }); const card = cards.find((item) => item.id === id); if (card) persistCard(card); },
  moveCard: (id, status) => { const cards = get().cards.map((card) => card.id === id ? { ...card, status, position: get().cards.filter((item) => item.status === status).length } : card); set({ cards }); const card = cards.find((item) => item.id === id); if (card) persistCard(card); },
  removeCard: (id) => { set({ cards: get().cards.filter((card) => card.id !== id) }); void fetch("/api/admin/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table: "project_cards", operation: "delete", data: { id } }) }); },
}), { name: "emmapresh-projects" }));
