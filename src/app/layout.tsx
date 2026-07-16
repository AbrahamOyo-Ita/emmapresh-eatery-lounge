import type { Metadata } from "next";
import { displayFont, bodyFont } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/home/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { BranchWelcomeModal } from "@/components/layout/branch-welcome-modal";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { branches } from "@/data/branches";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Good Food, Cakes, Catering & Events`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.twitter],
  };

  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    url: siteConfig.url,
    servesCuisine: ["Nigerian", "Continental"],
    priceRange: "₦₦",
    location: branches.map((branch) => ({
      "@type": "Place",
      name: branch.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.address,
        addressLocality: branch.city,
        addressRegion: branch.state,
        addressCountry: "NG",
      },
      telephone: branch.phone,
    })),
  };

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={restaurantJsonLd} />
        <AnnouncementBar />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <BranchWelcomeModal />
        <WhatsAppButton />
      </body>
    </html>
  );
}
