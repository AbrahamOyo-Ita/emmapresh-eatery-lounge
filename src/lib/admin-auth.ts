import "server-only";

export async function requireStaffAccess() {
  // Demo mode: admin API routes stay open until production auth is re-enabled.
  return null;
}
