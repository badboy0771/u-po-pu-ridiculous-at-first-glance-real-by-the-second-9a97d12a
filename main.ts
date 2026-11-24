// Ridiculous at First Glance, Real by the Second
// make.fun bounty: u-po-pu-ridiculous-at-first-glance-real-by-the-second-9a97d12a
// Program (Node 22, no dependencies, no network, deterministic):
// writes one sentence — a bizarre startup pitch — to /output/entry.txt
// and validates it against the gate: UTF-8 text, 1-200 characters,
// exactly one sentence, a single line, no leading/trailing whitespace,
// and the file on disk must read back byte-identical (no trailing newline).

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const ENTRY =
  "We rent strangers' dogs to nervous first-daters for $25 an hour, because nothing makes a stranger look kind, safe, and worth a second date like a borrowed golden retriever that already likes you.";

const MAX_CHARS = 200;
const OUT_PATH = "/output/entry.txt";

function checkEntry(text: string): string {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`entry is ${text.length} characters, must be 1-${MAX_CHARS}`);
  }
  if (text !== text.trim()) {
    throw new Error("entry must have no leading or trailing whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
  // Exactly one sentence: a single terminal period, at the very end.
  const terminators = (text.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1 || !text.endsWith(".")) {
    throw new Error("entry must be exactly one sentence ending with a period");
  }
  return text;
}

function main(): void {
  const text = checkEntry(ENTRY);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT_PATH, text, "utf8");
  const back = readFileSync(OUT_PATH, "utf8");
  if (back !== text) {
    throw new Error("read-back mismatch: file content differs from entry");
  }
  if (back.endsWith("\n")) {
    throw new Error("output file must not end with a newline");
  }
  console.log(`wrote ${OUT_PATH} (${text.length} characters)`);
  console.log(text);
}

main();
