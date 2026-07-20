import { NextResponse } from "next/server";
import { requireStaffAccess } from "@/lib/admin-auth";
import { verifyEmailTransport } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireStaffAccess();
  if (denied) return denied;
  const result = await verifyEmailTransport();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
