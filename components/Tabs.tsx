import { type ComponentChildren } from "preact";
import { type Signal } from "@preact/signals";

import IconPlus from "./icons/Plus.tsx";

function Tab(
  { children, id, selected }: {
    children?: ComponentChildren;
    id: number;
    selected: Signal<number>;
  },
) {
  if (selected.value === id) {
    return (
      <li class="block border-b dark:border-gray-700 lg:inline lg:border-b-0">
        <button
          class="block py-3 px-4 mb-1 text-primary-600 dark:text-primary-500 hover:text-primary-600 border-b-2 border-primary-600 dark:border-primary-500"
          aria-current="page"
        >
          {children}
        </button>
      </li>
    );
  } else {
    return (
      <li class="block border-b dark:border-gray-700 lg:inline lg:border-b-0">
        <button
          onClick={() => selected.value = id}
          class="block py-3 px-4 mb-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 hover:dark:text-primary-500 hover:border-b-2 hover:border-primary-600 hover:dark:border-primary-500"
        >
          {children}
        </button>
      </li>
    );
  }
}

export default function Tabs(
  { selected, fixCount }: {
    selected: Signal<number>;
    fixCount: Signal<number>;
  },
) {
  const tabs = [<Tab id={0} key={0} selected={selected}>Documentation</Tab>];
  for (let i = 1; i <= fixCount.value; i++) {
    tabs.push(<Tab id={i} key={i} selected={selected}>Fix {i}</Tab>);
  }
  tabs.push(
    <Tab id={fixCount.value + 1} key={fixCount.value + 1} selected={selected}>
      <div class="flex">
        <IconPlus /> Add Fix
      </div>
    </Tab>,
  );

  return (
    <nav class="hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm lg:block">
      <div>
        <div class="flex items-center">
          <ul class="flex flex-col lg:flex-row mt-0 w-full text-sm font-medium">
            {tabs}
          </ul>
        </div>
      </div>
    </nav>
  );
}
