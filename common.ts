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
