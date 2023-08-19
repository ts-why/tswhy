import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

export default defineConfig({
  plugins: [twindPlugin({
    selfURL: new URL("./twind.config.ts", import.meta.url).href,
    ...twindConfig,
  })],
});
