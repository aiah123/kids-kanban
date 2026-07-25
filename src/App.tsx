import { useState } from 'react';
import { StoreProvider, useStore } from './state/store';
import { I18nProvider, useI18n } from './i18n/i18n';
import { KidTabs } from './components/KidTabs';
import { Board } from './components/Board';
import { SettingsMenu } from './components/settings/SettingsMenu';

function AppShell() {
  const { state, dispatch } = useStore();
  const { t } = useI18n();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const activeKid = state.kids.find((k) => k.id === state.activeKidId) ?? state.kids[0];
  const activeBoard = state.boards.find((b) => b.id === activeKid?.boardId);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">{t('app.title')}</h1>
        <button
          className="icon-button"
          onClick={() => setSettingsOpen(true)}
          aria-label={t('settings.open')}
        >
          ⚙️
        </button>
      </header>

      <KidTabs
        kids={state.kids}
        activeKidId={activeKid?.id ?? null}
        onSelect={(kidId) => dispatch({ type: 'SET_ACTIVE_KID', kidId })}
        onAdd={() => setSettingsOpen(true)}
      />

      {activeBoard && (
        <Board
          board={activeBoard}
          onMoveTask={(taskId, columnId) =>
            dispatch({ type: 'MOVE_TASK', boardId: activeBoard.id, taskId, columnId })
          }
        />
      )}

      {settingsOpen && <SettingsMenu onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <I18nProvider>
        <AppShell />
      </I18nProvider>
    </StoreProvider>
  );
}

export default App;
