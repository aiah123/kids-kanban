import { useI18n } from '../../i18n/i18n';

export function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();
  return (
    <div className="tab-bar">
      <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>
        {t('language.english')}
      </button>
      <button className={language === 'he' ? 'active' : ''} onClick={() => setLanguage('he')}>
        {t('language.hebrew')}
      </button>
    </div>
  );
}
