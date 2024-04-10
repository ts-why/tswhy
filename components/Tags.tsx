function Tag({ tag }: { tag: string }) {
  return (
    <span class="text-sm rounded m-1 px-2 py-1 bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100">
      <a href={`/tag/${tag}`} class="hover:underline">{tag}</a>
    </span>
  );
}

export default function Tags({ tags }: { tags?: string[] }) {
  if (!tags || !tags.length) {
    return null;
  }

  return (
    <div class="flex-auto py-2">{tags.map((tag) => <Tag tag={tag} />)}</div>
  );
}
