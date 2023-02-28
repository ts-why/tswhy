export interface DiagnosticData {
  code: number;
  codeText: string;
  title: string;
  category: "error" | "message" | "suggestion";
  documentation?: string;
  tags?: string[];
  related?: number[];
  fixes?: DiagnosticFixData[];
}

export interface DiagnosticFixData {
  title: string;
  body: string;
}

export type DiagnosticMessages = Record<
  string,
  { category: "Error" | "Suggestion" | "Message"; code: number }
>;

export interface DocCodeFrontMatter {
  title: string;
  category: "error" | "message" | "suggestion";
  tags?: string[];
  related?: number[];
}

export interface DocCodeFixFrontMatter {
  title: string;
}

export interface ProposedDocs {
  documentation: string;
  fixes?: DiagnosticFixData[];
}
