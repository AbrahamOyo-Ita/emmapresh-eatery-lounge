import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

assert.ok(existsSync(join(root, "src/app/api/submissions/route.ts")), "submission API route is missing");
assert.ok(existsSync(join(root, "src/app/api/uploads/route.ts")), "upload API route is missing");
assert.ok(existsSync(join(root, "src/app/api/admin/snapshot/route.ts")), "admin snapshot API route is missing");
assert.ok(existsSync(join(root, "src/app/api/admin/update/route.ts")), "admin update API route is missing");
assert.ok(existsSync(join(root, "src/app/api/admin/auth/request-code/route.ts")), "admin OTP request route is missing");

const envExample = read(".env.example");
assert.match(envExample, /NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key/, "anon key placeholder must stay scrubbed");
assert.match(envExample, /SUPABASE_SERVICE_ROLE_KEY=your-service-role-key/, "service role placeholder must stay scrubbed");
assert.doesNotMatch(envExample, /eyJ[A-Za-z0-9_-]+\./, ".env.example must not contain JWT-looking secrets");

const demoOpsMigration = read("supabase/migrations/20260718090000_demo_ops.sql");
for (const bucket of ["receipts", "cake-reference-images", "catalog-images", "gallery-images"]) {
  assert.match(demoOpsMigration, new RegExp(`'${bucket}'`), `${bucket} bucket must be declared`);
}
for (const policy of ["public upload receipts", "staff read private uploads", "public read catalog images"]) {
  assert.match(demoOpsMigration, new RegExp(policy), `${policy} storage policy must be declared`);
}

const proxy = read("src/proxy.ts");
assert.match(proxy, /staff_profiles/, "admin proxy must check staff_profiles");
assert.match(proxy, /staff-access-required/, "admin proxy must reject users without staff access");
assert.match(read("src/lib/admin-auth.ts"), /Staff access required/, "admin API guard must reject non-staff users");
assert.match(read("src/lib/admin-access.ts"), /oyoitaabraham@gmail\.com/, "super-admin email must remain authorised");
assert.match(read("src/lib/admin-access.ts"), /emmapresheateryandlounge@gmail\.com/, "company admin email must remain authorised");
assert.match(read("src/app/admin/login/page.tsx"), /verifyOtp/, "admin login must verify a one-time email passcode");
assert.match(read("src/app/api/admin/auth/request-code/route.ts"), /isBootstrapAdmin/, "OTP requests must reject unauthorised emails");
assert.match(read("src/app/api/admin/snapshot/route.ts"), /requireStaffAccess/, "snapshot route must require staff access");
assert.match(read("src/components/admin/backend-hydration.tsx"), /setInterval\(\(\) => void hydrate\(\), 10_000\)/, "admin dashboard must refresh backend data live");
assert.match(read("src/stores/orders-store.ts"), /if \(!persisted\?\.persisted\)/, "checkout must not report success before backend persistence");
assert.match(read("src/app/api/admin/update/route.ts"), /requireStaffAccess/, "update route must require staff access");

const adminLayout = read("src/app/admin/layout.tsx");
const adminSidebar = read("src/components/admin/admin-sidebar.tsx");
assert.match(adminLayout, /onMenuClick=\{\(\) => setMobileNavOpen\(true\)\}/, "admin hamburger must open mobile navigation");
assert.match(adminSidebar, /aria-modal="true"/, "mobile admin navigation must be an accessible modal");
assert.match(adminSidebar, /Escape/, "mobile admin navigation must close with Escape");

const promotionsAdmin = read("src/app/admin/promotions/page.tsx");
assert.doesNotMatch(promotionsAdmin, /<Button[^>]*disabled[^>]*>\s*<Plus/, "new promotion action must remain functional");
assert.match(promotionsAdmin, /addPromotion/, "admin must persist newly created promotions");

const footer = read("src/components/layout/footer.tsx");
assert.match(footer, /onSubmit=\{subscribe\}/, "newsletter form must have a working submit handler");

assert.ok(existsSync(join(root, "src/app/admin/projects/page.tsx")), "project management board is missing");
assert.ok(existsSync(join(root, "src/app/api/admin/workspace/route.ts")), "shared CRM/project workspace API is missing");
assert.match(read("src/app/api/admin/workspace/route.ts"), /requireStaffAccess/, "workspace mutations must require staff access");
assert.match(read("src/stores/projects-store.ts"), /moveCard/, "project cards must support workflow movement");
assert.match(read("src/components/offers/offers-list.tsx"), /\/api\/promotions/, "public offers must load backend promotions");

const receiptUpload = read("src/components/checkout/receipt-upload.tsx");
assert.match(receiptUpload, /\/api\/uploads/, "receipt upload must use the upload API");
assert.match(receiptUpload, /storagePath/, "receipt upload must return a storage path");

console.log("Project verification passed.");
