import { resetSeed, pick, int, bool, pad, TABLES, MACHINES } from './helpers';

/* Row shapes for each Maintenance entity — mirror the production columns. */
export interface PitRow {
  id: string;
  name: string;
  pitLocation: string;
  machine: string;
  enabled: boolean;
}
export interface MachineRow {
  id: string;
  name: string;
  tableName: string;
  enabled: boolean;
}
export interface GameTypeRow {
  id: string;
  gameCode: string;
  typeCode: string;
  description: string;
  enabled: boolean;
}
export interface TableRow {
  id: string;
  name: string;
  gameType: string;
  pit: string;
  enabled: boolean;
}
export interface SignageGroupRow {
  id: string;
  name: string;
  subDisplayNumber: number;
  switchInterval: number;
  enabled: boolean;
}
export interface LocationRow {
  id: string;
  code: string;
  nameEn: string;
  nameZhTw: string;
  nameZhCn: string;
  enabled: boolean;
}
export interface PitLocationRow {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
}

const PIT_LOCATIONS = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'VIP', 'MAIN'];
const GAME_TYPES = ['BB', 'BAC', 'DT', 'RO'];

export function makePits(count = 35): PitRow[] {
  resetSeed(1001);
  return Array.from({ length: count }, (_, i) => ({
    id: `pit-${i + 1}`,
    name: `${pad(int(1, 90))} - ${pick(PIT_LOCATIONS)}`,
    pitLocation: pick(PIT_LOCATIONS),
    machine: pick(MACHINES),
    enabled: bool(0.85),
  }));
}

export function makeMachines(count = 28): MachineRow[] {
  resetSeed(1002);
  return Array.from({ length: count }, (_, i) => ({
    id: `mac-${i + 1}`,
    name: pick(MACHINES) + '-' + pad(i),
    tableName: pick(TABLES),
    enabled: bool(0.82),
  }));
}

export function makeGameTypes(): GameTypeRow[] {
  resetSeed(1003);
  const defs = [
    { gameCode: 'BB', typeCode: 'BAC', description: 'Baccarat' },
    { gameCode: 'DT', typeCode: 'DGT', description: 'Dragon Tiger' },
    { gameCode: 'RO', typeCode: 'ROU', description: 'Roulette' },
    { gameCode: 'SB', typeCode: 'SIC', description: 'Sic Bo' },
    { gameCode: 'BJ', typeCode: 'BLJ', description: 'Blackjack' },
    { gameCode: 'PG', typeCode: 'PAI', description: 'Pai Gow' },
    { gameCode: 'FT', typeCode: 'FAN', description: 'Fan Tan' },
  ];
  return defs.map((d, i) => ({ id: `gt-${i + 1}`, ...d, enabled: bool(0.9) }));
}

export function makeTables(count = 40): TableRow[] {
  resetSeed(1004);
  return Array.from({ length: count }, (_, i) => {
    const pitNum = pad(pick([1, 3, 5, 7, 9]));
    return {
      id: `tbl-${i + 1}`,
      name: `${pitNum}BB${pad(int(1, 12))}`,
      gameType: pick(GAME_TYPES),
      pit: `${pitNum} - NORTH`,
      enabled: bool(0.88),
    };
  });
}

export function makeSignageGroups(count = 14): SignageGroupRow[] {
  resetSeed(1005);
  return Array.from({ length: count }, (_, i) => ({
    id: `sg-${i + 1}`,
    name: `Signage Group ${pad(i + 1)}`,
    subDisplayNumber: int(1, 8),
    switchInterval: pick([5, 10, 15, 20, 30]),
    enabled: bool(0.8),
  }));
}

export function makeLocations(): LocationRow[] {
  resetSeed(1006);
  const defs = [
    { code: 'MO', nameEn: 'Macau', nameZhTw: '澳門', nameZhCn: '澳门' },
    { code: 'CT', nameEn: 'Cotai', nameZhTw: '路氹', nameZhCn: '路氹' },
    { code: 'HK', nameEn: 'Hong Kong', nameZhTw: '香港', nameZhCn: '香港' },
    { code: 'ZH', nameEn: 'Zhuhai', nameZhTw: '珠海', nameZhCn: '珠海' },
    { code: 'TP', nameEn: 'Taipa', nameZhTw: '氹仔', nameZhCn: '氹仔' },
    { code: 'PN', nameEn: 'Peninsula', nameZhTw: '半島', nameZhCn: '半岛' },
  ];
  return defs.map((d, i) => ({ id: `loc-${i + 1}`, ...d, enabled: bool(0.92) }));
}

export function makePitLocations(): PitLocationRow[] {
  resetSeed(1007);
  return PIT_LOCATIONS.map((name, i) => ({
    id: `pl-${i + 1}`,
    name,
    code: name.slice(0, 2).toUpperCase(),
    enabled: bool(0.9),
  }));
}
