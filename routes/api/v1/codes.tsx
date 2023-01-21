import { type Handlers } from "$fresh/server.ts";
import type { DiagnosticData } from "$types";

export const handler: Handlers = {
  async GET(_req) {
    try {
      const res = await fetch(
        new URL("../../../db/_all.json", import.meta.url),
      );
      if (res.status === 200) {
        const data: DiagnosticData = await res.json();
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
