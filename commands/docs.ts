/**
 * Build the documentation database from the individual diagnostic docs and
 * fixes contained in `/docs`.
 *
 * @module
 */

import { Command } from "@codemonument/cliffy/command";
import { extract } from "@std/front-matter/yaml";

import "@std/dotenv/load";

import { kia } from "$utils/cli.ts";
import { clear, setDiagnostic, TSWHY_PROD_KV } from "$utils/kv.ts";
import { log } from "$utils/log.ts";
import type {
  DiagnosticFixData,
  DocCodeFixFrontMatter,
  DocCodeFrontMatter,
} from "$utils/types.ts";

const CODE_RE = /^(\d{4,5})\.md$/;
const FIX_RE = /^(\d{4,5})_fix_(\d{2})\.md$/;

export default new Command()
  .description("Parse diagnostics and load them into the KV store.")
  .option("-p, --prod", "Connect to the production KV store.")
  .action(async ({ prod }) => {
    log.step("Analyzing /docs...");
    log.group();

    const docs = new Set<number>();
    const docFixes = new Map<number, string[]>();
    let fixCount = 0;

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

    const kv = await Deno.openKv(prod && TSWHY_PROD_KV);

    log.step("Clearing KV store...");
    await clear(kv);

    let remaining = docs.size;
    log.step(`Loading KV store with ${remaining} diagnostics...`);

    kia.start(`parsing and loading`);
    for (const code of docs) {
      const codeText = `TS${code}`;
      const md = await Deno.readTextFile(`./docs/${code}.md`);
      try {
        const {
          body: documentation,
          attrs: { title, category, tags, related },
        } = extract<DocCodeFrontMatter>(md);
        const fixIds = docFixes.get(code);
        let fixes: DiagnosticFixData[] | undefined;
        if (fixIds) {
          fixes = [];
          for (
            const fixId of fixIds.sort((a, b) =>
              parseInt(a, 10) - parseInt(b, 10)
            )
          ) {
            const md = await Deno.readTextFile(
              `./docs/${code}_fix_${fixId}.md`,
            );
            const { body, attrs: { title } } = extract<DocCodeFixFrontMatter>(
              md,
            );
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
        await setDiagnostic(kv, diagnostic);
        kia.set(
          `loaded diagnostic ${diagnostic.codeText} (${remaining}/${docs.size})        `,
        );
        remaining--;
      } catch (e) {
        log.error(`Problem processing error ${code}.`, e);
      }
    }

    kia.succeed("loaded.");

    log.step("Done.");
  });
