import { Head } from "$fresh/runtime.ts";
import {
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import type { DiagnosticData } from "$types";
import { Diagnostic } from "../components/Diagnostic.tsx";

type Data = DiagnosticData;

export default function DiagnosticPage({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>tswhy?</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Diagnostic>{data}</Diagnostic>
      </div>
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(_req, { params: { code }, render, renderNotFound }) {
    try {
      const res = await fetch(new URL(`../db/${code}.json`, import.meta.url));
      if (res.status === 200) {
        const data: DiagnosticData = await res.json();
        return render(data);
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};

export const config: RouteConfig = {
  routeOverride: "/ts:code",
};
