import * as React from "react";
import { ChevronDown } from "lucide-react";
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
  ({ className, error, children, value, defaultValue, onChange, onBlur, disabled, name, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const rootRef = React.useRef<HTMLSpanElement>(null);
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string>(() => String(value ?? defaultValue ?? ""));
    const isControlled = value !== undefined;
    const currentValue = String(isControlled ? value : internalValue);

    const options = React.Children.toArray(children)
      .filter(React.isValidElement)
      .map((child) => {
        const option = child as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>;
        return {
          value: String(option.props.value ?? option.props.children ?? ""),
          label: String(option.props.children ?? option.props.value ?? ""),
          disabled: option.props.disabled,
        };
      });
    const selected = options.find((option) => option.value === currentValue);
    const activeOptions = options.filter((option) => !option.disabled);

    React.useEffect(() => {
      if (!open) return;
      function handlePointerDown(event: PointerEvent) {
        if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
      }
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [open]);

    function emitChange(nextValue: string) {
      if (!isControlled) setInternalValue(nextValue);
      setOpen(false);
      onChange?.({
        target: { value: nextValue, name },
        currentTarget: { value: nextValue, name },
      } as React.ChangeEvent<HTMLSelectElement>);
    }

    function moveSelection(direction: 1 | -1) {
      if (activeOptions.length === 0) return;
      const currentIndex = Math.max(0, activeOptions.findIndex((option) => option.value === currentValue));
      const nextIndex = (currentIndex + direction + activeOptions.length) % activeOptions.length;
      emitChange(activeOptions[nextIndex].value);
    }

    return (
      <span ref={rootRef} className={cn("relative block", className?.includes("w-auto") && "inline-block")}>
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onBlur={() => {
            onBlur?.({
              target: { value: currentValue, name },
              currentTarget: { value: currentValue, name },
            } as React.FocusEvent<HTMLSelectElement>);
          }}
          onClick={() => setOpen((isOpen) => !isOpen)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (!open) setOpen(true);
              else moveSelection(1);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              if (!open) setOpen(true);
              else moveSelection(-1);
            }
            if (event.key === "Escape") setOpen(false);
          }}
          className={cn(
            "focus-ring flex h-11 w-full items-center justify-between gap-4 rounded-control border bg-white px-4 text-left text-sm font-medium text-charcoal shadow-[var(--shadow-soft)] transition-colors",
            error ? "border-error" : "border-border hover:border-charcoal/50 focus:border-primary",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
        >
          <span className={cn("truncate", !selected?.value && "text-body/65")}>{selected?.label ?? "Select an option"}</span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
          </span>
        </button>
        {open && (
          <div
            className="absolute z-50 mt-2 max-h-72 min-w-full overflow-y-auto rounded-card border border-border bg-white p-1.5 shadow-[0_18px_45px_-24px_rgba(23,23,23,0.45)]"
            role="listbox"
            aria-labelledby={selectId}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => emitChange(option.value)}
                className={cn(
                  "focus-ring flex w-full items-center justify-between rounded-control px-3 py-2.5 text-left text-sm transition-colors",
                  option.value === currentValue ? "bg-primary text-white" : "text-charcoal hover:bg-cream-soft",
                  option.disabled && "cursor-not-allowed opacity-50"
                )}
                role="option"
                aria-selected={option.value === currentValue}
              >
                <span>{option.label}</span>
                {option.value === currentValue && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
              </button>
            ))}
          </div>
        )}
        <select
          ref={ref}
          id={`${selectId}-native`}
          name={name}
          value={currentValue}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          {...props}
        >
          {children}
        </select>
      </span>
    );
  }
);
Select.displayName = "Select";
