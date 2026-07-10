import { useMemo } from 'react';
import { Button, Tooltip, Descriptions } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { EnquiryListPage } from './EnquiryListPage';
import type { DataColumn } from '@/components/table/types';
import type { FilterField, FilterValues } from '@/components/FilterBar';
import {
  makeShoeData,
  makeGameData,
  makeCardData,
  makeEventData,
  makeUserActivityData,
  CARD_DATA_TOTAL,
  PIT_OPTIONS,
  TABLE_OPTIONS,
  MACHINE_OPTIONS,
  EVENT_TYPE_OPTIONS,
  type ShoeRow,
  type GameRow,
  type CardRow,
  type EventRow,
  type UserActivityRow,
} from '@/data/enquiry';

const col = <T,>(dataIndex: keyof T & string, title: string, opts: Partial<DataColumn<T>> = {}): DataColumn<T> => ({
  title,
  dataIndex,
  sortable: true,
  ...opts,
});

/** Generic equality filter: each filter key maps to a row field. Empty = ignore. */
function matchFilters<T>(row: T, values: FilterValues, map: Record<string, keyof T>) {
  return Object.entries(map).every(([filterKey, rowKey]) => {
    const v = values[filterKey];
    if (v == null || v === '') return true;
    return String((row as Record<string, unknown>)[rowKey as string]) === String(v);
  });
}

/** A per-row print button → opens the score-card print preview. */
function printColumn<T>(t: TFunction, navigate: (p: string) => void): DataColumn<T> {
  return {
    title: t('common.print'),
    dataIndex: '__print' as keyof T & string,
    enableToggle: false,
    width: 72,
    fixed: 'right',
    render: () => (
      <Tooltip title={t('common.print')}>
        <Button
          type="text"
          size="small"
          icon={<PrinterOutlined />}
          onClick={(e) => {
            e.stopPropagation(); // don't also open the row detail drawer
            navigate('/score-card');
          }}
        />
      </Tooltip>
    ),
  };
}

/* --- Shoe Data --- */
export function ShoeDataPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rows = useMemo(() => makeShoeData(), []);
  const columns = useMemo<DataColumn<ShoeRow>[]>(
    () => [
      col<ShoeRow>('pit', t('fields.pit'), { searchable: true }),
      col<ShoeRow>('table', t('fields.tableName'), { searchable: true }),
      col<ShoeRow>('machine', t('fields.machine'), { searchable: true }),
      col<ShoeRow>('shoeNumber', t('fields.shoeNumber')),
      col<ShoeRow>('startTime', t('fields.startTime')),
      col<ShoeRow>('endTime', t('fields.endTime')),
      printColumn<ShoeRow>(t, navigate),
    ],
    [t, navigate],
  );
  const filters: FilterField[] = [
    { key: 'pit', labelKey: 'fields.pitName', type: 'select', options: PIT_OPTIONS },
    { key: 'table', labelKey: 'fields.tableName', type: 'select', options: TABLE_OPTIONS },
    { key: 'time', labelKey: 'filter.time', type: 'dateRange', span: 8 },
  ];
  return (
    <EnquiryListPage
      config={{
        titleKey: 'nav.shoeData',
        filters,
        columns,
        rows,
        rowKey: 'id',
        exportFileName: 'shoe_data',
        filterFn: (r, v) => matchFilters(r, v, { pit: 'pit', table: 'table' }),
      }}
    />
  );
}

/* --- Game Data (widest table, with drill-in detail + print) --- */
export function GameDataPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rows = useMemo(() => makeGameData(), []);
  const columns = useMemo<DataColumn<GameRow>[]>(
    () => [
      col<GameRow>('pit', t('fields.pit'), { searchable: true }),
      col<GameRow>('table', t('fields.tableName'), { searchable: true }),
      col<GameRow>('machine', t('fields.machine'), { searchable: true }),
      col<GameRow>('shoeNumber', t('fields.shoeNumber')),
      col<GameRow>('gameNumber', t('fields.gameNumber')),
      col<GameRow>('startTime', t('fields.startTime')),
      col<GameRow>('endTime', t('fields.endTime')),
      col<GameRow>('result', t('fields.result')),
      col<GameRow>('pair', t('fields.pair')),
      col<GameRow>('natural', t('fields.natural')),
      col<GameRow>('source', t('fields.source')),
      col<GameRow>('winningTotal', t('fields.winningTotal')),
      col<GameRow>('special', t('fields.special')),
      printColumn<GameRow>(t, navigate),
    ],
    [t, navigate],
  );
  const filters: FilterField[] = [
    { key: 'pit', labelKey: 'fields.pitName', type: 'select', options: PIT_OPTIONS },
    { key: 'table', labelKey: 'fields.tableName', type: 'select', options: TABLE_OPTIONS },
    { key: 'machine', labelKey: 'fields.machine', type: 'select', options: MACHINE_OPTIONS },
    { key: 'time', labelKey: 'filter.time', type: 'dateRange', span: 12 },
  ];
  // Row drill-in: full record as a definition list.
  // PROVISIONAL — row detail view not in source screens; confirm at walkthrough.
  const renderDetail = (r: GameRow) => (
    <Descriptions size="small" column={1} bordered style={{ background: 'transparent' }}>
      <Descriptions.Item label={t('fields.pit')}>{r.pit}</Descriptions.Item>
      <Descriptions.Item label={t('fields.tableName')}>{r.table}</Descriptions.Item>
      <Descriptions.Item label={t('fields.machine')}>{r.machine}</Descriptions.Item>
      <Descriptions.Item label={t('fields.shoeNumber')}>{r.shoeNumber}</Descriptions.Item>
      <Descriptions.Item label={t('fields.gameNumber')}>{r.gameNumber}</Descriptions.Item>
      <Descriptions.Item label={t('fields.result')}>{r.result}</Descriptions.Item>
      <Descriptions.Item label={t('fields.startTime')}>{r.startTime}</Descriptions.Item>
      <Descriptions.Item label={t('fields.endTime')}>{r.endTime}</Descriptions.Item>
      <Descriptions.Item label={t('fields.winningTotal')}>{r.winningTotal}</Descriptions.Item>
      <Descriptions.Item label={t('fields.pair')}>{r.pair}</Descriptions.Item>
      <Descriptions.Item label={t('fields.natural')}>{r.natural}</Descriptions.Item>
      <Descriptions.Item label={t('fields.special')}>{r.special}</Descriptions.Item>
    </Descriptions>
  );
  return (
    <EnquiryListPage
      config={{
        titleKey: 'nav.gameData',
        filters,
        columns,
        rows,
        rowKey: 'id',
        exportFileName: 'game_data',
        filterFn: (r, v) => matchFilters(r, v, { pit: 'pit', table: 'table', machine: 'machine' }),
        renderDetail,
      }}
    />
  );
}

