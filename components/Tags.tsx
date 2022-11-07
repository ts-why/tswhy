import { type ComponentChildren } from "preact";

function Tag({ children }: { children: ComponentChildren }) {
  return (
    <span class="text-sm rounded m-1 px-2 py-1 bg-blue(100 dark:700) text-blue(700 dark:100)">
      {children}
    </span>
  );
}

export function Tags({ children }: { children: string[] | undefined }) {
  if (!children) {
    return null;
  }
  return <>{children.map((tag) => <Tag>{tag}</Tag>)}</>;
}
