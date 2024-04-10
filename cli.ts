#!/usr/bin/env -S deno run -A --unstable-kv

import { Command } from "@codemonument/cliffy/command";
import docs from "./commands/docs.ts";
import scaffold from "./commands/scaffold.ts";
import upload from "./commands/upload.ts";

await new Command()
  .name("tswhy-cli")
  .version("1.0.0")
  .action(function () {
    this.showHelp();
  })
  .description("Command line tool for tswhy‽")
  .command("docs", docs)
  .command("scaffold", scaffold)
  .command("upload", upload)
  .parse(Deno.args);
