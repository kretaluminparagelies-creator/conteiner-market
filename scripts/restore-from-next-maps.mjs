import fs from "fs";
import path from "path";

const root = process.cwd();
const nextDir = path.join(root, ".next");
const files = new Map();

const allowedPrefixes = [
  "src/app/",
  "src/components/",
  "src/lib/constants/",
  "src/lib/hooks/",
  "src/lib/seo/",
  "src/lib/spline/",
  "src/lib/utils/",
  "src/lib/data/",
  "src/lib/types/",
  "src/data/",
];

const allowedAppFiles = /^src\/app\/[^/]+\.(tsx|ts|css|ico)$/;

function isAllowed(relPosix) {
  if (relPosix.includes("__nextjs-internal")) return false;
  if (relPosix.includes("route-entry")) return false;
  if (relPosix.includes("favicon.ico")) return false;
  if (allowedPrefixes.some((p) => relPosix.startsWith(p))) return true;
  if (allowedAppFiles.test(relPosix)) return true;
  return /^src\/app\/[^/]+\/page\.tsx$/.test(relPosix);
}

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".map")) {
      try {
        const map = JSON.parse(fs.readFileSync(p, "utf8"));
        if (!map.sourcesContent || !map.sources) continue;
        map.sources.forEach((src, i) => {
          const content = map.sourcesContent[i];
          if (!content) return;
          const norm = src.replace(/^file:\/\//i, "").replace(/\\/g, "/");
          const idx = norm.toLowerCase().indexOf("/src/");
          if (idx === -1) return;
          const relPosix = norm.slice(idx + 1);
          if (!isAllowed(relPosix)) return;
          const winRel = relPosix.replace(/\//g, path.sep);
          const existing = files.get(winRel);
          if (!existing || content.length > existing.length) {
            files.set(winRel, content);
          }
        });
      } catch {
        /* skip */
      }
    }
  }
}

function rmIfExists(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

for (const junk of ["src/client", "src/server", "src/shared", "src/build"]) {
  rmIfExists(path.join(root, junk));
}

walk(nextDir);

let count = 0;
for (const [rel, content] of files) {
  const out = path.join(root, rel);
  if (fs.existsSync(out) && fs.statSync(out).isDirectory()) {
    fs.rmSync(out, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
  count++;
}

console.log(`Restored ${count} project files`);
for (const f of [...files.keys()].sort()) console.log(f);
