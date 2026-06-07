import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FEE3C7",
          borderRadius: "50%",
          fontSize: 320,
          fontWeight: 700,
          color: "#3d3d3a",
          fontFamily: "Inter, sans-serif",
        }}
      >
        f
      </div>
    ),
    { width: 512, height: 512 }
  );
}
