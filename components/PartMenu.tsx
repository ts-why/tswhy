import { type ComponentChildren } from "preact";
import { useContext } from "preact/hooks";

import { EditorState } from "../state/EditorState.ts";

function PartMenuItem(
  { children, id }: { children: ComponentChildren; id: number },
) {
  const { currentTab } = useContext(EditorState);
  return currentTab.value === id
    ? (
      <li class="block border(b dark:gray-700) lg:(inline border-b-0)">
        <button
          class="block py-3 px-4 text-primary(600 dark:500 hover:600) border(b-2 primary(600 dark:500))"
          aria-current="page"
        >
          {children}
        </button>
      </li>
    )
    : (
      <li class="block border(b dark:gray-700 lg:b-0) lg:inline">
        <button
          onClick={() => currentTab.value = id}
          class="block py-3 px-4 text-gray(500 dark:400) hover:(text-primary(600 dark:500) border(b-2 primary-600 dark:primary-500))"
        >
          {children}
        </button>
      </li>
    );
}

export function PartMenu() {
  const { fixCount } = useContext(EditorState);
  const parts = [<PartMenuItem id={0}>Documentation</PartMenuItem>];
  for (let i = 0; i < fixCount.value; i++) {
    parts.push(<PartMenuItem id={i + 1}>Fix {i + 1}</PartMenuItem>);
  }
  parts.push(
    <PartMenuItem id={fixCount.value + 1}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5 inline -mt-1"
      >
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
      </svg>
      Add Fix
    </PartMenuItem>,
  );

  return (
    <nav class="hidden bg(white dark:gray-900) border(b gray(200 dark:800)) shadow-sm lg:block">
      <div>
        <div class="flex items-center">
          <ul class="flex flex(col lg:row) mt-0 w-full text-sm font-medium">
            {parts}
          </ul>
        </div>
      </div>
    </nav>
  );
}
