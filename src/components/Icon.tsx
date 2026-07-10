import {
  Wrench,
  Map,
  Dices,
  Tablet,
  Quote,
  Coins,
  Club,
  ArrowDownToDot,
  Database,
  FileStack,
  Crown,
  CreditCard,
  CalendarFold,
  FileUser,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';

/**
 * Navigation icons — Lucide (lucide-react), the one icon set outside antd used
 * in this app (documented in THEME.md). The nav config references these by
 * short name so swapping an icon is a one-line change here + in navigation.ts.
 *
 * Note: Lucide has no "money" icon — Pit uses `Coins`; alternatives are
 * `Banknote` / `Wallet` / `CircleDollarSign`.
 */
const ICONS: Record<string, LucideIcon> = {
  wrench: Wrench, // Maintenance group
  map: Map, // Pit Location
  dices: Dices, // Game Type
  tablet: Tablet, // Machine
  quote: Quote, // Signage Group
  coins: Coins, // Pit
  club: Club, // Table
  arrowDownToDot: ArrowDownToDot, // Location
  database: Database, // Enquiry group
  fileStack: FileStack, // Shoe Data
  crown: Crown, // Game Data
  creditCard: CreditCard, // Card Data
  calendarFold: CalendarFold, // Event Data
  fileUser: FileUser, // User Activity
  heartPulse: HeartPulse, // Table Heartbeat
};

export function NavIcon({ name }: { name: string }) {
  const Cmp = ICONS[name] ?? Wrench;
  // The `ant-menu-item-icon` class lets antd apply its native label spacing and
  // collapsed-mode centring to this (non-antd) Lucide icon.
  return (
    <span
      className="ant-menu-item-icon"
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Cmp size={17} strokeWidth={1.9} />
    </span>
  );
}
