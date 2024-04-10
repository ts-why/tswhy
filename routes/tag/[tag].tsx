import type { RouteContext } from "$fresh/server.ts";
import { getDiagnosticsByTag } from "$utils/kv.ts";
import DiagnosticResult from "../../components/DiagnosticResult.tsx";

import Footer from "../../components/Footer.tsx";
import Header from "../../components/Header.tsx";

export default async function TagList(
  _req: Request,
  { params: { tag }, renderNotFound }: RouteContext,
) {
  const kv = await Deno.openKv();
  const diagnostics = await getDiagnosticsByTag(kv, tag);
  kv.close();
  if (!diagnostics.length) {
    return renderNotFound();
  }

  const items = diagnostics.map((diagnostic) => (
    <DiagnosticResult hit={diagnostic} />
  ));

  return (
    <>
      <div class="p-4 mx-auto max-w-screen-xl">
        <Header
          title={`${tag} - tswhy‽`}
          description={`A list of TypeScript diagnostics tagged with "${tag}".`}
          keywords={["typescript", "diagnostic", tag]}
        />
        {items}
      </div>
      <Footer />
    </>
  );
}
