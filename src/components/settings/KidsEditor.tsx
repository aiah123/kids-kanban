import { useState } from 'react';
import type { Kid } from '../../types';
import { useI18n } from '../../i18n/i18n';

interface KidsEditorProps {
  kids: Kid[];
  onRename: (kidId: string, name: string) => void;
  onColor: (kidId: string, color: string) => void;
  onRemove: (kidId: string) => void;
  onAdd: (name: string, color: string) => void;
}

export function KidsEditor({ kids, onRename, onColor, onRemove, onAdd }: KidsEditorProps) {
  const { t } = useI18n();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#38bdf8');

  return (
    <div>
      {kids.map((kid) => (
        <div className="list-item" key={kid.id}>
          <input
            type="text"
            className="grow"
            value={kid.name}
            onChange={(e) => onRename(kid.id, e.target.value)}
          />
          <input
            type="color"
            value={kid.color}
            onChange={(e) => onColor(kid.id, e.target.value)}
          />
          <button
            className="btn danger"
            onClick={() => onRemove(kid.id)}
            disabled={kids.length <= 1}
          >
            {t('kids.remove')}
          </button>
        </div>
      ))}
      <div className="form-row" style={{ marginBlockStart: 12 }}>
        <input
          type="text"
          placeholder={t('kids.addPlaceholder')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
        <button
          className="btn"
          onClick={() => {
            if (!newName.trim()) return;
            onAdd(newName.trim(), newColor);
            setNewName('');
          }}
        >
          {t('kids.add')}
        </button>
      </div>
    </div>
  );
}
