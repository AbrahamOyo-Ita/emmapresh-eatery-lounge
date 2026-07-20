"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { adminLoginSchema, type AdminLoginFormValues } from "@/schemas/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const accessError = searchParams.get("error") === "staff-access-required";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({ resolver: zodResolver(adminLoginSchema) });

  async function onSubmit(data: AdminLoginFormValues) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (signInError) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.push(searchParams.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm rounded-card bg-white p-8 shadow-[var(--shadow-lift)]">
        <div className="mb-6 text-center">
          <span className="font-display text-xl">
            EMMA<span className="text-primary">PRESH</span>
          </span>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-body">Staff Login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" autoComplete="username" {...register("email")} error={errors.email?.message} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
            <FieldError>{errors.password?.message}</FieldError>
          </div>

          {(error || accessError) && (
            <p role="alert" className="flex items-center gap-1.5 text-sm font-medium text-error">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {error ?? "This account does not have staff access."}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-body">
          Staff accounts only. Contact a super admin if you need access.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminLoginForm />
    </React.Suspense>
  );
}
