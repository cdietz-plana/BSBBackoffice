import {
  resetSeed,
  pick,
  int,
  bool,
  pad,
  timeSeries,
  PITS,
  TABLES,
  MACHINES,
} from './helpers';

export interface ShoeRow {
  id: string;
  pit: string;
  table: string;
  machine: string;
  shoeNumber: number;
  startTime: string;
  endTime: string;
}
export interface GameRow {
  id: string;
  pit: string;
  table: string;
  machine: string;
  shoeNumber: number;
  gameNumber: number;
  startTime: string;
  endTime: string;
  result: string;
  pair: string;
  natural: string;
  source: string;
  winningTotal: number;
  special: string;
}
export interface CardRow {
  id: string;
  pit: string;
  table: string;
  shoeNumber: number;
  gameNumber: number;
  sequence: number;
  seat: string;
  cardValue: string;
  cardSuit: string;
  time: string;
}
export interface EventRow {
  id: string;
  pit: string;
  table: string;
  machine: string;
  eventTime: string;
  eventType: string;
  eventValue: string;
}
export interface UserActivityRow {
  id: string;
  userName: string;
  activityType: string;
  activityValue: string;
  timestamp: string;
}
export interface HeartbeatRow {
  id: string;
  pitName: string;
  tableName: string;
  machineName: string;
  lastReceiveDate: string;
  status: 'Timeout' | 'Alive';
}

const RESULTS = ['Player', 'Banker', 'Tie'];
const PAIRS = ['NoPair', 'PlayerPair', 'BankerPair'];
const NATURALS = ['NoNatural', 'PlayerNatural', 'BankerNatural'];
const SUITS = ['Spade', 'Heart', 'Diamond', 'Club'];
const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SEATS = ['Player1', 'Player2', 'Player3', 'Banker'];

/** Event Type — the long enum called out in the inventory. */
export const EVENT_TYPES = [
  'Startup',
  'ShoeChange',
  'Lock',
  'ReachCutCard',
  'ErrorOn',
  'ErrorOff',
  'DrawingTimeout',
  'FastFeed',
  'Error08',
  'Error09',
  'Error10',
  'Error11',
  'Error12',
  'Error13',
  'Error14',
  'Error15',
  'Error16',
];

const ACTIVITY_TYPES = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'Export', 'Print'];
const USER_NAMES = ['QATG003', 'QATG001', 'ADMIN', 'OPER01', 'OPER02', 'SUPERVISOR'];

export function makeShoeData(count = 120): ShoeRow[] {
  resetSeed(2001);
  return Array.from({ length: count }, (_, i) => ({
    id: `shoe-${i + 1}`,
    pit: pick(PITS),
    table: pick(TABLES),
    machine: pick(MACHINES),
    shoeNumber: 4600 + int(0, 80),
    startTime: timeSeries(i * 2 + 1),
    endTime: timeSeries(i * 2),
  }));
}

export function makeGameData(count = 200): GameRow[] {
  resetSeed(2002);
  const pit = 'PITCT';
  const table = 'CTBB03';
  const machine = 'DT008857';
  return Array.from({ length: count }, (_, i) => ({
    id: `game-${i + 1}`,
    pit,
    table,
    machine,
    shoeNumber: 4651 + (i % 3),
    gameNumber: count - i,
    startTime: timeSeries(i * 2 + 1),
    endTime: timeSeries(i * 2),
    result: pick(RESULTS),
    pair: pick(PAIRS),
    natural: pick(NATURALS),
    source: 'Shoe',
    winningTotal: int(0, 9),
    special: bool(0.15) ? `f${int(1, 9)}_${int(1, 9)}` : '-',
  }));
}

/** Card Data — heavy pagination: 5,786 rows / 579 pages per the inventory. */
export const CARD_DATA_TOTAL = 5786;
export function makeCardData(count = 500): CardRow[] {
  resetSeed(2003);
  return Array.from({ length: count }, (_, i) => ({
    id: `card-${i + 1}`,
    pit: 'PITCT',
    table: 'CTBB03',
    shoeNumber: 4651 + (i % 4),
    gameNumber: 66 - (i % 66),
    sequence: (i % 6) + 1,
    seat: pick(SEATS),
    cardValue: pick(CARD_VALUES),
    cardSuit: pick(SUITS),
    time: timeSeries(i),
  }));
}

export function makeEventData(count = 160): EventRow[] {
  resetSeed(2004);
  return Array.from({ length: count }, (_, i) => ({
    id: `evt-${i + 1}`,
    pit: pick(PITS),
    table: pick(TABLES),
    machine: pick(MACHINES),
    eventTime: timeSeries(i),
    eventType: pick(EVENT_TYPES),
    eventValue: bool(0.5) ? String(int(1, 999)) : '-',
  }));
}

export function makeUserActivityData(count = 140): UserActivityRow[] {
  resetSeed(2005);
  return Array.from({ length: count }, (_, i) => ({
    id: `ua-${i + 1}`,
    userName: pick(USER_NAMES),
    activityType: pick(ACTIVITY_TYPES),
    activityValue: pick(['/enquiry/gameData', '/maintenance/pit', 'ScoreCard', '-', 'Profile']),
    timestamp: timeSeries(i),
  }));
}

export function makeHeartbeatData(count = 221): HeartbeatRow[] {
  resetSeed(2006);
  return Array.from({ length: count }, (_, i) => {
    // ~96.5% Timeout to match the reference pie chart.
    const status: HeartbeatRow['status'] = bool(0.965) ? 'Timeout' : 'Alive';
    return {
      id: `hb-${i + 1}`,
      pitName: pick([...PITS, '01', '89']),
      tableName: `${pad(int(1, 90))}BB${pad(int(1, 12))}`,
      machineName: bool(0.6) ? pick(MACHINES) : '-',
      lastReceiveDate: bool(0.5) ? timeSeries(i * 5) : '-',
      status,
    };
  });
}

/** Filter dropdown option sources. */
export const PIT_OPTIONS = PITS.map((p) => ({ value: p, label: p }));
export const TABLE_OPTIONS = TABLES.map((tb) => ({ value: tb, label: tb }));
export const MACHINE_OPTIONS = MACHINES.map((m) => ({ value: m, label: m }));
export const EVENT_TYPE_OPTIONS = EVENT_TYPES.map((e) => ({ value: e, label: e }));
