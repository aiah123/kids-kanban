import { useState } from 'react';
import type { Icon, Space, SpaceTask } from '../../types';
import { useI18n } from '../../i18n/i18n';
import { SpaceTaskList } from './SpaceTaskList';

interface SpacesEditorProps {
  spaces: Space[];
  onAddSpace: (name: string, color: string) => void;
  onUpdateSpace: (spaceId: string, patch: Partial<Pick<Space, 'name' | 'color'>>) => void;
  onRemoveSpace: (spaceId: string) => void;
  onAddTask: (spaceId: string, name: string, icon: Icon, color: string) => void;
  onUpdateTask: (spaceId: string, taskId: string, patch: Partial<Pick<SpaceTask, 'name' | 'icon' | 'color'>>) => void;
  onRemoveTask: (spaceId: string, taskId: string) => void;
}

export function SpacesEditor({
  spaces, onAddSpace, onUpdateSpace, onRemoveSpace, onAddTask, onUpdateTask, onRemoveTask,
}: SpacesEditorProps) {
  const { t } = useI18n();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#bae6fd');

  return (
    <div>
      <form className="form-row space-create" onSubmit={(event) => {
        event.preventDefault();
        if (!newName.trim()) return;
        onAddSpace(newName.trim(), newColor);
        setNewName('');
      }}>
        <input type="text" placeholder={t('spaces.addPlaceholder')} aria-label={t('spaces.addPlaceholder')}
          value={newName} onChange={(event) => setNewName(event.target.value)} />
        <input type="color" aria-label={t('spaces.color')} value={newColor}
          onChange={(event) => setNewColor(event.target.value)} />
        <button className="btn square-control" aria-label={t('spaces.add')} title={t('spaces.add')} disabled={!newName.trim()}>+</button>
      </form>

      {spaces.map((space) => (
        <div className="space-editor" key={space.id}>
          <button type="button" className="btn danger square-control space-remove"
            aria-label={`${t('spaces.remove')}: ${space.name}`} title={t('spaces.remove')}
            onClick={() => {
              const message = t('spaces.confirmRemove').replace('{name}', () => space.name || t('spaces.name'));
              if (window.confirm(message)) onRemoveSpace(space.id);
            }}>−</button>
          <details>
            <summary>
              <span className="space-disclosure" aria-hidden="true">▸</span>
              <span className="space-color" style={{ backgroundColor: space.color }} aria-hidden="true" />
              <span>{space.name || t('spaces.name')}</span>
            </summary>
            <div className="space-editor-body">
              <div className="form-row space-create">
                <input type="text" aria-label={t('spaces.name')} value={space.name}
                  onChange={(event) => onUpdateSpace(space.id, { name: event.target.value })} />
                <input type="color" aria-label={t('spaces.color')} value={space.color}
                  onChange={(event) => onUpdateSpace(space.id, { color: event.target.value })} />
              </div>
              <SpaceTaskList
                tasks={space.tasks}
                onAdd={(name, icon, color) => onAddTask(space.id, name, icon, color)}
                onUpdate={(taskId, patch) => onUpdateTask(space.id, taskId, patch)}
                onRemove={(taskId) => onRemoveTask(space.id, taskId)}
              />
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
