import { useDroppable } from '@dnd-kit/core';
import type { BoardTask, Column as ColumnType } from '../types';
import { getColumnRole } from '../state/defaults';
import { TaskCard } from './TaskCard';
import { getContrastText } from '../utils/color';

interface ColumnProps {
  column: ColumnType;
  tasks: BoardTask[];
  columns: ColumnType[];
  onMoveTask: (taskId: string, columnId: string) => void;
}

export function Column({ column, tasks, columns, onMoveTask }: ColumnProps) {
  const inProgress = getColumnRole(column) === 'in-progress';
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div ref={setNodeRef} className={`column ${isOver ? 'column-drop-target' : ''}`}>
      <div
        className="column-header"
        style={{ background: column.color, color: getContrastText(column.color) }}
      >
        {column.name}
      </div>
      <div className="task-list">
        {tasks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              inProgress={inProgress}
              columns={columns}
              onMove={(columnId) => onMoveTask(task.id, columnId)}
            />
          ))}
      </div>
    </div>
  );
}
