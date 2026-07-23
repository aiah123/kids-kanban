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
  onUpdateTask: (
    spaceId: string,
    taskId: string,
    patch: Partial<Pick<SpaceTask, 'name' | 'icon' | 'color'>>
  ) => void;
  onRemoveTask: (spaceId: string, taskId: string) => void;
  onApply: (spaceId: string) => void;
}

export function SpacesEditor({
  spaces,
  onAddSpace,
  onUpdateSpace,
  onRemoveSpace,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
  onApply,
}: SpacesEditorProps) {
  const { t } = useI18n();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#bae6fd');
  const [appliedFlash, setAppliedFlash] = useState<string | null>(null);

  return (
    <div>
      {spaces.map((space) => (
        <div
          key={space.id}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 12,
            marginBlockEnd: 14,
          }}
        >
          <div className="form-row">
            <input
              type="text"
              className="grow"
              value={space.name}
              onChange={(e) => onUpdateSpace(space.id, { name: e.target.value })}
            />
            <input
              type="color"
              value={space.color}
              onChange={(e) => onUpdateSpace(space.id, { color: e.target.value })}
            />
            <button
              className="btn"
              onClick={() => {
                onApply(space.id);
                setAppliedFlash(space.id);
                setTimeout(() => setAppliedFlash(null), 1200);
              }}
            >
              {appliedFlash === space.id ? t('spaces.applied') : t('spaces.apply')}
            </button>
            <button className="btn danger" onClick={() => onRemoveSpace(space.id)}>
              {t('spaces.remove')}
            </button>
          </div>

          <p style={{ fontWeight: 600, margin: '8px 0 4px' }}>{t('spaces.tasks')}</p>
          <SpaceTaskList
            tasks={space.tasks}
            onAdd={(name, icon, color) => onAddTask(space.id, name, icon, color)}
            onUpdate={(taskId, patch) => onUpdateTask(space.id, taskId, patch)}
            onRemove={(taskId) => onRemoveTask(space.id, taskId)}
          />
        </div>
      ))}

      <div className="form-row">
        <input
          type="text"
          placeholder={t('spaces.addPlaceholder')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
        <button
          className="btn"
          onClick={() => {
            if (!newName.trim()) return;
            onAddSpace(newName.trim(), newColor);
            setNewName('');
          }}
        >
          {t('spaces.add')}
        </button>
      </div>
    </div>
  );
}
