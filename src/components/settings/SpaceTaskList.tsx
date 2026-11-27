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
    <div className="space-task-list">
      {tasks.map((task) => (
        <div key={task.id}>
          <div className="list-item">
            <button
              type="button"
              className="task-icon"
              style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'none' }}
              aria-label={`${t('icon.choose')}: ${task.name}`}
              aria-expanded={expandedTaskId === task.id}
              onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
            >
              {task.icon.type === 'emoji' ? task.icon.value : <img src={task.icon.value} alt="" />}
            </button>
            <input
              type="text"
              className="grow"
              aria-label={t('spaces.taskName')}
              value={task.name}
              onChange={(e) => onUpdate(task.id, { name: e.target.value })}
            />
            <input
              type="color"
              aria-label={t('spaces.color')}
              value={task.color}
              onChange={(e) => onUpdate(task.id, { color: e.target.value })}
            />
            <button type="button" className="btn danger square-control"
              aria-label={`${t('spaces.removeTask')}: ${task.name}`} title={t('spaces.removeTask')}
              onClick={() => {
              const message = t('spaces.confirmRemoveTask').replace('{name}', () => task.name || t('spaces.taskName'));
              if (window.confirm(message)) onRemove(task.id);
            }}>−</button>
          </div>
          {expandedTaskId === task.id && (
            <IconPicker value={task.icon} onChange={(icon) => onUpdate(task.id, { icon })} />
          )}
        </div>
      ))}

      <form className="form-row space-create task-create" onSubmit={(event) => {
        event.preventDefault();
        if (!newName.trim()) return;
        onAdd(newName.trim(), newIcon, newColor);
        setNewName('');
        setAddingIconOpen(false);
      }}>
        <button
          type="button"
          className="task-icon"
          style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'none' }}
          aria-label={t('icon.choose')}
          aria-expanded={addingIconOpen}
          onClick={() => setAddingIconOpen((v) => !v)}
        >
          {newIcon.type === 'emoji' ? newIcon.value : <img src={newIcon.value} alt="" />}
        </button>
        <input
          type="text"
          placeholder={t('spaces.taskPlaceholder')}
          aria-label={t('spaces.taskPlaceholder')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input type="color" aria-label={t('spaces.color')} value={newColor} onChange={(e) => setNewColor(e.target.value)} />
        <button className="btn square-control" aria-label={t('spaces.addTask')} title={t('spaces.addTask')} disabled={!newName.trim()}>+</button>
      </form>
      {addingIconOpen && <IconPicker value={newIcon} onChange={setNewIcon} />}
    </div>
  );
}
