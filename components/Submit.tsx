import { useContext } from "preact/hooks";

import { EditorState } from "../state/EditorState.ts";

export function Submit() {
  const { dirty } = useContext(EditorState);
  return (
    <form action="/propose" method="POST" class="flex justify-end">
      <input name="docs" type="hidden" value={`something goes here`} />
      <input name="code" type="hidden" value="1003" />
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
