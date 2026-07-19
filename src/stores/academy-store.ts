import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AcademyApplication, AcademyApplicationStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedAcademyApplications } from "@/data/academy-applications-seed";
import { patchEntity, persistEntity } from "@/lib/backend-client";

interface AcademyState {
  applications: AcademyApplication[];
  setApplications: (applications: AcademyApplication[]) => void;
  createApplication: (input: Omit<AcademyApplication, "id" | "reference" | "status" | "createdAt">) => AcademyApplication;
  updateStatus: (id: string, status: AcademyApplicationStatus) => void;
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      applications: seedAcademyApplications,
      setApplications: (applications) => set({ applications }),
      createApplication: (input) => {
        const application: AcademyApplication = {
          ...input,
          id: generateId("academy"),
          reference: generateOrderReference("AC"),
          status: "application-received",
          createdAt: new Date().toISOString(),
        };
        set({ applications: [application, ...get().applications] });
        persistEntity("academy", application);
        return application;
      },
      updateStatus: (id, status) => {
        set({ applications: get().applications.map((a) => (a.id === id ? { ...a, status } : a)) });
        patchEntity("academy", id, { status });
      },
    }),
    { name: "emmapresh-academy" }
  )
);
