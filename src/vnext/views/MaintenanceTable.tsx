import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { GlassTable, type GlassColumn } from '../GlassTable';
import { GlassModal, type VField } from '../GlassModal';
import { useVToast } from '../toast';
import { useIntent } from '../intent';

export interface MaintenanceEntity<T> {
  /** Stable key (matches the nav key) — used by command-palette "New" actions. */
  key: string;
  singular: string;
  rowKey: keyof T & string;
  columns: GlassColumn<T>[];
  fields: VField[];
  uniqueField?: keyof T & string;
  seed: () => T[];
  searchPlaceholder?: string;
}

/** Generic dark-glass CRUD table: New / Edit / Delete with a toast per action. */
export function MaintenanceTable<T extends object>({ entity }: { entity: MaintenanceEntity<T> }) {
  const toast = useVToast();
  const { createKey, clearCreate } = useIntent();
  const [rows, setRows] = useState<T[]>(() => entity.seed());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

  const key = entity.rowKey;

  // Command-palette "New <entity>" opens the create modal on arrival.
  useEffect(() => {
    if (createKey === entity.key) {
      setEditing(null);
      setOpen(true);
      clearCreate();
    }
  }, [createKey, entity.key, clearCreate]);

  const del = (r: T) => {
    setRows((p) => p.filter((x) => x[key] !== r[key]));
    toast(`${entity.singular} deleted`, 'ok');
  };

  const submit = (values: Record<string, unknown>) => {
    if (editing) {
      setRows((p) => p.map((x) => (x[key] === editing[key] ? ({ ...x, ...values } as T) : x)));
      toast(`${entity.singular} updated`, 'ok');
    } else {
      const id = `${entity.singular}-${Date.now()}`;
      setRows((p) => [{ ...values, [key]: id } as unknown as T, ...p]);
      toast(`${entity.singular} created`, 'ok');
    }
    setOpen(false);
  };

  const checkDup = (values: Record<string, unknown>): string | null => {
    if (!entity.uniqueField) return null;
    const f = entity.uniqueField;
    const clash = rows.some(
      (r) => r[f] === values[f] && (!editing || r[key] !== editing[key]),
    );
    return clash ? String(f) : null;
  };

  return (
    <>
      <GlassTable<T>
        columns={entity.columns}
        rows={rows}
        rowKey={key}
        searchPlaceholder={entity.searchPlaceholder}
        toolbarRight={
          <button
            className="vn-btn primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus size={15} /> New
          </button>
        }
        rowActions={(r) => (
          <>
            <button
              className="vn-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(r);
                setOpen(true);
              }}
              aria-label="edit"
            >
              <Pencil size={14} />
            </button>
            <button
              className="vn-icon-btn danger"
              onClick={(e) => {
                e.stopPropagation();
                del(r);
              }}
              aria-label="delete"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      />
      <GlassModal
        open={open}
        title={`${editing ? 'Edit' : 'New'} ${entity.singular}`}
        fields={entity.fields}
        initial={editing ? (editing as unknown as Record<string, unknown>) : undefined}
        checkDuplicate={checkDup}
        onSubmit={submit}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
