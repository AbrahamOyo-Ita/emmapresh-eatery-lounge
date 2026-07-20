"use client";

import * as React from "react";
import { useAcademyStore } from "@/stores/academy-store";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { useCateringStore } from "@/stores/catering-store";
import { useContactStore } from "@/stores/contact-store";
import { useHallsStore } from "@/stores/halls-store";
import { useMealPlansStore } from "@/stores/meal-plans-store";
import { useOrdersStore } from "@/stores/orders-store";
import { useReservationsStore } from "@/stores/reservations-store";
import type { Order } from "@/types";
import { useCrmStore } from "@/stores/crm-store";
import { useProjectsStore } from "@/stores/projects-store";
import { usePromotionsStore } from "@/stores/promotions-store";

function mergeOrders(localOrders: Order[], serverOrders: Order[]) {
  const merged = new Map(localOrders.map((order) => [order.reference, order]));
  serverOrders.forEach((serverOrder) => {
    const localOrder = merged.get(serverOrder.reference);
    if (!localOrder || new Date(serverOrder.updatedAt).getTime() >= new Date(localOrder.updatedAt).getTime()) {
      merged.set(serverOrder.reference, serverOrder);
    }
  });
  return [...merged.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function BackendHydration() {
  const setOrders = useOrdersStore((s) => s.setOrders);
  const setCatering = useCateringStore((s) => s.setRequests);
  const setCakeRequests = useCakeRequestsStore((s) => s.setRequests);
  const setAcademy = useAcademyStore((s) => s.setApplications);
  const setHalls = useHallsStore((s) => s.setEnquiries);
  const setReservations = useReservationsStore((s) => s.setReservations);
  const setMealPlans = useMealPlansStore((s) => s.setSubscriptions);
  const setContact = useContactStore((s) => s.setMessages);
  const hydrateCrm = useCrmStore((s) => s.hydrate);
  const setProjectCards = useProjectsStore((s) => s.setCards);
  const setPromotions = usePromotionsStore((s) => s.setPromotions);

  React.useEffect(() => {
    let active = true;
    async function hydrate() {
      try {
        const response = await fetch("/api/admin/snapshot", { cache: "no-store" });
        const json = await response.json();
        if (!active || !json.ok || !json.data) return;
        const serverOrders = (json.data.orders ?? []) as Order[];
        setOrders(mergeOrders(useOrdersStore.getState().orders, serverOrders));
        if (json.data.catering?.length) setCatering(json.data.catering);
        if (json.data.cakeRequests?.length) setCakeRequests(json.data.cakeRequests);
        if (json.data.academy?.length) setAcademy(json.data.academy);
        if (json.data.halls?.length) setHalls(json.data.halls);
        if (json.data.reservations?.length) setReservations(json.data.reservations);
        if (json.data.mealPlans?.length) setMealPlans(json.data.mealPlans);
        if (json.data.contact?.length) setContact(json.data.contact);
      } catch {
        // Local demo state remains available when backend is not configured.
      }
    }
    void hydrate();
    fetch("/api/admin/workspace", { cache: "no-store" }).then((response) => response.json()).then((workspace) => {
      if (!active || !workspace.ok || !workspace.data) return;
      const data = workspace.data;
      hydrateCrm({
        profileOverrides: (data.profiles ?? []).map((row: Record<string, unknown>) => ({ email: row.email, stage: row.stage, tags: row.tags ?? [], owner: row.owner })),
        notes: (data.notes ?? []).map((row: Record<string, unknown>) => ({ id: row.id, customerEmail: row.customer_email, body: row.body, author: row.author, createdAt: row.created_at })),
        tasks: (data.tasks ?? []).map((row: Record<string, unknown>) => ({ id: row.id, customerEmail: row.customer_email, title: row.title, dueDate: row.due_date, status: row.status, owner: row.owner, createdAt: row.created_at })),
        deals: (data.deals ?? []).map((row: Record<string, unknown>) => ({ id: row.id, customerEmail: row.customer_email, title: row.title, value: Number(row.value), stage: row.stage, expectedCloseDate: row.expected_close_date ?? "", createdAt: row.created_at })),
      } as Parameters<typeof hydrateCrm>[0]);
      setProjectCards((data.projectCards ?? []).map((row: Record<string, unknown>) => ({ id: row.id, title: row.title, description: row.description, status: row.status, priority: row.priority, owner: row.owner, dueDate: row.due_date ?? "", labels: row.labels ?? [], position: Number(row.position) })) as Parameters<typeof setProjectCards>[0]);
      setPromotions((data.promotions ?? []).map((row: Record<string, unknown>) => ({ id: row.id, title: row.title, description: row.description, code: row.code, discount: row.discount, validUntil: row.valid_until })) as Parameters<typeof setPromotions>[0]);
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, [hydrateCrm, setAcademy, setCakeRequests, setCatering, setContact, setHalls, setMealPlans, setOrders, setProjectCards, setPromotions, setReservations]);

  return null;
}
