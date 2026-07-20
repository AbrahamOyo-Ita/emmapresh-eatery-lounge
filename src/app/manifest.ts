import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FFF6E8",
    theme_color: "#C5161D",
    lang: "en-NG",
    categories: ["food", "shopping", "lifestyle"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Order food", short_name: "Menu", url: "/menu?source=pwa", icons: [{ src: "/icons/192", sizes: "192x192", type: "image/png" }] },
      { name: "View cart", short_name: "Cart", url: "/cart?source=pwa", icons: [{ src: "/icons/192", sizes: "192x192", type: "image/png" }] },
      { name: "My account", short_name: "Account", url: "/account?source=pwa", icons: [{ src: "/icons/192", sizes: "192x192", type: "image/png" }] },
    ],
  };
}
