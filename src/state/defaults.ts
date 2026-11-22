import type { AppState, Board, Column, Kid, Language, Space } from '../types';
import { makeId } from './id';

const COLUMN_TEXT: Record<Language, string[]> = {
  en: ['Not Started', 'In Progress', 'Done'],
  he: ['לא התחלתי', 'בתהליך', 'הושלם'],
};

const COLUMN_NAMES = COLUMN_TEXT.en.map((en, index) => ({ en, he: COLUMN_TEXT.he[index] }));

const COLUMN_COLORS = ['#fbbf24', '#60a5fa', '#4ade80'];

const KID_NAME: Record<Language, string> = {
  en: 'My Kid',
  he: 'הילד/ה שלי',
};

const KID_COLOR = '#f472b6';

interface SpaceSeed {
  name: Record<Language, string>;
  color: string;
  tasks: { name: Record<Language, string>; emoji: string; color: string }[];
}

const SPACE_SEEDS: SpaceSeed[] = [
  {
    name: { en: 'Morning Routine', he: 'שגרת בוקר' },
    color: '#fde68a',
    tasks: [
      { name: { en: 'Brush Teeth', he: 'לצחצח שיניים' }, emoji: '🦷', color: '#fde68a' },
      { name: { en: 'Get Dressed', he: 'להתלבש' }, emoji: '👕', color: '#fde68a' },
      { name: { en: 'Eat Breakfast', he: 'לאכול ארוחת בוקר' }, emoji: '🥣', color: '#fde68a' },
      { name: { en: 'Pack Bag', he: 'לארוז תיק' }, emoji: '🎒', color: '#fde68a' },
    ],
  },
  {
    name: { en: 'Afternoon Routine', he: 'שגרת אחר הצהריים' },
    color: '#c4b5fd',
    tasks: [
      { name: { en: 'Homework', he: 'שיעורי בית' }, emoji: '📚', color: '#c4b5fd' },
      { name: { en: 'Tidy Room', he: 'לסדר חדר' }, emoji: '🧹', color: '#c4b5fd' },
      { name: { en: 'Play Time', he: 'זמן משחק' }, emoji: '🎮', color: '#c4b5fd' },
      { name: { en: 'Shower', he: 'מקלחת' }, emoji: '🚿', color: '#c4b5fd' },
    ],
  },
];

const SPACE_NAMES = SPACE_SEEDS.map((seed) => seed.name);
const TASK_NAMES = SPACE_SEEDS.flatMap((seed) => seed.tasks.map((task) => task.name));

function translateName<T extends { name: string }>(
  item: T,
  names: Record<Language, string>[],
  language: Language,
): T {
  const otherLanguage = language === 'he' ? 'en' : 'he';
  const match = names.find((name) => name[otherLanguage] === item.name);
  return match ? { ...item, name: match[language] } : item;
}

export function localizeRoutineNames(
  state: AppState,
  language: Language = state.settings.language,
): AppState {
  return {
    ...state,
    settings: {
      ...state.settings,
      language,
      defaultColumns: state.settings.defaultColumns.map((column) => translateName(column, COLUMN_NAMES, language)),
    },
    spaces: state.spaces.map((space) => ({
      ...translateName(space, SPACE_NAMES, language),
      tasks: space.tasks.map((task) => translateName(task, TASK_NAMES, language)),
    })),
    boards: state.boards.map((board) => ({
      ...board,
      columns: board.columns.map((column) => translateName(column, COLUMN_NAMES, language)),
      tasks: board.tasks.map((task) => translateName(task, TASK_NAMES, language)),
    })),
  };
}

export function detectLanguage(): Language {
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('he')
    ? 'he'
    : 'en';
}

export function getColumnRole(column: Column): Column['role'] {
  if (column.role) return column.role;

  const name = column.name.trim().toLowerCase();
  if (name === COLUMN_TEXT.en[1].toLowerCase() || name === COLUMN_TEXT.he[1]) return 'in-progress';
  if (name === COLUMN_TEXT.en[2].toLowerCase() || name === COLUMN_TEXT.he[2]) return 'done';
}

const DEFAULT_COLUMN_ROLES: Column['role'][] = [undefined, 'in-progress', 'done'];

export function makeDefaultColumns(language: Language): Column[] {
  return COLUMN_TEXT[language].map((name, i) => ({
    id: makeId(),
    name,
    color: COLUMN_COLORS[i],
    order: i,
    role: DEFAULT_COLUMN_ROLES[i],
  }));
}

export function makeDefaultSpaces(language: Language): Space[] {
  return SPACE_SEEDS.map((seed) => ({
    id: makeId(),
    name: seed.name[language],
    color: seed.color,
    tasks: seed.tasks.map((t) => ({
      id: makeId(),
      name: t.name[language],
      icon: { type: 'emoji' as const, value: t.emoji },
      color: t.color,
    })),
  }));
}

export function makeDefaultState(): AppState {
  const language = detectLanguage();
  const defaultColumns = makeDefaultColumns(language);

  const board: Board = {
    id: makeId(),
    name: 'Board',
    columns: defaultColumns.map((c) => ({ ...c })),
    tasks: [],
  };

  const kid: Kid = {
    id: makeId(),
    name: KID_NAME[language],
    color: KID_COLOR,
    boardId: board.id,
  };

  return {
    kids: [kid],
    boards: [board],
    spaces: makeDefaultSpaces(language),
    settings: {
      language,
      defaultColumns,
    },
    activeKidId: kid.id,
  };
}
