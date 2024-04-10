function Item({ code }: { code: number }) {
  return (
    <span class="px-2">
      <a
        href={`/ts${code}`}
        class="text-blue-600 dark:text-blue-300 hover:underline"
      >
        TS{code}
      </a>
    </span>
  );
}

export default function Related({ related }: { related?: number[] }) {
  if (!related || !related.length) {
    return null;
  }

  return (
    <div class="p-2 flex-auto">
      Related: {related.map((code) => <Item code={code} />)}
    </div>
  );
}
