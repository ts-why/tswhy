import { type Handlers, type PageProps } from "$fresh/server.ts";
import type { DiagnosticData } from "$types";

import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import Editor from "../islands/Editor.tsx";

type Data = DiagnosticData;

export default function EditPage({ data }: PageProps<Data>) {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Header />
        <main>
          <Editor>{data}</Editor>
        </main>
      </div>
      <Footer />
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { render, renderNotFound }) {
    try {
      const codeStr = new URL(req.url).searchParams.get("code");
      if (codeStr) {
        const code = parseInt(codeStr, 10);
        const res = await fetch(new URL(`../db/${code}.json`, import.meta.url));
        if (res.status === 200) {
          const data: DiagnosticData = await res.json();
          return render(data);
        }
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};
