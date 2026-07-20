import process from "node:process";
import nextEnv from "@next/env";
import nodemailer from "nodemailer";

nextEnv.loadEnvConfig(process.cwd());

const recipient = process.argv[2]?.trim();
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

if (!recipient || !emailPattern.test(recipient)) {
  console.error("Usage: npm run email:test-order -- customer@example.com");
  process.exit(1);
}

const user = process.env.GMAIL_USER?.trim();
const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
const fromName = process.env.EMAIL_FROM_NAME?.trim() || "EmmaPresh Eatery & Lounge";
const replyTo = process.env.EMAIL_REPLY_TO?.trim() || user;

if (!user || !emailPattern.test(user) || !pass || pass.length !== 16) {
  console.error("GMAIL_USER and a 16-character GMAIL_APP_PASSWORD are required in .env.local");
  process.exit(1);
}

const reference = `EP-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`;
const subject = `Your EmmaPresh order is confirmed — ${reference}`;
const text = `Hello,\n\nThank you for choosing EmmaPresh Eatery & Lounge. Your order confirmation is ready.\n\nOrder reference: ${reference}\nStatus: Confirmed\nPayment: Verified\n\nThis confirmation was sent to verify your requested email notifications. No payment was taken and no food will be prepared.\n\nEmmaPresh Eatery & Lounge\n+234 803 386 8360`;
const escapedSubject = subject.replace(/[&<>"']/g, (value) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[value]);

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 12_000,
  greetingTimeout: 10_000,
  socketTimeout: 30_000,
  auth: { user, pass },
  disableFileAccess: true,
  disableUrlAccess: true,
});

try {
  const result = await transport.sendMail({
    from: { name: fromName, address: user },
    replyTo,
    to: recipient,
    subject,
    text,
    html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapedSubject}</title></head><body style="margin:0;background:#f7efe4;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">We have confirmed your EmmaPresh order.</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:36px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:auto;background:#fff;border:1px solid #e8ddd1;border-radius:20px;overflow:hidden"><tr><td style="background:#171412;padding:28px 32px;color:#fff;border-bottom:4px solid #b41018"><div style="font-size:24px;font-weight:800">EMMA PRESH</div><div style="margin-top:5px;font-size:11px;letter-spacing:3px;color:#e9d7bd">EATERY &amp; LOUNGE</div></td></tr><tr><td style="padding:34px 32px"><div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#e8f7ed;color:#176b35;font-size:12px;font-weight:700">ORDER CONFIRMED</div><h1 style="margin:18px 0;color:#171412;font-size:26px">Thank you for choosing EmmaPresh</h1><p style="color:#423c37;font-size:16px;line-height:1.7">Your order confirmation is ready.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;background:#faf7f2;border-radius:14px"><tr><td style="padding:18px;color:#756d66">Order reference</td><td style="padding:18px;text-align:right;font-weight:700;color:#171412">${reference}</td></tr><tr><td style="padding:0 18px 18px;color:#756d66">Payment</td><td style="padding:0 18px 18px;text-align:right;font-weight:700;color:#176b35">Verified</td></tr></table><p style="color:#756d66;font-size:13px;line-height:1.6">This confirmation was sent to verify your requested email notifications. No payment was taken and no food will be prepared.</p><p style="margin-top:24px;color:#756d66;font-size:13px;line-height:1.6">Need help? Call +234 803 386 8360.</p></td></tr></table></td></tr></table></body></html>`,
  });

  console.log(JSON.stringify({
    ok: true,
    reference,
    messageId: result.messageId,
    accepted: result.accepted.map(String),
    rejected: result.rejected.map(String),
  }));
} catch (error) {
  console.error(JSON.stringify({
    ok: false,
    code: error?.code || error?.responseCode || "UNKNOWN",
    error: error instanceof Error ? error.message : "Email delivery failed",
  }));
  process.exitCode = 1;
} finally {
  transport.close();
}
