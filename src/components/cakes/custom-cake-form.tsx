"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, UploadCloud, X } from "lucide-react";
import { Input, Label, FieldError, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { useBranchStore } from "@/stores/branch-store";
import { customCakeRequestSchema, type CustomCakeRequestFormValues } from "@/schemas/cake";

const budgetRanges = ["₦20,000 - ₦40,000", "₦40,000 - ₦80,000", "₦80,000 - ₦150,000", "₦150,000+"];
const MAX_IMAGES = 4;

export function CustomCakeForm() {
  const createRequest = useCakeRequestsStore((s) => s.createRequest);
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const [images, setImages] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomCakeRequestFormValues>({
    resolver: zodResolver(customCakeRequestSchema),
    defaultValues: { fulfilmentMethod: "pickup", layers: 1 },
  });

  const fulfilmentMethod = watch("fulfilmentMethod");

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        if (file.size > 5 * 1024 * 1024) return;
        const reader = new FileReader();
        reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
  }

  function onSubmit(data: CustomCakeRequestFormValues) {
    const request = createRequest({ ...data, branchSlug, referenceImages: images });
    setSubmitted(request.reference);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl text-charcoal">Custom Cake Request Received</h2>
        <p className="mt-2 text-sm text-body">
          Your reference is <strong>{submitted}</strong>. Our bakery team will review your design and send a
          quotation to your email.
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
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <Input id="eventType" {...register("eventType")} placeholder="Birthday, wedding, anniversary..." error={errors.eventType?.message} />
          <FieldError>{errors.eventType?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="eventDate">Event Date</Label>
          <Input id="eventDate" type="date" {...register("eventDate")} error={errors.eventDate?.message} />
          <FieldError>{errors.eventDate?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="requiredDate">Required Pickup/Delivery Date</Label>
          <Input id="requiredDate" type="date" {...register("requiredDate")} error={errors.requiredDate?.message} />
          <FieldError>{errors.requiredDate?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="sizeLabel">Cake Size</Label>
          <Select id="sizeLabel" {...register("sizeLabel")} error={errors.sizeLabel?.message}>
            <option value="">Select a size</option>
            <option value="6-inch, serves 8">6-inch, serves 8</option>
            <option value="8-inch, serves 12">8-inch, serves 12</option>
            <option value="10-inch, serves 20">10-inch, serves 20</option>
            <option value="2-tier, serves 50">2-tier, serves 50</option>
            <option value="3-tier, serves 100">3-tier, serves 100</option>
          </Select>
          <FieldError>{errors.sizeLabel?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="layers">Number of Layers</Label>
          <Input id="layers" type="number" min={1} max={5} {...register("layers", { valueAsNumber: true })} error={errors.layers?.message} />
        </div>
        <div>
          <Label htmlFor="flavour">Preferred Flavour</Label>
          <Input id="flavour" {...register("flavour")} placeholder="Vanilla, chocolate, red velvet..." error={errors.flavour?.message} />
          <FieldError>{errors.flavour?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="colour">Preferred Colour</Label>
          <Input id="colour" {...register("colour")} error={errors.colour?.message} />
          <FieldError>{errors.colour?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="shape">Shape</Label>
          <Select id="shape" {...register("shape")} error={errors.shape?.message}>
            <option value="">Select a shape</option>
            <option value="Round">Round</option>
            <option value="Square">Square</option>
            <option value="Heart">Heart</option>
            <option value="Custom">Custom</option>
          </Select>
          <FieldError>{errors.shape?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="theme">Theme (optional)</Label>
          <Input id="theme" {...register("theme")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="inscription">Inscription (optional)</Label>
          <Input id="inscription" {...register("inscription")} />
        </div>
        <div>
          <Label htmlFor="budgetRange">Budget Range</Label>
          <Select id="budgetRange" {...register("budgetRange")} error={errors.budgetRange?.message}>
            <option value="">Select a range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </Select>
          <FieldError>{errors.budgetRange?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="fulfilmentMethod">Delivery or Pickup</Label>
          <Select id="fulfilmentMethod" {...register("fulfilmentMethod")}>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </Select>
        </div>
        {fulfilmentMethod === "delivery" && (
          <div className="sm:col-span-2">
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Input id="deliveryAddress" {...register("deliveryAddress")} />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="dietaryRequirements">Dietary Requirements (optional)</Label>
        <Input id="dietaryRequirements" {...register("dietaryRequirements")} placeholder="Egg-free, nut allergy..." />
      </div>

      <div>
        <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
        <Textarea id="additionalNotes" {...register("additionalNotes")} />
      </div>

      <div>
        <Label>Reference Images (optional, up to 4)</Label>
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative h-20 w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Reference ${i + 1}`} className="h-20 w-20 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-white"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-body hover:border-charcoal">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
              <span className="text-[0.6rem]">Upload</span>
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => handleFiles(e.target.files)} />
            </label>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Submit Custom Cake Request
      </Button>
    </form>
  );
}
