import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, Award, MapPin } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCourseBySlug } from "@/data/academy-courses";
import { academyCourses } from "@/data/academy-courses";
import { branches } from "@/data/branches";
import { formatCurrency, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return academyCourses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();
  const branch = branches.find((b) => b.slug === course.branchSlug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <FoodImage name={course.title} icon="academy" className="aspect-square w-full rounded-card" iconClassName="h-24 w-24" />
        <div>
          <Badge variant="outline">{course.track === "cooking" ? "Cooking" : "Baking"}</Badge>
          <h1 className="mt-3 font-display text-3xl text-charcoal">{course.title}</h1>
          <p className="mt-3 text-sm text-body">{course.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <p className="flex items-center gap-1.5 text-charcoal"><Clock className="h-4 w-4 text-body" aria-hidden="true" /> {course.durationWeeks} weeks</p>
            <p className="flex items-center gap-1.5 text-charcoal"><Users className="h-4 w-4 text-body" aria-hidden="true" /> {course.availableSeats} seats left</p>
            <p className="flex items-center gap-1.5 text-charcoal"><MapPin className="h-4 w-4 text-body" aria-hidden="true" /> {branch?.name}</p>
            {course.certificateAwarded && (
              <p className="flex items-center gap-1.5 text-charcoal"><Award className="h-4 w-4 text-body" aria-hidden="true" /> Certificate awarded</p>
            )}
          </div>

          <p className="mt-4 text-sm text-body">Schedule: <span className="text-charcoal">{course.schedule}</span></p>
          <p className="mt-1 text-sm text-body">Format: <span className="capitalize text-charcoal">{course.deliveryFormat}</span></p>
          <p className="mt-1 text-sm text-body">Instructor: <span className="text-charcoal">{course.instructor}</span></p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-body">Course Modules</p>
            <ul className="space-y-1 text-sm text-charcoal">
              {course.modules.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl bg-cream-soft px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-body">Course Fee</span>
              <span className="font-display text-lg text-charcoal">{formatCurrency(course.fee)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm text-body">Deposit Required</span>
              <span className="text-sm font-semibold text-charcoal">{formatCurrency(course.depositRequired)}</span>
            </div>
          </div>

          <Link href={`/academy/apply?course=${course.slug}`} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6 w-full")}>
            Apply for This Course
          </Link>
        </div>
      </div>
    </div>
  );
}
