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
    "/search",
    "/locations",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/delivery-policy",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));

  const branchRoutes = branches.map((b) => ({ url: `${base}/locations/${b.slug}`, lastModified: new Date() }));
  const categoryRoutes = menuCategories.map((c) => ({ url: `${base}/menu/${c.slug}`, lastModified: new Date() }));
  const menuItemRoutes = menuItems.map((item) => ({ url: `${base}/menu/item/${item.slug}`, lastModified: new Date() }));
  const cakeRoutes = cakes.map((c) => ({ url: `${base}/cakes/${c.slug}`, lastModified: new Date() }));
  const courseRoutes = academyCourses.map((c) => ({ url: `${base}/academy/courses/${c.slug}`, lastModified: new Date() }));
  const hallRoutes = halls.map((h) => ({ url: `${base}/halls/${h.slug}`, lastModified: new Date() }));

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
