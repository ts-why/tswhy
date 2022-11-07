import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <body class="dark:(bg-gray-900 text-white)">
      <Component />
    </body>
  );
}
