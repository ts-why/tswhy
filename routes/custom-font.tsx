import { type Handlers } from "$fresh/server.ts";
import { ImageResponse } from "og-edge";

const openSans = fetch(
  new URL(
    "../assets/Open_Sans/static/OpenSans/OpenSans-Medium.ttf",
    import.meta.url,
  ),
).then((res) => res.arrayBuffer());
const wellfleet = fetch(
  new URL("../assets/Wellfleet/Wellfleet-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export const handler: Handlers = {
  async GET(_req, { renderNotFound }) {
    const fontWellfleet = {
      name: "Wellfleet",
      data: await wellfleet,
      style: "normal",
    } as const;
    const fontOpenSans = {
      name: "OpenSans",
      data: await openSans,
      style: "normal",
    } as const;

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "white",
            height: "100%",
            width: "100%",
            fontSize: 100,
            fontFamily: "Wellfleet",
            paddingTop: "100px",
            paddingLeft: "50px",
          }}
        >
          <div>TS1002</div>
          <div>Unterminated string literal.</div>
        </div>
      ) as any,
      {
        width: 1200,
        height: 630,
        fonts: [fontWellfleet, fontOpenSans],
      },
    );
  },
};
