export const siteConfig = {
  name: "EmmaPresh Eatery & Lounge",
  shortName: "EmmaPresh",
  brandPrimary: "EMMA PRESH",
  brandSecondary: "EATERY & LOUNGE",
  description:
    "Order meals, plan catering, book custom cakes, reserve event spaces and learn professional cooking across Abuja, Lagos and Badagry.",
  url: "https://www.emmapresh.com",
  phone: "+234 803 386 8360",
  secondaryPhone: "+234 803 794 1674",
  whatsapp: "2348033868360",
  email: "emmapresheateryandlounge@gmail.com",
  currency: "NGN",
  currencySymbol: "₦",
  social: {
    instagram: "https://instagram.com/emmapresh",
    facebook: "https://facebook.com/emmapresh",
    tiktok: "https://www.tiktok.com/@emmapresheateryandlounge",
  },
} as const;

export const mainNav = [
  { label: "Menu", href: "/menu" },
  { label: "Meals by Litre", href: "/litre-meals" },
  { label: "Catering", href: "/catering" },
  { label: "Cakes", href: "/cakes" },
  { label: "Academy", href: "/academy" },
  { label: "Event Halls", href: "/halls" },
  { label: "Locations", href: "/locations" },
  { label: "Offers", href: "/offers" },
] as const;

export const footerLinks = {
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Menu", href: "/menu" },
    { label: "Blog", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  ourMenu: [
    { label: "Burgers", href: "/menu/burgers" },
    { label: "Pizza", href: "/menu/pizza" },
    { label: "Local Meals", href: "/menu/local-meals" },
    { label: "Drinks", href: "/drinks" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Delivery Policy", href: "/delivery-policy" },
  ],
} as const;
