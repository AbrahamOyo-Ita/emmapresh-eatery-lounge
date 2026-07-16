"use client";

import * as React from "react";
import { User, LogOut } from "lucide-react";
import { AccountNav } from "@/components/account/account-nav";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomerSessionStore } from "@/stores/customer-session-store";

export default function AccountPage() {
  const { session, setSession, clearSession } = useCustomerSessionStore();
  const [hydrated, setHydrated] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  React.useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setSession({ name, phone, email });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl text-charcoal">My Account</h1>
      {session && <AccountNav />}

      {!session ? (
        <div className="mt-8 rounded-card border border-border/60 bg-white p-6">
          <p className="mb-4 text-sm text-body">
            EmmaPresh uses guest checkout — enter the details you used when ordering to view your order history and
            favourites.
          </p>
          <form onSubmit={handleLookup} className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="sm:col-span-3">Continue</Button>
          </form>
        </div>
      ) : (
        <div className="mt-8 rounded-card border border-border/60 bg-white p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg text-charcoal">{session.name}</p>
              <p className="text-sm text-body">{session.email}</p>
              <p className="text-sm text-body">{session.phone}</p>
            </div>
          </div>
          <button
            onClick={clearSession}
            className="focus-ring mt-6 flex items-center gap-1.5 text-sm font-semibold text-body hover:text-error"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Switch Account
          </button>
        </div>
      )}
    </div>
  );
}
