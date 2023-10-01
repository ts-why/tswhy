import { extract } from "$std/front_matter/yaml.ts";
import {
  DiagnosticData,
  DiagnosticFixData,
  DocCodeFixFrontMatter,
  DocCodeFrontMatter,
} from "$types";

/** Convert a markdown string to diagnostic data. */
export function markdownToDiagnostic(code: number, md: string): DiagnosticData {
  const codeText = `TS${code}`;
  const { body: documentation, attrs: { title, category, tags, related } } =
    extract<DocCodeFrontMatter>(md);
  return { code, codeText, title, category, documentation, tags, related };
}

/** Convert a markdown string to diagnostic fix data. */
export function markdownToDiagnosticFix(md: string): DiagnosticFixData {
  const { body, attrs: { title } } = extract<DocCodeFixFrontMatter>(md);
  return { body, title };
}

/** Convert a diagnostic fix into a markdown string. */
export function diagnosticDataFixToMarkdown(fix: DiagnosticFixData): string {
  const { title, body } = fix;
  return `---\ntitle: ${JSON.stringify(title)}\n---\n\n${body}`;
}

/** Convert diagnostic data fixes into an array of markdown strings. */
export function diagnosticDataFixesToMarkdown(
  { fixes }: DiagnosticData,
): string[] {
  return fixes?.map((fix) => diagnosticDataFixToMarkdown(fix)) ?? [];
}

/** Convert diagnostic data into a markdown string. */
export function diagnosticDataToMarkdown(
  { title, category, tags, related, documentation }: DiagnosticData,
): string {
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
