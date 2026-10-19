// Typography guard: keeps every type declaration in src/styles/typography.css.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const failures = [];

async function listFiles(dir, pattern) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(path, pattern);
      return pattern.test(entry.name) ? [path] : [];
    }),
  );
  return nested.flat();
}

// 1. No inline typography in components.
const inlineType = /font-?(?:size|family|weight)|letter-?spacing|line-?height/i;
for (const file of await listFiles("src", /\.tsx$/)) {
  if (/\.test\.tsx$/.test(file)) continue;
  if (inlineType.test(await readFile(file, "utf8")))
    failures.push(`${file} sets typography inline`);
}

// 2. globals.css owns layout and colour only.
const globals = await readFile("src/styles/globals.css", "utf8");
const typeDeclaration =
  /^\s*(font(?:-size|-family|-weight)?|line-height|letter-spacing)\s*:/m;
const match = globals.match(typeDeclaration);
if (match)
  failures.push(
    `src/styles/globals.css declares "${match[1]}" — move it to typography.css`,
  );

// 3. The scale tokens exist.
const typography = await readFile("src/styles/typography.css", "utf8");
for (const token of [
  "--font-mono",
  "--type-hero-h1",
  "--type-section-h2",
  "--type-case-title",
  "--type-step-title",
  "--type-body-lg",
  "--type-body",
  "--type-metric-value",
  "--type-eyebrow",
  "--type-code",
]) {
  if (!typography.includes(`${token}:`))
    failures.push(`src/styles/typography.css missing ${token}`);
}

if (failures.length) {
  console.error(`Typography guard failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Typography guard passed.");
