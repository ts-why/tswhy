import type { RouteContext } from "$fresh/server.ts";
import { getDiagnostic } from "$utils/kv.ts";

import Footer from "../../components/Footer.tsx";
import Header from "../../components/Header.tsx";
import Editor from "../../islands/Editor.tsx";

export default async function EditPage(
  _req: Request,
  { params: { code }, renderNotFound }: RouteContext,
) {
  const kv = await Deno.openKv();
  const diagnosticData = await getDiagnostic(kv, parseInt(code, 10));
  kv.close();
  if (diagnosticData) {
    return (
      <>
        <div class="p-4 mx-auto max-w-screen-xl">
          <Header
            title={`Edit ${diagnosticData.codeText}`}
            canonical={`/edit/ts${code}`}
          />
          <main>
            <Editor diagnosticData={diagnosticData} />
          </main>
        </div>
        <Footer />
      </>
    );
  } else {
    return renderNotFound();
  }
}
