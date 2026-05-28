import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #141413 0%, #252523 100%)",
          color: "#faf9f5",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            中文字体库
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#cc785c",
              borderLeft: "2px solid #cc785c",
              paddingLeft: 16,
            }}
          >
            Chinese Fonts
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#8e8b82",
            marginBottom: 8,
          }}
        >
          Download Free Chinese Fonts · Hanzi
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#6c6a64",
          }}
        >
          450+ High Quality Chinese Fonts · cfont.site
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
