import { useState } from 'react';
import { useStore } from '../../state/store';
import { useI18n } from '../../i18n/i18n';
import { KidsEditor } from './KidsEditor';
import { ColumnsEditor } from './ColumnsEditor';
import { SpacesEditor } from './SpacesEditor';
import { LanguageToggle } from './LanguageToggle';

type Tab = 'kids' | 'columns' | 'spaces' | 'language';

interface SettingsMenuProps {
  onClose: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { state, dispatch } = useStore();
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('kids');

  const activeKid = state.kids.find((k) => k.id === state.activeKidId) ?? state.kids[0];
  const activeBoard = state.boards.find((b) => b.id === activeKid?.boardId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{t('settings.title')}</h2>
          <button className="icon-button" onClick={onClose} aria-label={t('settings.close')}>
            ✕
          </button>
        </div>

        <div className="tab-bar">
          <button className={tab === 'kids' ? 'active' : ''} onClick={() => setTab('kids')}>
            {t('settings.tab.kids')}
          </button>
          <button className={tab === 'columns' ? 'active' : ''} onClick={() => setTab('columns')}>
            {t('settings.tab.columns')}
          </button>
          <button className={tab === 'spaces' ? 'active' : ''} onClick={() => setTab('spaces')}>
            {t('settings.tab.spaces')}
          </button>
          <button className={tab === 'language' ? 'active' : ''} onClick={() => setTab('language')}>
            {t('settings.tab.language')}
          </button>
        </div>

        {tab === 'kids' && (
          <KidsEditor
            kids={state.kids}
            onRename={(kidId, name) => dispatch({ type: 'RENAME_KID', kidId, name })}
            onColor={(kidId, color) => dispatch({ type: 'SET_KID_COLOR', kidId, color })}
            onRemove={(kidId) => dispatch({ type: 'REMOVE_KID', kidId })}
            onAdd={(name, color) => dispatch({ type: 'ADD_KID', name, color })}
          />
        )}

        {tab === 'columns' && activeBoard && (
          <ColumnsEditor
            columns={activeBoard.columns}
            onUpdate={(columnId, patch) =>
              dispatch({ type: 'UPDATE_COLUMN', boardId: activeBoard.id, columnId, patch })
            }
            onRemove={(columnId) =>
              dispatch({ type: 'REMOVE_COLUMN', boardId: activeBoard.id, columnId })
            }
            onReorder={(columnIds) =>
              dispatch({ type: 'REORDER_COLUMNS', boardId: activeBoard.id, columnIds })
            }
            onAdd={(name, color) =>
              dispatch({ type: 'ADD_COLUMN', boardId: activeBoard.id, name, color })
            }
          />
        )}

        {tab === 'spaces' && (
          <SpacesEditor
            spaces={state.spaces}
            onAddSpace={(name, color) => dispatch({ type: 'ADD_SPACE', name, color })}
            onUpdateSpace={(spaceId, patch) => dispatch({ type: 'UPDATE_SPACE', spaceId, patch })}
            onRemoveSpace={(spaceId) => dispatch({ type: 'REMOVE_SPACE', spaceId })}
            onAddTask={(spaceId, name, icon, color) =>
              dispatch({ type: 'ADD_SPACE_TASK', spaceId, name, icon, color })
            }
            onUpdateTask={(spaceId, taskId, patch) =>
              dispatch({ type: 'UPDATE_SPACE_TASK', spaceId, taskId, patch })
            }
            onRemoveTask={(spaceId, taskId) =>
              dispatch({ type: 'REMOVE_SPACE_TASK', spaceId, taskId })
            }
            onApply={(spaceId) =>
              activeBoard &&
              dispatch({ type: 'APPLY_SPACE_TO_BOARD', boardId: activeBoard.id, spaceId })
            }
          />
        )}

        {tab === 'language' && <LanguageToggle />}
      </div>
    </div>
  );
}
