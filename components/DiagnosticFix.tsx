import type { DiagnosticFixData } from "$types";

import { Markdown } from "./Markdown.tsx";

export function DiagnosticFix(
  { children: { title, body } }: { children: DiagnosticFixData },
) {
  return (
    <article class="px-4 border(t-2 gray(50 dark:900)) mb-4">
      <h3 class="text-xl py-4">Fix: {title}</h3>
      <Markdown>{body}</Markdown>
    </article>
  );
}
