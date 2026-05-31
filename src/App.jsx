import { useEffect, useCallback } from 'react';
import { useFlashcards } from './hooks/useFlashcards';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSwipe } from './hooks/useSwipe';
import { useAutoplay } from './hooks/useAutoplay';
import { getAllTags } from './utils/sorting';
import { preloadVoices } from './utils/speech';

import Header from './components/Header';
import Flashcard from './components/Flashcard';
import Navigation from './components/Navigation';
import Controls from './components/Controls';
import SearchFilter from './components/SearchFilter';
import Stats from './components/Stats';
import ProgressBar from './components/ProgressBar';
import ImportExport from './components/ImportExport';
import Heatmap from './components/Heatmap';
import QuizMode from './components/QuizMode';
import AutoplayControls from './components/AutoplayControls';
import StatsChart from './components/StatsChart';

export default function App() {
  const {
    words,
    displayList,
    currentWord,
    currentIndex,
    isFlipped,
    loading,
    error,
    settings,
    studyHistory,
    filteredCount,
    updateSettings,
    changeSortMode,
    goNext,
    goPrev,
    goRandom,
    flip,
    handleRemember,
    handleHard,
    toggleFavorite,
    importWords,
    exportWords,
    setIsFlipped,
  } = useFlashcards();

  useEffect(() => {
    preloadVoices();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light';
  }, [settings.darkMode]);

  const swipeRef = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  useKeyboardShortcuts({
    onPrev: goPrev,
    onNext: goNext,
    onFlip: flip,
    onRandom: goRandom,
    enabled: settings.viewMode === 'flashcard',
  });

  const autoplayTick = useCallback(() => {
    setIsFlipped(false);
    goNext();
  }, [goNext, setIsFlipped]);

  const { playing, toggle: toggleAutoplay, stop: stopAutoplay } = useAutoplay({
    enabled: settings.viewMode === 'flashcard',
    interval: settings.autoplayInterval,
    onTick: autoplayTick,
  });

  useEffect(() => {
    stopAutoplay();
  }, [settings.viewMode, stopAutoplay]);

  const allTags = getAllTags(words);

  function handleTagToggle(tag) {
    const selected = settings.selectedTags.includes(tag)
      ? settings.selectedTags.filter((t) => t !== tag)
      : [...settings.selectedTags, tag];
    updateSettings({ selectedTags: selected });
  }

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loader" />
        <p>Đang tải từ vựng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app error-screen">
        <p>Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        darkMode={settings.darkMode}
        onToggleTheme={() => updateSettings({ darkMode: !settings.darkMode })}
      />

      <main className="main-content">
        <aside className="sidebar">
          <Stats words={words} />
          <ProgressBar words={words} />
          <SearchFilter
            searchQuery={settings.searchQuery}
            onSearchChange={(q) => updateSettings({ searchQuery: q })}
            allTags={allTags}
            selectedTags={settings.selectedTags}
            onTagToggle={handleTagToggle}
            onClearTags={() => updateSettings({ selectedTags: [] })}
          />
          <Controls
            sortMode={settings.sortMode}
            onSortChange={changeSortMode}
            hanziOnlyMode={settings.hanziOnlyMode}
            onHanziOnlyToggle={() => updateSettings({ hanziOnlyMode: !settings.hanziOnlyMode })}
            favoritesOnly={settings.favoritesOnly}
            onFavoritesToggle={() => updateSettings({ favoritesOnly: !settings.favoritesOnly })}
            viewMode={settings.viewMode}
            onViewModeChange={(mode) => updateSettings({ viewMode: mode })}
            onRemember={handleRemember}
            onHard={handleHard}
            hasWord={!!currentWord}
          />
          <ImportExport onImport={importWords} onExport={exportWords} />
          <Heatmap studyHistory={studyHistory} />
          <StatsChart words={words} />
        </aside>

        <section className="flashcard-section">
          {settings.viewMode === 'flashcard' ? (
            <>
              <Flashcard
                word={currentWord}
                isFlipped={isFlipped}
                onFlip={flip}
                hanziOnlyMode={settings.hanziOnlyMode}
                onToggleFavorite={toggleFavorite}
                swipeRef={swipeRef}
              />
              <Navigation
                onPrev={goPrev}
                onNext={goNext}
                onRandom={goRandom}
                onFlip={flip}
                currentIndex={currentIndex}
                total={filteredCount}
              />
              <AutoplayControls
                playing={playing}
                onToggle={toggleAutoplay}
                interval={settings.autoplayInterval}
                onIntervalChange={(v) => updateSettings({ autoplayInterval: v })}
                disabled={filteredCount === 0}
              />
            </>
          ) : (
            <QuizMode words={displayList} />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Learn Hanyu — Dữ liệu lưu local, không cần server</p>
      </footer>
    </div>
  );
}
