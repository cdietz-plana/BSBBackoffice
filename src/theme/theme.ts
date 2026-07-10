/**
 * ============================================================================
 *  BSB Backend — MGM brand theme (single source of truth)
 * ============================================================================
 *
 *  This is the ONE place to tune the look-and-feel. Every colour, radius and
 *  font in the app resolves from the `brand` palette below through Ant Design
 *  v5 design tokens (see `buildTheme`). Components must NOT hardcode colours —
 *  read from `theme.useToken()` or the exported `brand` object instead.
 *
 *  Handoff note for InSys: drop this file into the production app, wrap the
 *  tree in <ConfigProvider theme={buildTheme(...)}> and the reskin applies.
 *  See THEME.md for the full token reference.
 * ============================================================================
 */
import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';

/* ---------------------------------------------------------------------------
 * 1. BRAND PALETTE — edit these to re-brand the whole app.
 * ------------------------------------------------------------------------- */
export const brand = {
  /** MGM gold — active states, primary buttons, links. */
  gold: '#B08D46',
  /** Deeper gold — hover / active / pressed. */
  goldDeep: '#8C6E33',
  /** Light gold wash — selected sidebar item background. */
  goldTint: '#F3E9D5',
  /** Faint gold — table row hover / subtle highlights. */
  goldWash: '#FAF3E5',

  /** Warm near-black — top header background. */
  // --- Frosted-glass direction: light translucent chrome over the lion
  //     watermark. This is a loose starting point; tune freely. ---
  /** Frosted ivory header (translucent — blur applied in AppHeader). */
  headerBg: 'rgba(250, 247, 241, 0.72)',
  /** Header foreground text (dark on the light glass). */
  headerText: '#1F1B16',
  /** Header muted/secondary text + inactive icons. */
  headerTextMuted: '#6B655C',

  /** Frosted ivory sidebar (translucent — blur applied in AppSidebar). */
  sidebarBg: 'rgba(250, 247, 241, 0.66)',
  /** Sidebar hairline / divider. */
  sidebarBorder: 'rgba(120, 113, 73, 0.16)',

  /** White — cards, tables, content surfaces. */
  contentBg: '#FFFFFF',
  /** Page canvas behind the cards. */
  canvasBg: '#FAFAF8',
  /** Warm base under the tiled MGM lion watermark (see /public/bg-pattern.svg). */
  canvasPatternBase: '#F5EFE2',

  /** Frosted-glass surface (cards, filter bar, modals, popovers). */
  glassBg: 'rgba(255, 255, 255, 0.68)',
  /** Slightly more opaque glass for dense/overlay surfaces (modals, dropdowns). */
  glassBgStrong: 'rgba(255, 255, 255, 0.86)',
  /** Hairline on glass surfaces — faint gold tint. */
  glassBorder: 'rgba(120, 113, 73, 0.18)',
  /** Standard backdrop blur for glass surfaces. */
  glassBlur: 'blur(14px) saturate(140%)',

  /** Primary body text. */
  textPrimary: '#1F1B16',
  /** Secondary / muted text. */
  textSecondary: '#6B655C',
  /** Hairline borders on inputs, cards, tables. */
  border: '#E7E2D8',

  /** Semantic. */
  success: '#3F9142',
  warning: '#C8901F',
  error: '#B23A3A',
  info: '#B08D46',

  /** Heartbeat pie chart. */
  chartTimeout: '#B23A3A',
  chartAlive: '#3F9142',
} as const;

/* ---------------------------------------------------------------------------
 * 2. SHAPE & TYPOGRAPHY tokens.
 * ------------------------------------------------------------------------- */
export const shape = {
  radius: 8,
  radiusSm: 6,
  radiusLg: 12,
} as const;

export const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', " +
    "Arial, 'PingFang TC', 'Microsoft JhengHei', 'Noto Sans TC', sans-serif",
  /** Base font size in px. The A / A / A header control scales this. */
  fontSizeBase: 14,
} as const;

/** Font-scale steps wired to the header's A · A · A accessibility control. */
export const FONT_SCALES = {
  small: 13,
  default: 14,
  large: 16,
} as const;
export type FontScaleKey = keyof typeof FONT_SCALES;

