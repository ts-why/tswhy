import type { DiagnosticData } from "$types";

import { DiagnosticFix } from "./DiagnosticFix.tsx";
import { Markdown } from "./Markdown.tsx";
import { Related } from "./Related.tsx";
import { Tags } from "./Tags.tsx";

import { interpolate } from "$util/strings.ts";

export function Diagnostic(
  { children: { code, title, documentation, tags, related, fixes }, params }: {
    children: DiagnosticData;
    params?: Map<string, string>;
  },
) {
  return (
    <article class="rounded-lg bg-gray(100 dark:800) my-4">
      <div class="border(b-2 gray(50 dark:900)) p-4">
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
