/**
 * @module
 */

import { Command } from "cliffy/command";
import docs from "./commands/docs.ts";
import scaffold from "./commands/scaffold.ts";

await new Command()
  .name("tswhy-build")
  .version("1.0.0")
  .action(function () {
    this.showHelp();
  })
  .description("Document building CLI for tswhy?")
  .command("docs", docs)
  .command("scaffold", scaffold)
  .parse(Deno.args);
