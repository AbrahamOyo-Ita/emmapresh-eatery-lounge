import type { AcademyCourse } from "@/types";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface RawCourse {
  title: string;
  track: "cooking" | "baking";
  description: string;
  instructor: string;
  durationWeeks: number;
  schedule: string;
  branchSlug: "abuja" | "lagos" | "badagry";
  deliveryFormat: "in-person" | "online" | "hybrid";
  fee: number;
  depositRequired: number;
  availableSeats: number;
  modules: string[];
  certificateAwarded: boolean;
}

const raw: RawCourse[] = [
  { title: "Beginner Nigerian Cooking", track: "cooking", description: "Master the fundamentals of Nigerian cuisine — soups, rice dishes and swallow — from scratch.", instructor: "Chef Ngozi Adeyemi", durationWeeks: 4, schedule: "Saturdays, 10am–1pm", branchSlug: "lagos", deliveryFormat: "in-person", fee: 65000, depositRequired: 20000, availableSeats: 12, modules: ["Knife skills & prep", "Soups & stews", "Rice dishes", "Swallow techniques"], certificateAwarded: true },
  { title: "Advanced Continental Cuisine", track: "cooking", description: "Take your skills further with continental techniques, plating and sauce work.", instructor: "Chef David Okafor", durationWeeks: 6, schedule: "Weekday evenings, 6pm–8pm", branchSlug: "abuja", deliveryFormat: "in-person", fee: 95000, depositRequired: 30000, availableSeats: 10, modules: ["Sauce fundamentals", "Protein cookery", "Plating & presentation", "Menu design"], certificateAwarded: true },
  { title: "Small Chops & Party Snacks", track: "cooking", description: "Learn to make small chops, spring rolls and party snacks for events and side businesses.", instructor: "Chef Amaka Nwosu", durationWeeks: 2, schedule: "Weekend intensive", branchSlug: "lagos", deliveryFormat: "in-person", fee: 45000, depositRequired: 15000, availableSeats: 15, modules: ["Batter & dough basics", "Frying techniques", "Packaging for events"], certificateAwarded: true },
  { title: "Baking Fundamentals", track: "baking", description: "Build a strong foundation in baking — bread, pastries and simple cakes.", instructor: "Chef Fatima Sani", durationWeeks: 4, schedule: "Saturdays, 2pm–5pm", branchSlug: "abuja", deliveryFormat: "in-person", fee: 70000, depositRequired: 20000, availableSeats: 12, modules: ["Bread basics", "Pastry dough", "Simple sponge cakes", "Kitchen hygiene"], certificateAwarded: true },
  { title: "Professional Cake Decoration", track: "baking", description: "Advanced fondant, buttercream and sugar-flower techniques for celebration cakes.", instructor: "Chef Peace Effiong", durationWeeks: 6, schedule: "Weekday mornings, 9am–12pm", branchSlug: "lagos", deliveryFormat: "hybrid", fee: 120000, depositRequired: 40000, availableSeats: 8, modules: ["Fondant covering", "Buttercream piping", "Sugar flowers", "Wedding cake tiers"], certificateAwarded: true },
  { title: "Catering Business Management", track: "cooking", description: "A practical course for turning your cooking skills into a catering business.", instructor: "Chef Emeka Nnamdi", durationWeeks: 3, schedule: "Online, self-paced with live Q&A", branchSlug: "lagos", deliveryFormat: "online", fee: 55000, depositRequired: 15000, availableSeats: 20, modules: ["Costing & pricing", "Client management", "Event logistics", "Food safety compliance"], certificateAwarded: false },
];

export const academyCourses: AcademyCourse[] = raw.map((course, index) => ({
  id: `course-${index + 1}`,
  slug: slugify(course.title),
  title: course.title,
  track: course.track,
  description: course.description,
  image: `/images/academy/${slugify(course.title)}.jpg`,
  instructor: course.instructor,
  durationWeeks: course.durationWeeks,
  schedule: course.schedule,
  branchSlug: course.branchSlug,
  deliveryFormat: course.deliveryFormat,
  fee: course.fee,
  depositRequired: course.depositRequired,
  availableSeats: course.availableSeats,
  modules: course.modules,
  certificateAwarded: course.certificateAwarded,
}));

export function getCourseBySlug(slug: string) {
  return academyCourses.find((c) => c.slug === slug);
}
