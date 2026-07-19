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
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Demo-first: local optimistic state remains usable if backend env is absent.
  }
}

export function persistEntity(entity: BackendEntity, payload: unknown) {
  void postJson("/api/submissions", { entity, payload });
}

export function patchEntity(entity: BackendEntity, id: string, patch: Record<string, unknown>) {
  void postJson("/api/admin/update", { entity, id, patch });
}

