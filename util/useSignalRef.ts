import { type Signal, useSignal } from "@preact/signals";
import { type MutableRef } from "preact/hooks";

/**
 * {@link useSignal}, but works as a ref on DOM elements.
 */
export function useSignalRef<T>(value: T): Signal<T> & MutableRef<T> {
  const ref = useSignal(value);
  if (!("current" in ref)) {
    Object.defineProperty(ref, "current", refSignalProto);
  }
  return ref as (Signal<T> & MutableRef<T>);
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
