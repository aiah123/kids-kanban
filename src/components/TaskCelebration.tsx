import { useI18n } from '../i18n/i18n';

import { celebrations } from '../features/taskCelebrations';

export function TaskCelebration({ variant }: { variant: number }) {
  const { t } = useI18n();
  const [icon, motion] = celebrations[variant];
  return (
    <div className="task-celebration" role="status">
      <span className={`celebration-icon celebration-${motion}`} aria-hidden="true">{icon}</span>
      {t('task.celebration')}
    </div>
  );
}
