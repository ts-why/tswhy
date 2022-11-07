export function Related({ children }: { children: number[] | undefined }) {
  if (!children) {
    return null;
  }
  return (
    <div class="m-2">
      Related: {children.map((code) => <span>TS{code}</span>)}
    </div>
  );
}
