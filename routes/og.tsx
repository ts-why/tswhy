import { type Handlers, type RouteConfig } from "$fresh/server.ts";
import { ImageResponse } from "og-edge";
import type { DiagnosticData } from "$types";
import { getDiagnostic } from "$util/kv.ts";
import { interpolate } from "$util/strings.ts";

const openSans = fetch(
  new URL(
    "../assets/Open_Sans/static/OpenSans/OpenSans-Medium.ttf",
    import.meta.url,
  ),
).then((res) => res.arrayBuffer());
const wellfleet = fetch(
  new URL("../assets/Wellfleet/Wellfleet-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

function OgCard(
  { children: diagnosticData, params }: {
    children: DiagnosticData;
    params: Map<string, string>;
  },
) {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        padding: "66px",
        flexDirection: "column",
        backgroundImage: "linear-gradient(to bottom, #dcdee0, #fcfcfd)",
      }}
    >
      <div
        style={{
          color: "#3178C6",
          borderBottom: "2px solid #9CA0A6",
          marginBottom: "18px",
          fontSize: 72,
          fontFamily: "Wellfleet",
        }}
      >
        {diagnosticData.codeText}
      </div>
      <div
        style={{
          color: "#2E3033",
          fontSize: 48,
          fontFamily: "OpenSans",
        }}
      >
        {interpolate(diagnosticData.title, params)}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "24px",
          }}
        >
          <svg
            viewBox="0 0 512 512"
            version="1.1"
            height="92"
            width="92"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              id="tswhy"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <rect
                id="Rectangle"
                fill="#3178C6"
                x="0"
                y="0"
                width="512"
                height="512"
                rx="50"
              >
              </rect>
              <g
                id="?"
                transform="translate(173.218750, 107.000000)"
                fill="#F7DF1E"
                fill-rule="nonzero"
              >
                <path
                  d="M3,83.4375 C1.25,83.4375 0.25,82 0,79.125 L3.75,6 C4.125,2 6,0 9.375,0 L37.3125,0.75 C41.6875,1 44.0625,3 44.4375,6.75 L44.0625,18 C64.0625,7.5 84,2.25 103.875,2.25 C135.875,2.25 156.25,13.6875 165,36.5625 C167.875,44.3125 169.3125,52.84375 169.3125,62.15625 C169.3125,71.46875 168.1875,79.96875 165.9375,87.65625 C163.6875,95.34375 160.71875,102.84375 157.03125,110.15625 C153.34375,117.46875 149.125,124.625 144.375,131.625 L109.125,180.75 C102.625,190.25 98.28125,197.78125 96.09375,203.34375 C93.90625,208.90625 92.53125,212.03125 91.96875,212.71875 C91.40625,213.40625 90.4375,213.75 89.0625,213.75 L59.8125,209.4375 C58.1875,209.3125 57.375,208.375 57.375,206.625 C57.375,204.875 58,201.5 59.25,196.5 C62.25,185 71.125,168.5625 85.875,147.1875 L100.125,126 C117,100.75 125.4375,81.125 125.4375,67.125 C125.4375,54.5 119.1875,46.125 106.6875,42 C102.8125,40.625 98.375,39.9375 93.375,39.9375 C88.375,39.9375 83.65625,40.25 79.21875,40.875 C74.78125,41.5 70.5625,42.375 66.5625,43.5 C60.1875,45.25 52.3125,48.5625 42.9375,53.4375 L42.1875,77.4375 C42.0625,79.0625 41.84375,80.25 41.53125,81 C41.21875,81.75 40.125,82.1875 38.25,82.3125 L3,83.4375 Z M103.6875,252.1875 C105.1875,255.4375 106.28125,258.9375 106.96875,262.6875 C107.65625,266.4375 108,269.9375 108,273.1875 C108,276.4375 106.90625,279.40625 104.71875,282.09375 C102.53125,284.78125 99.625,287 96,288.75 C88.5,292.375 81.25,294.1875 74.25,294.1875 C67.25,294.1875 62.4375,293.09375 59.8125,290.90625 C57.1875,288.71875 55.0625,286 53.4375,282.75 C50.3125,276.5 48.75,270.34375 48.75,264.28125 C48.75,258.21875 50.125,253.8125 52.875,251.0625 C55.625,248.3125 59,246.125 63,244.5 C69.875,241.875 76.71875,240.5625 83.53125,240.5625 C90.34375,240.5625 95.03125,241.65625 97.59375,243.84375 C100.15625,246.03125 102.1875,248.8125 103.6875,252.1875 Z"
                  id="Shape"
                >
                </path>
              </g>
            </g>
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
          }}
        >
          <div style={{ fontSize: 32 }}>tswhy?</div>
          <div style={{ fontFamily: "OpenSans" }}>
            A community effort to enrich TypeScript diagnostics.
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            alignSelf: "center",
            fontFamily: "OpenSans",
            marginLeft: "auto",
          }}
        >
          {diagnosticData.fixes && diagnosticData.fixes.length === 1
            ? "1 fix"
            : `${diagnosticData.fixes?.length ?? 0} fixes`}
        </div>
      </div>
    </div>
  );
}

export const handler: Handlers = {
  async GET(req, { params: { code }, renderNotFound }) {
    const fontOpenSans = {
      name: "OpenSans",
      data: await openSans,
      weight: 700,
      style: "normal",
    } as const;
    const fontWellfleet = {
      name: "Wellfleet",
      data: await wellfleet,
      weight: 700,
      style: "normal",
    } as const;

    try {
      const kv = await Deno.openKv();
      const diagnosticData = await getDiagnostic(kv, parseInt(code, 10));
      kv.close();
      if (diagnosticData) {
        const params = new Map(new URL(req.url).searchParams);

        return new ImageResponse(
          // deno-lint-ignore no-explicit-any
          <OgCard params={params}>{diagnosticData}</OgCard> as any,
          {
            width: 1200,
            height: 630,
            fonts: [fontWellfleet, fontOpenSans],
          },
        );
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};

export const config: RouteConfig = {
  routeOverride: "/og/ts:code",
};
