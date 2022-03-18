import { apply, css, setup, virtualSheet } from "./deps.ts";

export const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

export const sheet = virtualSheet();

setup({
  sheet,
  theme: {
    backgroundSize: { "4": "1rem" },
    fontFamily: {
      "sans": [
        "Inter var",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
      ],
      "mono": [
        "Menlo",
        "Monaco",
        "Lucida Console",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
  },
});
