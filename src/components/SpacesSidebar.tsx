import type { Space } from '../types';
import { useI18n } from '../i18n/i18n';

interface SpacesSidebarProps {
  spaces: Space[];
  enabledIds: string[];
  boardName: string;
  onToggle: (id: string, enabled: boolean) => void;
  onClose: () => void;
}

export function SpacesSidebar({ spaces, enabledIds, boardName, onToggle, onClose }: SpacesSidebarProps) {
  const { t } = useI18n();

  return (
    <div className="modal-overlay spaces-overlay" onClick={onClose}>
      <aside className="spaces-sidebar" aria-labelledby="spaces-sidebar-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 id="spaces-sidebar-title">{t('spaces.onBoard')}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label={t('settings.close')}>×</button>
        </div>
        <p className="spaces-board-name">{boardName}</p>
        {spaces.length === 0 && <p>{t('spaces.empty')}</p>}
        {spaces.map((space) => (
          <label className="space-checkbox" key={space.id}>
            <input type="checkbox" checked={enabledIds.includes(space.id)}
              onChange={(event) => onToggle(space.id, event.target.checked)} />
            <span className="space-color" style={{ backgroundColor: space.color }} aria-hidden="true" />
            <span>{space.name}</span>
          </label>
        ))}
      </aside>
    </div>
  );
}
