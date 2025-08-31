const tint = "#7C3AED";

const palette = {
  gradientStart: "#0EA5E9",
  gradientEnd: "#9333EA",
  glassBg: "rgba(255,255,255,0.12)",
  glassBorder: "rgba(255,255,255,0.35)",
  glassShadow: "rgba(0,0,0,0.25)",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.8)",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  chipBg: "rgba(255,255,255,0.18)",
  inputBg: "rgba(255,255,255,0.10)",
};

export default {
  light: {
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    background: "#0B1020",
    tint,
    tabIconDefault: "rgba(255,255,255,0.6)",
    tabIconSelected: "#ffffff",
  },
  palette,
};