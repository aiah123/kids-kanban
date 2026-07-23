import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { Board as BoardType } from '../types';
import { Column } from './Column';
import { useI18n } from '../i18n/i18n';

interface BoardProps {
  board: BoardType;
  onMoveTask: (taskId: string, columnId: string) => void;
}

export function Board({ board, onMoveTask }: BoardProps) {
  const { t } = useI18n();
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 8 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const columns = board.columns.slice().sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    onMoveTask(String(active.id), String(over.id));
  }

  if (columns.length === 0) {
    return <div className="board-empty">{t('board.empty')}</div>;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="board">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            columns={columns}
            tasks={board.tasks.filter((task) => task.columnId === column.id)}
            onMoveTask={onMoveTask}
          />
        ))}
      </div>
      {board.tasks.length === 0 && <div className="board-empty">{t('board.empty')}</div>}
    </DndContext>
  );
}
