import type { DiagnosticData } from "$types";

import { DiagnosticFix } from "./DiagnosticFix.tsx";
import { Markdown } from "./Markdown.tsx";
import { Related } from "./Related.tsx";
import { Tags } from "./Tags.tsx";

import { interpolate } from "$util/strings.ts";

export function Diagnostic(
  {
    children: { code, title, documentation, tags, related, fixes },
    editable = false,
    params,
  }: {
    children: DiagnosticData;
    editable?: boolean;
    params?: Map<string, string>;
  },
) {
  return (
    <article class="rounded-lg bg-gray(100 dark:800) my-4">
      <div class="group border(b-2 gray(50 dark:900)) p-4">
        {editable && (
          <div class="float-right invisible group-hover:visible">
            <a href={`/edit?code=${code}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <title>Edit the diagnostic.</title>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </a>
          </div>
        )}
        <h2 class="text-2xl font-header">TS{code}</h2>
        <h3 class="text-lg">{interpolate(title, params)}</h3>
      </div>
      {documentation && (
        <div class="p-4">
          <Markdown>{documentation}</Markdown>
        </div>
      )}
      {fixes?.map((fix) => <DiagnosticFix>{fix}</DiagnosticFix>)}
      <div class="md:(flex items-center) p-2">
        <Tags>{tags}</Tags>
        <Related>{related}</Related>
      </div>
    </article>
  );
}
