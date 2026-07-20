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
    return () => {
      active = false;
    };
  }, [setAcademy, setCakeRequests, setCatering, setContact, setHalls, setMealPlans, setOrders, setReservations]);

  return null;
}
