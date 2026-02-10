/**
 * Braga Bazaar – Design Tokens
 *
 * Clean, straightforward grocery store palette
 * matching the HTML template design.
 */

export const Colors = {
  /* ── Primary ─────────────────────────────────────────── */
  primary: "#2d7a32",        // Pingo Doce / Spar vibe green
  primaryLight: "#4CAF50",
  primaryDark: "#1B5E20",

  /* ── Accent ──────────────────────────────────────────── */
  accent: "#FF9800",
  accentLight: "#FFB74D",
  sale: "#e31e24",           // Bold red for sale badges

  /* ── Backgrounds ─────────────────────────────────────── */
  background: "#FFFFFF",     // Clean white page bg
  surface: "#FFFFFF",
  surfaceAlt: "#f4f4f4",     // Light grey for alternating sections

  /* ── Text ────────────────────────────────────────────── */
  textPrimary: "#333333",
  textSecondary: "#555555",
  textTertiary: "#999999",
  textOnPrimary: "#FFFFFF",

  /* ── Borders ─────────────────────────────────────────── */
  border: "#eeeeee",
  borderLight: "#F0F0F0",

  /* ── Semantic ────────────────────────────────────────── */
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#EF5350",
  info: "#42A5F5",

  /* ── Loyalty tiers ───────────────────────────────────── */
  tierBronze: "#A1887F",
  tierSilver: "#90A4AE",
  tierGold: "#FFB300",
  tierPlatinum: "#1A237E",

  /* ── Misc ────────────────────────────────────────────── */
  overlay: "rgba(0,0,0,0.4)",
  shadow: "#000",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
} as const;

export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
