import type { EntityConfig } from '@/components/crud/fieldConfig';
import type { SelectOption } from '@/components/FilterBar';
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

/* Select option sources for relational fields (mirror the mock data). */
const opt = (values: string[]): SelectOption[] => values.map((v) => ({ value: v, label: v }));

const PIT_LOCATION_OPTS = opt(['NORTH', 'SOUTH', 'EAST', 'WEST', 'VIP', 'MAIN']);
const GAME_TYPE_OPTS = opt(['BB', 'BAC', 'DT', 'RO']);
const MACHINE_OPTS = opt(['DT008857', 'DT000011', 'DT008585', 'KAMENG-A', 'KEI-INSYS', 'MINGBO-INSYS']);
const TABLE_OPTS = opt(['CTBB03', '01BB01', '01BB02', '03BB01', '90BB06', '12BB05']);
const PIT_OPTS = opt(['01 - NORTH', '03 - NORTH', '05 - SOUTH', '07 - EAST', '09 - VIP']);

/**
 * EntityConfig per Maintenance entity — the single source that drives the list
 * columns AND the create/edit form for each. Field lists are inferred from the
 * source list columns.
 * // PROVISIONAL — form field sets not shown in source screens; confirm at walkthrough.
 */
export const pitLocationConfig: EntityConfig<PitLocationRow> = {
  key: 'pit-location',
  titleKey: 'nav.pitLocation',
  singularKey: 'nav.pitLocation',
  rowKey: 'id',
  uniqueField: 'code',
  seed: makePitLocations,
  fields: [
    { name: 'name', labelKey: 'fields.name', type: 'text', required: true, searchable: true },
    { name: 'code', labelKey: 'fields.code', type: 'text', required: true, searchable: true, colSpan: 12 },
    { name: 'enabled', labelKey: 'fields.enabled', type: 'switch', defaultValue: true, colSpan: 12 },
  ],
};

export const gameTypeConfig: EntityConfig<GameTypeRow> = {
  key: 'game-type',
  titleKey: 'nav.gameType',
  singularKey: 'nav.gameType',
  rowKey: 'id',
  uniqueField: 'gameCode',
  seed: makeGameTypes,
  fields: [
    { name: 'gameCode', labelKey: 'fields.gameCode', type: 'text', required: true, searchable: true, colSpan: 12 },
    { name: 'typeCode', labelKey: 'fields.typeCode', type: 'text', required: true, colSpan: 12 },
    { name: 'description', labelKey: 'fields.description', type: 'text', searchable: true },
    { name: 'enabled', labelKey: 'fields.enabled', type: 'switch', defaultValue: true },
  ],
};

export const machineConfig: EntityConfig<MachineRow> = {
  key: 'machine',
  titleKey: 'nav.machine',
  singularKey: 'nav.machine',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makeMachines,
  fields: [
    { name: 'name', labelKey: 'fields.name', type: 'text', required: true, searchable: true },
    { name: 'tableName', labelKey: 'fields.tableName', type: 'select', options: TABLE_OPTS },
    { name: 'enabled', labelKey: 'fields.enabled', type: 'switch', defaultValue: true },
  ],
};

export const pitConfig: EntityConfig<PitRow> = {
  key: 'pit',
  titleKey: 'nav.pit',
  singularKey: 'nav.pit',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makePits,
  fields: [
    { name: 'name', labelKey: 'fields.name', type: 'text', required: true, searchable: true },
    { name: 'pitLocation', labelKey: 'fields.pitLocation', type: 'select', options: PIT_LOCATION_OPTS, colSpan: 12 },
    { name: 'machine', labelKey: 'fields.machine', type: 'select', options: MACHINE_OPTS, colSpan: 12 },
    { name: 'enabled', labelKey: 'fields.enabled', type: 'switch', defaultValue: true },
  ],
};

export const tableConfig: EntityConfig<TableRow> = {
  key: 'table',
  titleKey: 'nav.table',
  singularKey: 'nav.table',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makeTables,
  fields: [
    { name: 'name', labelKey: 'fields.name', type: 'text', required: true, searchable: true },
    { name: 'gameType', labelKey: 'fields.gameType', type: 'select', options: GAME_TYPE_OPTS, colSpan: 12 },
    { name: 'pit', labelKey: 'fields.pit', type: 'select', options: PIT_OPTS, colSpan: 12 },
    { name: 'enabled', labelKey: 'fields.enabled', type: 'switch', defaultValue: true },
  ],
};

export const signageGroupConfig: EntityConfig<SignageGroupRow> = {
  key: 'signage-group',
  titleKey: 'nav.signageGroup',
  singularKey: 'nav.signageGroup',
  rowKey: 'id',
  uniqueField: 'name',
  seed: makeSignageGroups,
  fields: [
    { name: 'name', labelKey: 'fields.name', type: 'text', required: true, searchable: true },
    { name: 'subDisplayNumber', labelKey: 'fields.subDisplayNumber', type: 'number', min: 1, max: 16, colSpan: 12 },
    { name: 'switchInterval', labelKey: 'fields.switchInterval', type: 'number', min: 1, max: 120, colSpan: 12 },
    { name: 'enabled', labelKey: 'fields.enabled', type: 'switch', defaultValue: true },
  ],
};

export const locationConfig: EntityConfig<LocationRow> = {
  key: 'location',
  titleKey: 'nav.location',
  singularKey: 'nav.location',
  rowKey: 'id',
  uniqueField: 'code',
  seed: makeLocations,
  fields: [
    { name: 'code', labelKey: 'fields.code', type: 'text', required: true, searchable: true, colSpan: 12 },
    { name: 'nameEn', labelKey: 'fields.nameEn', type: 'text', required: true, searchable: true, colSpan: 12 },
    { name: 'nameZhTw', labelKey: 'fields.nameZhTw', type: 'text', colSpan: 12 },
    { name: 'nameZhCn', labelKey: 'fields.nameZhCn', type: 'text', colSpan: 12 },
    { name: 'enabled', labelKey: 'fields.enabled', type: 'switch', defaultValue: true },
  ],
};
