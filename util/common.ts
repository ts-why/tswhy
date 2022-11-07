export function assert(
  cond: unknown,
  message = "Assertion failed.",
): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}
