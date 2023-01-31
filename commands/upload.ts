/**
 * @module
 */

import algoliasearch from "algoliasearch";
import { createFetchRequester } from "@algolia/requester-fetch";
import { Command } from "cliffy/command";
import { load } from "std/dotenv/mod.ts";

import { log } from "../util/log.ts";
import type { DiagnosticData } from "../types.d.ts";
import { kia } from "../util/cli.ts";

export default new Command()
  .description("")
  .action(async () => {
    log.step("Updating search index...");
    log.group();
    await load({ export: true });

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

    const all: DiagnosticData[] = JSON.parse(
      await Deno.readTextFile("./db/_all.json"),
    );
    log.light(`uploading ${all.length} records.`);
    const objects = all.map((item) => ({
      objectID: `ts_diagnostic_${item.code}`,
      ...item,
    }));

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
