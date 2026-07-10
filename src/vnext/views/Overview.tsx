import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TriangleAlert, Dices, Layers } from 'lucide-react';
import { makeHeartbeatData, makeGameData, type GameRow } from '@/data/enquiry';
import { AnimatedNumber, Donut } from '../parts';
import { GlassTable, type GlassColumn } from '../GlassTable';
import { useVNav } from '../nav';

const RESULTS = ['Player', 'Banker', 'Tie'];
const TABLES_LIVE = ['CTBB03', '01BB02', '03BB01', '90BB06'];

/** Prepend a freshly "played" game every few seconds for a live feel. */
function useLiveGames() {
  const [rows, setRows] = useState<GameRow[]>(() => makeGameData().slice(0, 30));
  useEffect(() => {
    const id = window.setInterval(() => {
      setRows((prev) => {
        const gn = (prev[0]?.gameNumber ?? 200) + 1;
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const next: GameRow = {
          id: `live-${gn}-${now.getTime()}`,
          pit: 'PITCT',
          table: TABLES_LIVE[gn % TABLES_LIVE.length],
          machine: 'DT008857',
          shoeNumber: 4651,
          gameNumber: gn,
          startTime: `2025-11-21 ${hh}:${mm}:${ss}`,
          endTime: '',
          result: RESULTS[Math.floor(Math.random() * RESULTS.length)],
          pair: 'NoPair',
          natural: 'NoNatural',
          source: 'Shoe',
          winningTotal: Math.floor(Math.random() * 10),
          special: '-',
        };
        return [next, ...prev].slice(0, 40);
      });
    }, 3500);
    return () => window.clearInterval(id);
  }, []);
  return rows;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE },
});
const hoverLift = {
  y: -4,
  boxShadow:
    '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(176,141,70,0.45)',
};

export function Overview() {
  const heartbeat = useMemo(() => makeHeartbeatData(), []);
  const games = useLiveGames();
  const timeout = heartbeat.filter((h) => h.status === 'Timeout').length;
  const alive = heartbeat.length - timeout;
  const total = heartbeat.length;

  const go = useVNav();
  const kpis = [
    { icon: Activity, label: 'Tables Online', value: alive, foot: <span className="up">▲ live floor</span>, nav: 'heartbeat' },
    { icon: TriangleAlert, label: 'Timeouts', value: timeout, foot: <span className="down">needs attention</span>, nav: 'heartbeat' },
    { icon: Dices, label: 'Games Today', value: 1284, foot: <span className="up">▲ 8.2% vs avg</span>, nav: 'games' },
    { icon: Layers, label: 'Active Shoes', value: 36, foot: <span>across 5 pits</span>, nav: 'shoe' },
  ];

  const gameCols: GlassColumn<GameRow>[] = [
    { key: 'table', label: 'Table' },
    { key: 'gameNumber', label: 'Game', align: 'right' },
    { key: 'result', label: 'Result', render: (r) => <span className={`vn-chip ${r.result.toLowerCase()}`}>{r.result}</span> },
    { key: 'winningTotal', label: 'Total', align: 'right' },
    { key: 'startTime', label: 'Start' },
  ];

  return (
    <>
      <div className="vn-kpis" style={{ marginBottom: 20 }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              className="vn-card vn-card-pad vn-kpi"
              style={{ cursor: 'pointer' }}
              onClick={() => go(k.nav)}
              {...reveal(0.05 + i * 0.06)}
              whileHover={hoverLift}
            >
              <div className="label">
                <Icon size={15} className="glyph" /> {k.label}
              </div>
              <div className="value">
                <AnimatedNumber value={k.value} />
              </div>
              <div className="foot">{k.foot}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="vn-main">
        <motion.div className="vn-card vn-card-pad" {...reveal(0.28)}>
          <p className="vn-card-title">Heartbeat health</p>
          <Donut fraction={alive / total} alive={alive} total={total} />
          <div className="vn-legend">
            <span className="item">
              <span className="dot" style={{ background: '#56d68a', boxShadow: '0 0 8px #56d68a' }} />
              Alive
            </span>
            <span className="item">
              <span className="dot" style={{ background: '#f06170' }} />
              Timeout
            </span>
          </div>
        </motion.div>

        <motion.div className="vn-card vn-card-pad" {...reveal(0.34)}>
          <p className="vn-card-title">
            Recent games
            <span className="vn-live"><span className="d" /> LIVE</span>
          </p>
          <GlassTable<GameRow>
            columns={gameCols}
            rows={games}
            rowKey="id"
            searchPlaceholder="Search recent games…"
          />
        </motion.div>
      </div>
    </>
  );
}
