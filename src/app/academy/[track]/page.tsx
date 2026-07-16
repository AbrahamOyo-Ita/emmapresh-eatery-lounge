import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, GraduationCap } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { academyCourses } from "@/data/academy-courses";
import { formatCurrency, cn } from "@/lib/utils";
import type { AcademyTrack } from "@/types";

interface PageProps {
  params: Promise<{ track: string }>;
}

export function generateStaticParams() {
  return [{ track: "cooking" }, { track: "baking" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { track } = await params;
  if (track !== "cooking" && track !== "baking") return {};
  return {
    title: track === "cooking" ? "Cooking Academy" : "Baking Academy",
    description: `Explore our ${track} courses — schedules, fees and what you'll learn.`,
  };
}

export default async function AcademyTrackPage({ params }: PageProps) {
  const { track } = await params;
  if (track !== "cooking" && track !== "baking") notFound();
  const activeTrack = track as AcademyTrack;
  const courses = academyCourses.filter((c) => c.track === activeTrack);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl text-charcoal capitalize">{activeTrack} Academy</h1>
      <p className="mt-2 max-w-xl text-sm text-body">
        {activeTrack === "cooking"
          ? "From Nigerian classics to continental technique — build real kitchen skills with hands-on instruction."
          : "Master bread, pastry and cake decoration with our experienced baking instructors."}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)]">
            <FoodImage name={course.title} icon="academy" className="h-36 w-full" />
            <div className="p-5">
              <h3 className="font-display text-base text-charcoal">{course.title}</h3>
              <p className="mt-1.5 text-xs text-body">{course.description}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-body">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {course.durationWeeks} weeks
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                <Users className="h-3.5 w-3.5" aria-hidden="true" /> {course.availableSeats} seats
              </p>
              <p className="mt-3 font-display text-lg text-charcoal">{formatCurrency(course.fee)}</p>
              <Link href={`/academy/courses/${course.slug}`} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-4 w-full")}>
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
