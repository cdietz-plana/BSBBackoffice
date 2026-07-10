import type { ColumnType } from 'antd/es/table';

/**
 * A column definition for the shared DataTable. Extends Ant Design's ColumnType
 * with a couple of ergonomic flags so a whole list page is just config:
 *  - `searchable` wires up the per-column search popover automatically
 *  - `enableToggle` lets it be hidden/reordered via the Column Display gear
 */
export interface DataColumn<T> extends ColumnType<T> {
  dataIndex: keyof T & string;
  /** Show the magnifier + search popover on this column header. */
  searchable?: boolean;
  /** Show a numeric sorter. Defaults to lexical sort when true. */
  sortable?: boolean;
  /** Allow the user to hide/reorder this column. Default true. */
  enableToggle?: boolean;
}

export type Density = 'large' | 'middle' | 'small';
