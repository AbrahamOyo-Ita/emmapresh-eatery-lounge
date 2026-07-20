import "server-only";

import webPush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

function configure() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || `mailto:${process.env.GMAIL_USER || "admin@emmapresh.com"}`;
  if (!publicKey || !privateKey) throw new Error("VAPID keys are not configured");
  webPush.setVapidDetails(subject, publicKey, privateKey);
}

export interface PushPayload { title: string; body: string; url?: string; image?: string; tag?: string; actionLabel?: string; }

export async function sendPushNotifications(payload: PushPayload, recipient?: string) {
  configure();
  const supabase = createAdminClient();
  let query = supabase.from("push_subscriptions").select("endpoint,p256dh,auth");
  if (recipient && recipient !== "all") query = query.eq("customer_email", recipient.toLowerCase());
  const { data, error } = await query;
  if (error) throw error;
  const expired: string[] = [];
  const deliveries = await Promise.allSettled((data ?? []).map(async (subscription) => {
    try {
      await webPush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, JSON.stringify(payload), { TTL: 60 * 60, urgency: "high" });
      return true;
    } catch (error) {
      const statusCode = typeof error === "object" && error && "statusCode" in error ? Number((error as { statusCode?: number }).statusCode) : 0;
      if (statusCode === 404 || statusCode === 410) expired.push(subscription.endpoint);
      throw error;
    }
  }));
  if (expired.length) await supabase.from("push_subscriptions").delete().in("endpoint", expired);
  return { total: deliveries.length, sent: deliveries.filter((item) => item.status === "fulfilled").length, failed: deliveries.filter((item) => item.status === "rejected").length };
}
