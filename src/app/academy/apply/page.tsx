import type { Metadata } from "next";
import * as React from "react";
import { AcademyApplyForm } from "@/components/academy/academy-apply-form";

export const metadata: Metadata = {
  title: "Apply to the Academy",
  description: "Apply for a cooking or baking course at EmmaPresh Academy.",
};

export default function AcademyApplyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-charcoal">Apply to the Academy</h1>
        <p className="mt-2 text-sm text-body">Select your course and submit your application.</p>
      </div>
      <React.Suspense fallback={null}>
        <AcademyApplyForm />
      </React.Suspense>
    </div>
  );
}
