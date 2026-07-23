import { useState } from 'react';
import type { Icon, SpaceTask } from '../../types';
import { useI18n } from '../../i18n/i18n';
import { IconPicker } from './IconPicker';

interface SpaceTaskListProps {
  tasks: SpaceTask[];
  onAdd: (name: string, icon: Icon, color: string) => void;
  onUpdate: (taskId: string, patch: Partial<Pick<SpaceTask, 'name' | 'icon' | 'color'>>) => void;
  onRemove: (taskId: string) => void;
}

export function SpaceTaskList({ tasks, onAdd, onUpdate, onRemove }: SpaceTaskListProps) {
  const { t } = useI18n();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState<Icon>({ type: 'emoji', value: '⭐' });
  const [newColor, setNewColor] = useState('#a5f3fc');
  const [addingIconOpen, setAddingIconOpen] = useState(false);

  return (
    <div style={{ marginInlineStart: 12 }}>
      {tasks.map((task) => (
        <div key={task.id}>
          <div className="list-item">
            <button
              type="button"
              className="task-icon"
              style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'none' }}
              onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
            >
              {task.icon.type === 'emoji' ? task.icon.value : <img src={task.icon.value} alt="" />}
            </button>
            <input
              type="text"
              className="grow"
              value={task.name}
              onChange={(e) => onUpdate(task.id, { name: e.target.value })}
            />
            <input
              type="color"
              value={task.color}
              onChange={(e) => onUpdate(task.id, { color: e.target.value })}
            />
            <button className="btn danger" onClick={() => onRemove(task.id)}>
              {t('columns.remove')}
            </button>
          </div>
          {expandedTaskId === task.id && (
            <IconPicker value={task.icon} onChange={(icon) => onUpdate(task.id, { icon })} />
          )}
        </div>
      ))}

      <div className="form-row" style={{ marginBlockStart: 12, alignItems: 'flex-start' }}>
        <button
          type="button"
          className="task-icon"
          style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'none' }}
          onClick={() => setAddingIconOpen((v) => !v)}
        >
          {newIcon.type === 'emoji' ? newIcon.value : <img src={newIcon.value} alt="" />}
        </button>
        <input
          type="text"
          placeholder={t('spaces.taskPlaceholder')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
        <button
          className="btn"
          onClick={() => {
            if (!newName.trim()) return;
            onAdd(newName.trim(), newIcon, newColor);
            setNewName('');
          }}
        >
          {t('spaces.addTask')}
        </button>
      </div>
      {addingIconOpen && <IconPicker value={newIcon} onChange={setNewIcon} />}
    </div>
  );
}
