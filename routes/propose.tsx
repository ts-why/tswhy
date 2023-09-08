import { type Handlers, type PageProps } from "$fresh/server.ts";
import { type ComponentChildren } from "preact";
import type { DiagnosticData, ProposedDocs } from "$types";
import { assert } from "$util/common.ts";
import {
  diagnosticDataFixToMarkdown,
  diagnosticDataToMarkdown,
} from "$util/diagnostics.ts";
import { createPR, getUser } from "$util/github.ts";
import { getDiagnostic } from "$util/kv.ts";
import { log } from "$util/log.ts";

import { Diagnostic } from "../components/Diagnostic.tsx";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";

type Data = {
  data: DiagnosticData;
  changes: ComponentChildren[];
  pr: {
    number: number;
    html_url: string;
    base: {
      repo: {
        full_name: string;
      };
    };
  };
};

export default function Propose(
  { data: { data, pr, changes } }: PageProps<Data>,
) {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Header />
        <main>
          <div class="rounded-lg bg-gray(100 dark:800) my-4 p-4">
            <h2 class="text-2xl font-header">Proposed</h2>
            <div class="text-lg">
              Pull request:{" "}
              <a
                href={pr.html_url}
                target="_blank"
                class="text-blue(600 dark:300) hover:underline"
              >
                {pr.base.repo.full_name}#{pr.number}
              </a>
              <ul class="list-disc list-inside p-4">
                {changes.map((item) => <li>{item}</li>)}
              </ul>
            </div>
          </div>
          <Diagnostic>{data}</Diagnostic>
        </main>
      </div>
      <Footer />
    </>
  );
}

export const handler: Handlers<Data> = {
  async POST(req, { render, renderNotFound }) {
    try {
      const formData = await req.formData();
      const code = parseInt(formData.get("code")?.toString() ?? "0", 10);
      const kv = await Deno.openKv();
      const data = await getDiagnostic(kv, code);
      kv.close();
      if (data) {
        const changes: ComponentChildren[] = [];
        const docs: ProposedDocs = JSON.parse(
          formData.get("docs")?.toString() ?? "",
        );
        if (!docs || typeof docs !== "object") {
          return renderNotFound();
        }
        const files: Record<string, string | null> = {};
        if (data.documentation !== docs.documentation) {
          data.documentation = docs.documentation;
          changes.push(
            <>
              Update <code>{code}.md</code>.
            </>,
          );
          files[`docs/${code}.md`] = diagnosticDataToMarkdown(data);
        }
        let i = 0;
        if (docs.fixes && docs.fixes.length) {
          if (!data.fixes) {
            data.fixes = [];
          }
          for (; i < docs.fixes.length; i++) {
            const fix = docs.fixes[i];
            if (
              data.fixes[i]?.body !== fix.body ||
              data.fixes[i]?.title !== fix.title
            ) {
              const fixId = (i + 1).toString(10).padStart(2, "0");
              files[`docs/${code}_fix_${fixId}.md`] =
                diagnosticDataFixToMarkdown(fix);
              changes.push(
                <>
                  Update <code>{code}_fix_{fixId}.md</code>.
                </>,
              );
              data.fixes[i] = fix;
            }
          }
        }
        if (data.fixes && data.fixes.length) {
          for (; i < data.fixes.length; i++) {
            const fixId = (i + 1).toString(10).padStart(2, "0");
            files[`docs/${code}_fix_${fixId}`] = null;
            changes.push(
              <>
                Delete <code>{code}_fix_{fixId}.md</code>.
              </>,
            );
          }
        }
        if (!changes.length) {
          return renderNotFound();
        }
        data.fixes = docs.fixes;
        let email = formData.get("author")?.toString() ?? "";
        let name = formData.get("author_name")?.toString() ?? "";
        if (!email.includes("@")) {
          const { login, id, name: username } = await getUser(email);
          name = username ?? email;
          email = `${id}+${login}@users.noreply.github.com`;
        }
        const changeText = Object.entries(files).map(([key, value]) =>
          value ? `Update \`${key}\`.` : `Delete \`${key}\`.`
        ).join("\n- ");
        const pr = await createPR({
          title: `proposal: TS${code}`,
          body:
            `## Proposing changes to TS${code}\n\nProposing:\n\n- ${changeText}\n\n`,
          head: `p-${code}`,
          author: { email, name },
          files,
        });
        assert(pr);
        log.step(`Proposal PR ${pr.number}.`);
        return render({ data, pr, changes });
      }
    } catch (e) {
      console.error(e);
    }
    return renderNotFound();
  },
};
