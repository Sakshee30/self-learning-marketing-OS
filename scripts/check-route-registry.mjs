import fs from "node:fs";

const source = fs.readFileSync("src/app/router/routeRegistry.ts", "utf8");

function collect(pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]).filter(Boolean);
}

function duplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

const ids = collect(/\bid:\s*"([^"]+)"/g);
const paths = collect(/\bpath:\s*"([^"]+)"/g);
const duplicateIds = duplicates(ids);
const duplicatePaths = duplicates(paths);

if (duplicateIds.length || duplicatePaths.length) {
  console.error("Route registry validation failed.");
  if (duplicateIds.length) console.error("Duplicate route IDs:", duplicateIds.join(", "));
  if (duplicatePaths.length) console.error("Duplicate route paths:", duplicatePaths.join(", "));
  process.exit(1);
}

if (!paths.includes("/command") || !paths.includes("/ai-cmo") || !paths.includes("/approvals")) {
  console.error("Route registry is missing required GrowthOS operating surfaces.");
  process.exit(1);
}

console.log(`Route registry OK: ${ids.length} IDs, ${paths.length} paths.`);


const customerAppSource = fs.readFileSync("src/App.tsx", "utf8");

if (/\bSuperAdminPage\b/.test(customerAppSource) || /path="\/super-admin"/.test(customerAppSource)) {
  console.error("Customer application must not compose the privileged platform-control UI.");
  process.exit(1);
}

if (/\bModulePage\b/.test(customerAppSource)) {
  console.error("Customer application must use dedicated feature pages instead of the legacy generic ModulePage.");
  process.exit(1);
}

if (!fs.existsSync("frontend/platform-admin/src/App.tsx")) {
  console.error("Dedicated platform-control application entry is missing.");
  process.exit(1);
}

console.log("Application-boundary checks OK: customer SPA and platform control remain separate.");
