export function Related({ children }: { children: number[] | undefined }) {
  if (!children || !children.length) {
    return null;
  }
  return (
    <div class="p-2 flex-auto">
      Related: {children.map((code) => (
        <span class="px-2">
          <a
            href={`/ts${code}`}
            class="text-blue(600 dark:300) hover:underline"
          >
            TS{code}
          </a>
        </span>
      ))}
    </div>
  );
}
