import type { AppState, Board } from '../types';
import type { Action } from './actions';
import { getColumnRole, localizeRoutineNames, makeDefaultColumns } from './defaults';
import { makeId } from './id';
import { addMissingSpaceTasks, belongsToSpace, getEnabledSpaceIds } from './boardSpaces';

function updateBoard(state: AppState, boardId: string, fn: (board: Board) => Board): AppState {
  return {
    ...state,
    boards: state.boards.map((b) => (b.id === boardId ? fn(b) : b)),
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return localizeRoutineNames(state, action.language);

    case 'SET_ACTIVE_KID':
      return { ...state, activeKidId: action.kidId };

    case 'ADD_KID': {
      const columns = makeDefaultColumns(state.settings.language);
      const board: Board = { id: makeId(), name: 'Board', columns, tasks: [] };
      const kid = { id: makeId(), name: action.name, color: action.color, boardId: board.id };
      return {
        ...state,
        boards: [...state.boards, board],
        kids: [...state.kids, kid],
        activeKidId: kid.id,
      };
    }

    case 'RENAME_KID':
      return {
        ...state,
        kids: state.kids.map((k) => (k.id === action.kidId ? { ...k, name: action.name } : k)),
      };

    case 'SET_KID_COLOR':
      return {
        ...state,
        kids: state.kids.map((k) => (k.id === action.kidId ? { ...k, color: action.color } : k)),
      };

    case 'REMOVE_KID': {
      const kid = state.kids.find((k) => k.id === action.kidId);
      if (!kid) return state;
      const remainingKids = state.kids.filter((k) => k.id !== action.kidId);
      return {
        ...state,
        kids: remainingKids,
        boards: state.boards.filter((b) => b.id !== kid.boardId),
        activeKidId:
          state.activeKidId === action.kidId
            ? (remainingKids[0]?.id ?? null)
            : state.activeKidId,
      };
    }

    case 'ADD_COLUMN':
      return updateBoard(state, action.boardId, (board) => {
        const column = { id: makeId(), name: action.name, color: action.color, order: board.columns.length };
        const updated = { ...board, columns: [...board.columns, column] };
        if (board.columns.length > 0) return updated;
        const enabled = getEnabledSpaceIds(board, state.spaces);
        return state.spaces.filter((space) => enabled.includes(space.id)).reduce(addMissingSpaceTasks, updated);
      });

    case 'UPDATE_COLUMN':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, ...action.patch, role: getColumnRole(c) } : c
        ),
      }));

    case 'REMOVE_COLUMN':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: board.columns
          .filter((c) => c.id !== action.columnId)
          .map((c, i) => ({ ...c, order: i })),
        tasks: board.tasks.filter((t) => t.columnId !== action.columnId),
      }));

    case 'REORDER_COLUMNS':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: action.columnIds
          .map((id, i) => {
            const col = board.columns.find((c) => c.id === id);
            return col ? { ...col, order: i } : null;
          })
          .filter((c): c is NonNullable<typeof c> => c !== null),
      }));

    case 'MOVE_TASK':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        tasks: board.tasks.map((t) =>
          t.id === action.taskId ? { ...t, columnId: action.columnId } : t
        ),
      }));

    case 'REMOVE_TASK':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        tasks: board.tasks.filter((t) => t.id !== action.taskId),
      }));

    case 'ADD_SPACE':
      return {
        ...state,
        spaces: [...state.spaces, { id: makeId(), name: action.name, color: action.color, tasks: [] }],
      };

    case 'UPDATE_SPACE':
      return {
        ...state,
        spaces: state.spaces.map((s) => (s.id === action.spaceId ? { ...s, ...action.patch } : s)),
      };

    case 'REMOVE_SPACE': {
      const space = state.spaces.find((item) => item.id === action.spaceId);
      if (!space) return state;
      return {
        ...state,
        spaces: state.spaces.filter((item) => item.id !== space.id),
        boards: state.boards.map((board) => ({
          ...board,
          enabledSpaceIds: board.enabledSpaceIds?.filter((id) => id !== space.id),
          tasks: board.tasks.filter((task) => !belongsToSpace(task, space)),
        })),
      };
    }

    case 'ADD_SPACE_TASK': {
      const space = state.spaces.find((item) => item.id === action.spaceId);
      if (!space) return state;
      const task = { id: makeId(), name: action.name, icon: action.icon, color: action.color };
      const updated = { ...space, tasks: [...space.tasks, task] };
      return {
        ...state,
        spaces: state.spaces.map((item) => item.id === space.id ? updated : item),
        boards: state.boards.map((board) => getEnabledSpaceIds(board, state.spaces).includes(space.id)
          ? addMissingSpaceTasks(board, updated)
          : board),
      };
    }

    case 'UPDATE_SPACE_TASK':
    case 'REMOVE_SPACE_TASK': {
      const space = state.spaces.find((item) => item.id === action.spaceId);
      if (!space) return state;
      const matches = (task: Board['tasks'][number]) =>
        task.spaceTaskId === action.taskId && belongsToSpace(task, space);
      const removing = action.type === 'REMOVE_SPACE_TASK';
      return {
        ...state,
        spaces: state.spaces.map((item) => item.id !== space.id ? item : {
          ...item,
          tasks: removing
            ? item.tasks.filter((task) => task.id !== action.taskId)
            : item.tasks.map((task) => task.id === action.taskId ? { ...task, ...action.patch } : task),
        }),
        boards: state.boards.map((board) => ({
          ...board,
          enabledSpaceIds: getEnabledSpaceIds(board, state.spaces),
          tasks: removing
            ? board.tasks.filter((task) => !matches(task))
            : board.tasks.map((task) => matches(task) ? { ...task, ...action.patch } : task),
        })),
      };
    }

    case 'SET_BOARD_SPACE': {
      const space = state.spaces.find((item) => item.id === action.spaceId);
      if (!space) return state;
      return updateBoard(state, action.boardId, (board) => {
        const enabledSpaceIds = new Set(getEnabledSpaceIds(board, state.spaces));
        if (action.enabled) enabledSpaceIds.add(space.id);
        else enabledSpaceIds.delete(space.id);
        const updated = { ...board, enabledSpaceIds: [...enabledSpaceIds] };
        return action.enabled ? addMissingSpaceTasks(updated, space) : updated;
      });
    }

    default:
      return state;
  }
}
