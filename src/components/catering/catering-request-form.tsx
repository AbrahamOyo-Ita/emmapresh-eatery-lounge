"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Input, Label, FieldError, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCateringStore } from "@/stores/catering-store";
import { useBranchStore } from "@/stores/branch-store";
import { cateringRequestSchema, type CateringRequestFormValues } from "@/schemas/catering";

const budgetRanges = ["₦500,000 - ₦1,000,000", "₦1,000,000 - ₦2,000,000", "₦2,000,000 - ₦4,000,000", "₦4,000,000+"];

export function CateringRequestForm() {
  const createRequest = useCateringStore((s) => s.createRequest);
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CateringRequestFormValues>({
    resolver: zodResolver(cateringRequestSchema),
    defaultValues: {
      serviceStyle: "buffet",
      drinksRequired: false,
      serversRequired: false,
      equipmentRequired: false,
      decorationRequired: false,
      guestCount: 0,
    },
  });

  function onSubmit(data: CateringRequestFormValues) {
    const request = createRequest({ ...data, branchSlug });
    setSubmitted(request.reference);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl text-charcoal">Request Received</h2>
        <p className="mt-2 text-sm text-body">
          Your catering enquiry reference is <strong>{submitted}</strong>. Our catering team will review your
          details and send a quotation to your email within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="customerName">Full Name</Label>
          <Input id="customerName" {...register("customerName")} error={errors.customerName?.message} />
          <FieldError>{errors.customerName?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register("phone")} error={errors.phone?.message} />
          <FieldError>{errors.phone?.message}</FieldError>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" {...register("email")} error={errors.email?.message} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cateringType">Event Type</Label>
          <Select id="cateringType" {...register("cateringType")}>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate</option>
            <option value="birthday">Birthday</option>
            <option value="conference">Conference</option>
            <option value="private-event">Private Event</option>
            <option value="institutional">School / Institutional</option>
            <option value="indoor">Indoor (General)</option>
            <option value="outdoor">Outdoor (General)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="guestCount">Number of Guests</Label>
          <Input id="guestCount" type="number" min={1} {...register("guestCount", { valueAsNumber: true })} error={errors.guestCount?.message} />
          <FieldError>{errors.guestCount?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="eventDate">Event Date</Label>
          <Input id="eventDate" type="date" {...register("eventDate")} error={errors.eventDate?.message} />
          <FieldError>{errors.eventDate?.message}</FieldError>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" type="time" {...register("startTime")} error={errors.startTime?.message} />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" type="time" {...register("endTime")} error={errors.endTime?.message} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="eventLocation">Event Location</Label>
          <Input id="eventLocation" {...register("eventLocation")} error={errors.eventLocation?.message} />
          <FieldError>{errors.eventLocation?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="serviceStyle">Service Style</Label>
          <Select id="serviceStyle" {...register("serviceStyle")}>
            <option value="buffet">Buffet</option>
            <option value="plated">Plated</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="budgetRange">Budget Range</Label>
          <Select id="budgetRange" {...register("budgetRange")} error={errors.budgetRange?.message}>
            <option value="">Select a range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Select>
          <FieldError>{errors.budgetRange?.message}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="preferredDishes">Preferred Dishes (optional)</Label>
        <Textarea id="preferredDishes" {...register("preferredDishes")} placeholder="E.g. jollof rice, suya, grilled fish..." />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { name: "drinksRequired", label: "Drinks Service" },
            { name: "serversRequired", label: "Servers" },
            { name: "equipmentRequired", label: "Equipment" },
            { name: "decorationRequired", label: "Decoration" },
          ] as const
        ).map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <label className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={controllerField.value}
                  onChange={(e) => controllerField.onChange(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                {field.label}
              </label>
            )}
          />
        ))}
      </div>

      <div>
        <Label htmlFor="additionalInfo">Additional Information (optional)</Label>
        <Textarea id="additionalInfo" {...register("additionalInfo")} />
      </div>

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Submit Catering Request
      </Button>
    </form>
  );
}
