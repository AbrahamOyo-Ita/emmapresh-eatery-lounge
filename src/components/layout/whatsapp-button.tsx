"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
