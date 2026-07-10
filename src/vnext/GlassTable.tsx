import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Rows3, Rows4, X } from 'lucide-react';

export interface GlassColumn<T> {
  key: keyof T & string;
  label: string;
  align?: 'left' | 'right';
  render?: (row: T) => ReactNode;
  searchable?: boolean;
}

export interface GlassFilter {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: string[];
}

/**
 * Custom dark-glass data table for the vNext concept — NOT Ant Design.
 * Search + an expandable Filters panel + column sort, with staggered rows and
 * optional per-row actions.
 */
export function GlassTable<T extends object>({
  columns,
  rows,
  rowKey,
  searchPlaceholder = 'Search…',
  filters,
  toolbarRight,
  rowActions,
  enableDetail = true,
  detailTitle,
}: {
  columns: GlassColumn<T>[];
  rows: T[];
  rowKey: keyof T & string;
  searchPlaceholder?: string;
  filters?: GlassFilter[];
  toolbarRight?: ReactNode;
  rowActions?: (row: T) => ReactNode;
  /** Click a row to open a detail drawer. */
  enableDetail?: boolean;
  /** Column key whose value titles the detail drawer. Defaults to first column. */
  detailTitle?: keyof T & string;
}) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<(keyof T & string) | null>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<T | null>(null);
  const [dense, setDense] = useState(false);

  const activeFilters = Object.values(filterValues).filter((v) => v && v.trim()).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows;

    if (q) {
      out = out.filter((r) =>
        columns.some((c) => {
          if (c.searchable === false) return false;
          return String(r[c.key] ?? '').toLowerCase().includes(q);
        }),
      );
    }

    (filters ?? []).forEach((f) => {
      const val = filterValues[f.key];
      if (!val || !val.trim()) return;
      out = out.filter((r) => {
        const cell = String((r as Record<string, unknown>)[f.key] ?? '');
        return f.type === 'select'
          ? cell === val
          : cell.toLowerCase().includes(val.toLowerCase());
      });
    });

    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
        return String(av ?? '').localeCompare(String(bv ?? '')) * sortDir;
      });
    }
    return out;
  }, [rows, columns, query, filters, filterValues, sortKey, sortDir]);

  const toggleSort = (key: keyof T & string) => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const clearFilters = () => setFilterValues({});

  return (
    <>
      <div className="vn-toolbar">
        <div className="vn-toolbar-left">
          <div className="vn-search">
            <Search size={15} />
            <input
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {filters && filters.length > 0 && (
            <button
              className={`vn-btn ghost ${showFilters || activeFilters ? 'on' : ''}`}
              onClick={() => setShowFilters((s) => !s)}
            >
              <SlidersHorizontal size={15} /> Filters
              {activeFilters > 0 && <span className="badge">{activeFilters}</span>}
            </button>
          )}
          <button
            className="vn-icon-btn"
            onClick={() => setDense((d) => !d)}
            title={dense ? 'Comfortable rows' : 'Compact rows'}
            aria-label="toggle density"
          >
            {dense ? <Rows3 size={16} /> : <Rows4 size={16} />}
          </button>
        </div>
        <div className="vn-toolbar-left">
          <span className="vn-count">{filtered.length} rows</span>
          {toolbarRight}
        </div>
      </div>

      {filters && filters.length > 0 && (
        <div className={`vn-filters ${showFilters ? 'open' : ''}`}>
          <div className="vn-filters-inner">
            {filters.map((f) => (
              <div key={f.key} className="vn-field">
                <label>{f.label}</label>
                {f.type === 'select' ? (
                  <select
                    className="vn-select"
                    value={filterValues[f.key] ?? ''}
                    onChange={(e) => setFilterValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  >
                    <option value="">All</option>
                    {(f.options ?? []).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="vn-input"
                    value={filterValues[f.key] ?? ''}
                    onChange={(e) => setFilterValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            <div className="vn-filters-actions">
              <button className="vn-btn ghost" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </div>
      )}

      <div className="vn-tbl-wrap">
        <table className={`vn-tbl ${dense ? 'dense' : ''}`}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} onClick={() => toggleSort(c.key)} style={{ textAlign: c.align ?? 'left' }}>
                  {c.label}
                  {sortKey === c.key && <span className="arrow">{sortDir === 1 ? '▲' : '▼'}</span>}
                </th>
              ))}
              {rowActions && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <motion.tr
                key={String(row[rowKey])}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.012, 0.35), duration: 0.3 }}
                onClick={() => enableDetail && setSelected(row)}
                style={{ cursor: enableDetail ? 'pointer' : 'default' }}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={c.align === 'right' ? 'num' : undefined}
                    style={{ textAlign: c.align ?? 'left' }}
                  >
                    {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                  </td>
                ))}
                {rowActions && (
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>{rowActions(row)}</div>
                  </td>
                )}
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)}>
                  <div className="vn-empty">No matching rows</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Row drill-in detail drawer */}
      {selected && (
        <>
          <div className="vn-drawer-overlay" onClick={() => setSelected(null)} />
          <motion.div
            className="vn-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="vn-drawer-head">
              <div>
                <h3>{String(selected[detailTitle ?? columns[0].key] ?? 'Detail')}</h3>
                <p className="sub">Record detail</p>
              </div>
              <button className="vn-icon-btn" onClick={() => setSelected(null)} aria-label="close">
                <X size={16} />
              </button>
            </div>
            <div>
              {columns.map((c) => (
                <div className="vn-dl-row" key={c.key}>
                  <span className="k">{c.label}</span>
                  <span className="v">
                    {c.render ? c.render(selected) : String(selected[c.key] ?? '—')}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
