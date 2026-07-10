# BSB Backend — MGM Reskin Prototype

A **visual reskin prototype** of the existing BSB Backend web app (MGM Macau,
built by InSys). This is a **reskin only** — the information architecture,
screen list, and navigation match the production app exactly; only the
look-and-feel is new, and it is centralized so the InSys team can lift the
theme tokens and component structure directly.

## Stack

Mirrors the production stack so the handoff is liftable, not just a mockup:

- **React 18 + Vite + TypeScript**
- **Ant Design v5** (`antd`) — themed entirely through `ConfigProvider` design tokens
- **react-router-dom** for routing
- **react-i18next** — English / Traditional Chinese (every label goes through an i18n key)
- **@ant-design/plots** for the Table Heartbeat pie chart
- **Mock data only** — local fixtures in `src/data/`, no backend, no API calls

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

Any username/password logs you in (no auth backend). `npm run build` produces a
static bundle.

## Where the brand lives

| File                          | Purpose                                                            |
| ----------------------------- | ----------------------------------------------------------------- |
| `src/theme/theme.ts`          | **Single source of truth** for all colours, radii, fonts          |
| `THEME.md`                    | Handoff doc: token reference + how to re-brand                    |
| `src/theme/ThemeProvider.tsx` | Wires tokens + A·A·A font scaling + antd locale into ConfigProvider |

Change one value in `theme.ts` and it propagates across every screen.

## Structure

```
src/
├── theme/          theme.ts (tokens), ThemeProvider.tsx
├── i18n/           en.ts, zh-TW.ts, index.ts
├── config/         navigation.ts (sidebar IA)
├── layout/         AppLayout, AppHeader, AppSidebar, AppFooter
├── components/     PageHeader, FilterBar, ContentCard, MgmLogo, Icon
│   └── table/      DataTable, ColumnDisplay, ExportModal (the shared list primitive)
├── data/           mock fixtures (maintenance, enquiry)
└── pages/
    ├── maintenance/  MaintenanceListPage template + 7 config-driven pages
    ├── enquiry/      EnquiryListPage template + 5 pages + TableHeartbeat
    ├── account/      Profile, ChangePassword
    ├── Login.tsx
    └── ScoreCard.tsx (print artifact, @media print)
```

## Screens

- **Login** — centered MGM logo, credentials, language select
- **Maintenance** (CRUD toolbar): Pit Location · Game Type · Machine · Signage
  Group · Pit · Table · Location — one template, seven configs
- **Enquiry** (filter bar + export): Shoe · Game · Card (heavy pagination) ·
  Event · User Activity Data
- **Table Heartbeat** — Timeout-vs-Alive pie + status table
- **Account** — My Profile · Change Password
- **Score Card** — print-friendly baccarat scorecard

## Design notes

- **Reusable primitives** — `DataTable` (sort, per-column search, row select,
  add/delete/refresh/export/density/column-display, page-size selector) and
  `FilterBar` (with Past 3/6/9/12-month date presets) mean each list page is
  just a config object.
- **Bilingual-safe** — flex/grid layouts survive the EN↔繁中 label swap.
- **Density** — tables stay readable in Compact mode with thousands of rows.
- The MGM lion in `public/mgm-logo.svg` is a **placeholder** — swap for the
  official brand asset during handoff.
