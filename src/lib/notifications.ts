import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export type NotificationChannel = "email" | "sms" | "whatsapp" | "admin";

export interface NotificationInput {
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  message: string;
  entityType?: string;
  entityReference?: string;
}

export async function notify(input: NotificationInput) {
  if (hasSupabaseEnv()) {
    const supabase = createAdminClient();
    await supabase.from("notifications").insert({
      channel: input.channel,
      recipient: input.recipient,
      subject: input.subject,
      message: input.message,
      entity_type: input.entityType,
      entity_reference: input.entityReference,
      status: "queued",
    });
  }

  if (!process.env.NOTIFICATION_WEBHOOK_URL) return;

  try {
    await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    if (hasSupabaseEnv()) {
      const supabase = createAdminClient();
      await supabase
        .from("notifications")
        .update({ status: "failed" })
        .eq("entity_reference", input.entityReference ?? "");
    }
  }
}

