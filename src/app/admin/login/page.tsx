"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState<"email" | "code">("email");
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const accessError = searchParams.get("error") === "staff-access-required";

  async function requestCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const response = await fetch("/api/admin/auth/request-code", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send passcode.");
      setEmail(email.trim().toLowerCase()); setStep("code");
      setMessage("A one-time passcode has been sent to your email.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send passcode.");
    } finally { setLoading(false); }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\d{6,10}$/.test(token)) return setError("Enter the complete passcode from your email.");
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    setLoading(false);
    if (verifyError) return setError("That passcode is invalid or has expired. Request a new one and try again.");
    router.replace(searchParams.get("next") || "/admin"); router.refresh();
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-charcoal px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,22,29,.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,196,54,.12),transparent_30%)]" />
      <div className="relative w-full max-w-md rounded-[1.75rem] border border-white/10 bg-white p-6 shadow-2xl sm:p-9">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg"><ShieldCheck className="h-7 w-7" /></span>
          <span className="font-display text-xl">EMMA<span className="text-primary">PRESH</span></span>
          <h1 className="mt-3 text-2xl font-bold text-charcoal">Secure dashboard access</h1>
          <p className="mt-1 text-sm text-body">Authorised administrators sign in with a one-time email passcode.</p>
        </div>

        {step === "email" ? (
          <form onSubmit={requestCode} className="space-y-5">
            <div><Label htmlFor="email">Authorised email address</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" /><Input id="email" type="email" required autoFocus autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="pl-10" placeholder="name@company.com" /></div></div>
            <Button type="submit" size="lg" className="w-full" loading={loading}>Email my passcode</Button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-5">
            <button type="button" onClick={() => { setStep("email"); setToken(""); setError(null); setMessage(null); }} className="flex items-center gap-1 text-xs font-bold text-body hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" />Change email</button>
            <div><Label htmlFor="token">One-time passcode</Label><div className="relative"><KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" /><Input id="token" type="text" required autoFocus inputMode="numeric" autoComplete="one-time-code" minLength={6} maxLength={10} value={token} onChange={(event) => setToken(event.target.value.replace(/\D/g, "").slice(0, 10))} className="pl-10 text-center text-xl font-bold tracking-[.22em]" placeholder="00000000" /></div><p className="mt-2 text-xs text-body">Enter the code sent to {email}</p></div>
            <Button type="submit" size="lg" className="w-full" loading={loading}>Verify and open dashboard</Button>
            <button type="button" disabled={loading} onClick={(event) => requestCode(event as unknown as React.FormEvent)} className="w-full text-center text-xs font-bold text-primary disabled:opacity-50">Send a new passcode</button>
          </form>
        )}

        {(error || accessError) && <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-error"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error ?? "This account does not have dashboard access."}</p>}
        {message && !error && <p role="status" className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-800">{message}</p>}
        <p className="mt-6 text-center text-xs text-body">Passcodes are temporary and can only be used once.</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <React.Suspense fallback={null}><AdminLoginForm /></React.Suspense>;
}
