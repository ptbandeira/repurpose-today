import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "RepurposeToday — AI won't replace you. But it will replace your job description.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #fff7ed 0%, #fafaf9 50%, #ffedd5 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 80px",
          fontFamily: "Inter, system-ui, sans-serif",
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
              fontSize: "22px",
              color: "#c2410c",
              background: "#ffedd5",
              padding: "8px 20px",
              borderRadius: "20px",
              fontWeight: 500,
            }}
          >
            The Repurpose Framework™ — for professionals in transition
          </span>
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#1c1917",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          AI won&apos;t replace you. But it will
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#ea580c",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "40px",
          }}
        >
          replace your job description.
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#57534e",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Purpose discovery • Peer cohorts • Career reinvention framework
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              color: "#ea580c",
              fontWeight: 700,
            }}
          >
            repurposetoday.com
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#a8a29e",
            }}
          >
            An Analog AI program
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
