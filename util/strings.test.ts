import { interpolate } from "./strings.ts";

Deno.test({
  name: "interpolate",
  fn() {
    console.log(interpolate("replace {0}", new Map([["0", "me"]])));
  },
});
