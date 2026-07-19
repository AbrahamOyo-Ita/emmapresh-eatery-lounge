import { Bell, CreditCard, Database, LockKeyhole, MapPin } from "lucide-react";
import { branches } from "@/data/branches";
import { formatCurrency } from "@/lib/utils";

const systemChecks = [
  { label: "Supabase database", value: "Configured by env", icon: Database },
  { label: "Staff role gate", value: "staff_profiles required", icon: LockKeyhole },
  { label: "Payment gateway", value: "On hold for demo", icon: CreditCard },
  { label: "Notifications", value: "Database + optional webhook", icon: Bell },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-charcoal">Settings</h1>
        <p className="mt-1 text-sm text-body">Operational configuration currently powering checkout and admin workflows.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {systemChecks.map((check) => (
          <div key={check.label} className="rounded-2xl border border-border/60 bg-white p-4">
            <check.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-charcoal">{check.label}</p>
            <p className="mt-1 text-xs text-body">{check.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-white">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base text-charcoal">Branch Checkout Settings</h2>
          <p className="mt-1 text-xs text-body">These bank accounts and delivery thresholds are shown to customers at checkout.</p>
        </div>
        <div className="divide-y divide-border">
          {branches.map((branch) => (
            <div key={branch.slug} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_1fr_1fr]">
              <div>
                <p className="flex items-center gap-2 font-semibold text-charcoal">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  {branch.name}
                </p>
                <p className="mt-1 text-xs text-body">{branch.address}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-charcoal">{branch.bankAccount.bankName}</p>
                <p className="text-body">{branch.bankAccount.accountName}</p>
                <p className="font-mono text-xs text-charcoal">{branch.bankAccount.accountNumber}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-charcoal">Delivery fee: {formatCurrency(branch.deliveryFee)}</p>
                <p className="text-body">Free delivery from {formatCurrency(branch.freeDeliveryThreshold)}</p>
                <p className="mt-1 text-xs text-body">{branch.email} · {branch.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
