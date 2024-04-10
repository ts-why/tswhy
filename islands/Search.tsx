import algoliasearch, { SearchClient } from "algoliasearch";
import type { Hit, SearchResponse } from "@algolia/client-search";
import { createFetchRequester } from "@algolia/requester-fetch";
import { useEffect } from "preact/hooks";
import {
  batch,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";

import IconSearch from "../components/icons/Search.tsx";
import DiagnosticResult from "../components/DiagnosticResult.tsx";
import type { DiagnosticData } from "../utils/types.ts";

let client: SearchClient;

function assertSearchResponse(value: unknown): asserts value is SearchResponse {
  if (!value || typeof value !== "object" || !("hits" in value)) {
    throw new Error("value is not a SearchResponse");
  }
}

export default function Search(
  { appId, apiKey }: { appId: string; apiKey: string },
) {
  useEffect(() => {
    const requester = createFetchRequester();
    client = algoliasearch(appId, apiKey, { requester });
  }, [appId, apiKey]);

  const hits = useSignal<Hit<DiagnosticData>[]>([]);
  const input = useSignal("");
  const moreResults = useSignal(0);

  let timeout: number | undefined;

  useSignalEffect(() => {
    if (!input.value) {
      batch(() => {
        hits.value = [];
        moreResults.value = 0;
      });
      return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if (!input.value) {
        return;
      }
      const { results: [results] } = await client.multipleQueries<
        DiagnosticData
      >(
        [{
          indexName: "typescript_errors",
          query: input.value,
          params: {
            page: 0,
            hitsPerPage: 20,
          },
        }],
      );
      batch(() => {
        assertSearchResponse(results);
        hits.value = results.hits;
        moreResults.value = results.nbHits - results.hits.length;
      });
    }, 250);
  });

  const items = useComputed(() =>
    hits.value.map((hit) => <DiagnosticResult hit={hit} />)
  );

  return (
    <form class="mr-3 w-full">
      <label
        for="search-bar"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
      >
        Search
      </label>
      <div class="relative">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
          <IconSearch />
        </div>
        <input
          type="search"
          value={input.value}
          onInput={(evt) => input.value = evt.currentTarget.value}
          id="search-bar"
          class="block py-2 px-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Search diagnostics..."
          autoFocus
        />
      </div>
      {items.value.length
        ? items
        : (
          <aside class="m-6 p-6 rounded border text-gray-800 dark:text-gray-200">
            <h2 class="text-2xl mb-4 font-header">Tips...</h2>
            <div>
              <ul class="list-disc mx-6">
                <li>
                  You can navigate directly to a diagnostic if you know the code
                  (for example for <em>TS1002: Unterminated string literal</em>
                  {" "}
                  you would navigate to{" "}
                  <a
                    href="/ts1002"
                    class="text-blue-600 dark:text-blue-300 hover:underline"
                  >
                    <code>/ts1002</code>
                  </a>).
                </li>
                <li>
                  You can search by TypeScript code, with our without the
                  leading <code>TS</code>.
                </li>
                <li>
                  You can search by partial diagnostic message (e.g.{" "}
                  <code>Unterminated</code> or <code>statement</code>).
                </li>
                <li>
                  You can search by tags. (e.g. <code>syntax-error</code> or
                  {" "}
                  <code>type-error</code>).
                </li>
              </ul>
            </div>
          </aside>
        )}
      {moreResults.value > 0 && (
        <div class="m-4 p-4 text-center">
          {moreResults.value}{" "}
          more diagnostic{moreResults.value !== 1 ? "s" : ""}...
        </div>
      )}
    </form>
  );
}
