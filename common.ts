export function getBody({ body, head, footer }: {
  body: string;
  head: string[];
  footer: string[];
}, styles: string): string {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        ${styles}
        ${head.join("\n")}
      </head>
      <body>
        ${body}
        ${footer.join("\n")}
      </body>
    </html>`;
}

export type Child<T> = T | [T];

/** A utility function that inspects a value, and if the value is an array,
 * returns the first element of the array, otherwise returns the value. This is
 * used to deal with the ambiguity around children properties with nano_jsx. */
export function take<T>(value: Child<T>, itemIsArray = false): T {
  if (itemIsArray) {
    return Array.isArray(value) && Array.isArray(value[0]) ? value[0] : // deno-lint-ignore no-explicit-any
      value as any;
  } else {
    return Array.isArray(value) ? value[0] : value;
  }
}