/* --- Card Data (heavy pagination: 5,786 rows) --- */
export function CardDataPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rows = useMemo(() => makeCardData(), []);
  const columns = useMemo<DataColumn<CardRow>[]>(
    () => [
      col<CardRow>('pit', t('fields.pit'), { searchable: true }),
      col<CardRow>('table', t('fields.tableName'), { searchable: true }),
      col<CardRow>('shoeNumber', t('fields.shoeNumber')),
      col<CardRow>('gameNumber', t('fields.gameNumber')),
      col<CardRow>('sequence', t('fields.sequence')),
      col<CardRow>('seat', t('fields.seat')),
      col<CardRow>('cardValue', t('fields.cardValue')),
      col<CardRow>('cardSuit', t('fields.cardSuit')),
      col<CardRow>('time', t('fields.time')),
      printColumn<CardRow>(t, navigate),
    ],
    [t, navigate],
  );
  const filters: FilterField[] = [
    { key: 'pit', labelKey: 'fields.pitName', type: 'select', options: PIT_OPTIONS },
    { key: 'table', labelKey: 'fields.tableName', type: 'select', options: TABLE_OPTIONS },
    { key: 'time', labelKey: 'filter.time', type: 'dateRange', span: 8 },
  ];
  return (
    <EnquiryListPage
      config={{
        titleKey: 'nav.cardData',
        filters,
        columns,
        rows,
        rowKey: 'id',
        totalOverride: CARD_DATA_TOTAL,
        defaultPageSize: 10,
        exportFileName: 'card_data',
        filterFn: (r, v) => matchFilters(r, v, { pit: 'pit', table: 'table' }),
      }}
    />
  );
}

/* --- Event Data --- */
export function EventDataPage() {
  const { t } = useTranslation();
  const rows = useMemo(() => makeEventData(), []);
  const columns = useMemo<DataColumn<EventRow>[]>(
    () => [
      col<EventRow>('pit', t('fields.pit'), { searchable: true }),
      col<EventRow>('table', t('fields.tableName'), { searchable: true }),
      col<EventRow>('machine', t('fields.machine'), { searchable: true }),
      col<EventRow>('eventTime', t('fields.eventTime')),
      col<EventRow>('eventType', t('fields.eventType'), { searchable: true }),
      col<EventRow>('eventValue', t('fields.eventValue')),
    ],
    [t],
  );
  const filters: FilterField[] = [
    { key: 'pit', labelKey: 'fields.pitName', type: 'select', options: PIT_OPTIONS },
    { key: 'table', labelKey: 'fields.tableName', type: 'select', options: TABLE_OPTIONS },
    { key: 'eventType', labelKey: 'fields.eventType', type: 'select', options: EVENT_TYPE_OPTIONS },
    { key: 'eventTime', labelKey: 'fields.eventTime', type: 'dateRange', span: 12 },
  ];
  return (
    <EnquiryListPage
      config={{
        titleKey: 'nav.eventData',
        filters,
        columns,
        rows,
        rowKey: 'id',
        exportFileName: 'event_data',
        filterFn: (r, v) =>
          matchFilters(r, v, { pit: 'pit', table: 'table', eventType: 'eventType' }),
      }}
    />
  );
}

/* --- User Activity Data --- */
export function UserActivityDataPage() {
  const { t } = useTranslation();
  const rows = useMemo(() => makeUserActivityData(), []);
  const columns = useMemo<DataColumn<UserActivityRow>[]>(
    () => [
      col<UserActivityRow>('userName', t('fields.userName'), { searchable: true }),
      col<UserActivityRow>('activityType', t('fields.activityType'), { searchable: true }),
      col<UserActivityRow>('activityValue', t('fields.activityValue')),
      col<UserActivityRow>('timestamp', t('fields.timestamp')),
    ],
    [t],
  );
  const filters: FilterField[] = [
    { key: 'userName', labelKey: 'fields.userName', type: 'input' },
    { key: 'activityType', labelKey: 'fields.activityType', type: 'input' },
    { key: 'time', labelKey: 'filter.time', type: 'dateRange', span: 8 },
  ];
  return (
    <EnquiryListPage
      config={{
        titleKey: 'nav.userActivityData',
        filters,
        columns,
        rows,
        rowKey: 'id',
        exportFileName: 'user_activity',
        filterFn: (r, v) =>
          String(r.userName).toLowerCase().includes(String(v.userName ?? '').toLowerCase()) &&
          String(r.activityType)
            .toLowerCase()
            .includes(String(v.activityType ?? '').toLowerCase()),
      }}
    />
  );
}
