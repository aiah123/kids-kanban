import { useRef, useState } from 'react';
import type { Icon } from '../../types';
import { useI18n } from '../../i18n/i18n';

const EMOJI_OPTIONS = [
  '🦷', '👕', '🥣', '🎒', '📚', '🧹', '🎮', '🚿', '🛏️', '🧦',
  '🧴', '🍎', '🥪', '💧', '🧸', '🐶', '🚲', '⚽', '🎨', '🎵',
  '📖', '✏️', '🧴', '🧻', '🧼', '👟', '🧥', '🪥', '🍽️', '🗑️',
  '🌟', '⏰', '🧺', '📺', '🛁', '🚪', '🌳', '☀️', '🌙', '✅',
];

interface IconPickerProps {
  value: Icon;
  onChange: (icon: Icon) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<'emoji' | 'image'>(value.type);
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
          {t('icon.emoji')}
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
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              type="button"
              key={emoji}
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
