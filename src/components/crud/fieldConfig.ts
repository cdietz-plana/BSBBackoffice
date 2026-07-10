import type { SelectOption } from '@/components/FilterBar';

/**
 * FieldConfig — the single description of an entity field. One list of these
 * drives BOTH the list-table columns AND the create/edit form, so a whole
 * Maintenance entity is just data. See `entities.ts` for the concrete configs.
 */
export type FieldType = 'text' | 'number' | 'select' | 'switch' | 'textarea';

export interface FieldConfig {
  /** Key in the row object. */
  name: string;
  /** i18n key for the label. */
  labelKey: string;
  type: FieldType;
  required?: boolean;
  /** Options for `select`. */
  options?: SelectOption[];
  /** Numeric bounds for `number`. */
  min?: number;
  max?: number;
  /** Column span (of 24) inside the form grid. Default 24 (full width). */
  colSpan?: number;
  /** Show a per-column search box on this field's table column. */
  searchable?: boolean;
  /** Hide from the list table (still editable in the form). */
  hideInTable?: boolean;
  /** Default value used when creating a new record. */
  defaultValue?: unknown;
}

/**
 * EntityConfig — everything CrudTable needs to render a full CRUD surface for
 * one Maintenance entity.
 */
export interface EntityConfig<T> {
  /** Route segment / stable id. */
  key: string;
  /** i18n key for the plural page title (e.g. 'nav.pitLocation'). */
  titleKey: string;
  /** i18n key for the singular noun used in toasts/empty state. */
  singularKey: string;
  /** Row identity field. */
  rowKey: keyof T & string;
  /** Field list — drives table columns and the form. */
  fields: FieldConfig[];
  /** Field used for the duplicate check on create/edit (e.g. 'code'). */
  uniqueField?: keyof T & string;
  /** Mock-data seed generator. */
  seed: () => T[];
}
