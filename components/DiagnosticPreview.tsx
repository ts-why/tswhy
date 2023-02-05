import { type Signal } from "@preact/signals";
import {
  markdownToDiagnostic,
  markdownToDiagnosticFix,
} from "$util/diagnostics.ts";

import { DiagnosticFix } from "./DiagnosticFix.tsx";
import { Markdown } from "./Markdown.tsx";
import { Related } from "./Related.tsx";
import { Tags } from "./Tags.tsx";

export function DiagnosticPreview(
  { children: md, code, fixes }: {
    children: Signal<string>;
    code: number;
    fixes: Signal<string[]>;
  },
) {
  const { title, documentation, tags, related } = markdownToDiagnostic(
    code,
    md.value,
  );
  return (
    <article class="rounded-lg bg-gray(100 dark:800) my-4">
      <div class="border(b-2 gray(50 dark:900)) p-4">
        <h2 class="text-2xl font-header">TS{code}</h2>
        <h3 class="text-lg">{title}</h3>
      </div>
      {documentation && (
        <div class="p-4">
          <Markdown>{documentation}</Markdown>
        </div>
      )}
      {fixes.value.map((fix) => (
        <DiagnosticFix>{markdownToDiagnosticFix(fix)}</DiagnosticFix>
      ))}
      <div class="md:(flex items-center) p-2">
        <Tags>{tags}</Tags>
        <Related>{related}</Related>
      </div>
    </article>
  );
}
