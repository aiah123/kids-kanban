import type { Kid } from '../types';
import { getContrastText } from '../utils/color';

interface KidTabsProps {
  kids: Kid[];
  activeKidId: string | null;
  onSelect: (kidId: string) => void;
  onAdd: () => void;
}

export function KidTabs({ kids, activeKidId, onSelect, onAdd }: KidTabsProps) {
  return (
    <div className="kid-tabs">
      {kids.map((kid) => {
        const active = kid.id === activeKidId;
        return (
          <button
            key={kid.id}
            className={`kid-tab ${active ? 'active' : ''}`}
            style={active ? { background: kid.color, color: getContrastText(kid.color) } : undefined}
            onClick={() => onSelect(kid.id)}
          >
            {kid.name}
          </button>
        );
      })}
      <button className="kid-tab add" onClick={onAdd} aria-label="Add kid">
        +
      </button>
    </div>
  );
}
