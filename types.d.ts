export interface DiagnosticData {
  code: number;
  title: string;
  documentation?: string;
  tags?: string[];
  related?: number[];
  fixes?: DiagnosticFixData[];
}

export interface DiagnosticFixData {
  title: string;
  body: string;
}
