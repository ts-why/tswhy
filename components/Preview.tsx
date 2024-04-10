import { type Signal } from "@preact/signals";
import {
  markdownToDiagnostic,
  markdownToDiagnosticFix,
} from "$utils/diagnostics.ts";

import Markdown from "./Markdown.tsx";
import DiagnosticFix from "./DiagnosticFix.tsx";
import Related from "./Related.tsx";
import Tags from "./Tags.tsx";

export default function Preview(
  { code, doc, fixes }: {
    code: number;
    doc: Signal<string>;
    fixes: Signal<string[]>;
  },
) {
  const {
    title,
    documentation,
    tags,
    related,
  } = markdownToDiagnostic(code, doc.value);
  const items = fixes.value.map((fix) => (
    <DiagnosticFix fix={markdownToDiagnosticFix(fix)} />
  ));
  return (
    <article class="rounded-lg bg-gray-100 dark:bg-gray-800 my-4 w-1/2">
      <div class="border-b-2 border-gray-50 dark:border-gray-900 p-4">
        <h2 class="text-2xl font-header">TS{code}</h2>
        <h3 class="text-lg">{title}</h3>
      </div>
      {documentation && (
        <div class="p-4">
          <Markdown>{documentation}</Markdown>
        </div>
      )}
      {items}
      <div class="md:flex md:items-center p-2">
        <Tags tags={tags}></Tags>
        <Related related={related} />
      </div>
    </article>
  );
}
