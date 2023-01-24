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
