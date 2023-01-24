import $ from "dax";
import { extract } from "std/encoding/front_matter/yaml.ts";
import { parse } from "std/flags/mod.ts";

import { DiagnosticData, DiagnosticFixData } from "./types.d.ts";
import { assert } from "./util/common.ts";

interface DocCodeFrontMatter {
  title: string;
  category: "error" | "message" | "suggestion";
  tags?: string[];
  related?: number[];
}

interface DocCodeFixFrontMatter {
  title: string;
}

function stringify(value: unknown) {
  return `${JSON.stringify(value, undefined, "  ")}\n`;
}

async function buildDocs() {
  const docs = new Set<number>();
  const docFixes = new Map<number, string[]>();

  const CODE_RE = /^(\d{4,5})\.md$/;
  const FIX_RE = /^(\d{4,5})_fix_(\d{2})\.md$/;

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
    const codeText = `TS${code}`;
    const md = await Deno.readTextFile(`./docs/${code}.md`);
    const {
      body: documentation,
      attrs: { title, category, tags, related },
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
    const diagnostic = {
      code,
      codeText,
      title,
      category,
      documentation,
      tags,
      related,
      fixes,
    };
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
  $.logStep("Done.");
}

type DiagnosticMessages = Record<
  string,
  { category: "Error" | "Suggestion" | "Message"; code: number }
>;

async function scaffold() {
  $.logStep("Fetching diagnostic messages...");
  const res = await fetch(
    "https://github.com/microsoft/TypeScript/raw/main/src/compiler/diagnosticMessages.json",
  );
  if (res.status !== 200) {
    return $.logError(
      `Unexpected status returned fetching diagnostics: ${res.status} ${res.statusText}`,
    );
  }
  const diagnosticMessages: DiagnosticMessages = await res.json();
  const entries = [...Object.entries(diagnosticMessages)].map((
    [key, { code, category }],
  ) => [code, category, key] as const);
  const writes: Promise<void>[] = [];
  for (const [code, category, title] of entries) {
    try {
      const stat = await Deno.stat(`./docs/${code}.md`);
      assert(stat.isFile);
      continue;
    } catch {
      //
    }
    const md = `---
title: ${JSON.stringify(title)}
category: ${
      category === "Error"
        ? "error"
        : category === "Suggestion"
        ? "suggestion"
        : "message"
    }
---
`;
    writes.push(Deno.writeTextFile(`./docs/${code}.md`, md));
  }
  await Promise.all(writes);
}

function printHelp() {
  console.log(
    `
%cusage: deno task build <command>%c

Commands:
  %cdocs      %cRead the /docs directory entries and generate /db content.
  %cscaffold  %cFetch the current TypeScript diagnostic messages and scaffold out
            the contents of /docs with a file per diagnostic message.

`,
    "color:yellow",
    "color:none",
    "color:cyan",
    "color:none",
    "color:cyan",
    "color:none",
  );
}

function main() {
  const args = parse(Deno.args, { boolean: ["help"] });
  if (args.help) {
    return printHelp();
  }
  const [command] = args._;
  switch (command) {
    case undefined:
    case "docs":
      return buildDocs();
    case "scaffold":
      return scaffold();
    default:
      $.logWarn(`Unrecognized subcommand: ${command}`);
      return printHelp();
  }
}

if (import.meta.main) {
  main();
}
