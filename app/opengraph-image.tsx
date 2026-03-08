import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "RepurposeToday — Your next chapter starts with a question, not a course.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fdf8f0 0%, #f0f5f0 50%, #d4e4d4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              color: "#306230",
              background: "#d4e4d4",
              padding: "8px 20px",
              borderRadius: "20px",
            }}
          >
            For workers navigating the AI transition
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 400,
            color: "#3a2a16",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          Your next chapter starts with
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 400,
            color: "#306230",
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "40px",
          }}
        >
          a question, not a course.
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#6e4f27",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Purpose discovery • Community cohorts • Peer skill-sharing
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "28px",
            color: "#306230",
            fontWeight: 600,
          }}
        >
          repurposetoday.com
        </div>
      </div>
    ),
    { ...size }
  );
}
