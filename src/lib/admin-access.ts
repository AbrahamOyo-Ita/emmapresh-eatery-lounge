export const SUPER_ADMIN_EMAIL = process.env.ADMIN_SUPER_EMAIL || "oyoitaabraham@gmail.com";
export const COMPANY_ADMIN_EMAIL = process.env.ADMIN_COMPANY_EMAIL || "emmapresheateryandlounge@gmail.com";

export type BootstrapAdminRole = "super_admin" | "company_admin";

export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getBootstrapAdminRole(email?: string | null): BootstrapAdminRole | null {
  const normalized = normalizeAdminEmail(email ?? "");
  if (normalized === SUPER_ADMIN_EMAIL) return "super_admin";
  if (normalized === COMPANY_ADMIN_EMAIL) return "company_admin";
  return null;
}

export function isBootstrapAdmin(email?: string | null) {
  return getBootstrapAdminRole(email) !== null;
}
