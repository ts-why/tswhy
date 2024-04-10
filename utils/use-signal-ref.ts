import { type Ref } from "preact/hooks";
import { type Signal, useSignal } from "@preact/signals";

export type SignalRef<T> = Signal<T | null> & Ref<T>;

/**
 * {@link useSignal}, but works as a ref on DOM elements.
 */
export function useSignalRef<T>(
  initialValue: T | null,
): SignalRef<T> {
  const ref = useSignal(initialValue);
  if (!("current" in ref)) {
    Object.defineProperty(ref, "current", refSignalProto);
  }
  return ref as SignalRef<T>;
}

const refSignalProto = {
  configurable: true,
  get(this: { value: unknown }): unknown {
    return this.value;
  },
  set(this: { value: unknown }, v: unknown) {
    this.value = v;
  },
};
