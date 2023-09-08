import { type Handlers } from "$fresh/server.ts";
import type { DiagnosticData } from "$types";
import { DIAGNOSTICS_KEY } from "$util/kv.ts";

export const handler: Handlers = {
  async GET(_req) {
    try {
      const kv = await Deno.openKv();
      const list = kv.list<DiagnosticData>({ prefix: [DIAGNOSTICS_KEY] });
      const data: DiagnosticData[] = [];
      for await (const { value } of list) {
        data.push(value);
      }
      kv.close();
      if (data.length) {
        return Response.json(data);
      }
    } catch {
      //
    }
    return Response.json({ status: 500, statusText: "Internal Server Error" }, {
      status: 500,
      statusText: "Not Found",
    });
  },
};
