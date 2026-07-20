"use client";

import * as React from "react";
import { CalendarDays, GripVertical, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useProjectsStore, type ProjectPriority, type ProjectStatus } from "@/stores/projects-store";
import { cn } from "@/lib/utils";

const columns: { id: ProjectStatus; label: string; tone: string }[] = [
  { id: "backlog", label: "Backlog", tone: "bg-body" }, { id: "planned", label: "Planned", tone: "bg-info" },
  { id: "in-progress", label: "In Progress", tone: "bg-warning" }, { id: "review", label: "Review", tone: "bg-primary" }, { id: "done", label: "Done", tone: "bg-success" },
];
const priorityTone: Record<ProjectPriority,string> = { low: "bg-cream-soft text-body", medium: "bg-info/10 text-info", high: "bg-warning/10 text-warning", urgent: "bg-error/10 text-error" };

export default function ProjectsPage() {
  const { cards, addCard, updateCard, moveCard, removeCard } = useProjectsStore();
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [dragged, setDragged] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ title: "", description: "", status: "backlog" as ProjectStatus, priority: "medium" as ProjectPriority, owner: "Unassigned", dueDate: "", labels: "" });
  const emptyForm = { title: "", description: "", status: "backlog" as ProjectStatus, priority: "medium" as ProjectPriority, owner: "Unassigned", dueDate: "", labels: "" };
  function openCreate() { setEditingId(null); setForm(emptyForm); setOpen(true); }
  function openEdit(id: string) { const card = cards.find((item) => item.id === id); if (!card) return; setEditingId(id); setForm({ ...card, labels: card.labels.join(", ") }); setOpen(true); }
  function submit(event: React.FormEvent) { event.preventDefault(); const input = { ...form, labels: form.labels.split(",").map((v) => v.trim()).filter(Boolean) }; if (editingId) updateCard(editingId, input); else addCard(input); setOpen(false); setEditingId(null); setForm(emptyForm); }
  return <div>
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-display text-2xl text-charcoal">Projects</h1><p className="mt-1 text-sm text-body">Plan launches, campaigns and operations across one shared board.</p></div><Button onClick={openCreate}><Plus className="h-4 w-4" />New card</Button></div>
    <div className="flex gap-4 overflow-x-auto pb-5 snap-x">
      {columns.map((column) => <section key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragged) moveCard(dragged,column.id); setDragged(null); }} className="w-[min(86vw,19rem)] shrink-0 snap-start rounded-2xl bg-white/70 p-3 ring-1 ring-border/70">
        <div className="mb-3 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className={cn("h-2.5 w-2.5 rounded-full",column.tone)} /><h2 className="font-semibold text-charcoal">{column.label}</h2></div><span className="rounded-full bg-cream-soft px-2 py-0.5 text-xs font-bold text-body">{cards.filter((card) => card.status === column.id).length}</span></div>
        <div className="min-h-32 space-y-3">{cards.filter((card) => card.status === column.id).map((card) => <article key={card.id} draggable onDragStart={() => setDragged(card.id)} className="group cursor-grab rounded-xl border border-border/70 bg-white p-4 shadow-[var(--shadow-soft)] active:cursor-grabbing">
          <div className="flex items-start gap-2"><GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-body/50" /><div className="min-w-0 flex-1"><p className="font-semibold leading-snug text-charcoal">{card.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-body">{card.description}</p></div><button onClick={() => openEdit(card.id)} className="text-body hover:text-primary" aria-label={`Edit ${card.title}`}><Pencil className="h-4 w-4" /></button><button onClick={() => removeCard(card.id)} className="text-body hover:text-error" aria-label={`Delete ${card.title}`}><Trash2 className="h-4 w-4" /></button></div>
          <div className="mt-3 flex flex-wrap gap-1">{card.labels.map((label) => <span key={label} className="rounded-full bg-cream-soft px-2 py-0.5 text-[0.65rem] font-bold text-body">{label}</span>)}</div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs"><span className={cn("rounded-full px-2 py-1 font-bold capitalize",priorityTone[card.priority])}>{card.priority}</span><span className="flex items-center gap-1 truncate text-body"><UserRound className="h-3.5 w-3.5" />{card.owner}</span></div>
          {card.dueDate && <p className="mt-2 flex items-center gap-1 text-xs text-body"><CalendarDays className="h-3.5 w-3.5" />{new Date(`${card.dueDate}T00:00:00`).toLocaleDateString("en-NG")}</p>}
        </article>)}</div>
      </section>)}
    </div>
    <Dialog open={open} onClose={() => setOpen(false)} title={editingId ? "Edit project card" : "Create project card"}><form onSubmit={submit} className="space-y-4 p-5"><div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} /></div><div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} /></div><div className="grid gap-4 sm:grid-cols-2"><div><Label>Column</Label><Select value={form.status} onChange={(e) => setForm({...form,status:e.target.value as ProjectStatus})}>{columns.map((c)=><option key={c.id} value={c.id}>{c.label}</option>)}</Select></div><div><Label>Priority</Label><Select value={form.priority} onChange={(e) => setForm({...form,priority:e.target.value as ProjectPriority})}>{(["low","medium","high","urgent"] as const).map((p)=><option key={p} value={p}>{p}</option>)}</Select></div></div><div className="grid gap-4 sm:grid-cols-2"><div><Label>Owner</Label><Input value={form.owner} onChange={(e) => setForm({...form,owner:e.target.value})} /></div><div><Label>Due date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({...form,dueDate:e.target.value})} /></div></div><div><Label>Labels</Label><Input placeholder="launch, marketing" value={form.labels} onChange={(e) => setForm({...form,labels:e.target.value})} /></div><Button className="w-full" type="submit">{editingId ? "Save changes" : "Create card"}</Button></form></Dialog>
  </div>;
}
