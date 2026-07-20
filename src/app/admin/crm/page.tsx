"use client";

import * as React from "react";
import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, CircleDollarSign, Search, Users } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { useOrdersStore } from "@/stores/orders-store";
import { useCateringStore } from "@/stores/catering-store";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { useAcademyStore } from "@/stores/academy-store";
import { useHallsStore } from "@/stores/halls-store";
import { useReservationsStore } from "@/stores/reservations-store";
import { useCrmStore, type CrmStage } from "@/stores/crm-store";
import { buildCrmCustomers } from "@/lib/admin/crm";
import { cn, formatCurrency } from "@/lib/utils";

const stageLabels: Record<CrmStage, string> = {
  new: "New",
  active: "Active",
  vip: "VIP",
  "at-risk": "At Risk",
  corporate: "Corporate",
  lead: "Lead",
};

export default function AdminCrmPage() {
  const orders = useOrdersStore((s) => s.orders);
  const catering = useCateringStore((s) => s.requests);
  const cakes = useCakeRequestsStore((s) => s.requests);
  const academy = useAcademyStore((s) => s.applications);
  const halls = useHallsStore((s) => s.enquiries);
  const reservations = useReservationsStore((s) => s.reservations);
  const crm = useCrmStore();
  const [hydrated, setHydrated] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [stage, setStage] = React.useState<CrmStage | "all">("all");

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
  const filtered = customers.filter((customer) => {
    const matchesStage = stage === "all" || customer.stage === stage;
    const haystack = `${customer.name} ${customer.email} ${customer.phone} ${customer.tags.join(" ")}`.toLowerCase();
    return matchesStage && haystack.includes(query.toLowerCase());
  });
  const pipelineValue = crm.deals.filter((deal) => !["won", "lost"].includes(deal.stage)).reduce((sum, deal) => sum + deal.value, 0);
  const openTasks = crm.tasks.filter((task) => task.status === "open");
  const wonValue = crm.deals.filter((deal) => deal.stage === "won").reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal">CRM</h1>
          <p className="mt-1 text-sm text-body">Customer intelligence, sales pipeline, follow-ups and account ownership.</p>
        </div>
        <Link href="/admin/customers" className="focus-ring rounded-control bg-cream-soft px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-border">
          Legacy customer list
        </Link>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          { label: "Customer Profiles", value: customers.length, icon: Users },
          { label: "Open Follow-ups", value: openTasks.length, icon: CheckCircle2 },
          { label: "Pipeline Value", value: formatCurrency(pipelineValue), icon: BriefcaseBusiness },
          { label: "Won CRM Value", value: formatCurrency(wonValue), icon: CircleDollarSign },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border/60 bg-white p-5">
            <metric.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl text-charcoal">{metric.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-body">{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border/60 bg-white p-5">
          <h2 className="font-display text-base text-charcoal">Customer Segments</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(Object.keys(stageLabels) as CrmStage[]).map((key) => {
              const count = customers.filter((customer) => customer.stage === key).length;
              return (
                <button key={key} type="button" onClick={() => setStage(key)} className={cn("focus-ring rounded-xl border px-4 py-3 text-left", stage === key ? "border-primary bg-primary/5" : "border-border hover:border-charcoal")}>
                  <span className="block text-sm font-semibold text-charcoal">{stageLabels[key]}</span>
                  <span className="text-xs text-body">{count} customers</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-white p-5">
          <h2 className="font-display text-base text-charcoal">Open Tasks</h2>
          <div className="mt-4 space-y-2">
            {openTasks.length === 0 ? <p className="text-sm text-body">No open tasks.</p> : openTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-xl bg-cream-soft/60 p-3 text-sm">
                <p className="font-semibold text-charcoal">{task.title}</p>
                <p className="mt-1 text-xs text-body">{task.customerEmail} · Due {task.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <div className="relative min-w-0 flex-[1_1_100%] sm:min-w-64 sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden="true" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers, tags, email or phone" className="pl-10" />
          </div>
          <Select value={stage} onChange={(event) => setStage(event.target.value as CrmStage | "all")} className="w-full sm:w-auto sm:min-w-44">
            <option value="all">All stages</option>
            {(Object.keys(stageLabels) as CrmStage[]).map((key) => <option key={key} value={key}>{stageLabels[key]}</option>)}
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Stage</th>
                <th className="px-5 py-3 font-semibold">Owner</th>
                <th className="px-5 py-3 font-semibold">Orders</th>
                <th className="px-5 py-3 font-semibold">Value</th>
                <th className="px-5 py-3 font-semibold">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.email} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                  <td className="px-5 py-4">
                    <Link href={`/admin/crm/${encodeURIComponent(customer.email)}`} className="focus-ring font-semibold text-charcoal hover:text-primary">
                      {customer.name}
                    </Link>
                    <p className="mt-1 text-xs text-body">{customer.email} · {customer.phone}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {customer.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-cream-soft px-2 py-0.5 text-[0.65rem] font-bold text-body">{tag}</span>)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{stageLabels[customer.stage]}</span>
                  </td>
                  <td className="px-5 py-4 text-body">{customer.owner}</td>
                  <td className="px-5 py-4 text-charcoal">{customer.orderCount}</td>
                  <td className="px-5 py-4 font-semibold text-charcoal">{formatCurrency(customer.totalSpend + customer.dealValue)}</td>
                  <td className="px-5 py-4 text-charcoal">{customer.openTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
