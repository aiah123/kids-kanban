export type Language = 'en' | 'he';

export interface Column {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Icon {
  type: 'emoji' | 'image';
  value: string; // emoji character, or a data URL for images
}

export interface SpaceTask {
  id: string;
  name: string;
  icon: Icon;
  color: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  tasks: SpaceTask[];
}

export interface BoardTask {
  id: string;
  spaceTaskId: string;
  name: string;
  icon: Icon;
  color: string;
  columnId: string;
  order: number;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  tasks: BoardTask[];
}

export interface Kid {
  id: string;
  name: string;
  color: string;
  boardId: string;
}

export interface Settings {
  language: Language;
  defaultColumns: Column[];
}

export interface AppState {
  kids: Kid[];
  boards: Board[];
  spaces: Space[];
  settings: Settings;
  activeKidId: string | null;
}
