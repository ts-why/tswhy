import algoliasearch from "algoliasearch";
import { createFetchRequester } from "@algolia/requester-fetch";
import { Command } from "@codemonument/cliffy/command";

import "@std/dotenv/load";

import { kia } from "$utils/cli.ts";
import { DIAGNOSTICS_KEY } from "$utils/kv.ts";
import { log } from "$utils/log.ts";
import type { DiagnosticData } from "$utils/types.ts";

export default new Command()
  .description("Upload search records to Algolia.")
  .action(async () => {
    log.step("Updating search index...");
    log.group();

    const appId = Deno.env.get("ALGOLIA_APP_ID");
    if (!appId) {
      log.error("Missing environment variable 'ALGOLIA_APP_ID'.");
      return;
    }
    const apiKey = Deno.env.get("ALGOLIA_ADMIN_KEY");
    if (!apiKey) {
      log.error("Missing environment variable 'ALGOLIA_ADMIN_KEY'.");
      return;
    }

    const requester = createFetchRequester();
    const client = algoliasearch(appId, apiKey, {
      requester,
    });

    const index = client.initIndex("typescript_errors");

    const kv = await Deno.openKv();
    const list = kv.list<DiagnosticData>({ prefix: [DIAGNOSTICS_KEY] });
    const objects: Record<string, unknown>[] = [];
    for await (const { value } of list) {
      objects.push({
        objectID: `ts_diagnostic_${value.code}`,
        ...value,
      });
    }
    log.light(`uploading ${objects.length} records.`);

    kia.start("uploading...");

    try {
      await index
        .partialUpdateObjects(objects, { createIfNotExists: true })
        .wait();
    } catch (error) {
      kia.fail("errored.");
      return log.error(JSON.stringify(error, undefined, "  "));
    }

    kia.succeed("uploaded.");

    log.groupEnd();
    log.step("Done.");

    // the algolia client does not close down well, so a manual exit is
    // required.
    Deno.exit(0);
  });
