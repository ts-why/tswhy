import { Command } from "@codemonument/cliffy/command";
import { assert } from "@std/assert/assert";
import type { DiagnosticMessages } from "$utils/types.ts";
import { kia } from "$utils/cli.ts";
import { log } from "$utils/log.ts";

const DIAGNOSTIC_MSG_URL =
  "https://github.com/microsoft/TypeScript/raw/main/src/compiler/diagnosticMessages.json";

export default new Command()
  .description(
    "Retrieve latest TypeScript diagnostics and scaffold out any missing docs.",
  )
  .action(async () => {
    log.step("Fetching diagnostic messages...");
    kia.start("fetching...");
    const res = await fetch(DIAGNOSTIC_MSG_URL);
    if (res.status !== 200) {
      kia.fail("failed.");
      return log.error(
        `Unexpected status returned fetching diagnostics: ${res.status} ${res.statusText}`,
      );
    }
    const diagnosticMessages: DiagnosticMessages = await res.json();
    const entries = [...Object.entries(diagnosticMessages)].map((
      [key, { code, category }],
    ) => [code, category, key] as const);
    kia.succeed(`fetched ${entries.length} diagnostic messages.`);
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
    if (writes.length) {
      log.step(`Scaffolding ${writes.length} diagnostics...`);
      await Promise.all(writes);
      log.step("Done.");
    } else {
      log.warn("Nothing to scaffold.");
    }
  });
