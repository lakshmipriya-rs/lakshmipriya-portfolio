import { readFile } from "node:fs/promises";

const files = ["src/App.tsx", "src/main.tsx"];
const forbidden = /font-(?:size|family)|letter-spacing|font-weight/;
const failures = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  if (forbidden.test(source)) failures.push(file);
}

const typography = await readFile("src/styles/typography.css", "utf8");
for (const role of ["hero-h1", "section-h2", "case-title", "step-title", "body-lg", "metric-value", "eyebrow", "role-code"]) {
  if (!typography.includes(role)) failures.push(`src/styles/typography.css missing ${role}`);
}

const globalStyles = await readFile("src/styles/globals.css", "utf8");
if (/Instrument Serif|Inter(?: Variable)?/.test(globalStyles)) {
  failures.push("src/styles/globals.css references a removed font family");
}

if (failures.length) {
  console.error(`Typography guard failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Typography guard passed.");