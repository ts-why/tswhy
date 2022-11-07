import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";
import { DiagnosticData } from "$types";
import { Diagnostic } from "../components/Diagnostic.tsx";

type Data = DiagnosticData[];

export default function Home({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>tswhy?</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-lg">
        <div class="flex items-center">
          <img
            src="/tswhy.svg"
            class="w-16 h-16 flex-initial"
            alt="the tswhy logo: a question mark in a box"
          />
          <div class="flex-grow p-4">
            <h1 class="text-3xl font-header">tswhy?</h1>
            <h2 class="text-sm">
              A community effort to enrich TypeScript diagnostics.
            </h2>
          </div>
        </div>
        <main>
          {data.map((item) => <Diagnostic>{item}</Diagnostic>)}
        </main>
      </div>
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(_req, { render }) {
    const data = JSON.parse(
      await Deno.readTextFile(new URL("../db/_all.json", import.meta.url)),
    ) as Data;
    return render(data);
  },
};
