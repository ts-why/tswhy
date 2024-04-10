import type { DiagnosticFixData } from "$utils/types.ts";

import Markdown from "./Markdown.tsx";

export default function DiagnosticFix(
  { fix: { title, body } }: { fix: DiagnosticFixData },
) {
  return (
    <article class="px-4 border-t-2 border-gray-50 dark:border-gray-900 mb-4">
      <h3 class="font-header text-xl py-4">Fix: {title}</h3>
      <Markdown>{body}</Markdown>
    </article>
  );
}
