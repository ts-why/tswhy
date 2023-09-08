import { type Handlers, type PageProps } from "$fresh/server.ts";

import { DiagnosticResult } from "../../components/DiagnosticResult.tsx";
import { Footer } from "../../components/Footer.tsx";
import { Header } from "../../components/Header.tsx";
import { DiagnosticData } from "$types";
import { getDiagnosticsByTag } from "$util/kv.ts";

type Data = { diagnostics: DiagnosticData[]; tag: string };

export default function TagList(
  { data: { diagnostics, tag } }: PageProps<Data>,
) {
  const items = diagnostics.map((diagnostic) => (
    <DiagnosticResult>{diagnostic}</DiagnosticResult>
  ));
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Header
          title={`tswhy? – ${tag}`}
          description={`A list of TypeScript diagnostics tagged with "${tag}".`}
          keywords={["typescript", "diagnostic", tag]}
        />
        {items}
      </div>
      <Footer />
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(_req, { params: { tag }, render, renderNotFound }) {
    try {
      const kv = await Deno.openKv();
      const diagnostics = await getDiagnosticsByTag(kv, tag);
      kv.close();
      if (diagnostics.length) {
        return render({ diagnostics, tag });
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};
