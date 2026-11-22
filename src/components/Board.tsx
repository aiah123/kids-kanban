import { useEffect, useRef, useState } from 'react';
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
import { TaskCelebration } from './TaskCelebration';
import { randomCelebration } from '../features/taskCelebrations';
import { playTaskMusic } from '../features/taskMusic';
import { getColumnRole } from '../state/defaults';
import { useI18n } from '../i18n/i18n';

interface BoardProps {
  board: BoardType;
  onMoveTask: (taskId: string, columnId: string) => void;
}

export function Board({ board, onMoveTask }: BoardProps) {
  const { t } = useI18n();
  const music = useRef<{ taskId: string; stop: () => void } | null>(null);
  const celebrationTimer = useRef<number>(undefined);
  const [celebration, setCelebration] = useState<{ variant: number; id: number } | null>(null);

  useEffect(() => () => {
    music.current?.stop();
    window.clearTimeout(celebrationTimer.current);
  }, []);
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 8 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const columns = board.columns.slice().sort((a, b) => a.order - b.order);

  function moveTask(taskId: string, columnId: string) {
    const task = board.tasks.find((item) => item.id === taskId);
    const destination = columns.find((column) => column.id === columnId);
    if (!task || !destination || task.columnId === columnId) return;

    if (music.current?.taskId === taskId) {
      music.current.stop();
      music.current = null;
    }

    const role = getColumnRole(destination);
    if (role === 'in-progress') {
      music.current?.stop();
      try {
        music.current = { taskId, stop: playTaskMusic() };
      } catch {
        music.current = null;
      }
    } else if (role === 'done') {
      window.clearTimeout(celebrationTimer.current);
      celebrationTimer.current = window.setTimeout(() => setCelebration(null), 1150);
      setCelebration({ variant: randomCelebration(), id: celebrationTimer.current });
    }

    onMoveTask(taskId, columnId);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    moveTask(String(active.id), String(over.id));
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
            onMoveTask={moveTask}
          />
        ))}
      </div>
      {celebration && <TaskCelebration variant={celebration.variant} key={celebration.id} />}
      {board.tasks.length === 0 && <div className="board-empty">{t('board.empty')}</div>}
    </DndContext>
  );
}
