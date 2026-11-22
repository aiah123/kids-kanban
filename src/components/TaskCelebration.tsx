import type { CSSProperties } from 'react';
import { useI18n } from '../i18n/i18n';
import { celebrations } from '../features/taskCelebrations';

const colors = ['#fb7185', '#facc15', '#38bdf8', '#c084fc', '#4ade80'];
const bursts = Array.from({ length: 3 }, (_, burst) => (
  Array.from({ length: 12 }, (_, index) => {
    const angle = index * Math.PI / 6 + burst * 0.23;
    const radius = 54 + (index % 3) * 16;
    return {
      '--spark-x': `${Math.cos(angle) * radius}px`,
      '--spark-y': `${Math.sin(angle) * radius}px`,
      '--spark-color': colors[(index + burst) % colors.length],
    } as CSSProperties;
  })
));

export function TaskCelebration({ variant }: { variant: number }) {
  const { t } = useI18n();
  const [icon, motion] = celebrations[variant];
  return (
    <div className="task-celebration" role="status">
      <div className="celebration-stage" aria-hidden="true">
        {bursts.map((sparks, burst) => (
          <span key={burst} className="celebration-burst">
            {sparks.map((spark, index) => <i className="celebration-spark" key={index} style={spark} />)}
          </span>
        ))}
        <span className="celebration-dancer">
          <span className={`celebration-icon celebration-${motion}`}>{icon}</span>
        </span>
      </div>
      <span className="celebration-message">{t('task.celebration')}</span>
    </div>
  );
}
