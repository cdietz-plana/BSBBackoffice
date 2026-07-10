import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface VField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'switch';
  required?: boolean;
  options?: string[];
  full?: boolean;
}

/** Dark glass modal with a form generated from `fields`. Custom (no antd). */
export function GlassModal({
  open,
  title,
  fields,
  initial,
  checkDuplicate,
  onSubmit,
  onClose,
}: {
  open: boolean;
  title: string;
  fields: VField[];
  initial?: Record<string, unknown>;
  checkDuplicate?: (values: Record<string, unknown>) => string | null;
  onSubmit: (values: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const seed: Record<string, unknown> = {};
    fields.forEach((f) => {
      seed[f.name] = initial?.[f.name] ?? (f.type === 'switch' ? true : '');
    });
    setValues(seed);
    setErrors({});
  }, [open, fields, initial]);

  if (!open) return null;

  const set = (name: string, v: unknown) => setValues((p) => ({ ...p, [name]: v }));

  const submit = () => {
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && f.type !== 'switch' && !String(values[f.name] ?? '').trim()) {
        errs[f.name] = 'Required';
      }
    });
    if (Object.keys(errs).length === 0) {
      const dup = checkDuplicate?.(values);
      if (dup) errs[dup] = 'Already exists';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(values);
  };

  return (
    <div className="vn-modal-overlay" onClick={onClose}>
      <motion.div
        className="vn-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="vn-modal-head">
          <h3>{title}</h3>
          <button className="vn-icon-btn" onClick={onClose} aria-label="close">
            <X size={16} />
          </button>
        </div>

        <div className="vn-form-grid">
          {fields.map((f) => (
            <div key={f.name} className={`vn-field ${f.full || f.type === 'switch' ? 'full' : ''}`}>
              <label>{f.label}</label>
              {f.type === 'select' ? (
                <select
                  className="vn-select"
                  value={String(values[f.name] ?? '')}
                  onChange={(e) => set(f.name, e.target.value)}
                >
                  <option value="">—</option>
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === 'switch' ? (
                <div
                  className={`vn-switch ${values[f.name] ? 'on' : ''}`}
                  onClick={() => set(f.name, !values[f.name])}
                  role="switch"
                  aria-checked={Boolean(values[f.name])}
                >
                  <span className="knob" />
                </div>
              ) : (
                <input
                  className="vn-input"
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={String(values[f.name] ?? '')}
                  onChange={(e) =>
                    set(f.name, f.type === 'number' ? e.target.valueAsNumber || '' : e.target.value)
                  }
                />
              )}
              {errors[f.name] && <span className="err">{errors[f.name]}</span>}
            </div>
          ))}
        </div>

        <div className="vn-modal-foot">
          <button className="vn-btn ghost" onClick={onClose}>Cancel</button>
          <button className="vn-btn primary" onClick={submit}>Save</button>
        </div>
      </motion.div>
    </div>
  );
}
