"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const messages = [
  "Free delivery on orders above ₦25,000 this week.",
  "New cakes just added — same-day pickup available.",
  "Academy registration is now open for the September intake.",
  "Book your event hall early for December dates.",
  "Weekend combo: Small Chops Platter + 2 drinks at a special price.",
];

export function AnnouncementBar() {
  const [index, setIndex] = React.useState(0);
  const pathname = usePathname();

  React.useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4500);
    return () => clearInterval(interval);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="flex h-9 items-center justify-center gap-2 bg-charcoal px-4 text-xs font-medium text-white/90">
      <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
      <div className="relative h-4 w-full max-w-xl overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-0"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
