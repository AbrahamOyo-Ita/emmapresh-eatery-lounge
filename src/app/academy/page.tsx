import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Users, GraduationCap } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { academyCourses } from "@/data/academy-courses";
import { formatCurrency, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cooking & Baking Academy",
  description: "Learn professional cooking and baking at EmmaPresh Academy — beginner to advanced courses across Abuja and Lagos.",
};

export default function AcademyPage() {
  return (
    <div>
      <div className="bg-cream-soft/60 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Cooking &amp; Baking Academy</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">
            From beginner weekend classes to professional certification programmes — learn from experienced chefs
            across Nigerian and continental cuisine, baking and cake decoration.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex gap-3">
          <Link href="/academy" className="rounded-full bg-charcoal px-4 py-1.5 text-xs font-semibold text-white">All Courses</Link>
          <Link href="/academy/cooking" className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-charcoal hover:border-charcoal">Cooking</Link>
          <Link href="/academy/baking" className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-charcoal hover:border-charcoal">Baking</Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {academyCourses.map((course) => (
            <div key={course.id} className="overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)]">
              <FoodImage name={course.title} icon="academy" className="h-36 w-full" />
              <div className="p-5">
                <Badge variant="outline">{course.track === "cooking" ? "Cooking" : "Baking"}</Badge>
                <h3 className="mt-2 font-display text-base text-charcoal">{course.title}</h3>
                <p className="mt-1.5 text-xs text-body">{course.description}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-body">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {course.durationWeeks} weeks · {course.schedule}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" /> {course.availableSeats} seats available
                </p>
                <p className="mt-3 font-display text-lg text-charcoal">{formatCurrency(course.fee)}</p>
                <Link
                  href={`/academy/courses/${course.slug}`}
                  className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-4 w-full")}
                >
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
