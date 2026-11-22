import type { AppState, Board, BoardTask, Column, Icon, Kid, Space, SpaceTask } from '../types';

const format = 'kids-kanban-config';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isList<T>(value: unknown, isItem: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(isItem);
}

function hasUniqueIds(items: { id: string }[]): boolean {
  return new Set(items.map((item) => item.id)).size === items.length;
}

function isNamedColor(value: unknown): value is Record<string, unknown> & {
  id: string;
  name: string;
  color: string;
} {
  return isRecord(value) && typeof value.id === 'string' && value.id.length > 0
    && typeof value.name === 'string' && typeof value.color === 'string';
}

function isColumn(value: unknown): value is Column {
  return isNamedColor(value) && Number.isFinite(value.order)
    && (value.role === undefined || value.role === 'in-progress' || value.role === 'done');
}

function isIcon(value: unknown): value is Icon {
  return isRecord(value) && typeof value.value === 'string'
    && (value.type === 'emoji' || (value.type === 'image' && /^data:[^,]*;base64,/i.test(value.value)));
}

function isSpaceTask(value: unknown): value is SpaceTask {
  return isNamedColor(value) && isIcon(value.icon);
}

function isSpace(value: unknown): value is Space {
  return isNamedColor(value) && isList(value.tasks, isSpaceTask) && hasUniqueIds(value.tasks);
}

function isBoardTask(value: unknown): value is BoardTask {
  return isNamedColor(value) && isIcon(value.icon) && typeof value.spaceTaskId === 'string'
    && typeof value.columnId === 'string' && Number.isFinite(value.order);
}

function isBoard(value: unknown): value is Board {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id
    || typeof value.name !== 'string' || !isList(value.columns, isColumn)
    || !isList(value.tasks, isBoardTask) || !hasUniqueIds(value.columns)
    || !hasUniqueIds(value.tasks)) return false;

  const columnIds = new Set(value.columns.map((column) => column.id));
  return value.tasks.every((task) => columnIds.has(task.columnId));
}

function isKid(value: unknown): value is Kid {
  return isNamedColor(value) && typeof value.boardId === 'string';
}

function isAppState(value: unknown): value is AppState {
  if (!isRecord(value) || !isList(value.kids, isKid) || !isList(value.boards, isBoard)
    || !isList(value.spaces, isSpace) || !hasUniqueIds(value.kids)
    || !hasUniqueIds(value.boards) || !hasUniqueIds(value.spaces)
    || !isRecord(value.settings)
    || (value.settings.language !== 'en' && value.settings.language !== 'he')
    || !isList(value.settings.defaultColumns, isColumn)
    || !hasUniqueIds(value.settings.defaultColumns)) return false;

  const boardIds = new Set(value.boards.map((board) => board.id));
  return value.kids.every((kid) => boardIds.has(kid.boardId))
    && (value.activeKidId === null || value.kids.some((kid) => kid.id === value.activeKidId));
}

export function serializeConfig(state: AppState): string {
  return JSON.stringify({ format, version: 1, state });
}

export function parseConfig(text: string): AppState {
  const backup: unknown = JSON.parse(text);
  if (!isRecord(backup) || backup.format !== format || backup.version !== 1
    || !isAppState(backup.state)) {
    throw new Error('Invalid Kids Kanban configuration');
  }
  return backup.state;
}
