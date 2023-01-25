import type { Hit } from "@algolia/client-search";
import type { DiagnosticData } from "$types";
import { Related } from "./Related.tsx";
import { Tags } from "./Tags.tsx";

export function DiagnosticResult(
  { children: hit }: { children: Hit<DiagnosticData> },
) {
  return (
    <article class="rounded-lg bg-gray(100 dark:800) my-4">
      <div class="border(b-2 gray(50 dark:900)) p-4">
        <h2 class="text-2xl font-header">
          <a
            href={`./ts${hit.code}`}
            class="text-blue(600 dark:300) hover:underline"
          >
            TS{hit.code}
          </a>
        </h2>
        <h3 class="text-lg">{hit.title}</h3>
      </div>
      <div class="md:(flex items-center mx-2)">
        {hit.fixes && hit.fixes.length && (hit.fixes.length === 1
          ? <div class="flex-auto m-2">1 Fix</div>
          : <div class="flex-auto m-2">{hit.fixes.length} Fixes</div>)}
        <Tags>{hit.tags}</Tags>
        <Related>{hit.related}</Related>
      </div>
    </article>
  );
}
