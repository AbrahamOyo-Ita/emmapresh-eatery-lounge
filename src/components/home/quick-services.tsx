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
    <section className="motion-section bg-primary py-10">
      <div className="motion-grid mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 sm:grid-cols-4 sm:gap-3 sm:px-6">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="focus-ring group flex flex-col items-start gap-3 rounded-card border border-white/15 bg-white/95 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <service.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-charcoal">{service.label}</p>
              <p className="mt-0.5 text-xs text-body">{service.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
