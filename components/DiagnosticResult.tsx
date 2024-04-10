import type { Hit } from "@algolia/client-search";

import Related from "./Related.tsx";
import Tags from "./Tags.tsx";
import type { DiagnosticData } from "../utils/types.ts";

export default function DiagnosticResult(
  { hit: { code, title, fixes, tags, related } }: {
    hit: Hit<DiagnosticData> | DiagnosticData;
  },
) {
  return (
    <article class="rounded-lg bg-gray-100 dark:bg-gray-800 my-4">
      <div class="border-b-2 border-gray-50 dark:border-gray-900 p-4">
        <h2 class="text-2xl font-header">
          <a
            href={`/ts${code}`}
            class="text-blue-600 dark:text-blue-300 hover:underline"
          >
            TS{code}
          </a>
        </h2>
        <h3 class="text-lg">{title}</h3>
      </div>
      <div class="md:flex md:items-center md:mx-2">
        {fixes && fixes.length && (
          <div class="flex-auto m-2">
            {fixes.length === 1 ? "1 Fix" : `${fixes.length} Fixes`}
          </div>
        )}
        <Tags tags={tags} />
        <Related related={related} />
      </div>
    </article>
  );
}
