# BSB Backend — MGM Theme Handoff

This prototype is a **visual reskin** of the existing BSB Backend (React + Ant
Design v5). The information architecture, screen list and component structure
are unchanged — only the look-and-feel is new, and all of it is driven from
**one file**:

```
src/theme/theme.ts
```

That file is designed to be lifted straight into the production app. Everything
below explains what the tokens are and how to change the brand.

---

## 1. How the theme is applied

Ant Design v5 themes through **design tokens** passed to `<ConfigProvider>`.
There are no CSS overrides scattered through components and **no hardcoded
colours** — components read colours from the active token set.

```tsx
// src/theme/ThemeProvider.tsx (simplified)
import { ConfigProvider } from 'antd';
import { buildTheme } from './theme';

<ConfigProvider theme={buildTheme(fontSize)}>
  <App />
</ConfigProvider>;
```

To drop the reskin into the InSys production app, copy `theme.ts`, wrap the
tree in the `ConfigProvider` above, and you're done.

---

## 2. The brand palette (edit this to re-brand)

All colours resolve from the `brand` object at the top of `theme.ts`. Change a
value here and it propagates everywhere.

| Token             | Value     | Used for                                             |
| ----------------- | --------- | ---------------------------------------------------- |
| `gold`            | `#B08D46` | **colorPrimary** — active states, primary buttons, links |
| `goldDeep`        | `#8C6E33` | Hover / active / pressed gold                        |
| `goldTint`        | `#F3E9D5` | Selected sidebar item background                     |
| `goldWash`        | `#FAF3E5` | Table row hover, subtle highlights                   |
| `headerBg`        | `#161310` | Top header background (warm near-black)              |
| `headerText`      | `#F5F1E8` | Header text                                          |
| `sidebarBg`       | `#FAF7F1` | Left sidebar (ivory)                                 |
| `sidebarBorder`   | `#ECE6DA` | Sidebar hairline                                     |
| `contentBg`       | `#FFFFFF` | Cards, tables, content surfaces                      |
| `canvasBg`        | `#FAFAF8` | Page canvas behind cards                             |
| `textPrimary`     | `#1F1B16` | Body text                                            |
| `textSecondary`   | `#6B655C` | Muted / secondary text                               |
| `border`          | `#E7E2D8` | Input / card / table hairlines                       |
| `chartTimeout`    | `#B23A3A` | Heartbeat pie — Timeout slice                        |
| `chartAlive`      | `#3F9142` | Heartbeat pie — Alive slice                          |

### Shape & type

| Token                    | Value                | Notes                                   |
| ------------------------ | -------------------- | --------------------------------------- |
| `shape.radius`           | `8`                  | Cards, inputs, buttons                  |
| `shape.radiusLg`         | `12`                 | Cards, modals                           |
| `typography.fontFamily`  | system UI + TC fonts | Falls back to PingFang / JhengHei / Noto |
| `typography.fontSizeBase`| `14`                 | Base size; scaled by the A·A·A control  |

---

## 3. Common re-brand recipes

**Change the accent colour** (e.g. to a different property's gold/red):

```ts
// src/theme/theme.ts
export const brand = {
  gold: '#9E7B3A',      // new primary
  goldDeep: '#7A5E28',  // new hover
  goldTint: '#EFE6D2',  // new selected-item wash
  ...
};
```

**Make the header lighter:**

```ts
headerBg: '#2A2420',
headerText: '#FFFFFF',
```

**Round everything more / less:**

```ts
export const shape = { radius: 4, radiusSm: 3, radiusLg: 8 };
```

**Adjust a single component** (Ant Design component tokens) — see the
`components` block in `buildTheme()`. Each key (`Table`, `Menu`, `Button`, …)
maps to Ant Design's per-component token API.

---

## 4. Font-size accessibility control (A · A · A)

The header exposes the original app's font-scaling control. It swaps the base
`fontSize` token live:

```ts
export const FONT_SCALES = { small: 13, default: 14, large: 16 };
```

`buildTheme(fontSize)` is re-invoked with the chosen size, so the whole UI
rescales through tokens — no per-component work.

---

## 5. Bilingual (EN / 繁體中文)

Every visible string goes through `react-i18next` keys (`src/i18n/`). English
is fully populated; Traditional Chinese is stubbed with placeholders ready for
translation. Layouts use flex/grid and avoid fixed widths so they survive the
longer/shorter label runs in either language.

---

## 6. Icons

The component library is Ant Design, but the **navigation icons** use one
additional set — **[Lucide](https://lucide.dev)** (`lucide-react`) — for a
cleaner, more premium line style. This is the only non-antd icon dependency
and it is deliberate.

All nav icons resolve through a single map in `src/components/Icon.tsx`; the
sidebar config (`src/config/navigation.ts`) references them by short name, so
swapping any icon is a one-line change. Icon size (17px) and stroke weight
(1.9) are set once in `Icon.tsx`. Everywhere else (toolbars, table controls,
forms) still uses Ant Design's own `@ant-design/icons`.

## 7. What is NOT themed here

- **Score Card print** uses a dedicated `@media print` stylesheet
  (`src/pages/ScoreCard.*`) — it is a print artifact, not an app screen.
- Mock data lives in `src/data/` — there are **no API calls**; swap these for
  real endpoints during integration.
