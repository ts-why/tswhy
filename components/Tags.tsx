function Tag({ children: tag }: { children: string }) {
  return (
    <span class="text-sm rounded m-1 px-2 py-1 bg-blue(100 dark:700) text-blue(700 dark:100)">
      <a href={`/tag/${tag}`} class="hover:underline">{tag}</a>
    </span>
  );
}

export function Tags({ children }: { children: string[] | undefined }) {
  if (!children || !children.length) {
    return null;
  }
  return (
    <div class="flex-auto py-2">{children.map((tag) => <Tag>{tag}</Tag>)}</div>
  );
}
