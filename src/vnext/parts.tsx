import { useEffect, useRef } from 'react';
import { animate, motion } from 'framer-motion';

/** Count-up number driven by framer-motion. */
export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [value, decimals, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/** Glowing SVG donut with an animated arc draw. */
export function Donut({
  fraction,
  alive,
  total,
}: {
  fraction: number; // alive / total, 0..1
  alive: number;
  total: number;
}) {
  const size = 200;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const aliveLen = c * fraction;

  return (
    <div className="vn-donut-wrap">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="vnAlive" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7ee8ab" />
            <stop offset="1" stopColor="#56d68a" />
          </linearGradient>
          <filter id="vnGlow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Timeout track (the majority) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(240,97,112,0.28)"
          strokeWidth={stroke}
        />
        {/* Alive arc, animated */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#vnAlive)"
          strokeWidth={stroke}
          strokeLinecap="round"
          filter="url(#vnGlow)"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - aliveLen }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </svg>
      <div className="vn-donut-center">
        <div className="big">
          <AnimatedNumber value={fraction * 100} decimals={1} suffix="%" />
        </div>
        <div className="small">Alive</div>
        <div className="small" style={{ marginTop: 8, letterSpacing: 1 }}>
          {alive} / {total}
        </div>
      </div>
    </div>
  );
}
