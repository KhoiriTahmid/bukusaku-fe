import type { ThemeConfig } from "antd";

export const themeColors = {
  text: "#081603",
  background: "#f9fef6",
  primary: "#6ae02e",
  secondary: "#8ce8ed",
  accent: "#65a6e7",
  surface: "#ffffff",
  surfaceMuted: "#f0f7eb",
  border: "#e2eddd",
  textMuted: "#647260",
} as const;

export const themeConfig: ThemeConfig = {
  cssVar: { key: "app" },
  token: {
    colorPrimary: themeColors.primary,
    colorInfo: themeColors.accent,
    colorSuccess: themeColors.primary,
    colorTextBase: themeColors.text,
    colorBgBase: themeColors.background,
    colorBgContainer: themeColors.surface,
    colorBgLayout: themeColors.background,
    colorBorder: themeColors.border,
    colorBorderSecondary: themeColors.border,
    colorTextDescription: themeColors.textMuted,
  },
  components: {
    Layout: {
      bodyBg: "var(--background)",
      headerBg: "var(--surface)",
      siderBg: "var(--text)",
    },
    Card: {
      colorBgContainer: "var(--surface)",
      colorBorderSecondary: "var(--border)",
    },
    Table: {
      headerBg: "var(--surface-muted)",
      rowHoverBg: "var(--surface-muted)",
      borderColor: "var(--border)",
    },
    Menu: {
      darkItemBg: "var(--text)",
      darkSubMenuItemBg: "var(--text)",
    },
  },
};
