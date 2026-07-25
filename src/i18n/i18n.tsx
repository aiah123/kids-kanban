import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { Language } from '../types';
import { useStore } from '../state/store';
import en from './en.json';
import he from './he.json';

const dictionaries: Record<Language, Record<string, string>> = { en, he };

interface I18nContextValue {
  language: Language;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  setLanguage: (language: Language) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useStore();
  const language = state.settings.language;
  const dir: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const t = (key: string) => dictionaries[language][key] ?? key;
  const setLanguage = (next: Language) => dispatch({ type: 'SET_LANGUAGE', language: next });

  return (
    <I18nContext.Provider value={{ language, dir, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
