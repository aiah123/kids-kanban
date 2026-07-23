import type { AppState, Board, Column, Kid, Language, Space } from '../types';
import { makeId } from './id';

const COLUMN_TEXT: Record<Language, string[]> = {
  en: ['Not Started', 'In Progress', 'Done'],
  he: ['לא התחלתי', 'בתהליך', 'הושלם'],
};

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

export function detectLanguage(): Language {
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('he')
    ? 'he'
    : 'en';
}

export function makeDefaultColumns(language: Language): Column[] {
  return COLUMN_TEXT[language].map((name, i) => ({
    id: makeId(),
    name,
    color: COLUMN_COLORS[i],
    order: i,
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
