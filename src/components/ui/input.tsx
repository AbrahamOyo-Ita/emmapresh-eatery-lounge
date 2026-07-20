import * as React from "react";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  const value = `${String(hour).padStart(2, "0")}:${minute}`;
  const hour12 = hour % 12 || 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return { value, label: `${hour12}:${minute} ${suffix}` };
});

function formatDateLabel(value: string) {
  if (!value) return "Select date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatTimeLabel(value: string) {
  return timeOptions.find((option) => option.value === value)?.label ?? "Select time";
}

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, value, defaultValue, onChange, onBlur, name, id, min, max, step, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(() => String(value ?? defaultValue ?? ""));
    const currentValue = String(isControlled ? value : internalValue);
    const [open, setOpen] = React.useState(false);
    const [visibleMonth, setVisibleMonth] = React.useState(() => {
      const selectedDate = currentValue ? new Date(`${currentValue}T00:00:00`) : null;
      return selectedDate && !Number.isNaN(selectedDate.getTime()) ? selectedDate : new Date();
    });
    const rootRef = React.useRef<HTMLSpanElement>(null);

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
      onChange?.({
        target: { value: nextValue, name },
        currentTarget: { value: nextValue, name },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    function emitBlur() {
      onBlur?.({
        target: { value: currentValue, name },
        currentTarget: { value: currentValue, name },
      } as React.FocusEvent<HTMLInputElement>);
    }

    const controlClassName = cn(
      "focus-ring flex h-11 w-full items-center justify-between gap-3 rounded-control border bg-white px-4 text-left text-sm font-medium text-charcoal shadow-[var(--shadow-soft)] transition-colors",
      error ? "border-error" : "border-border hover:border-charcoal/50 focus:border-primary",
      disabled && "cursor-not-allowed opacity-60",
      className
    );

    if (type === "date") {
      const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
      const startOffset = firstDay.getDay();
      const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
      const cells = Array.from({ length: startOffset + daysInMonth }, (_, index) =>
        index < startOffset ? null : new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index - startOffset + 1)
      );

      return (
        <span ref={rootRef} className={cn("relative block", className?.includes("w-auto") && "inline-block")}>
          <input ref={ref} id={inputId} type="hidden" name={name} value={currentValue} {...props} />
          <button type="button" disabled={disabled} onClick={() => setOpen((isOpen) => !isOpen)} onBlur={emitBlur} className={controlClassName} data-invalid={!!error}>
            <span className={cn(!currentValue && "text-body/65")}>{formatDateLabel(currentValue)}</span>
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          </button>
          {open && (
            <div className="absolute left-0 z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-card border border-border bg-white p-3 shadow-[0_18px_45px_-24px_rgba(23,23,23,0.45)]">
              <div className="mb-3 flex items-center justify-between">
                <button type="button" className="focus-ring rounded-full p-1.5 text-body hover:bg-cream-soft hover:text-charcoal" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} aria-label="Previous month">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="text-sm font-semibold text-charcoal">
                  {new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(visibleMonth)}
                </p>
                <button type="button" className="focus-ring rounded-full p-1.5 text-body hover:bg-cream-soft hover:text-charcoal" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} aria-label="Next month">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-bold uppercase tracking-wide text-body">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {cells.map((day, index) => {
                  if (!day) return <span key={`empty-${index}`} />;
                  const nextValue = isoDate(day);
                  const selected = nextValue === currentValue;
                  return (
                    <button key={nextValue} type="button" onClick={() => { emitChange(nextValue); setOpen(false); }} className={cn("focus-ring h-8 rounded-full text-xs font-semibold transition-colors", selected ? "bg-primary text-white" : "text-charcoal hover:bg-cream-soft")}>
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </span>
      );
    }

    if (type === "time") {
      return (
        <span ref={rootRef} className={cn("relative block", className?.includes("w-auto") && "inline-block")}>
          <input ref={ref} id={inputId} type="hidden" name={name} value={currentValue} {...props} />
          <button type="button" disabled={disabled} onClick={() => setOpen((isOpen) => !isOpen)} onBlur={emitBlur} className={controlClassName} data-invalid={!!error}>
            <span className={cn(!currentValue && "text-body/65")}>{formatTimeLabel(currentValue)}</span>
            <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          </button>
          {open && (
            <div className="absolute z-50 mt-2 max-h-64 w-full min-w-40 overflow-y-auto rounded-card border border-border bg-white p-1.5 shadow-[0_18px_45px_-24px_rgba(23,23,23,0.45)]">
              {timeOptions.map((option) => (
                <button key={option.value} type="button" onClick={() => { emitChange(option.value); setOpen(false); }} className={cn("focus-ring flex w-full items-center justify-between rounded-control px-3 py-2 text-left text-sm transition-colors", option.value === currentValue ? "bg-primary text-white" : "text-charcoal hover:bg-cream-soft")}>
                  {option.label}
                  {option.value === currentValue && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </span>
      );
    }

    if (type === "number") {
      const numericValue = Number(currentValue || 0);
      const stepValue = Number(step ?? 1);
      const minValue = min == null ? undefined : Number(min);
      const maxValue = max == null ? undefined : Number(max);
      const updateNumber = (direction: 1 | -1) => {
        let next = (Number.isFinite(numericValue) ? numericValue : 0) + direction * stepValue;
        if (minValue != null) next = Math.max(minValue, next);
        if (maxValue != null) next = Math.min(maxValue, next);
        emitChange(String(next));
      };
      return (
        <span className="relative block">
          <input
            ref={ref}
            id={inputId}
            type="number"
            value={currentValue}
            onChange={(event) => emitChange(event.target.value)}
            onBlur={onBlur}
            name={name}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(
              "focus-ring custom-number-input h-11 w-full rounded-control border bg-white py-0 pl-4 pr-20 text-sm text-charcoal placeholder:text-body/60 shadow-[var(--shadow-soft)] transition-colors",
              error ? "border-error" : "border-border focus:border-charcoal",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          <span className="absolute right-1.5 top-1/2 flex -translate-y-1/2 overflow-hidden rounded-md border border-border bg-cream-soft">
            <button type="button" disabled={disabled || (minValue != null && numericValue <= minValue)} onClick={() => updateNumber(-1)} className="focus-ring flex h-8 w-8 items-center justify-center text-body hover:bg-white hover:text-charcoal disabled:opacity-40" aria-label="Decrease value">
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button type="button" disabled={disabled || (maxValue != null && numericValue >= maxValue)} onClick={() => updateNumber(1)} className="focus-ring flex h-8 w-8 items-center justify-center border-l border-border text-body hover:bg-white hover:text-charcoal disabled:opacity-40" aria-label="Increase value">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        </span>
      );
    }

    return (
      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
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
          data-invalid={!!error}
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
