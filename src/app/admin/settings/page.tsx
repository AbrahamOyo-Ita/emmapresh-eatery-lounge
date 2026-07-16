import { Settings } from "lucide-react";
import { ModuleRoadmap } from "@/components/admin/module-roadmap";

export default function AdminSettingsPage() {
  return (
    <ModuleRoadmap
      title="Settings"
      description="Configure branch bank accounts, payment instructions, SEO metadata and communication channels."
      icon={Settings}
      seedCount={3}
      seedLabel="Branches configured"
      plannedFeatures={[
        "Edit branch bank account details shown at checkout",
        "Manage SEO metadata for each public page",
        "Configure email, SMS and WhatsApp notification channels",
        "Manage staff accounts and role-based permissions",
      ]}
    />
  );
}
