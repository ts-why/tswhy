export interface DiagnosticMessage {
  category: DiagnosticMessageCategory;
  code: number;
}

export type DiagnosticMessageCategory = "Error" | "Message" | "Suggestion";

/** The original source diagnostic message information for TypeScript. */
export interface DiagnosticMessages {
  [message: string]: DiagnosticMessageCategory;
}

export interface ManifestItem {
  explain: boolean;
  fix: boolean;
  tags: string[];
}

/** A manifest of the enriched data */
export interface ManifestJson {
  [code: string]: ManifestItem;
}
