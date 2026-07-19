import type { Metadata } from "next";
import { CustomCakeForm } from "@/components/cakes/custom-cake-form";
import { FoodImage } from "@/components/ui/food-image";

export const metadata: Metadata = {
  title: "Custom Cake Request",
  description: "Design your own celebration cake — upload reference images and get a quotation from our bakery team.",
};

export default function CustomCakeOrderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-charcoal">Request a Custom Cake</h1>
        <p className="mt-2 text-sm text-body">Tell us your vision and upload inspiration images — we&apos;ll take it from there.</p>
      </div>
      <FoodImage
        name="Custom celebration cake"
        src="/Cakes and desserts3.jpeg"
        icon="cake"
        className="mb-8 aspect-[16/7] w-full rounded-card"
      />
      <CustomCakeForm />
    </div>
  );
}
