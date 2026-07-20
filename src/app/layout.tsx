import type { Metadata, Viewport } from "next";
import { displayFont, bodyFont } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BranchWelcomeModal } from "@/components/layout/branch-welcome-modal";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { PwaController } from "@/components/pwa/pwa-controller";
import { branches } from "@/data/branches";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Good Food, Cakes, Catering & Events`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "restaurant",
  keywords: [
    "EmmaPresh Eatery and Lounge",
    "restaurant in Abuja",
    "restaurant in Lagos",
    "restaurant in Badagry",
    "Nigerian food Abuja",
    "Nigerian food Lagos",
    "Nigerian food Badagry",
    "catering services Nigeria",
    "cakes and event hall",
  ],
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_NG",
    type: "website",
    images: [{ url: "/EmmaPresh Lagos.png", alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/EmmaPresh Lagos.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: siteConfig.shortName, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#C5161D",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: ["EmmaPresh", "Emma Presh Eatery and Lounge"],
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    contactPoint: [siteConfig.phone, siteConfig.secondaryPhone].map((telephone) => ({
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: "English",
    })),
    address: branches.map((branch) => ({
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.city,
      addressRegion: branch.state,
      addressCountry: "NG",
    })),
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.tiktok],
  };

  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@graph": branches.map((branch) => ({
      "@type": ["Restaurant", "LocalBusiness"],
      "@id": `${siteConfig.url}/locations/${branch.slug}#restaurant`,
      name: branch.name,
      url: `${siteConfig.url}/locations/${branch.slug}`,
      image: `${siteConfig.url}${branch.image}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.address,
        addressLocality: branch.city,
        addressRegion: branch.state,
        addressCountry: "NG",
      },
      telephone: branch.phone,
      email: branch.email,
      servesCuisine: ["Nigerian", "African", "Continental"],
      priceRange: "₦₦",
      hasMenu: `${siteConfig.url}/menu?branch=${branch.slug}`,
      acceptsReservations: true,
      foundingDate: branch.establishedDate,
      parentOrganization: { "@id": `${siteConfig.url}/#organization` },
    })),
  };

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-charcoal">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={restaurantJsonLd} />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <BranchWelcomeModal />
        <WhatsAppButton />
        <PwaController />
      </body>
    </html>
  );
}
