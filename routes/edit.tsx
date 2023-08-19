import type { DiagnosticData } from "$types";

import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import Editor from "../islands/Editor.tsx";

export default async function EditPage(req: Request) {
  const codeStr = new URL(req.url).searchParams.get("code");
  if (codeStr) {
    const code = parseInt(codeStr, 10);
    const res = await fetch(new URL(`../db/${code}.json`, import.meta.url));
    if (res.status === 200) {
      const data: DiagnosticData = await res.json();
      return (
        <>
          <div class="p-4 mx-auto max-w-screen-lg">
            <Header />
            <main>
              <Editor data={data} />
            </main>
          </div>
          <Footer />
        </>
      );
    }
  }
  return null;
}
