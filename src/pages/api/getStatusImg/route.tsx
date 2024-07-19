import { ImageResponse } from "next/og";
import { fontBase64 } from "~/utils/fontbase64";
import { semiB64 } from "~/utils/geistSemiBoldBase64";
import { mediumB64 } from "~/utils/mediumB64";

export const runtime = "edge";

export default async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // getting allowanceLeft
    const allowance = searchParams.get("allowanceLeft");

    // getting tipStatus
    const tipStatus = searchParams.get("tipStatus");
    const statusMsg = searchParams.get("msg");
    const mainText = searchParams.get("main");

    // getting font array buffer to use fonts
    const getFontBuffer = (fontB64: string) => {
      const fontBuffer = Uint8Array.from(atob(fontB64), (c) => c.charCodeAt(0));

      return fontBuffer;
    };

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            height: "266px",
            width: "509px",
            backgroundColor: "black",
          }}
        >
          {/* tip status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: "10px",
              paddingLeft: "25px",
              paddingTop: 0,
              zIndex: "20",
              width: "100%",
              textAlign: "start",
              color: "white",
              maxWidth: "380px",
            }}
          >
            <h1
              style={{
                textShadow: `0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black`,
                fontFamily: "Geist UltraBlack",
                fontSize: tipStatus?.includes("successfull") ? 22 : 42,
                fontWeight: 900,
                margin: 0,
              }}
            >
              {tipStatus}
            </h1>
            <p
              style={{
                maxWidth: "100%",
                fontFamily: "Geist Medium",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "6px",
                fontSize: "1.0rem",
                fontWeight: 100,
                color: "white",
                margin: 0,
                padding: 0,
              }}
            >
              {statusMsg && statusMsg}
              <span
                style={{
                  textDecoration: "underline",
                  fontFamily: "Geist SemiBold",
                  fontWeight: 600,
                }}
              >
                {mainText}
              </span>
            </p>
          </div>
        </div>
      ),
      {
        width: 509,
        height: 266,
        fonts: [
          {
            name: "Geist UltraBlack",
            style: "normal",
            data: getFontBuffer(fontBase64),
            weight: 900,
          },
          {
            name: "Geist SemiBold",
            style: "normal",
            data: getFontBuffer(semiB64),
            weight: 600,
          },
          {
            name: "Geist Medium",
            style: "normal",
            data: getFontBuffer(mediumB64),
            weight: 400,
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
