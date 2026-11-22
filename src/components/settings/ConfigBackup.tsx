import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '../../i18n/i18n';
import { parseConfig, serializeConfig } from '../../state/configBackup';
import { useStore } from '../../state/store';
import type { AppState } from '../../types';

export function ConfigBackup() {
  const { state, restoreState } = useStore();
  const { t } = useI18n();
  const fileInput = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const [status, setStatus] = useState('');

  function exportConfig() {
    const file = new Blob([serializeConfig(state)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kids-kanban-config.json';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importConfig(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    setReading(true);
    setStatus('');
    try {
      let imported: AppState;
      try {
        imported = parseConfig(await file.text());
      } catch {
        setStatus('backup.invalid');
        return;
      }

      if (!window.confirm(t('backup.confirm'))) return;

      try {
        restoreState(imported);
        setStatus('backup.success');
      } catch {
        setStatus('backup.saveError');
      }
    } finally {
      setReading(false);
    }
  }

  return (
    <section>
      <p>{t('backup.description')}</p>
      <div className="tab-bar">
        <button type="button" onClick={exportConfig}>{t('backup.export')}</button>
        <button type="button" disabled={reading} onClick={() => fileInput.current?.click()}>
          {t('backup.import')}
        </button>
      </div>
      <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={importConfig} />
      <p role="status">{status && t(status)}</p>
    </section>
  );
}
