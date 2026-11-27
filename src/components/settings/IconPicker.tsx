import { useRef, useState } from 'react';
import type { Icon } from '../../types';
import diaper from '../../assets/task-icons/diaper.png?inline';
import washHands from '../../assets/task-icons/wash-hands.png?inline';
import { useI18n } from '../../i18n/i18n';

const drawings = [
  { label: 'icon.diaper', value: diaper },
  { label: 'icon.washHands', value: washHands },
];

const EMOJI_OPTIONS = [
  '📖', '📚', '✏️', '📝', '🎒', '📏', '✂️', '🖍️', '🎨', '🧩',
  '🪥', '🦷', '🧼', '🚿', '🛁', '🚽', '🧻', '🧴', '🪮', '🫧',
  '👕', '👖', '🧦', '👟', '🧥', '🧤', '🧣', '🧢', '👗', '🩴',
  '🥣', '🍳', '🥞', '🍞', '🥪', '🍚', '🍝', '🍽️', '🍴', '🥛',
  '🍎', '🍌', '🥕', '🥦', '💧', '🫗', '🧃', '🥗', '🍇', '🍓',
  '🛏️', '🧸', '🌙', '☀️', '⏰', '💤', '🪟', '🚪', '🔑', '🚌',
  '🧹', '🧺', '🗑️', '🧽', '🪴', '🐶', '🐈', '🐟', '🪣', '🧰',
  '🚲', '⚽', '🏀', '🛝', '🏊', '🎵', '🎮', '📺', '🌳', '🌟', '✅',
];

interface IconPickerProps {
  value: Icon;
  onChange: (icon: Icon) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<'emoji' | 'image'>(
    value.type === 'image' && !drawings.some((drawing) => drawing.value === value.value) ? 'image' : 'emoji',
  );
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ type: 'image', value: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="tab-bar">
        <button
          type="button"
          className={tab === 'emoji' ? 'active' : ''}
          onClick={() => setTab('emoji')}
        >
          {t('icon.library')}
        </button>
        <button
          type="button"
          className={tab === 'image' ? 'active' : ''}
          onClick={() => setTab('image')}
        >
          {t('icon.upload')}
        </button>
      </div>
      {tab === 'emoji' ? (
        <div className="emoji-grid">
          {drawings.map((drawing) => (
            <button type="button" key={drawing.label} aria-label={t(drawing.label)} title={t(drawing.label)}
              className={value.type === 'image' && value.value === drawing.value ? 'selected' : ''}
              onClick={() => onChange({ type: 'image', value: drawing.value })}>
              <img src={drawing.value} alt="" />
            </button>
          ))}
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              aria-label={emoji === '📖' ? t('icon.book') : undefined}
              className={value.type === 'emoji' && value.value === emoji ? 'selected' : ''}
              onClick={() => onChange({ type: 'emoji', value: emoji })}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
          {value.type === 'image' && (
            <div style={{ marginBlockStart: 8 }}>
              <img src={value.value} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
