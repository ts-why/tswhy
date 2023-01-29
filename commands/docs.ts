/**
 * Build the documentation database from the individual diagnostic docs and
 * fixes contained in `/docs`.
 *
 * @module
 */

import { Command } from "cliffy/command";
import { extract } from "std/encoding/front_matter/yaml.ts";

import { kia } from "../util/cli.ts";
import { log } from "../util/log.ts";
import { stringify } from "../util/strings.ts";
import type {
  DiagnosticData,
  DiagnosticFixData,
  DocCodeFixFrontMatter,
  DocCodeFrontMatter,
} from "../types.d.ts";

const CODE_RE = /^(\d{4,5})\.md$/;
const FIX_RE = /^(\d{4,5})_fix_(\d{2})\.md$/;

export default new Command()
  .description("Build documentation content.")
  .action(async () => {
    const docs = new Set<number>();
    const docFixes = new Map<number, string[]>();
    let fixCount = 0;

    log.step("Analyzing /docs...");
    log.group();

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
        fixCount++;
      } else {
        log.warn(`Unsupported file located at: /docs/${entry.name}`);
      }
    }

    log.light(`located ${docs.size} diagnostic docs and ${fixCount} fixes.`);
    log.groupEnd();

    const all: DiagnosticData[] = [];
    const index: Record<number, string> = {};
    const tagIndex: Record<string, number[]> = {};
    const writePromises: Promise<void>[] = [];

    kia.start("parsing");
    for (const code of docs) {
      const codeText = `TS${code}`;
      const md = await Deno.readTextFile(`./docs/${code}.md`);
      const {
        body: documentation,
        attrs: { title, category, tags, related },
      } = extract<DocCodeFrontMatter>(md);
      index[code] = title;
      if (tags) {
        for (const tag of tags) {
          if (!(tag in tagIndex)) {
            tagIndex[tag] = [];
          }
          tagIndex[tag].push(code);
        }
      }
      const fixIds = docFixes.get(code);
      let fixes: DiagnosticFixData[] | undefined;
      if (fixIds) {
        fixes = [];
        for (
          const fixId of fixIds.sort((a, b) =>
            parseInt(a, 10) - parseInt(b, 10)
          )
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

    all.sort(({ code: a }, { code: b }) => a - b);

    kia.succeed("parsed.");

    log.step("Writing document db...");

    await Promise.all([
      ...writePromises,
      Deno.writeTextFile("./db/_all.json", stringify(all)),
      Deno.writeTextFile("./db/_index.json", stringify(index)),
      Deno.writeTextFile("./db/_tags.json", stringify(tagIndex)),
    ]);
    log.step("Done.");
  });
