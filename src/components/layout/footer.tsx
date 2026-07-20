"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, PhoneCall, Mail, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/social-icons";
import { Logo } from "./logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { footerLinks, siteConfig } from "@/config/site";
import { branches } from "@/data/branches";
import { useContactStore } from "@/stores/contact-store";

export function Footer() {
  const pathname = usePathname();
  const sendMessage = useContactStore((state) => state.sendMessage);
  const [subscriberEmail, setSubscriberEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = subscriberEmail.trim();
    if (!email) return;
    sendMessage({
      name: "Newsletter subscriber",
      email,
      subject: "Newsletter subscription",
      message: "Please add this email address to EmmaPresh news and offers updates.",
    });
    setSubscribed(true);
    setSubscriberEmail("");
  }
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-border bg-soft-black text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-12 grid gap-8 rounded-card bg-white/5 p-6 sm:grid-cols-[1.3fr_1fr] sm:p-8">
          <div>
            <h3 className="font-display text-xl text-white">Subscribe for News &amp; Offers</h3>
            <p className="mt-2 text-sm text-white/60">
              Be first to know about new cakes in stock, academy intakes and weekend offers.
            </p>
          </div>
          <form className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start" onSubmit={subscribe}>
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <Input
              id="footer-email"
              type="email"
              required
              placeholder="Enter your email"
              value={subscriberEmail}
              onChange={(event) => { setSubscriberEmail(event.target.value); setSubscribed(false); }}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
            />
            <Button type="submit" variant="accent">
              {subscribed ? <><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Subscribed</> : "Subscribe"}
            </Button>
            <span className="sr-only" aria-live="polite">{subscribed ? "Subscription received" : ""}</span>
          </form>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="[&_span:first-child]:text-white [&_span:last-child]:text-white/50" />
            <p className="mt-4 text-sm text-white/60">{siteConfig.description}</p>
            <div className="mt-4 flex gap-3">
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <FacebookIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <InstagramIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={siteConfig.social.tiktok} aria-label="TikTok" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <TikTokIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="focus-ring text-white/60 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-white">Our Branches</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {branches.map((branch) => (
                <li key={branch.slug}>
                  <Link href={`/locations/${branch.slug}`} className="focus-ring flex items-start gap-1.5 text-white/60 hover:text-white">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {branch.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-white">Get in Touch</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-start gap-1.5 text-white/60">
                <PhoneCall className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-white">{siteConfig.phone}</a><br /><a href={`tel:${siteConfig.secondaryPhone.replace(/\s/g, "")}`} className="hover:text-white">{siteConfig.secondaryPhone}</a></span>
              </li>
              <li className="flex min-w-0 items-start gap-1.5 text-white/60">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="min-w-0 break-all hover:text-white">{siteConfig.email}</a>
              </li>
            </ul>
            <h4 className="mt-5 font-display text-sm uppercase tracking-wide text-white">Policies</h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {footerLinks.policies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="focus-ring text-white/60 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} EmmaPresh Eatery &amp; Lounge. All rights reserved.</p>
          <p>Abuja · Lagos · Badagry</p>
        </div>
      </div>
    </footer>
  );
}
