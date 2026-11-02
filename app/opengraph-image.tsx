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
        alignItems: "center",
        justifyContent: "center",
        padding: 72,
        backgroundColor: "#fd550a",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px",
          borderRadius: 40,
          color: "#015d47",
          backgroundColor: "#e0f354",
          border: "6px solid #015d47",
        }}
      >
        <div style={{ fontSize: 44 }}>{BRAND.name}</div>
        <div style={{ fontSize: 104, marginTop: 16 }}>{BRAND.tagline}</div>
      </div>
    </div>,
    size,
  );
}
