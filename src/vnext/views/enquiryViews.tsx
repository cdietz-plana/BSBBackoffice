import { useEffect, useMemo, useState } from 'react';
import { GlassTable, type GlassColumn, type GlassFilter } from '../GlassTable';
import {
  makeHeartbeatData,
  makeShoeData,
  makeGameData,
  makeCardData,
  makeEventData,
  makeUserActivityData,
  EVENT_TYPES,
  type HeartbeatRow,
  type ShoeRow,
  type GameRow,
  type CardRow,
  type EventRow,
  type UserActivityRow,
} from '@/data/enquiry';
import { PITS, TABLES, MACHINES } from '@/data/helpers';

const PIT = [...PITS];
const TABLE = [...TABLES];
const MACHINE = [...MACHINES];
const SUIT: Record<string, string> = { Spade: '♠', Heart: '♥', Diamond: '♦', Club: '♣' };
const RED = new Set(['Heart', 'Diamond']);
const ALERT = new Set([
  'ErrorOn', 'DrawingTimeout', 'Lock', 'Error08', 'Error09', 'Error10',
  'Error11', 'Error12', 'Error13', 'Error14', 'Error15', 'Error16',
]);

const statusPill = (s: string) => (
  <span className={`vn-pill ${s === 'Alive' ? 'on' : 'off'}`}>
    <span className="d" />
    {s}
  </span>
);
const resultChip = (r: string) => <span className={`vn-chip ${r.toLowerCase()}`}>{r}</span>;

