import {
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import type { DiagnosticData } from "$types";
import { Diagnostic } from "../components/Diagnostic.tsx";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import { interpolate } from "../util/strings.ts";

type Data = {
  diagnosticData: DiagnosticData;
  params: Map<string, string>;
};

export default function DiagnosticPage(
  { data: { diagnosticData, params } }: PageProps<Data>,
) {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Header
          title={`${diagnosticData.codeText}: ${
            interpolate(diagnosticData.title, params)
          }`}
        />
        <Diagnostic params={params}>{diagnosticData}</Diagnostic>
      </div>
      <Footer />
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { params: { code }, render, renderNotFound }) {
    try {
      const params = new Map(new URL(req.url).searchParams);
      const res = await fetch(new URL(`../db/${code}.json`, import.meta.url));
      if (res.status === 200) {
        const diagnosticData: DiagnosticData = await res.json();
        return render({ diagnosticData, params });
      }
    } catch {
      //
    }
    return renderNotFound();
  },
  async POST(req, { params: { code }, render, renderNotFound }) {
    try {
      const params = new Map<string, string>();
      for (const [key, value] of await req.formData()) {
        params.set(key, String(value));
      }
      const res = await fetch(new URL(`../db/${code}.json`, import.meta.url));
      if (res.status === 200) {
        const diagnosticData: DiagnosticData = await res.json();
        return render({ diagnosticData, params });
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