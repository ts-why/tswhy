import { interpolate } from "$utils/strings.ts";
import type { DiagnosticData } from "$utils/types.ts";

import IconEdit from "./icons/Edit.tsx";
import DiagnosticFix from "./DiagnosticFix.tsx";
import Markdown from "./Markdown.tsx";
import Related from "./Related.tsx";
import Tags from "./Tags.tsx";

export default function Diagnostic(
  {
    diagnosticData: { code, title, documentation, tags, related, fixes },
    editable = false,
    params,
  }: {
    diagnosticData: DiagnosticData;
    editable?: boolean;
    params?: Map<string, string>;
  },
) {
  return (
    <article class="rounded-lg bg-gray-100 dark:bg-gray-800 my-4">
      <div class="group border-b-2 border-gray-50 dark:border-gray-900 p-4">
        {editable && (
          <div class="float-right invisible group-hover:visible hover:text-blue-600 hover:dark:text-blue-300">
            <a href={`/edit/ts${code}`}>
              <IconEdit />
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
      {fixes?.map((fix) => <DiagnosticFix fix={fix} />)}
      <div class="md:flex md:items-center p-2">
        <Tags tags={tags} />
        <Related related={related} />
      </div>
    </article>
  );
}
