import type { Handlers, PageProps } from "$fresh/server.ts";
import { getDiagnostic } from "$utils/kv.ts";
import { interpolate } from "$utils/strings.ts";
import type { DiagnosticData } from "$utils/types.ts";

import Diagnostic from "../components/Diagnostic.tsx";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

interface Data {
  diagnosticData: DiagnosticData;
  params: Map<string, string>;
}

function toOgImageUrl({ code }: DiagnosticData, params: Map<string, string>) {
  const url = new URL(`/og/ts${code}`, "https://tswhy.com/");
  for (const [name, value] of params) {
    url.searchParams.append(name, value);
  }
  return url;
}

export default function DiagnosticPage(
  { data: { diagnosticData, params } }: PageProps<Data>,
) {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-xl">
        <Header
          title={`${diagnosticData.codeText}: ${
            interpolate(diagnosticData.title, params)
          }`}
          description={diagnosticData.documentation ??
            interpolate(diagnosticData.title, params)}
          ogImage={toOgImageUrl(diagnosticData, params)}
          keywords={[
            "typescript",
            "diagnostic",
            diagnosticData.codeText,
            "fix",
          ]}
        />
        <Diagnostic diagnosticData={diagnosticData} params={params} editable />
      </div>
      <Footer />
    </>
  );
}

export const handler: Handlers = {
  async GET(req, { params: { code }, render, renderNotFound }) {
    try {
      const params = new Map(new URL(req.url).searchParams);
      const kv = await Deno.openKv();
      const diagnosticData = await getDiagnostic(kv, parseInt(code, 10));
      kv.close();
      if (diagnosticData) {
        return render({ diagnosticData, params });
      }
    } catch {
      //
    }
    return renderNotFound();
  },
  async POST(req, { params: { code }, render, renderNotFound }) {
    try {
      const params = new Map(
        [...(await req.formData())].filter(([, value]) =>
          typeof value === "string"
        ) as [string, string][],
      );
      const kv = await Deno.openKv();
      const diagnosticData = await getDiagnostic(kv, parseInt(code, 10));
      kv.close();
      if (diagnosticData) {
        return render({ diagnosticData, params });
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};
