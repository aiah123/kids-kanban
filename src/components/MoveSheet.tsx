import type { Column } from '../types';
import { useI18n } from '../i18n/i18n';

interface MoveSheetProps {
  columns: Column[];
  currentColumnId: string;
  onSelect: (columnId: string) => void;
  onClose: () => void;
}

export function MoveSheet({ columns, currentColumnId, onSelect, onClose }: MoveSheetProps) {
  const { t } = useI18n();

  return (
    <div className="popover-overlay" onClick={onClose}>
      <div className="popover-sheet" onClick={(e) => e.stopPropagation()}>
        <p style={{ fontWeight: 700, marginBlockEnd: 12 }}>{t('task.moveTo')}</p>
        {columns
          .filter((c) => c.id !== currentColumnId)
          .map((c) => (
            <button key={c.id} onClick={() => onSelect(c.id)} style={{ borderInlineStart: `6px solid ${c.color}` }}>
              {c.name}
            </button>
          ))}
        <button className="secondary" onClick={onClose} style={{ background: 'transparent', textAlign: 'center' }}>
          {t('task.cancel')}
        </button>
      </div>
    </div>
  );
}
