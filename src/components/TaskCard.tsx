import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { BoardTask, Column } from '../types';
import { MoveSheet } from './MoveSheet';

interface TaskCardProps {
  task: BoardTask;
  columns: Column[];
  onMove: (columnId: string) => void;
}

export function TaskCard({ task, columns, onMove }: TaskCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    borderInlineStart: `6px solid ${task.color}`,
    opacity: isDragging ? 0.5 : 1,
    background: '#fff',
  };

  return (
    <>
      <button
        ref={setNodeRef}
        style={style}
        className="task-card"
        {...listeners}
        {...attributes}
        onClick={() => setSheetOpen(true)}
      >
        <span className="task-icon">
          {task.icon.type === 'emoji' ? (
            task.icon.value
          ) : (
            <img src={task.icon.value} alt="" />
          )}
        </span>
        <span>{task.name}</span>
      </button>
      {sheetOpen && (
        <MoveSheet
          columns={columns}
          currentColumnId={task.columnId}
          onSelect={(columnId) => {
            onMove(columnId);
            setSheetOpen(false);
          }}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}
