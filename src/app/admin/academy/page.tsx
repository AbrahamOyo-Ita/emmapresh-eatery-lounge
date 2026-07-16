"use client";

import * as React from "react";
import { Select } from "@/components/ui/input";
import { useAcademyStore } from "@/stores/academy-store";
import { academyCourses } from "@/data/academy-courses";
import type { AcademyApplicationStatus } from "@/types";

const statuses: AcademyApplicationStatus[] = [
  "application-received", "awaiting-payment", "payment-submitted", "payment-verified", "enrolled", "rejected",
];

export default function AdminAcademyPage() {
  const { applications, updateStatus } = useAcademyStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Academy Applications</h1>
      <p className="mt-1 mb-6 text-sm text-body">{applications.length} applications across {academyCourses.length} courses.</p>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Applicant</th>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Schedule</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const course = academyCourses.find((c) => c.id === app.courseId);
              return (
                <tr key={app.id} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-charcoal">{app.applicantName}</p>
                    <p className="text-xs text-body">{app.phone} · {app.email}</p>
                  </td>
                  <td className="px-4 py-3 text-body">{course?.title ?? "—"}</td>
                  <td className="px-4 py-3 text-body">{app.preferredSchedule}</td>
                  <td className="px-4 py-3">
                    <Select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as AcademyApplicationStatus)} className="w-auto">
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
                      ))}
                    </Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
