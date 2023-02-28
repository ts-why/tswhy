import { type JSX } from "preact";
import { useContext } from "preact/hooks";
import { useComputed, useSignal } from "@preact/signals";

import { EditorState } from "../state/EditorState.ts";

export function Submit({ code }: { code: number }) {
  const { dirty, docs } = useContext(EditorState);
  const author = useSignal("");
  const onInput = (
    event: JSX.TargetedEvent,
  ) => (author.value = (event.target as HTMLInputElement).value);
  const isEmail = useComputed(() => !!author.value.match(/[@+]/));

  return (
    <form action="/propose" method="POST">
      <input name="docs" type="hidden" value={JSON.stringify(docs.value)} />
      <input name="code" type="hidden" value={code} />
      <div class="grid gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label
            for="author"
            class="block mb-2 font-medium text(sm gray-900 dark:white)"
          >
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            class="disabled:opacity-50 bg-gray(50 dark:700) border border-gray(300 dark:600) text(gray-900 sm dark:white) rounded-lg focus:(ring-primary(600 dark:500) border-primary(600 dark:500)) block w-full p-2.5 dark:placeholder-gray-400"
            placeholder="Your GitHub user ID or your e-mail"
            onInput={onInput}
            value={author.value}
            disabled={!dirty.value}
            required={dirty.value}
          />
        </div>
        <div>
          <label
            for="author_name"
            class="block mb-2 font-medium text(sm gray-900 dark:white"
          >
            Name
          </label>
          <input
            type="text"
            name="author_name"
            id="author_name"
            class="disabled:opacity-50 bg-gray(50 dark:700) border border-gray(300 dark:600) text(gray-900 sm dark:white) rounded-lg focus:(ring-primary(600 dark:500) border-primary(600 dark:500)) block w-full p-2.5 dark:placeholder-gray-400"
            placeholder="Your name"
            disabled={!dirty.value || !isEmail.value}
            required={isEmail.value}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!dirty.value}
        class="text(sm white center disabled:gray-100) bg(primary(700 dark:600 hover:(800 dark:700)) disabled:gray(700 hover:700)) focus:(ring(4 primary(300 dark:800)) outline-none) font-medium rounded-lg px-5 py-2.5"
      >
        Propose
      </button>
    </form>
  );
}
