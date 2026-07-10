import { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import type { FieldConfig } from './fieldConfig';

export interface EntityFormModalProps<T> {
  open: boolean;
  mode: 'create' | 'edit';
  /** i18n key for the singular noun (title + messages). */
  singularKey: string;
  fields: FieldConfig[];
  initialValues?: Partial<T>;
  /** Return the field name that duplicates an existing record, or null. */
  checkDuplicate?: (values: Partial<T>) => string | null;
  /** Persist handler — caller updates state + fires the toast. */
  onSubmit: (values: Partial<T>) => void;
  onClose: () => void;
}

/**
 * One form for create AND edit, generated from a FieldConfig[]. Handles inline
 * validation, duplicate-value errors, and a submitting state (Save disabled +
 * spinner only while in flight). The mock "save" is a short delay.
 */
export function EntityFormModal<T extends object>({
  open,
  mode,
  singularKey,
  fields,
  initialValues,
  checkDuplicate,
  onSubmit,
  onClose,
}: EntityFormModalProps<T>) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Reset the form each time the modal opens (defaults for create, record for edit).
  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      const defaults: Record<string, unknown> = {};
      fields.forEach((f) => {
        defaults[f.name] =
          f.defaultValue ?? (f.type === 'switch' ? true : undefined);
      });
      form.setFieldsValue(defaults);
    }
  }, [open, mode, initialValues, fields, form]);

  const handleOk = async () => {
    let values: Partial<T>;
    try {
      values = (await form.validateFields()) as Partial<T>;
    } catch {
      return; // inline validation errors already shown
    }

    // Duplicate-value guard (e.g. two Pit Locations with the same Code).
    const dupField = checkDuplicate?.(values);
    if (dupField) {
      form.setFields([
        { name: dupField, errors: [t('common.duplicate')] },
      ]);
      return;
    }

    setSubmitting(true);
    // Simulate a network round-trip so the submitting state is visible.
    window.setTimeout(() => {
      setSubmitting(false);
      onSubmit(values);
      form.resetFields();
    }, 450);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const title = `${t(mode === 'create' ? 'common.add' : 'common.edit')} · ${t(singularKey)}`;

  const renderControl = (field: FieldConfig) => {
    switch (field.type) {
      case 'number':
        return <InputNumber min={field.min} max={field.max} style={{ width: '100%' }} />;
      case 'select':
        return (
          <Select
            allowClear
            placeholder={t('common.selectPlaceholder')}
            options={(field.options ?? []).map((o) => ({
              value: o.value,
              label: o.labelKey ? t(o.labelKey) : o.label ?? o.value,
            }))}
          />
        );
      case 'switch':
        return <Switch checkedChildren={t('common.enabled')} unCheckedChildren={t('common.disabled')} />;
      case 'textarea':
        return <Input.TextArea rows={3} />;
      case 'text':
      default:
        return <Input />;
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      confirmLoading={submitting}
      okButtonProps={{ disabled: submitting }}
      destroyOnHidden
      width={520}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 12 }} requiredMark>
        <Row gutter={16}>
          {fields.map((field) => (
            <Col key={field.name} span={field.colSpan ?? 24}>
              <Form.Item
                label={t(field.labelKey)}
                name={field.name}
                valuePropName={field.type === 'switch' ? 'checked' : 'value'}
                rules={
                  field.required && field.type !== 'switch'
                    ? [{ required: true, message: t('common.required') }]
                    : undefined
                }
              >
                {renderControl(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
}
