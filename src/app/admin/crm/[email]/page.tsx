"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useOrdersStore } from "@/stores/orders-store";
import { useCateringStore } from "@/stores/catering-store";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { useAcademyStore } from "@/stores/academy-store";
import { useHallsStore } from "@/stores/halls-store";
import { useReservationsStore } from "@/stores/reservations-store";
import { useCrmStore, type CrmDealStage, type CrmStage } from "@/stores/crm-store";
import { buildCrmCustomers } from "@/lib/admin/crm";
import { formatCurrency } from "@/lib/utils";

const stages: CrmStage[] = ["new", "active", "vip", "at-risk", "corporate", "lead"];
const dealStages: CrmDealStage[] = ["new-lead", "qualified", "proposal-sent", "won", "lost"];

export default function AdminCrmCustomerPage() {
  const params = useParams<{ email: string }>();
  const email = decodeURIComponent(params.email);
  const orders = useOrdersStore((s) => s.orders);
  const catering = useCateringStore((s) => s.requests);
  const cakes = useCakeRequestsStore((s) => s.requests);
  const academy = useAcademyStore((s) => s.applications);
  const halls = useHallsStore((s) => s.enquiries);
  const reservations = useReservationsStore((s) => s.reservations);
  const crm = useCrmStore();
  const [hydrated, setHydrated] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDue, setTaskDue] = React.useState("");
  const [dealTitle, setDealTitle] = React.useState("");
  const [dealValue, setDealValue] = React.useState("");

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!hydrated) return null;

  const customers = buildCrmCustomers({
    orders,
    catering,
    cakes,
    academy,
    halls,
    reservations,
    overrides: crm.profileOverrides,
    notes: crm.notes,
    tasks: crm.tasks,
    deals: crm.deals,
  });
  const customer = customers.find((item) => item.email === email);

  if (!customer) {
    return (
      <div>
        <Link href="/admin/crm" className="focus-ring text-sm font-semibold text-primary hover:underline">Back to CRM</Link>
        <p className="mt-8 font-display text-xl text-charcoal">Customer not found</p>
      </div>
    );
  }

  const customerNotes = crm.notes.filter((item) => item.customerEmail === email);
  const customerTasks = crm.tasks.filter((item) => item.customerEmail === email);
  const customerDeals = crm.deals.filter((item) => item.customerEmail === email);

  return (
    <div>
      <Link href="/admin/crm" className="focus-ring mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-primary">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to CRM
      </Link>

      <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-border/60 bg-white p-5">
          <h1 className="font-display text-2xl text-charcoal">{customer.name}</h1>
          <p className="mt-1 text-sm text-body">{customer.email} · {customer.phone}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-cream-soft/60 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-body">Orders</p>
              <p className="mt-1 font-display text-xl text-charcoal">{customer.orderCount}</p>
            </div>
            <div className="rounded-xl bg-cream-soft/60 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-body">Spend</p>
              <p className="mt-1 font-display text-xl text-charcoal">{formatCurrency(customer.totalSpend)}</p>
            </div>
            <div className="rounded-xl bg-cream-soft/60 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-body">Pipeline</p>
              <p className="mt-1 font-display text-xl text-charcoal">{formatCurrency(customer.dealValue)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5">
          <h2 className="font-display text-base text-charcoal">Account Controls</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Stage</Label>
              <Select value={customer.stage} onChange={(event) => crm.setProfileOverride(email, { stage: event.target.value as CrmStage })}>
                {stages.map((stage) => <option key={stage} value={stage}>{stage.replace(/-/g, " ")}</option>)}
              </Select>
            </div>
            <div>
              <Label>Owner</Label>
              <Input value={customer.owner} onChange={(event) => crm.setProfileOverride(email, { owner: event.target.value })} />
            </div>
            <div>
              <Label>Tags</Label>
              <Input value={customer.tags.join(", ")} onChange={(event) => crm.setProfileOverride(email, { tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} />
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <section className="rounded-2xl border border-border/60 bg-white p-5">
          <h2 className="font-display text-base text-charcoal">Customer Timeline</h2>
          <div className="mt-4 space-y-3">
            {customer.interactions.map((event) => (
              <div key={`${event.type}-${event.id}`} className="rounded-xl border border-border/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-charcoal">{event.type}: {event.title}</p>
                  {event.status && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{event.status.replace(/-/g, " ")}</span>}
                </div>
                <p className="mt-1 text-xs text-body">{event.meta} · {new Date(event.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="font-display text-base text-charcoal">Add Note</h2>
            <Textarea className="mt-3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add relationship context, preferences, or follow-up details..." />
            <Button className="mt-3 w-full" disabled={!note.trim()} onClick={() => { crm.addNote({ customerEmail: email, body: note, author: "Admin" }); setNote(""); }}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Save Note
            </Button>
            <div className="mt-4 space-y-2">
              {customerNotes.slice(0, 3).map((item) => <p key={item.id} className="rounded-xl bg-cream-soft/60 p-3 text-xs text-body">{item.body}</p>)}
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="font-display text-base text-charcoal">Follow-up Tasks</h2>
            <div className="mt-3 grid gap-2">
              <Input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Task title" />
              <Input type="date" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} />
              <Button disabled={!taskTitle.trim() || !taskDue} onClick={() => { crm.addTask({ customerEmail: email, title: taskTitle, dueDate: taskDue, owner: customer.owner }); setTaskTitle(""); setTaskDue(""); }}>
                Add Task
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {customerTasks.map((task) => (
                <button key={task.id} type="button" onClick={() => crm.updateTaskStatus(task.id, task.status === "open" ? "done" : "open")} className="focus-ring block w-full rounded-xl bg-cream-soft/60 p-3 text-left text-xs">
                  <span className="font-semibold text-charcoal">{task.title}</span>
                  <span className="block text-body">Due {task.dueDate} · {task.status}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="font-display text-base text-charcoal">Deals</h2>
            <div className="mt-3 grid gap-2">
              <Input value={dealTitle} onChange={(event) => setDealTitle(event.target.value)} placeholder="Deal title" />
              <Input type="number" min={0} value={dealValue} onChange={(event) => setDealValue(event.target.value)} placeholder="Value" />
              <Button disabled={!dealTitle.trim()} onClick={() => { crm.addDeal({ customerEmail: email, title: dealTitle, value: Number(dealValue || 0), stage: "new-lead", expectedCloseDate: "" }); setDealTitle(""); setDealValue(""); }}>
                Add Deal
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {customerDeals.map((deal) => (
                <div key={deal.id} className="rounded-xl bg-cream-soft/60 p-3 text-xs">
                  <p className="font-semibold text-charcoal">{deal.title}</p>
                  <p className="text-body">{formatCurrency(deal.value)}</p>
                  <Select value={deal.stage} onChange={(event) => crm.updateDealStage(deal.id, event.target.value as CrmDealStage)} className="mt-2">
                    {dealStages.map((stage) => <option key={stage} value={stage}>{stage.replace(/-/g, " ")}</option>)}
                  </Select>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
