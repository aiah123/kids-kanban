import type { Column, Icon, Language, Space, SpaceTask } from '../types';

export type Action =
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'SET_ACTIVE_KID'; kidId: string }
  | { type: 'ADD_KID'; name: string; color: string }
  | { type: 'RENAME_KID'; kidId: string; name: string }
  | { type: 'SET_KID_COLOR'; kidId: string; color: string }
  | { type: 'REMOVE_KID'; kidId: string }
  | { type: 'ADD_COLUMN'; boardId: string; name: string; color: string }
  | {
      type: 'UPDATE_COLUMN';
      boardId: string;
      columnId: string;
      patch: Partial<Pick<Column, 'name' | 'color'>>;
    }
  | { type: 'REMOVE_COLUMN'; boardId: string; columnId: string }
  | { type: 'REORDER_COLUMNS'; boardId: string; columnIds: string[] }
  | { type: 'MOVE_TASK'; boardId: string; taskId: string; columnId: string }
  | { type: 'REMOVE_TASK'; boardId: string; taskId: string }
  | { type: 'ADD_SPACE'; name: string; color: string }
  | { type: 'UPDATE_SPACE'; spaceId: string; patch: Partial<Pick<Space, 'name' | 'color'>> }
  | { type: 'REMOVE_SPACE'; spaceId: string }
  | { type: 'ADD_SPACE_TASK'; spaceId: string; name: string; icon: Icon; color: string }
  | {
      type: 'UPDATE_SPACE_TASK';
      spaceId: string;
      taskId: string;
      patch: Partial<Pick<SpaceTask, 'name' | 'icon' | 'color'>>;
    }
  | { type: 'REMOVE_SPACE_TASK'; spaceId: string; taskId: string }
  | { type: 'APPLY_SPACE_TO_BOARD'; boardId: string; spaceId: string };
