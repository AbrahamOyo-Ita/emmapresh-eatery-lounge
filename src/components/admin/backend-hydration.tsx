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
        setOrders(json.data.orders ?? []);
        setCatering(json.data.catering ?? []);
        setCakeRequests(json.data.cakeRequests ?? []);
        setAcademy(json.data.academy ?? []);
        setHalls(json.data.halls ?? []);
        setReservations(json.data.reservations ?? []);
        setMealPlans(json.data.mealPlans ?? []);
        setContact(json.data.contact ?? []);
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

