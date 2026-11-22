import { useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: () => T, restore: (value: T) => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? restore(JSON.parse(raw) as T) : initial();
    } catch {
      return initial();
    }
  });

  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, 200);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [key, value]);

  function saveAndReplace(next: T) {
    const restored = restore(next);
    localStorage.setItem(key, JSON.stringify(restored));
    window.clearTimeout(timeoutRef.current);
    setValue(restored);
  }

  return [value, setValue, saveAndReplace] as const;
}
