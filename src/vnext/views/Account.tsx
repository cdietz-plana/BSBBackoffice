import { useState } from 'react';
import { useVToast } from '../toast';

const FIELDS: { name: string; label: string; full?: boolean; disabled?: boolean }[] = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'email', label: 'Email', full: true },
  { name: 'phone', label: 'Telephone' },
  { name: 'account', label: 'User Account', disabled: true },
];

export function Account() {
  const toast = useVToast();
  const [values, setValues] = useState<Record<string, string>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    account: 'QATG003',
  });

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="vn-card vn-card-pad">
        <div className="vn-profile-head">
          <span className="av-lg">QA</span>
          <div>
            <div className="nm">QATG003</div>
            <div className="rl">Supervisor · iN Systems (Macao) Ltd.</div>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--vn-glass-border)', margin: '20px 0' }} />

        <div className="vn-form-2col">
          {FIELDS.map((f) => (
            <div key={f.name} className={`vn-field ${f.full ? 'full' : ''}`}>
              <label>{f.label}</label>
              <input
                className="vn-input"
                value={values[f.name] ?? ''}
                disabled={f.disabled}
                style={f.disabled ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
                onChange={(e) => set(f.name, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="vn-btn primary" onClick={() => toast('Profile saved', 'ok')}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
