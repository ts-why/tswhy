import { apply, css, setup, twColors, virtualSheet } from "./deps.ts";

/** Global CSS used by the app to set the background color */
export const app = css({
  ":global": {
    "html": apply`bg-gray-500`,
  },
});

/** The virtual CSS sheet used to SSR render the CSS via twind. */
export const sheet = virtualSheet();

/** The colors used in the theme, exported as a standalone structure, so they
 * can be used in situations where twind is not being used. */
export const themeColors = {
  blue: {
    50: "#D6EBF3",
    100: "#C6E3EF",
    200: "#A6D3E6",
    300: "#87C3DD",
    400: "#67B3D4",
    500: "#47A3CB",
    600: "#3085AA",
    700: "#24637E",
    800: "#174052",
    900: "#0B1E27",
  },
  brown: {
    50: "#FFFFFF",
    100: "#FDFDFD",
    200: "#EBEBE5",
    300: "#DCD8CD",
    400: "#CBC6B5",
    500: "#BAB39D",
    600: "#A3997C",
    700: "#877E5F",
    800: "#675F48",
    900: "#464131",
  },
  purple: twColors.fuchsia,
  pink: twColors.pink,
  orange: twColors.orange,
  red: {
    50: "#FFFFFF",
    100: "#FEFCFC",
    200: "#F5DCDC",
    300: "#ECBDBD",
    400: "#E39D9D",
    500: "#DA7D7D",
    600: "#CE5151",
    700: "#B43333",
    800: "#882727",
    900: "#5C1A1A",
  },
  green: twColors.emerald,
  yellow: twColors.amber,
  gray: {
    50: "#FFFFFF",
    100: "#FFFFFF",
    200: "#FFFFFF",
    300: "#FFFFFF",
    400: "#F9F9F9",
    500: "#E5E5E5",
    600: "#C9C9C9",
    700: "#ADADAD",
    800: "#919191",
    900: "#757575",
  },
  white: twColors.white,
} as const;

// setup the sheet with the theme and import custom font-faces
setup({
  sheet,
  theme: {
    colors: { ...themeColors },
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
      "heading": '"Josefin Sans"',
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
  preflight: {
    "@import":
      `url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@500&display=swap')`,
  },
});
