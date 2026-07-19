import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

const bucketByKind = {
  receipt: "receipts",
  "cake-reference": "cake-reference-images",
} as const;

export async function POST(request: Request) {
  const formData = await request.formData();
  const kind = String(formData.get("kind") ?? "receipt") as keyof typeof bucketByKind;
  const reference = String(formData.get("reference") ?? "upload");
  const file = formData.get("file");
  const bucket = bucketByKind[kind];

  if (!bucket || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Invalid upload" }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: true, skipped: "supabase-env-missing", path: "" });
  }

  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${reference}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 30);
  return NextResponse.json({ ok: true, path, url: data?.signedUrl ?? "" });
}

