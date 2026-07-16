import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "focus-ring w-full rounded-control border bg-white px-4 h-11 text-sm text-charcoal placeholder:text-body/60 transition-colors",
          error ? "border-error" : "border-border focus:border-charcoal",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "focus-ring w-full rounded-control border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-body/60 transition-colors min-h-28",
          error ? "border-error" : "border-border focus:border-charcoal",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-semibold text-charcoal mb-1.5", className)} {...props} />
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-error">
      {children}
    </p>
  );
}

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "focus-ring w-full rounded-control border bg-white px-4 h-11 text-sm text-charcoal transition-colors",
          error ? "border-error" : "border-border focus:border-charcoal",
          className
        )}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