/* --- Table Heartbeat (live: statuses flip periodically) --- */
export function TableHeartbeatView() {
  const [rows, setRows] = useState<HeartbeatRow[]>(() => makeHeartbeatData());
  useEffect(() => {
    const id = window.setInterval(() => {
      setRows((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const copy = [...prev];
        const next: HeartbeatRow['status'] = copy[i].status === 'Alive' ? 'Timeout' : 'Alive';
        const now = new Date();
        const stamp = `2025-11-21 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        copy[i] = {
          ...copy[i],
          status: next,
          lastReceiveDate: next === 'Alive' ? stamp : copy[i].lastReceiveDate,
        };
        return copy;
      });
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  const columns: GlassColumn<HeartbeatRow>[] = [
    { key: 'tableName', label: 'Table' },
    { key: 'pitName', label: 'Pit' },
    { key: 'machineName', label: 'Machine' },
    { key: 'lastReceiveDate', label: 'Last Receive' },
    { key: 'status', label: 'Status', render: (r) => statusPill(r.status) },
  ];
  const filters: GlassFilter[] = [
    { key: 'status', label: 'Status', type: 'select', options: ['Alive', 'Timeout'] },
    { key: 'tableName', label: 'Table', type: 'text' },
  ];
  return (
    <GlassTable<HeartbeatRow>
      columns={columns}
      rows={rows}
      rowKey="id"
      filters={filters}
      searchPlaceholder="Search tables, pits, machines…"
      toolbarRight={<span className="vn-live"><span className="d" /> LIVE</span>}
    />
  );
}

/* --- Shoe Data --- */
export function ShoeDataView() {
  const rows = useMemo(() => makeShoeData(), []);
  const columns: GlassColumn<ShoeRow>[] = [
    { key: 'pit', label: 'Pit' },
    { key: 'table', label: 'Table' },
    { key: 'machine', label: 'Machine' },
    { key: 'shoeNumber', label: 'Shoe', align: 'right' },
    { key: 'startTime', label: 'Start' },
    { key: 'endTime', label: 'End' },
  ];
  const filters: GlassFilter[] = [
    { key: 'pit', label: 'Pit', type: 'select', options: PIT },
    { key: 'table', label: 'Table', type: 'select', options: TABLE },
  ];
  return <GlassTable<ShoeRow> columns={columns} rows={rows} rowKey="id" filters={filters} searchPlaceholder="Search shoes, tables…" />;
}

/* --- Game Data --- */
export function GameDataView() {
  const rows = useMemo(() => makeGameData().slice(0, 90), []);
  const columns: GlassColumn<GameRow>[] = [
    { key: 'pit', label: 'Pit' },
    { key: 'table', label: 'Table' },
    { key: 'machine', label: 'Machine' },
    { key: 'shoeNumber', label: 'Shoe', align: 'right' },
    { key: 'gameNumber', label: 'Game', align: 'right' },
    { key: 'startTime', label: 'Start' },
    { key: 'result', label: 'Result', render: (r) => resultChip(r.result) },
    { key: 'winningTotal', label: 'Total', align: 'right' },
  ];
  const filters: GlassFilter[] = [
    { key: 'pit', label: 'Pit', type: 'select', options: PIT },
    { key: 'table', label: 'Table', type: 'select', options: TABLE },
    { key: 'machine', label: 'Machine', type: 'select', options: MACHINE },
    { key: 'result', label: 'Result', type: 'select', options: ['Player', 'Banker', 'Tie'] },
  ];
  return <GlassTable<GameRow> columns={columns} rows={rows} rowKey="id" filters={filters} searchPlaceholder="Search games, tables, results…" />;
}

/* --- Card Data --- */
export function CardDataView() {
  const rows = useMemo(() => makeCardData().slice(0, 120), []);
  const columns: GlassColumn<CardRow>[] = [
    { key: 'pit', label: 'Pit' },
    { key: 'table', label: 'Table' },
    { key: 'shoeNumber', label: 'Shoe', align: 'right' },
    { key: 'gameNumber', label: 'Game', align: 'right' },
    { key: 'sequence', label: 'Seq', align: 'right' },
    { key: 'seat', label: 'Seat' },
    {
      key: 'cardValue',
      label: 'Card',
      render: (r) => (
        <span style={{ fontWeight: 600 }}>
          {r.cardValue}
          <span style={{ color: RED.has(r.cardSuit) ? '#ff8a95' : 'var(--vn-text)', marginLeft: 4 }}>
            {SUIT[r.cardSuit] ?? r.cardSuit}
          </span>
        </span>
      ),
    },
    { key: 'time', label: 'Time' },
  ];
  const filters: GlassFilter[] = [
    { key: 'pit', label: 'Pit', type: 'select', options: PIT },
    { key: 'table', label: 'Table', type: 'select', options: TABLE },
    { key: 'seat', label: 'Seat', type: 'select', options: ['Player1', 'Player2', 'Player3', 'Banker'] },
  ];
  return <GlassTable<CardRow> columns={columns} rows={rows} rowKey="id" filters={filters} searchPlaceholder="Search cards, seats…" />;
}

/* --- Event Data --- */
export function EventDataView() {
  const rows = useMemo(() => makeEventData(), []);
  const columns: GlassColumn<EventRow>[] = [
    { key: 'pit', label: 'Pit' },
    { key: 'table', label: 'Table' },
    { key: 'machine', label: 'Machine' },
    { key: 'eventTime', label: 'Event Time' },
    {
      key: 'eventType',
      label: 'Event Type',
      render: (r) => <span className={`vn-pill ${ALERT.has(r.eventType) ? 'off' : 'neutral'}`}>{r.eventType}</span>,
    },
    { key: 'eventValue', label: 'Value', align: 'right' },
  ];
  const filters: GlassFilter[] = [
    { key: 'eventType', label: 'Event Type', type: 'select', options: EVENT_TYPES },
    { key: 'pit', label: 'Pit', type: 'select', options: PIT },
  ];
  return <GlassTable<EventRow> columns={columns} rows={rows} rowKey="id" filters={filters} searchPlaceholder="Search events, types…" />;
}

/* --- User Activity --- */
export function UserActivityView() {
  const rows = useMemo(() => makeUserActivityData(), []);
  const columns: GlassColumn<UserActivityRow>[] = [
    { key: 'userName', label: 'User' },
    { key: 'activityType', label: 'Activity' },
    { key: 'activityValue', label: 'Detail' },
    { key: 'timestamp', label: 'Timestamp' },
  ];
  const filters: GlassFilter[] = [
    { key: 'activityType', label: 'Activity', type: 'select', options: ['Login', 'Logout', 'Create', 'Update', 'Delete', 'Export', 'Print'] },
    { key: 'userName', label: 'User', type: 'text' },
  ];
  return <GlassTable<UserActivityRow> columns={columns} rows={rows} rowKey="id" filters={filters} searchPlaceholder="Search users, activity…" />;
}
