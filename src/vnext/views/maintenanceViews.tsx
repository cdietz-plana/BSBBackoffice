import {
  makePits,
  makeMachines,
  makeGameTypes,
  makeTables,
  makeSignageGroups,
  makeLocations,
  makePitLocations,
  type PitRow,
  type MachineRow,
  type GameTypeRow,
  type TableRow,
  type SignageGroupRow,
  type LocationRow,
  type PitLocationRow,
} from '@/data/maintenance';
import { MaintenanceTable, type MaintenanceEntity } from './MaintenanceTable';
import type { GlassColumn } from '../GlassTable';

const PIT_LOCATION = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'VIP', 'MAIN'];
const GAME_TYPE = ['BB', 'BAC', 'DT', 'RO'];
const MACHINE = ['DT008857', 'DT000011', 'DT008585', 'KAMENG-A', 'KEI-INSYS', 'MINGBO-INSYS'];
const TABLE = ['CTBB03', '01BB01', '01BB02', '03BB01', '90BB06', '12BB05'];
const PIT = ['01 - NORTH', '03 - NORTH', '05 - SOUTH', '07 - EAST', '09 - VIP'];

const enabledCol = <T extends { enabled: boolean }>(): GlassColumn<T> => ({
  key: 'enabled' as keyof T & string,
  label: 'Status',
  searchable: false,
  render: (r) => (
    <span className={`vn-pill ${r.enabled ? 'on' : 'off'}`}>
      <span className="d" />
      {r.enabled ? 'Enabled' : 'Disabled'}
    </span>
  ),
});

const pitLocation: MaintenanceEntity<PitLocationRow> = {
  key: 'pit-location',
  singular: 'Pit Location',
  rowKey: 'id',
  uniqueField: 'code',
  seed: makePitLocations,
  searchPlaceholder: 'Search pit locations…',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    enabledCol<PitLocationRow>(),
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, full: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'enabled', label: 'Enabled', type: 'switch' },
  ],
};

const gameType: MaintenanceEntity<GameTypeRow> = {
  key: 'game-type',
  singular: 'Game Type',
  rowKey: 'id',
  uniqueField: 'gameCode',
  seed: makeGameTypes,
  searchPlaceholder: 'Search game types…',
  columns: [
    { key: 'gameCode', label: 'Game Code' },
    { key: 'typeCode', label: 'Type Code' },
    { key: 'description', label: 'Description' },
    enabledCol<GameTypeRow>(),
  ],
  fields: [
    { name: 'gameCode', label: 'Game Code', type: 'text', required: true },
    { name: 'typeCode', label: 'Type Code', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', full: true },
    { name: 'enabled', label: 'Enabled', type: 'switch' },
  ],
};

const machine: MaintenanceEntity<MachineRow> = {
  key: 'machine',
  singular: 'Machine',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makeMachines,
  searchPlaceholder: 'Search machines…',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'tableName', label: 'Table' },
    enabledCol<MachineRow>(),
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, full: true },
    { name: 'tableName', label: 'Table', type: 'select', options: TABLE },
    { name: 'enabled', label: 'Enabled', type: 'switch' },
  ],
};

const signageGroup: MaintenanceEntity<SignageGroupRow> = {
  key: 'signage',
  singular: 'Signage Group',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makeSignageGroups,
  searchPlaceholder: 'Search signage groups…',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'subDisplayNumber', label: 'Sub Display', align: 'right' },
    { key: 'switchInterval', label: 'Interval (s)', align: 'right' },
    enabledCol<SignageGroupRow>(),
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, full: true },
    { name: 'subDisplayNumber', label: 'Sub Display Number', type: 'number' },
    { name: 'switchInterval', label: 'Switch Interval', type: 'number' },
    { name: 'enabled', label: 'Enabled', type: 'switch' },
  ],
};

const pit: MaintenanceEntity<PitRow> = {
  key: 'pit',
  singular: 'Pit',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makePits,
  searchPlaceholder: 'Search pits…',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'pitLocation', label: 'Location' },
    { key: 'machine', label: 'Machine' },
    enabledCol<PitRow>(),
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, full: true },
    { name: 'pitLocation', label: 'Pit Location', type: 'select', options: PIT_LOCATION },
    { name: 'machine', label: 'Machine', type: 'select', options: MACHINE },
    { name: 'enabled', label: 'Enabled', type: 'switch' },
  ],
};

const table: MaintenanceEntity<TableRow> = {
  key: 'table',
  singular: 'Table',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makeTables,
  searchPlaceholder: 'Search tables…',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'gameType', label: 'Game Type' },
    { key: 'pit', label: 'Pit' },
    enabledCol<TableRow>(),
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, full: true },
    { name: 'gameType', label: 'Game Type', type: 'select', options: GAME_TYPE },
    { name: 'pit', label: 'Pit', type: 'select', options: PIT },
    { name: 'enabled', label: 'Enabled', type: 'switch' },
  ],
};

const location: MaintenanceEntity<LocationRow> = {
  key: 'location',
  singular: 'Location',
  rowKey: 'id',
  uniqueField: 'code',
  seed: makeLocations,
  searchPlaceholder: 'Search locations…',
  columns: [
    { key: 'code', label: 'Code' },
    { key: 'nameEn', label: 'English' },
    { key: 'nameZhTw', label: '繁體' },
    { key: 'nameZhCn', label: '简体' },
    enabledCol<LocationRow>(),
  ],
  fields: [
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'nameEn', label: 'English Name', type: 'text', required: true },
    { name: 'nameZhTw', label: 'Traditional Chinese', type: 'text' },
    { name: 'nameZhCn', label: 'Simplified Chinese', type: 'text' },
    { name: 'enabled', label: 'Enabled', type: 'switch' },
  ],
};

export const PitLocationView = () => <MaintenanceTable entity={pitLocation} />;
export const GameTypeView = () => <MaintenanceTable entity={gameType} />;
export const MachineView = () => <MaintenanceTable entity={machine} />;
export const SignageGroupView = () => <MaintenanceTable entity={signageGroup} />;
export const PitView = () => <MaintenanceTable entity={pit} />;
export const TableView = () => <MaintenanceTable entity={table} />;
export const LocationView = () => <MaintenanceTable entity={location} />;
