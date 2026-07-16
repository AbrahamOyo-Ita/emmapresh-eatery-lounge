import Link from "next/link";
import {
  UtensilsCrossed,
  Beaker,
  ChefHat,
  CakeSlice,
  GraduationCap,
  Building2,
  CalendarCheck,
  CupSoda,
} from "lucide-react";

const services = [
  { label: "Order Food", href: "/menu", icon: UtensilsCrossed, description: "Browse the full menu" },
  { label: "Meals by Litre", href: "/litre-meals", icon: Beaker, description: "Cooked meals, sized for you" },
  { label: "Book Catering", href: "/catering", icon: ChefHat, description: "Indoor & outdoor events" },
  { label: "Order a Cake", href: "/cakes", icon: CakeSlice, description: "Ready-made or custom" },
  { label: "Join the Academy", href: "/academy", icon: GraduationCap, description: "Cooking & baking classes" },
  { label: "Book an Event Hall", href: "/halls", icon: Building2, description: "Weddings, parties & more" },
  { label: "Reserve a Table", href: "/reservations", icon: CalendarCheck, description: "Dine in at the lounge" },
  { label: "Browse Drinks", href: "/drinks", icon: CupSoda, description: "Juices, mocktails & more" },
];

export function QuickServices() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="focus-ring group flex flex-col items-start gap-3 rounded-card border border-border/60 bg-white p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-lift)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <service.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-sm text-charcoal">{service.label}</p>
              <p className="mt-0.5 text-xs text-body">{service.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
