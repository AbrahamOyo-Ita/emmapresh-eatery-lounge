import type { AcademyApplication } from "@/types";
import { generateOrderReference } from "@/lib/utils";
import { academyCourses } from "./academy-courses";

const raw: Omit<AcademyApplication, "id" | "reference">[] = [
  { courseId: academyCourses[0].id, applicantName: "Blessing Etim", phone: "08131112222", email: "blessing.etim@example.com", preferredSchedule: "Saturdays, 10am-1pm", status: "enrolled", createdAt: "2026-06-10T09:00:00.000Z" },
  { courseId: academyCourses[1].id, applicantName: "Femi Oladapo", phone: "08141113333", email: "femi.oladapo@example.com", preferredSchedule: "Weekday evenings", status: "payment-verified", createdAt: "2026-06-25T10:00:00.000Z" },
  { courseId: academyCourses[3].id, applicantName: "Ada Eze", phone: "08151114444", email: "ada.eze@example.com", preferredSchedule: "Saturdays, 2pm-5pm", status: "awaiting-payment", createdAt: "2026-07-05T11:00:00.000Z" },
  { courseId: academyCourses[4].id, applicantName: "David Okafor", phone: "08161115555", email: "david.okafor@example.com", preferredSchedule: "Weekday mornings", status: "application-received", createdAt: "2026-07-13T12:00:00.000Z" },
  { courseId: academyCourses[2].id, applicantName: "Fatima Sani", phone: "08171116666", email: "fatima.sani@example.com", preferredSchedule: "Weekend intensive", status: "application-received", createdAt: "2026-07-14T13:00:00.000Z" },
];

export const seedAcademyApplications: AcademyApplication[] = raw.map((r, i) => ({
  ...r,
  id: `academy-app-seed-${i + 1}`,
  reference: generateOrderReference("AC"),
}));
