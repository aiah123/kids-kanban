import { useState } from 'react';
import type { Column } from '../../types';
import { useI18n } from '../../i18n/i18n';

interface ColumnsEditorProps {
  columns: Column[];
  onUpdate: (columnId: string, patch: Partial<Pick<Column, 'name' | 'color'>>) => void;
  onRemove: (columnId: string) => void;
  onReorder: (columnIds: string[]) => void;
  onAdd: (name: string, color: string) => void;
}

export function ColumnsEditor({ columns, onUpdate, onRemove, onReorder, onAdd }: ColumnsEditorProps) {
  const { t } = useI18n();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#fbbf24');

  const sorted = columns.slice().sort((a, b) => a.order - b.order);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    onReorder(ids);
  }

  return (
    <div>
      {sorted.map((column, i) => (
        <div className="list-item" key={column.id}>
          <input
            type="text"
            className="grow"
            value={column.name}
            onChange={(e) => onUpdate(column.id, { name: e.target.value })}
          />
          <input
            type="color"
            value={column.color}
            onChange={(e) => onUpdate(column.id, { color: e.target.value })}
          />
          <button className="btn secondary" onClick={() => move(i, -1)} disabled={i === 0}>
            {t('columns.moveUp')}
          </button>
          <button
            className="btn secondary"
            onClick={() => move(i, 1)}
            disabled={i === sorted.length - 1}
          >
            {t('columns.moveDown')}
          </button>
          <button className="btn danger" onClick={() => onRemove(column.id)}>
            {t('columns.remove')}
          </button>
        </div>
      ))}
      <div className="form-row" style={{ marginBlockStart: 12 }}>
        <input
          type="text"
          placeholder={t('columns.addPlaceholder')}
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
          {t('columns.add')}
        </button>
      </div>
    </div>
  );
}
