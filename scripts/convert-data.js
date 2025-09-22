#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function convertValacdos() {
  const txtPath = join(__dirname, "../src/data/valacdos.txt");
  const tsPath = join(__dirname, "../src/data/valacdos.ts");

  const content = await fs.readFile(txtPath, "utf-8");

  const lines = content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split(",").map((val) => val.trim());
      const [start, end, modCheck, ...numericStrs] = parts;
      const [u, v, w, x, y, z, a, b, c, d, e, f, g, h, exception] =
        numericStrs.map(Number);

      return {
        start,
        end,
        modCheck,
        u,
        v,
        w,
        x,
        y,
        z,
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        exception: Number.isNaN(exception) ? "undefined" : exception,
      };
    });

  const tsContent = `// Auto-generated from valacdos.txt - DO NOT EDIT MANUALLY
import type { ModulusCheckMethods } from "../lib/constants/constants";

export type SortcodeValacdos = {
  start: string;
  end: string;
  modCheck: ModulusCheckMethods;
  u: number;
  v: number;
  w: number;
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  exception: number | undefined;
};

export const valacdosData: SortcodeValacdos[] = [
${lines
  .map(
    (line) =>
      `  {
    start: "${line.start}",
    end: "${line.end}",
    modCheck: "${line.modCheck}" as ModulusCheckMethods,
    u: ${line.u}, v: ${line.v}, w: ${line.w}, x: ${line.x}, y: ${line.y}, z: ${line.z},
    a: ${line.a}, b: ${line.b}, c: ${line.c}, d: ${line.d}, e: ${line.e}, f: ${line.f}, g: ${line.g}, h: ${line.h},
    exception: ${line.exception}
  }`
  )
  .join(",\n")}
];
`;

  await fs.writeFile(tsPath, tsContent);
  console.log("✓ Generated src/data/valacdos.ts");
}

async function convertScsub() {
  const txtPath = join(__dirname, "../src/data/scsub.txt");
  const tsPath = join(__dirname, "../src/data/scsub.ts");

  const content = await fs.readFile(txtPath, "utf-8");

  const entries = content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [original, substitute] = line.split(",").map((val) => val.trim());
      return `  "${original}": "${substitute}"`;
    });

  const tsContent = `// Auto-generated from scsub.txt - DO NOT EDIT MANUALLY

export const sortCodeSubstitutions: Record<string, string> = {
${entries.join(",\n")}
};
`;

  await fs.writeFile(tsPath, tsContent);
  console.log("✓ Generated src/data/scsub.ts");
}

async function main() {
  try {
    await convertValacdos();
    await convertScsub();
    console.log("✓ All data files converted successfully");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
