import "server-only";

import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import { z } from "zod";
import { siteConfig } from "@/config/site";

const emailAddress = z.string().trim().email().max(320);

const sendEmailSchema = z.object({
  to: z.union([emailAddress, z.array(emailAddress).min(1).max(50)]),
  subject: z.string().trim().min(1).max(180).refine((value) => !/[\r\n]/.test(value), "Subject cannot contain line breaks"),
  text: z.string().trim().min(1).max(100_000),
  actionUrl: z.string().url().max(2_048).optional(),
  actionLabel: z.string().trim().min(1).max(80).optional(),
  preheader: z.string().trim().max(180).optional(),
  replyTo: emailAddress.optional(),
  category: z.string().trim().regex(/^[a-z0-9][a-z0-9_-]{0,49}$/i).optional(),
  reference: z.string().trim().max(120).optional(),
});

export type SendEmailInput = z.input<typeof sendEmailSchema>;
export type SendEmailResult =
  | { skipped: true; reason: "gmail-env-missing" }
  | { skipped: false; messageId: string; accepted: string[]; rejected: string[]; attempts: number };

type MailConfig = {
  user: string;
  pass: string;
  fromName: string;
  replyTo: string;
};

declare global {
  var __emmapreshMailer: Transporter | undefined;
}

function emailConfig(): MailConfig | null {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  const parsedUser = emailAddress.safeParse(user);
  const parsedReplyTo = emailAddress.safeParse(process.env.EMAIL_REPLY_TO?.trim() || siteConfig.email);
  if (!parsedUser.success) throw new Error("GMAIL_USER must be a valid email address");
  if (!parsedReplyTo.success) throw new Error("EMAIL_REPLY_TO must be a valid email address");
  if (pass.length !== 16) throw new Error("GMAIL_APP_PASSWORD must be the 16-character Google App Password");

  return {
    user: parsedUser.data,
    pass,
    fromName: process.env.EMAIL_FROM_NAME?.trim() || siteConfig.name,
    replyTo: parsedReplyTo.data,
  };
}

export function hasEmailConfig() {
  try {
    return Boolean(emailConfig());
  } catch {
    return false;
  }
}

function getTransporter() {
  const config = emailConfig();
  if (!config) throw new Error("Gmail SMTP credentials are not configured");

  if (!globalThis.__emmapreshMailer) {
    globalThis.__emmapreshMailer = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 3,
      maxMessages: 75,
      rateDelta: 1_000,
      rateLimit: 4,
      connectionTimeout: 12_000,
      greetingTimeout: 10_000,
      socketTimeout: 30_000,
      auth: { user: config.user, pass: config.pass },
      disableFileAccess: true,
      disableUrlAccess: true,
    });
  }
  return globalThis.__emmapreshMailer;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function emailHtml(input: z.output<typeof sendEmailSchema>) {
  const paragraphs = input.text
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px;line-height:1.7;color:#423c37;font-size:16px">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const action = input.actionUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0"><tr><td style="border-radius:999px;background:#b41018"><a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;border:1px solid #b41018;border-radius:999px;color:#fff;text-decoration:none;font-weight:700;padding:13px 24px">${escapeHtml(input.actionLabel ?? "View details")}</a></td></tr></table>`
    : "";
  const preheader = escapeHtml(input.preheader ?? input.subject);
  const currentYear = new Date().getFullYear();

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(input.subject)}</title></head><body style="margin:0;padding:0;background:#f7efe4;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7efe4"><tr><td style="padding:36px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:auto;background:#fff;border:1px solid #e8ddd1;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(54,37,24,.08)"><tr><td style="background:#171412;padding:28px 32px;color:#fff;border-bottom:4px solid #b41018"><div style="font-size:24px;font-weight:800;letter-spacing:.5px">EMMA PRESH</div><div style="margin-top:5px;font-size:11px;letter-spacing:3px;color:#e9d7bd">EATERY &amp; LOUNGE</div></td></tr><tr><td style="padding:34px 32px 28px"><h1 style="margin:0 0 20px;color:#171412;font-size:26px;line-height:1.25">${escapeHtml(input.subject)}</h1>${paragraphs}${action}<p style="margin:30px 0 0;border-top:1px solid #eee5dc;padding-top:20px;color:#756d66;font-size:13px;line-height:1.6">Need help? Call ${escapeHtml(siteConfig.phone)} or ${escapeHtml(siteConfig.secondaryPhone)}.<br><a href="mailto:${escapeHtml(siteConfig.email)}" style="color:#9d1118">${escapeHtml(siteConfig.email)}</a></p></td></tr><tr><td style="background:#faf7f2;padding:18px 32px;color:#8a8179;font-size:11px;line-height:1.5">© ${currentYear} ${escapeHtml(siteConfig.name)}. Abuja · Lagos · Badagry</td></tr></table></td></tr></table></body></html>`;
}

function retryable(error: unknown) {
  const responseCode = typeof error === "object" && error && "responseCode" in error
    ? Number((error as { responseCode?: number }).responseCode)
    : 0;
  const code = typeof error === "object" && error && "code" in error
    ? String((error as { code?: string }).code)
    : "";
  return responseCode === 421 || responseCode === 450 || responseCode === 451 || responseCode === 452
    || ["ETIMEDOUT", "ECONNECTION", "ECONNRESET", "ESOCKET", "EAI_AGAIN"].includes(code);
}

function adminBcc() {
  const values = process.env.EMAIL_ADMIN_RECIPIENTS?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  const parsed = z.array(emailAddress).max(20).safeParse(values);
  if (!parsed.success) throw new Error("EMAIL_ADMIN_RECIPIENTS must contain valid comma-separated email addresses");
  return parsed.data;
}

function addresses(values: unknown) {
  if (!Array.isArray(values)) return [];
  return values.map((value) => typeof value === "string" ? value : String(value));
}

export async function sendEmail(rawInput: SendEmailInput): Promise<SendEmailResult> {
  const input = sendEmailSchema.parse(rawInput);
  const config = emailConfig();
  if (!config) return { skipped: true, reason: "gmail-env-missing" };

  const bcc = adminBcc();
  const options: SendMailOptions = {
    from: { name: config.fromName, address: config.user },
    replyTo: input.replyTo ?? config.replyTo,
    to: input.to,
    bcc: bcc.length ? bcc : undefined,
    subject: input.subject,
    text: input.text,
    html: emailHtml(input),
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await getTransporter().sendMail(options);
      return {
        skipped: false,
        messageId: result.messageId,
        accepted: addresses(result.accepted),
        rejected: addresses(result.rejected),
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;
      if (attempt === 3 || !retryable(error)) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1) + Math.floor(Math.random() * 200)));
    }
  }
  throw lastError;
}

export async function verifyEmailTransport() {
  try {
    if (!emailConfig()) return { ok: false as const, error: "Gmail SMTP credentials are not configured" };
    await getTransporter().verify();
    return { ok: true as const, account: process.env.GMAIL_USER?.trim() };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "SMTP verification failed" };
  }
}
