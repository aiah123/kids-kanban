import type { Board, BoardTask, Space } from '../types';
import { makeId } from './id';

export function belongsToSpace(task: BoardTask, space: Space): boolean {
  return task.spaceId === undefined
    ? space.tasks.some((source) => source.id === task.spaceTaskId)
    : task.spaceId === space.id;
}

export function getEnabledSpaceIds(board: Board, spaces: Space[]): string[] {
  return board.enabledSpaceIds ?? spaces
    .filter((space) => board.tasks.some((task) => belongsToSpace(task, space)))
    .map((space) => space.id);
}

export function addMissingSpaceTasks(board: Board, space: Space): Board {
  const columnId = board.columns[0]?.id;
  if (!columnId) return board;

  const existingIds = new Set(board.tasks.filter((task) => belongsToSpace(task, space)).map((task) => task.spaceTaskId));
  const startOrder = board.tasks.reduce((order, task) =>
    task.columnId === columnId ? Math.max(order, task.order + 1) : order, 0);
  const tasks = space.tasks.filter((task) => !existingIds.has(task.id)).map((task, index): BoardTask => ({
    id: makeId(),
    spaceId: space.id,
    spaceTaskId: task.id,
    name: task.name,
    icon: task.icon,
    color: task.color,
    columnId,
    order: startOrder + index,
  }));
  return { ...board, tasks: [...board.tasks, ...tasks] };
}

export function getVisibleTasks(board: Board, spaces: Space[]): BoardTask[] {
  if (!board.enabledSpaceIds) return board.tasks;
  const enabled = new Set(board.enabledSpaceIds);
  const hiddenSpaces = spaces.filter((space) => !enabled.has(space.id));
  return board.tasks.filter((task) => !hiddenSpaces.some((space) => belongsToSpace(task, space)));
}
