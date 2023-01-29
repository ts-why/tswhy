/**
 * @module
 */

import { colors } from "cliffy/ansi/colors";

export class Log {
  #log = console.log.bind(console);
  #depth = 0;
  #segmenter: Intl.Segmenter;

  #colorizeFirstWord(text: string, fn: (s: string) => string) {
    const [first, ...rest] = this.#segmenter.segment(text);
    return [fn(first.segment), ...rest.map(({ segment }) => segment)].join("");
  }

  #indent(value: unknown): string {
    const str = typeof value === "string"
      ? value
      : Deno.inspect(value, { colors: true });
    if (this.#depth === 0) {
      return str;
    }
    return str
      .split("\n")
      .map((line) => `${"  ".repeat(this.#depth)}${line}`)
      .join("\n");
  }

  get depth(): number {
    return this.#depth;
  }

  constructor(locale = "en") {
    this.#segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  }

  error(text: string, ...other: unknown[]): this {
    this.#log(
      this.#indent(this.#colorizeFirstWord(text, colors.brightRed)),
      ...other,
    );
    return this;
  }

  group(data?: unknown, ...rest: unknown[]): this {
    if (data) {
      this.#log(this.#indent(data), ...rest);
    }
    this.#depth++;
    return this;
  }

  groupEnd(): this {
    this.#depth = this.#depth <= 0 ? 0 : this.#depth - 1;
    return this;
  }

  kv(key: string, value: unknown): this {
    this.#log(this.#indent(`${colors.green(key)}:`), value);
    return this;
  }

  log(data?: unknown, ...rest: unknown[]): this {
    this.#log(this.#indent(data), ...rest);
    return this;
  }

  light(text: string, ...other: unknown[]): this {
    this.#log(this.#indent(colors.dim(text)), ...other);
    return this;
  }

  step(text: string, ...other: unknown[]): this {
    this.#log(
      this.#indent(this.#colorizeFirstWord(text, colors.brightGreen)),
      ...other,
    );
    return this;
  }

  warn(text: string, ...other: unknown[]): this {
    this.#log(
      this.#indent(this.#colorizeFirstWord(text, colors.brightYellow)),
      ...other,
    );
    return this;
  }
}

export const log = new Log();
