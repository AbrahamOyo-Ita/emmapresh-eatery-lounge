export type BackendEntity =
  | "orders"
  | "catering"
  | "cake-requests"
  | "academy"
  | "halls"
  | "reservations"
  | "meal-plans"
  | "contact"
  | "menu-status";

async function postJson(path: string, body: unknown) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok === false) {
      throw new Error(result?.error ?? "Backend request failed");
    }
    return result;
  } catch {
    // Demo-first: local optimistic state remains usable if backend env is absent.
    return null;
  }
}

export function persistEntity(entity: BackendEntity, payload: unknown) {
  return postJson("/api/submissions", { entity, payload });
}

export function patchEntity(entity: BackendEntity, id: string, patch: Record<string, unknown>) {
  return postJson("/api/admin/update", { entity, id, patch });
}
