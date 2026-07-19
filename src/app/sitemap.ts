import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { branches } from "@/data/branches";
import { menuCategories } from "@/data/categories";
import { menuItems } from "@/data/menu-items";
import { cakes } from "@/data/cakes";
import { academyCourses } from "@/data/academy-courses";
import { halls } from "@/data/halls";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date("2026-07-19");
  const staticRoutes = [
    "",
    "/menu",
    "/litre-meals",
    "/meal-plans",
    "/catering",
    "/catering/request-quote",
    "/cakes",
    "/cakes/custom-order",
    "/academy",
    "/academy/apply",
    "/halls",
    "/halls/request-booking",
    "/reservations",
    "/drinks",
    "/offers",
    "/gallery",
    "/about",
    "/contact",
    "/faq",
    "/locations",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/delivery-policy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: (path === "" || path === "/menu" || path === "/offers" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : ["/menu", "/locations", "/catering", "/cakes"].includes(path) ? 0.9 : 0.7,
  }));

  const branchRoutes = branches.map((b) => ({ url: `${base}/locations/${b.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.95, images: [`${base}${b.image}`] }));
  const categoryRoutes = menuCategories.map((c) => ({ url: `${base}/menu/${c.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.8, images: [`${base}${c.image}`] }));
  const menuItemRoutes = menuItems.map((item) => ({ url: `${base}/menu/item/${item.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.7, images: item.gallery.map((image) => `${base}${image}`) }));
  const cakeRoutes = cakes.map((c) => ({ url: `${base}/cakes/${c.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.7, images: c.gallery.map((image) => `${base}${image}`) }));
  const courseRoutes = academyCourses.map((c) => ({ url: `${base}/academy/courses/${c.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.6, images: [`${base}${c.image}`] }));
  const hallRoutes = halls.map((h) => ({ url: `${base}/halls/${h.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7, images: h.gallery.map((image) => `${base}${image}`) }));

  return [
    ...staticRoutes,
    ...branchRoutes,
    ...categoryRoutes,
    ...menuItemRoutes,
    ...cakeRoutes,
    ...courseRoutes,
    ...hallRoutes,
  ];
}
