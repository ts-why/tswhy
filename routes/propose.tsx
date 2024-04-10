import { type Handlers, type PageProps } from "$fresh/server.ts";
import { type ComponentChildren } from "preact";
import { assert } from "@std/assert/assert";
import {
  diagnosticDataFixToMarkdown,
  diagnosticDataToMarkdown,
  markdownToDiagnostic,
  markdownToDiagnosticFix,
} from "$utils/diagnostics.ts";
import { createPR, getUser } from "$utils/gh.ts";
import { getDiagnostic } from "$utils/kv.ts";
import { DiagnosticData, DiagnosticFixData } from "$utils/types.ts";

import Diagnostic from "../components/Diagnostic.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

interface Data {
  diagnosticData: DiagnosticData;
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
}

function fixDiff(
  a: DiagnosticFixData | undefined,
  b: DiagnosticFixData,
): boolean {
  return a?.body !== b.body || a?.title !== b.title;
}

function diff(a: DiagnosticData, b: DiagnosticData): boolean {
  if (a.documentation !== b.documentation) {
    return true;
  }
  if (a.related) {
    if (!b.related) {
      return true;
    }
    if (a.related.length !== b.related.length) {
      return true;
    }
    if (!a.related.every((el, i) => el === b.related![i])) {
      return true;
    }
  } else if (b.related) {
    return true;
  }
  if (a.tags) {
    if (!b.tags) {
      return true;
    }
    if (a.tags.length !== b.tags.length) {
      return true;
    }
    if (!a.tags.every((el, i) => el === b.tags![i])) {
      return true;
    }
  } else if (b.related) {
    return true;
  }
  return false;
}

export default function Proposal(
  { data: { diagnosticData, changes, pr } }: PageProps<Data>,
) {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-xl">
        <Header />
        <main>
          <div class="rounded-lg bg-gray-100 dark:bg-gray-800 my-4 p-4">
            <h2 class="text-2xl font-header">Proposed</h2>
            <div class="text-lg">
              Pull request:{" "}
              <a
                href={pr.html_url}
                target="_blank"
                class="text-blue-600 dark:text-blue-300 hover:underline"
              >
                {pr.base.repo.full_name}#{pr.number}
              </a>
              <ul class="list-disc list-inside p-4">
                {changes}
              </ul>
            </div>
          </div>
          <Diagnostic diagnosticData={diagnosticData} />
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
      const codeStr = formData.get("code");
      assert(typeof codeStr === "string");
      const code = parseInt(codeStr, 10);
      const kv = await Deno.openKv();
      const current = await getDiagnostic(kv, code);
      kv.close();
      if (current) {
        const doc = formData.get("doc");
        assert(typeof doc === "string");
        const proposed = markdownToDiagnostic(code, doc);
        const fixesStr = formData.get("fixes");
        assert(typeof fixesStr === "string");
        const changes: ComponentChildren[] = [];
        const files: Record<string, string | null> = {};
        if (diff(current, proposed)) {
          changes.push(
            <li>
              Update <code>{code}.md</code>
            </li>,
          );
          const { documentation, related, tags } = proposed;
          files[`docs/${code}.md`] = diagnosticDataToMarkdown({
            ...current,
            documentation,
            related,
            tags,
          });
        }
        const proposedFixes: DiagnosticFixData[] = JSON.parse(fixesStr)
          .map((fix: string) => markdownToDiagnosticFix(fix));
        const { fixes: currentFixes = [] } = current;
        let i = 0;
        if (proposedFixes.length) {
          for (; i < proposedFixes.length; i++) {
            const proposedFix = proposedFixes[i];
            if (fixDiff(currentFixes[i], proposedFix)) {
              const fixId = (i + 1).toString(10).padStart(2, "0");
              changes.push(
                <li>
                  Update <code>{code}_fix_{fixId}.md</code>
                </li>,
              );
              files[`docs/${code}_fix_${fixId}.md`] =
                diagnosticDataFixToMarkdown(proposedFix);
            }
          }
        }
        if (currentFixes.length) {
          for (; i < currentFixes.length; i++) {
            const fixId = (i + 1).toString(10).padStart(2, "0");
            changes.push(
              <li>
                Delete <code>{code}_fix_{fixId}.md</code>
              </li>,
            );
            files[`docs/${code}_fix_${fixId}.md`] = null;
          }
        }
        if (!changes.length) {
          return renderNotFound();
        }
        let email = formData.get("author");
        assert(typeof email === "string");
        let name = formData.get("author_name") ?? "";
        assert(typeof name === "string");
        if (!/@.+/.test(email)) {
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
        console.log(`Proposal PR: ${pr.number}`);
        const { documentation, related, tags } = proposed;
        return render({
          diagnosticData: {
            ...current,
            documentation,
            related,
            tags,
            fixes: proposedFixes.length ? proposedFixes : undefined,
          },
          changes,
          pr,
        });
      }
    } catch (err) {
      console.error(err);
      return new Response(null, { status: 400, statusText: "Bad Request" });
    }
    return renderNotFound();
  },
};
