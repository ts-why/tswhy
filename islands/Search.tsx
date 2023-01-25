import algoliasearch from "algoliasearch";
import type { Hit } from "@algolia/client-search";
import { createFetchRequester } from "@algolia/requester-fetch";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { batch, effect, signal } from "@preact/signals";
import type { JSX } from "preact";
import type { DiagnosticData } from "$types";

import { DiagnosticResult } from "../components/DiagnosticResult.tsx";

// setup algolia search client
const requester = createFetchRequester();
const client = algoliasearch("OD4964MTO4", "092be3c32ef25d3c12d0b819564cd088", {
  requester,
});

// setup signals
const hits = signal<Hit<DiagnosticData>[]>([]);
const input = signal("");
const moreResults = signal(0);

let timeout: number | undefined;

// respond to changes to input text
effect(() => {
  if (!IS_BROWSER) {
    return;
  }

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
    const { results: [results] } = await client.multipleQueries<DiagnosticData>(
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
      hits.value = results.hits;
      moreResults.value = results.nbHits - results.hits.length;
    });
  }, 250);
});

export default function Search() {
  const onInput = (e: JSX.TargetedEvent<HTMLInputElement>) =>
    input.value = e.currentTarget.value;

  const items = hits.value.map((hit) => (
    <DiagnosticResult>{hit}</DiagnosticResult>
  ));

  return (
    <>
      <form id="search-form" class="mr-3 w-full">
        <label
          for="search-bar"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
        >
          Search
        </label>
        <div class="relative">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              >
              </path>
            </svg>
          </div>
          <input
            type="search"
            value={input.value}
            onInput={onInput}
            id="search-bar"
            class="block py-2 px-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Search diagnostics..."
            autoFocus
          />
        </div>
        {items.length
          ? items
          : (
            <aside class="m-6 p-6 rounded border text-gray(800 dark:200)">
              <h2 class="text-2xl mb-4 font-header">Tips...</h2>
              <div>
                <ul class="list-disc mx-6">
                  <li>
                    You can navigate directly to a diagnostic if you know the
                    code (for example for{" "}
                    <em>TS1002: Unterminated string literal</em>{" "}
                    you would navigate to{" "}
                    <a
                      href="/ts1002"
                      class="text-blue(600 dark:300) hover:underline"
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
            {moreResults.value} more diagnostics...
          </div>
        )}
      </form>
    </>
  );
}
