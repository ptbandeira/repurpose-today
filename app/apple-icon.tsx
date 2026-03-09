import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
          borderRadius: "36px",
        }}
      >
        <span
          style={{
            fontSize: "110px",
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          R
        </span>
      </div>
    ),
    { ...size }
  );
}