/* ---------------------------------------------------------------------------
 * 3. Layout metrics reused across the shell.
 * ------------------------------------------------------------------------- */
export const layout = {
  headerHeight: 56,
  sidebarWidth: 236,
  sidebarCollapsedWidth: 72,
  footerHeight: 40,
} as const;

/* ---------------------------------------------------------------------------
 * 4. Build the Ant Design ThemeConfig from the palette above.
 *    `fontSize` is passed in so the A·A·A control can rescale live.
 * ------------------------------------------------------------------------- */
export function buildTheme(fontSize: number = typography.fontSizeBase): ThemeConfig {
  return {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: brand.gold,
      colorInfo: brand.info,
      colorSuccess: brand.success,
      colorWarning: brand.warning,
      colorError: brand.error,
      colorLink: brand.gold,
      colorLinkHover: brand.goldDeep,
      colorTextBase: brand.textPrimary,
      colorText: brand.textPrimary,
      colorTextSecondary: brand.textSecondary,
      colorBorder: brand.border,
      colorBorderSecondary: brand.border,
      colorBgLayout: brand.canvasBg,
      colorBgContainer: brand.contentBg,
      borderRadius: shape.radius,
      borderRadiusSM: shape.radiusSm,
      borderRadiusLG: shape.radiusLg,
      fontFamily: typography.fontFamily,
      fontSize,
      wireframe: false,
      controlHeight: 36,
    },
    components: {
      Layout: {
        headerBg: brand.headerBg,
        headerColor: brand.headerText,
        headerHeight: layout.headerHeight,
        headerPadding: '0 20px',
        // Transparent so the lion watermark (root background) shows through the
        // frosted-glass chrome. Blur is applied per-surface in the components.
        bodyBg: 'transparent',
        siderBg: brand.sidebarBg,
        footerBg: 'rgba(250, 247, 241, 0.72)',
        footerPadding: '0 24px',
      },
      Menu: {
        // Ivory sidebar with gold-tinted active item.
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
        itemColor: brand.textSecondary,
        itemHoverColor: brand.textPrimary,
        itemHoverBg: brand.goldWash,
        itemSelectedColor: brand.goldDeep,
        itemSelectedBg: brand.goldTint,
        itemActiveBg: brand.goldTint,
        groupTitleColor: brand.textSecondary,
        itemMarginInline: 8,
        itemBorderRadius: shape.radiusSm,
        iconSize: 16,
      },
      Table: {
        // Translucent so the glass card reads through the table surface.
        headerBg: 'rgba(251, 249, 244, 0.6)',
        headerColor: brand.textSecondary,
        headerSplitColor: 'transparent',
        borderColor: brand.glassBorder,
        rowHoverBg: 'rgba(176, 141, 70, 0.06)',
        rowSelectedBg: brand.goldTint,
        rowSelectedHoverBg: brand.goldTint,
        colorBgContainer: 'transparent',
        cellPaddingBlock: 12,
        cellPaddingInline: 16,
        headerBorderRadius: shape.radius,
      },
      Button: {
        borderRadius: shape.radius,
        primaryShadow: 'none',
        defaultShadow: 'none',
        fontWeight: 500,
      },
      Input: { borderRadius: shape.radius },
      Select: { borderRadius: shape.radius },
      DatePicker: { borderRadius: shape.radius },
      Breadcrumb: {
        itemColor: brand.textSecondary,
        lastItemColor: brand.textPrimary,
        separatorColor: brand.border,
        linkColor: brand.textSecondary,
        linkHoverColor: brand.gold,
      },
      Pagination: { borderRadius: shape.radiusSm },
      Modal: {
        borderRadiusLG: shape.radiusLg,
        contentBg: brand.glassBgStrong,
        headerBg: 'transparent',
        footerBg: 'transparent',
      },
      Drawer: { colorBgElevated: brand.glassBgStrong },
      Card: { borderRadiusLG: shape.radiusLg, headerBg: 'transparent', colorBgContainer: brand.glassBg },
    },
  };
}

/** Default theme (base font size). */
export const mgmTheme = buildTheme();
