import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const alt = `${BRAND.name}. ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 96,
        color: "#f2f6ff",
        backgroundColor: "#0a0f1e",
        backgroundImage:
          "radial-gradient(70% 90% at 82% 110%, rgba(255,164,92,0.55), rgba(47,107,255,0.4) 48%, rgba(10,15,30,0) 100%)",
      }}
    >
      <div style={{ fontSize: 40, color: "#a9b6d3" }}>{BRAND.name}</div>
      <div style={{ fontSize: 96, marginTop: 24 }}>{BRAND.tagline}</div>
    </div>,
    size,
  );
}
