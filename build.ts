import $ from "dax";
import { extract } from "std/encoding/front_matter/yaml.ts";

import { DiagnosticData, DiagnosticFixData } from "./types.d.ts";

interface DocCodeFrontMatter {
  title: string;
  tags?: string[];
  related?: number[];
}

interface DocCodeFixFrontMatter {
  title: string;
}

const docs = new Set<number>();
const docFixes = new Map<number, string[]>();

const CODE_RE = /^(\d{4})\.md$/;
const FIX_RE = /^(\d{4})_fix_(\d{2})\.md$/;

for await (const entry of Deno.readDir("./docs")) {
  const codeMatch = CODE_RE.exec(entry.name);
  const fixMatch = FIX_RE.exec(entry.name);
  if (codeMatch) {
    const [, codeStr] = codeMatch;
    const code = parseInt(codeStr, 10);
    docs.add(code);
  } else if (fixMatch) {
    const [, codeStr, fix] = fixMatch;
    const code = parseInt(codeStr, 10);
    if (!docFixes.has(code)) {
      docFixes.set(code, []);
    }
    docFixes.get(code)!.push(fix);
  } else {
    $.logWarn(`Unsupported file located at: /docs/${entry.name}`);
  }
}

const all: DiagnosticData[] = [];
const index: Record<number, string> = {};

for (const code of docs) {
  const md = await Deno.readTextFile(`./docs/${code}.md`);
  const {
    body: documentation,
    attrs: { title, tags, related },
  } = extract<DocCodeFrontMatter>(md);
  index[code] = title;
  const fixIds = docFixes.get(code);
  let fixes: DiagnosticFixData[] | undefined;
  if (fixIds) {
    fixes = [];
    for (
      const fixId of fixIds.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    ) {
      const md = await Deno.readTextFile(`./docs/${code}_fix_${fixId}.md`);
      const { body, attrs: { title } } = extract<DocCodeFixFrontMatter>(md);
      fixes.push({ title, body });
    }
  }
  all.push({ code, title, documentation, tags, related, fixes });
}

all.sort(({ code: aCode }, { code: bCode }) => aCode - bCode);

await Promise.all([
  Deno.writeTextFile(
    "./db/_all.json",
    JSON.stringify(all, undefined, "  "),
  ),
  Deno.writeTextFile(
    "./db/_index.json",
    JSON.stringify(index, undefined, "  "),
  ),
]);
