import { Hero } from "@/components/home/hero";
import { QuickServices } from "@/components/home/quick-services";
import { PopularMenu } from "@/components/home/popular-menu";
import { JunkFoodStrip } from "@/components/home/junk-food-strip";
import { FeatureSection } from "@/components/home/feature-section";
import { LocationsSection } from "@/components/home/locations-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { GallerySection } from "@/components/home/gallery-section";
import { getPopularItems } from "@/services/menu-service";
import { getBranches } from "@/services/branch-service";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nigerian Restaurant, Catering, Cakes & Event Halls",
  description:
    "EmmaPresh Eatery & Lounge serves Nigerian food, drinks and cakes with catering, event halls and cooking classes in Abuja, Lagos and Badagry.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "EmmaPresh Eatery & Lounge | Abuja, Lagos & Badagry",
    description: "Nigerian restaurant, catering, cakes, drinks, event halls and cooking academy across three locations.",
    url: siteConfig.url,
    images: [{ url: "/EmmaPresh Lagos.png", alt: "EmmaPresh Eatery & Lounge" }],
  },
};

export default async function HomePage() {
  const [popularItems, branches] = await Promise.all([getPopularItems(), getBranches()]);

  return (
    <>
      <Hero />
      <QuickServices />
      <PopularMenu items={popularItems} />
      <JunkFoodStrip />

      <FeatureSection
        tone="red"
        eyebrow="Busy Professionals"
        title="Meals by Litre & Weekly Plans"
        description="Soups, stews, rice and proteins portioned by the litre — perfect for professionals and families who don't have time to cook. Choose a one-off order or a recurring weekly plan."
        bullets={[
          "Order soups, stews, sauces and rice by the litre",
          "Choose 1L, 2L, 3L or 5L sizes, or a custom quantity",
          "Set up weekly or monthly delivery schedules",
          "Pause, skip or renew your plan anytime",
        ]}
        cta={{ label: "Order by Litre", href: "/litre-meals" }}
        secondaryCta={{ label: "View Meal Plans", href: "/meal-plans" }}
        icon="soup"
        image="/food in litres copy.jpeg"
      />

      <FeatureSection
        tone="white"
        imageSide="left"
        eyebrow="Events & Gatherings"
        title="Indoor & Outdoor Catering"
        description="From weddings and corporate events to birthdays and conferences — our catering team handles menu planning, service staff, equipment and delivery."
        bullets={[
          "Indoor and outdoor catering across all branches",
          "Buffet or plated service styles",
          "Servers, equipment and decoration on request",
          "Transparent quotation before any payment",
        ]}
        cta={{ label: "Request a Quote", href: "/catering/request-quote" }}
        secondaryCta={{ label: "See Packages", href: "/catering" }}
        icon="event"
        image="/food in litres copy.jpeg"
      />

      <FeatureSection
        tone="red"
        eyebrow="Bakery"
        title="Cakes & Custom Designs"
        description="Browse ready-made cakes in stock or request a fully custom cake — upload a reference image and our bakery team will quote and design it for you."
        bullets={[
          "Ready cakes with same-day pickup on select items",
          "Custom cakes for weddings, birthdays and corporate events",
          "Upload inspiration images for your design",
          "Track your order from design to delivery",
        ]}
        cta={{ label: "Order a Cake", href: "/cakes" }}
        secondaryCta={{ label: "Custom Cake Request", href: "/cakes/custom-order" }}
        icon="cake"
        image="/Cakes and desserts3.jpeg"
      />

      <FeatureSection
        tone="white"
        imageSide="left"
        eyebrow="Academy"
        title="Cooking & Baking Academy"
        description="Learn professional cooking and baking from experienced instructors — from beginner weekend classes to certified professional programmes."
        bullets={[
          "Beginner to professional cooking and baking tracks",
          "Weekend, private and corporate training options",
          "Certificate of completion on most courses",
          "In-person, online and hybrid formats",
        ]}
        cta={{ label: "Explore Courses", href: "/academy" }}
        secondaryCta={{ label: "Apply Now", href: "/academy/apply" }}
        icon="academy"
        image="/Cooking & Baking.png"
      />

      <FeatureSection
        tone="red"
        eyebrow="Event Halls"
        title="Book an Event Hall"
        description="Elegant, well-equipped event spaces for weddings, conferences and private celebrations — complete with catering, drinks and decoration support."
        bullets={[
          "Flexible banquet, theatre and boardroom layouts",
          "In-house catering, drinks and decoration support",
          "Backup power, sound system and parking",
          "Availability request with quotation",
        ]}
        cta={{ label: "Request Availability", href: "/halls/request-booking" }}
        secondaryCta={{ label: "View Halls", href: "/halls" }}
        icon="hall"
        image="/Event hall.jpeg"
      />

      <LocationsSection branches={branches} />
      <TestimonialsSection />
      <FaqSection />
      <GallerySection />
    </>
  );
}
import type { Metadata } from "next";
