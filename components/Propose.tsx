import { type Signal, useComputed, useSignal } from "@preact/signals";

export default function Propose(
  { code, doc, fixes, dirty }: {
    code: number;
    doc: Signal<string>;
    fixes: Signal<string[]>;
    dirty: Signal<boolean>;
  },
) {
  const author = useSignal("");
  const isEmail = useComputed(() => /@.+/.test(author.value));
  const valueFixes = useComputed(() => JSON.stringify(fixes.value));

  return (
    <form action="/propose" method="POST">
      <input name="doc" type="hidden" value={doc} />
      <input name="fixes" type="hidden" value={valueFixes} />
      <input name="code" type="hidden" value={code} />
      <div class="grid gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label
            for="author"
            class="block mb-2 font-medium text-sm text-gray-900 dark:text-white"
          >
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            class="disabled:opacity-50 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm dark:text-white rounded-lg focus:ring-primary-600 focus:dark:ring-primary-500 focus:border-primary-600 focus:dark:border-primary-500 block w-full p-2.5 dark:placeholder-gray-400"
            placeholder="Your GitHub user ID or your e-mail"
            onInput={(evt) => author.value = evt.currentTarget.value}
            value={author}
            disabled={!dirty.value}
            required={dirty}
          />
        </div>
        <div>
          <label
            for="author_name"
            class="block mb-2 font-medium text-sm text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            name="author_name"
            id="author"
            class="disabled:opacity-50 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm dark:text-white rounded-lg focus:ring-primary-600 focus:dark:ring-primary-500 focus:border-primary-600 focus:dark:border-primary-500 block w-full p-2.5 dark:placeholder-gray-400"
            placeholder="Your name"
            disabled={!dirty.value || !isEmail.value}
            required={isEmail}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!dirty.value}
        class="text-sm text-white text-center disabled:text-gray-100 bg-primary-700 dark:bg-primary-600 hover:bg-primary-800 hover:dark:bg-primary-700 disabled:bg-gray-700 disabled:hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 focus:dark:ring-primary-800 focus:outline-none font-medium rounded-lg px-5 py-2.5"
      >
        Propose
      </button>
    </form>
  );
}
