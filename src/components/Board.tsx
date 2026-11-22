import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { Board as BoardType } from '../types';
import { Column } from './Column';
import { TaskCelebration } from './TaskCelebration';
import { randomCelebration } from '../features/taskCelebrations';
import { playCompletionFanfare } from '../features/completionFanfare';
import countdownAudio from '../assets/ready-set-go.mp3?inline';
import { getColumnRole } from '../state/defaults';
import { useI18n } from '../i18n/i18n';

const countdownLabels = ['Ready!', 'Set!', 'Go!'];

interface BoardProps {
  board: BoardType;
  onMoveTask: (taskId: string, columnId: string) => void;
}

export function Board({ board, onMoveTask }: BoardProps) {
  const { t } = useI18n();
  const activeCountdown = useRef<{ taskId: string; stop: () => void } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const stopFanfare = useRef<(() => void) | null>(null);
  const celebrationTimer = useRef<number>(undefined);
  const [celebration, setCelebration] = useState<{ variant: number; id: number } | null>(null);

  useEffect(() => () => {
    activeCountdown.current?.stop();
    stopFanfare.current?.();
    window.clearTimeout(celebrationTimer.current);
  }, []);
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const sensors = useSensors(pointerSensor);

  const columns = board.columns.slice().sort((a, b) => a.order - b.order);

  function clearCountdown() {
    activeCountdown.current?.stop();
    activeCountdown.current = null;
    setCountdown(null);
  }

  function startCountdown(taskId: string) {
    clearCountdown();
    stopFanfare.current?.();
    window.clearTimeout(celebrationTimer.current);
    setCelebration(null);

    const audio = new Audio(countdownAudio);
    let step = 0;
    setCountdown(step);
    const timer = window.setInterval(() => {
      step += 1;
      if (step === countdownLabels.length) clearCountdown();
      else setCountdown(step);
    }, 1000);

    activeCountdown.current = {
      taskId,
      stop: () => {
        window.clearInterval(timer);
        audio.pause();
      },
    };
    void audio.play().catch(() => {});
  }

  function moveTask(taskId: string, columnId: string) {
    const task = board.tasks.find((item) => item.id === taskId);
    const destination = columns.find((column) => column.id === columnId);
    if (!task || !destination || task.columnId === columnId) return;

    const role = getColumnRole(destination);
    if (role === 'in-progress') {
      startCountdown(taskId);
    } else if (role === 'done') {
      clearCountdown();
      stopFanfare.current?.();
      try {
        stopFanfare.current = playCompletionFanfare();
      } catch {
        stopFanfare.current = null;
      }
      window.clearTimeout(celebrationTimer.current);
      celebrationTimer.current = window.setTimeout(() => setCelebration(null), 5000);
      setCelebration({ variant: randomCelebration(), id: celebrationTimer.current });
    } else if (activeCountdown.current?.taskId === taskId) {
      clearCountdown();
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
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
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
      {countdown !== null && (
        <div className="task-countdown" role="status">
          <span key={countdown} data-step={countdown} dir="ltr">{countdownLabels[countdown]}</span>
        </div>
      )}
      {celebration && <TaskCelebration variant={celebration.variant} key={celebration.id} />}
      {board.tasks.length === 0 && <div className="board-empty">{t('board.empty')}</div>}
    </DndContext>
  );
}
