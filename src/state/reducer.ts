import type { AppState, Board, BoardTask } from '../types';
import type { Action } from './actions';
import { makeDefaultColumns } from './defaults';
import { makeId } from './id';

function updateBoard(state: AppState, boardId: string, fn: (board: Board) => Board): AppState {
  return {
    ...state,
    boards: state.boards.map((b) => (b.id === boardId ? fn(b) : b)),
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, settings: { ...state.settings, language: action.language } };

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
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: [
          ...board.columns,
          {
            id: makeId(),
            name: action.name,
            color: action.color,
            order: board.columns.length,
          },
        ],
      }));

    case 'UPDATE_COLUMN':
      return updateBoard(state, action.boardId, (board) => ({
        ...board,
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, ...action.patch } : c
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

    case 'REMOVE_SPACE':
      return { ...state, spaces: state.spaces.filter((s) => s.id !== action.spaceId) };

    case 'ADD_SPACE_TASK':
      return {
        ...state,
        spaces: state.spaces.map((s) =>
          s.id === action.spaceId
            ? {
                ...s,
                tasks: [
                  ...s.tasks,
                  { id: makeId(), name: action.name, icon: action.icon, color: action.color },
                ],
              }
            : s
        ),
      };

    case 'UPDATE_SPACE_TASK':
      return {
        ...state,
        spaces: state.spaces.map((s) =>
          s.id === action.spaceId
            ? {
                ...s,
                tasks: s.tasks.map((t) => (t.id === action.taskId ? { ...t, ...action.patch } : t)),
              }
            : s
        ),
      };

    case 'REMOVE_SPACE_TASK':
      return {
        ...state,
        spaces: state.spaces.map((s) =>
          s.id === action.spaceId ? { ...s, tasks: s.tasks.filter((t) => t.id !== action.taskId) } : s
        ),
      };

    case 'APPLY_SPACE_TO_BOARD': {
      const space = state.spaces.find((s) => s.id === action.spaceId);
      if (!space) return state;
      return updateBoard(state, action.boardId, (board) => {
        const firstColumnId = board.columns[0]?.id;
        if (!firstColumnId) return board;
        const startOrder = board.tasks.filter((t) => t.columnId === firstColumnId).length;
        const newTasks: BoardTask[] = space.tasks.map((st, i) => ({
          id: makeId(),
          spaceTaskId: st.id,
          name: st.name,
          icon: st.icon,
          color: st.color,
          columnId: firstColumnId,
          order: startOrder + i,
        }));
        return { ...board, tasks: [...board.tasks, ...newTasks] };
      });
    }

    default:
      return state;
  }
}
