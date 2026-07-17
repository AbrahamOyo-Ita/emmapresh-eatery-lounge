import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-deep active:scale-[0.98]",
        light: "bg-white text-primary hover:bg-white/90 active:scale-[0.98]",
        accent: "bg-accent text-charcoal hover:bg-accent-warm active:scale-[0.98]",
        outline: "border border-charcoal text-charcoal bg-transparent hover:bg-charcoal hover:text-white",
        outlineLight: "border border-white/60 text-white bg-transparent hover:bg-white hover:text-primary",
        ghost: "text-charcoal hover:bg-black/5",
        subtle: "bg-cream-soft text-charcoal hover:bg-border",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
