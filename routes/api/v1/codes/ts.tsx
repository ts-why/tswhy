import { type Handlers, type RouteConfig } from "$fresh/server.ts";
import { getDiagnostic } from "$util/kv.ts";

export const handler: Handlers = {
  async GET(_req, { params: { code } }) {
    try {
      const kv = await Deno.openKv();
      const data = await getDiagnostic(kv, parseInt(code, 10));
      kv.close();
      if (data) {
        return Response.json(data);
      }
    } catch {
      return Response.json(
        { status: 500, statusText: "Internal Server Error" },
        {
          status: 500,
          statusText: "Not Found",
        },
      );
    }
    return Response.json({ status: 404, statusText: "Not Found" }, {
      status: 404,
      statusText: "Not Found",
    });
  },
};

export const config: RouteConfig = {
  routeOverride: "/api/v1/codes/ts:code",
};
