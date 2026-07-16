import { Megaphone } from "lucide-react";
import { ModuleRoadmap } from "@/components/admin/module-roadmap";

export default function AdminPromotionsPage() {
  return (
    <ModuleRoadmap
      title="Promotions"
      description="Create and manage discount codes, seasonal offers and loyalty rewards shown in the homepage announcement bar."
      icon={Megaphone}
      seedCount={8}
      seedLabel="Active promotions"
      plannedFeatures={[
        "Create percentage or fixed-amount discount codes",
        "Schedule promotions with start/end dates and branch scope",
        "Configure loyalty points, referral and birthday rewards",
        "Track redemption performance per promotion",
      ]}
    />
  );
}
