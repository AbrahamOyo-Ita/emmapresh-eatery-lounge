"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
}

export function Drawer({ open, onClose, side = "right", title, children, widthClassName = "max-w-md" }: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex" role="presentation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative z-10 flex h-full w-full flex-col bg-white shadow-2xl",
              widthClassName,
              side === "right" ? "ml-auto" : "mr-auto"
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-lg">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="focus-ring rounded-full p-2 hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
