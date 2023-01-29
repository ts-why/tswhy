import { type Handlers, type PageProps } from "$fresh/server.ts";

import { DiagnosticResult } from "../../components/DiagnosticResult.tsx";
import { Footer } from "../../components/Footer.tsx";
import { Header } from "../../components/Header.tsx";
import tagIndex from "../../db/_tags.json" assert { type: "json" };
import { DiagnosticData } from "../../types.d.ts";

type Tags = keyof typeof tagIndex;

type Data = { diagnostics: DiagnosticData[]; tag: string };

function isTag(tag: string): tag is Tags {
  return tag in tagIndex;
}

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
  async GET(_req, { params, render, renderNotFound }) {
    try {
      const tag = params.tag;
      if (isTag(tag)) {
        const diagnostics: DiagnosticData[] = await Promise.all(
          tagIndex[tag].sort().map((code) =>
            fetch(new URL(`../../db/${code}.json`, import.meta.url)).then(
              (res) => {
                if (res.status === 200) {
                  return res.json();
                }
                throw new Error("Bad response.");
              },
            )
          ),
        );
        return render({ diagnostics, tag });
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};
