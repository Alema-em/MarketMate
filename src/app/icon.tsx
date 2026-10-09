import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <span
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7fb",
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 500,
          color: "#080b10",
        }}
      >
        M
      </span>
    ),
    { ...size }
  );
}
