import { type Handlers, type RouteConfig } from "$fresh/server.ts";
import type { DiagnosticData } from "$types";

export const handler: Handlers = {
  async GET(_req, { params: { code } }) {
    try {
      const res = await fetch(
        new URL(`../../../../db/${code}.json`, import.meta.url),
      );
      if (res.status === 200) {
        const data: DiagnosticData = await res.json();
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
