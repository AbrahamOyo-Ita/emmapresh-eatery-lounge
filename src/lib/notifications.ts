import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { sendEmail } from "@/lib/email";

export type NotificationChannel = "email" | "sms" | "whatsapp" | "admin";

export interface NotificationInput {
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  message: string;
  entityType?: string;
  entityReference?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export async function notify(input: NotificationInput) {
  let notificationId: string | undefined;
  if (hasSupabaseEnv()) {
    const supabase = createAdminClient();
    const { data } = await supabase.from("notifications").insert({
      channel: input.channel,
      recipient: input.recipient,
      subject: input.subject,
      message: input.message,
      entity_type: input.entityType,
      entity_reference: input.entityReference,
      action_url: input.actionUrl,
      status: "queued",
    }).select("id").maybeSingle();
    notificationId = data?.id;
  }

  try {
    let emailQueued = false;
    if (input.channel === "email") {
      const delivery = await sendEmail({
        to: input.recipient,
        subject: input.subject,
        text: input.message,
        actionUrl: input.actionUrl,
        actionLabel: input.actionLabel,
        category: input.entityType,
        reference: input.entityReference,
      });
      emailQueued = delivery.skipped;
    }
    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      const response = await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error(`Notification webhook returned ${response.status}`);
    }
    if (hasSupabaseEnv()) {
      const supabase = createAdminClient();
      if (notificationId && !emailQueued) await supabase.from("notifications").update({ status: "sent" }).eq("id", notificationId);
    }
    if (emailQueued) return { ok: false as const, queued: true as const, reason: "gmail-env-missing" };
    return { ok: true as const };
  } catch (error) {
    if (hasSupabaseEnv() && notificationId) {
      await createAdminClient().from("notifications").update({ status: "failed" }).eq("id", notificationId);
    }
    console.error("Notification delivery failed", {
      channel: input.channel,
      entityReference: input.entityReference,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { ok: false as const, queued: false as const, reason: "delivery-failed" };
  }
}
