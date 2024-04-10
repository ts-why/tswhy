import { extract } from "@std/front-matter/yaml";

import type {
  DiagnosticData,
  DiagnosticFixData,
  DocCodeFixFrontMatter,
  DocCodeFrontMatter,
} from "./types.ts";

export function diagnosticDataFixToMarkdown(
  { title, body }: DiagnosticFixData,
): string {
  return `---\ntitle: ${JSON.stringify(title)}\n---\n\n${body}`;
}

export function diagnosticDataFixesToMarkdown({ fixes = [] }: DiagnosticData) {
  return fixes.map(diagnosticDataFixToMarkdown);
}

export function diagnosticDataToMarkdown(
  { title, category, tags, related, documentation }: DiagnosticData,
) {
  const lines = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `category: ${category}`,
  ];
  if (tags && tags.length) {
    lines.push("tags:");
    for (const tag of tags) {
      lines.push(`- ${tag}`);
    }
  }
  if (related && related.length) {
    lines.push("related:");
    for (const code of related) {
      lines.push(`- ${code}`);
    }
  }
  lines.push("---");
  if (documentation) {
    lines.push("", documentation);
  }
  return lines.join("\n");
}

export function markdownToDiagnostic(code: number, md: string): DiagnosticData {
  const codeText = `TS${code}`;
  const { body: documentation, attrs: { title, category, tags, related } } =
    extract<DocCodeFrontMatter>(md);
  return { code, codeText, title, category, documentation, tags, related };
}

export function markdownToDiagnosticFix(md: string): DiagnosticFixData {
  const { body, attrs: { title } } = extract<DocCodeFixFrontMatter>(md);
  return { body, title };
}
