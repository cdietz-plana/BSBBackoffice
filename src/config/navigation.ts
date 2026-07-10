/**
 * Sidebar navigation model. Mirrors the existing BSB IA exactly — two groups,
 * Maintenance and Enquiry, same order and labels as the production app. Labels
 * are i18n keys (resolved in the sidebar), not literal strings.
 */
export interface NavItem {
  /** Route path (relative to /app). */
  path: string;
  /** i18n key under `nav.*`. */
  labelKey: string;
  /** Ant Design icon name resolved in the sidebar. */
  icon: string;
}

export interface NavGroup {
  key: string;
  labelKey: string;
  icon: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'maintenance',
    labelKey: 'nav.maintenance',
    icon: 'wrench',
    items: [
      { path: 'maintenance/pit-location', labelKey: 'nav.pitLocation', icon: 'map' },
      { path: 'maintenance/game-type', labelKey: 'nav.gameType', icon: 'dices' },
      { path: 'maintenance/machine', labelKey: 'nav.machine', icon: 'tablet' },
      { path: 'maintenance/signage-group', labelKey: 'nav.signageGroup', icon: 'quote' },
      { path: 'maintenance/pit', labelKey: 'nav.pit', icon: 'coins' },
      { path: 'maintenance/table', labelKey: 'nav.table', icon: 'club' },
      { path: 'maintenance/location', labelKey: 'nav.location', icon: 'arrowDownToDot' },
    ],
  },
  {
    key: 'enquiry',
    labelKey: 'nav.enquiry',
    icon: 'database',
    items: [
      { path: 'enquiry/shoe-data', labelKey: 'nav.shoeData', icon: 'fileStack' },
      { path: 'enquiry/game-data', labelKey: 'nav.gameData', icon: 'crown' },
      { path: 'enquiry/card-data', labelKey: 'nav.cardData', icon: 'creditCard' },
      { path: 'enquiry/event-data', labelKey: 'nav.eventData', icon: 'calendarFold' },
      { path: 'enquiry/user-activity-data', labelKey: 'nav.userActivityData', icon: 'fileUser' },
      { path: 'enquiry/table-heartbeat', labelKey: 'nav.tableHeartbeat', icon: 'heartPulse' },
    ],
  },
];

/** Flat lookup of every navigable path → its i18n label key (for breadcrumbs). */
export const NAV_LOOKUP: Record<string, { labelKey: string; groupKey: string }> =
  Object.fromEntries(
    NAV_GROUPS.flatMap((g) =>
      g.items.map((i) => [i.path, { labelKey: i.labelKey, groupKey: g.labelKey }]),
    ),
  );
