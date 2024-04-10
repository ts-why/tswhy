import { batchedAtomic } from "@kitsonk/kv-toolbox/batched_atomic";
import { unique } from "@kitsonk/kv-toolbox/keys";
import type { DiagnosticData } from "./types.ts";

export const TSWHY_PROD_KV =
  "https://api.deno.com/databases/af5a2f14-8248-400b-9c27-46ba22a2a66e/connect";
export const DIAGNOSTICS_KEY = "diagnostics";
const TAGS_KEY = "tags";

export async function clear(kv: Deno.Kv) {
  let keys = await unique(kv, [DIAGNOSTICS_KEY]);
  for (const key of keys) {
    const subKeys = await unique(kv, key);
    for (const subKey of subKeys) {
      await kv.delete(subKey);
    }
    await kv.delete(key);
  }

  keys = await unique(kv, [TAGS_KEY]);
  for (const key of keys) {
    const subKeys = await unique(kv, key);
    for (const subKey of subKeys) {
      await kv.delete(subKey);
    }
    await kv.delete(key);
  }
}

export async function getTags(kv: Deno.Kv): Promise<string[]> {
  return (await unique(kv, [TAGS_KEY])).map(([, k]) => k as string);
}

export async function getDiagnostic(
  kv: Deno.Kv,
  code: number,
): Promise<DiagnosticData | undefined> {
  const res = await kv.get<DiagnosticData>([DIAGNOSTICS_KEY, code]);
  return res.value ?? undefined;
}

export async function getDiagnosticsByTag(
  kv: Deno.Kv,
  tag: string,
): Promise<DiagnosticData[]> {
  const diagnostics: DiagnosticData[] = [];
  const list = kv.list<DiagnosticData>({ prefix: [TAGS_KEY, tag] });
  for await (const item of list) {
    diagnostics.push(item.value);
  }
  return diagnostics;
}

export function setDiagnostic(
  kv: Deno.Kv,
  diagnostic: DiagnosticData,
): Promise<(Deno.KvCommitResult | Deno.KvCommitError)[]> {
  let operation = batchedAtomic(kv).set(
    [DIAGNOSTICS_KEY, diagnostic.code],
    diagnostic,
  );
  if (diagnostic.tags) {
    for (const tag of diagnostic.tags) {
      operation = operation.set([TAGS_KEY, tag, diagnostic.code], diagnostic);
    }
  }
  return operation.commit();
}
