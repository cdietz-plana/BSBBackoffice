import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type Tone = 'ok' | 'err';
interface ToastItem {
  id: number;
  msg: string;
  tone: Tone;
}

const ToastCtx = createContext<(msg: string, tone?: Tone) => void>(() => {});

/** Lightweight toast for the vNext concept (no Ant Design). */
export function useVToast() {
  return useContext(ToastCtx);
}

let seq = 0;

export function VToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((msg: string, tone: Tone = 'ok') => {
    const id = ++seq;
    setItems((p) => [...p, { id, msg, tone }]);
    window.setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 2600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="vn-toasts">
        {items.map((t) => (
          <motion.div
            key={t.id}
            className={`vn-toast ${t.tone}`}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="dot" />
            {t.msg}
          </motion.div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
