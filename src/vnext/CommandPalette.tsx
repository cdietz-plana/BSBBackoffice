import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CornerDownLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CommandItem {
  key: string;
  label: string;
  group: string;
  icon: LucideIcon;
}

/** ⌘K command palette — fuzzy-ish filter + keyboard nav to jump between views. */
export function CommandPalette({
  open,
  items,
  onSelect,
  onClose,
}: {
  open: boolean;
  items: CommandItem[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[cursor];
      if (item) onSelect(item.key);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Group results while preserving order.
  const groups: { group: string; items: CommandItem[] }[] = [];
  results.forEach((r) => {
    let g = groups.find((x) => x.group === r.group);
    if (!g) {
      g = { group: r.group, items: [] };
      groups.push(g);
    }
    g.items.push(r);
  });

  let flatIndex = -1;

  return (
    <div className="vn-cmdk-overlay" onClick={onClose}>
      <motion.div
        className="vn-cmdk"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="vn-cmdk-input">
          <Search size={18} style={{ color: 'var(--vn-muted)' }} />
          <input
            ref={inputRef}
            placeholder="Jump to…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="vn-kbd">ESC</span>
        </div>

        <div className="vn-cmdk-list">
          {results.length === 0 && (
            <div style={{ padding: '20px 12px', color: 'var(--vn-muted)', fontSize: 13 }}>
              No matches
            </div>
          )}
          {groups.map((g) => (
            <div key={g.group}>
              <div className="vn-cmdk-group">{g.group}</div>
              {g.items.map((item) => {
                flatIndex++;
                const idx = flatIndex;
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className={`vn-cmdk-item ${idx === cursor ? 'active' : ''}`}
                    onMouseEnter={() => setCursor(idx)}
                    onClick={() => onSelect(item.key)}
                  >
                    <span className="ic">
                      <Icon size={16} />
                    </span>
                    {item.label}
                    <span className="sub">{item.group}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="vn-cmdk-foot">
          <span><span className="vn-kbd">↑</span> <span className="vn-kbd">↓</span> navigate</span>
          <span><span className="vn-kbd"><CornerDownLeft size={11} /></span> select</span>
        </div>
      </motion.div>
    </div>
  );
}
