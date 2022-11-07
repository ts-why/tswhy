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

function stringify(value: unknown) {
  return `${JSON.stringify(value, undefined, "  ")}\n`;
}

async function main() {
  const docs = new Set<number>();
  const docFixes = new Map<number, string[]>();

  const CODE_RE = /^(\d{4})\.md$/;
  const FIX_RE = /^(\d{4})_fix_(\d{2})\.md$/;

  $.logStep("Analyzing /docs...");
  $.logGroup();

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

  $.logLight(`located ${docs.size} diagnostic docs.`);
  $.logGroupEnd();

  const all: DiagnosticData[] = [];
  const index: Record<number, string> = {};
  const writePromises: Promise<void>[] = [];

  $.logStep(`Parsing diagnostic documentation...`);

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
    const diagnostic = { code, title, documentation, tags, related, fixes };
    writePromises.push(
      Deno.writeTextFile(`./db/${code}.json`, stringify(diagnostic)),
    );
    all.push(diagnostic);
  }

  all.sort(({ code: aCode }, { code: bCode }) => aCode - bCode);

  $.logStep("Writing document db...");

  await Promise.all([
    ...writePromises,
    Deno.writeTextFile("./db/_all.json", stringify(all)),
    Deno.writeTextFile("./db/_index.json", stringify(index)),
  ]);
}

$.logStep("Done.");

if (import.meta.main) {
  main();
}
