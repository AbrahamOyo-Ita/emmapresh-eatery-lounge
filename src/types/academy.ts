import type { BranchSlug } from "./branch";

export type AcademyTrack = "cooking" | "baking";

export interface AcademyCourse {
  id: string;
  slug: string;
  title: string;
  track: AcademyTrack;
  description: string;
  image: string;
  instructor: string;
  durationWeeks: number;
  schedule: string;
  branchSlug: BranchSlug;
  deliveryFormat: "in-person" | "online" | "hybrid";
  fee: number;
  depositRequired: number;
  availableSeats: number;
  modules: string[];
  certificateAwarded: boolean;
}

export type AcademyApplicationStatus =
  | "application-received"
  | "awaiting-payment"
  | "payment-submitted"
  | "payment-verified"
  | "enrolled"
  | "rejected";

export interface AcademyApplication {
  id: string;
  reference: string;
  courseId: string;
  applicantName: string;
  phone: string;
  email: string;
  preferredSchedule: string;
  status: AcademyApplicationStatus;
  createdAt: string;
}
