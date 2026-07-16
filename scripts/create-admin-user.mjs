// Bootstraps a staff/admin account directly via the Supabase Admin API.
// Usage:
//   ADMIN_EMAIL=you@emmapresh.com ADMIN_PASSWORD='StrongPass123!' node scripts/create-admin-user.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(rootDir, ".env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) return;
  const contents = readFileSync(envPath, "utf-8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!key) continue;
    const value = rest.join("=").trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!email || !password) {
  console.error("Usage: ADMIN_EMAIL=you@emmapresh.com ADMIN_PASSWORD='StrongPass123!' node scripts/create-admin-user.mjs");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Failed to create admin user:", error.message);
  process.exit(1);
}

console.log(`Admin user created: ${data.user.email} (id: ${data.user.id})`);
console.log("You can now sign in at /admin/login with this email and password.");
