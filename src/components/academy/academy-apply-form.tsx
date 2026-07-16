"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAcademyStore } from "@/stores/academy-store";
import { academyCourses } from "@/data/academy-courses";

export function AcademyApplyForm() {
  const searchParams = useSearchParams();
  const createApplication = useAcademyStore((s) => s.createApplication);
  const [courseId, setCourseId] = React.useState(
    academyCourses.find((c) => c.slug === searchParams.get("course"))?.id ?? academyCourses[0].id
  );
  const [applicantName, setApplicantName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [preferredSchedule, setPreferredSchedule] = React.useState("");
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const application = createApplication({ courseId, applicantName, phone, email, preferredSchedule });
    setSubmitted(application.reference);
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl text-charcoal">Application Received</h2>
        <p className="mt-2 text-sm text-body">
          Your application reference is <strong>{submitted}</strong>. We&apos;ll email you payment instructions to
          secure your seat.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="course">Course</Label>
        <Select id="course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {academyCourses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="applicantName">Full Name</Label>
        <Input id="applicantName" required value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="preferredSchedule">Preferred Schedule</Label>
        <Input id="preferredSchedule" required placeholder="E.g. Saturdays, 10am-1pm" value={preferredSchedule} onChange={(e) => setPreferredSchedule(e.target.value)} />
      </div>
      <Button type="submit" size="lg" className="w-full">Submit Application</Button>
    </form>
  );
}
