import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import baseWordsJson from '../../data/words.json';
import {
  loadState,
  saveState,
  mergeWordsWithProgress,
  extractProgress,
  todayISO,
  DEFAULT_SETTINGS,
} from '../utils/storage';
import { sortWords, filterWords, SORT_MODES } from '../utils/sorting';
import { weightedRandomIndex, shuffleWithPriority } from '../utils/random';
import { markRemembered, markHard } from '../utils/spacedRepetition';

export function useFlashcards() {
  const [baseWords, setBaseWords] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [studyHistory, setStudyHistory] = useState({});
  const [orderedIds, setOrderedIds] = useState([]);
  const initialized = useRef(false);

  useEffect(() => {
    try {
      const saved = loadState();
      const json = baseWordsJson;

      const progressMap = saved?.progressMap || {};
      const merged = mergeWordsWithProgress(json, progressMap);

      setBaseWords(json);
      setWords(merged);
      setStudyHistory(saved?.studyHistory || {});
      setSettings({ ...DEFAULT_SETTINGS, ...saved?.settings });
      setCurrentIndex(saved?.settings?.currentIndex ?? 0);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const filteredWords = useMemo(() => {
    return filterWords(words, {
      searchQuery: settings.searchQuery,
      selectedTags: settings.selectedTags,
      favoritesOnly: settings.favoritesOnly,
    });
  }, [words, settings.searchQuery, settings.selectedTags, settings.favoritesOnly]);

  const displayList = useMemo(() => {
    if (settings.sortMode === SORT_MODES.RANDOM) {
      if (orderedIds.length === 0) return filteredWords;
      const map = new Map(filteredWords.map((w) => [w.id, w]));
      const ordered = orderedIds.map((id) => map.get(id)).filter(Boolean);
      const missing = filteredWords.filter((w) => !orderedIds.includes(w.id));
      return [...ordered, ...missing];
    }
    return sortWords(filteredWords, settings.sortMode);
  }, [filteredWords, settings.sortMode, orderedIds]);

  useEffect(() => {
    if (!initialized.current && displayList.length > 0) {
      initialized.current = true;
      if (settings.sortMode === SORT_MODES.RANDOM) {
        const shuffled = shuffleWithPriority(filteredWords);
        setOrderedIds(shuffled.map((w) => w.id));
      }
    }
  }, [displayList.length, filteredWords, settings.sortMode]);

  useEffect(() => {
    if (currentIndex >= displayList.length && displayList.length > 0) {
      setCurrentIndex(0);
    }
  }, [displayList.length, currentIndex]);

  const currentWord = displayList[currentIndex] || null;

  const persist = useCallback(
    (newWords, newSettings, newHistory) => {
      saveState({
        settings: newSettings ?? settings,
        progressMap: extractProgress(newWords ?? words),
        studyHistory: newHistory ?? studyHistory,
      });
    },
    [settings, words, studyHistory]
  );

  const updateSettings = useCallback(
    (patch) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        persist(words, next, studyHistory);
        return next;
      });
    },
    [words, studyHistory, persist]
  );

  const updateWord = useCallback(
    (id, updater) => {
      setWords((prev) => {
        const next = prev.map((w) => (w.id === id ? updater(w) : w));
        persist(next, settings, studyHistory);
        return next;
      });
    },
    [settings, studyHistory, persist]
  );

  const recordStudyDay = useCallback(() => {
    const today = todayISO();
    setStudyHistory((prev) => {
      const next = { ...prev, [today]: (prev[today] || 0) + 1 };
      persist(words, settings, next);
      return next;
    });
  }, [words, settings, persist]);

  const goNext = useCallback(() => {
    if (displayList.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((i) => {
      const next = (i + 1) % displayList.length;
      updateSettings({ currentIndex: next });
      return next;
    });
  }, [displayList.length, updateSettings]);

  const goPrev = useCallback(() => {
    if (displayList.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((i) => {
      const next = (i - 1 + displayList.length) % displayList.length;
      updateSettings({ currentIndex: next });
      return next;
    });
  }, [displayList.length, updateSettings]);

  const goRandom = useCallback(() => {
    if (displayList.length === 0) return;
    setIsFlipped(false);
    const idx = weightedRandomIndex(displayList);
    setCurrentIndex(idx);
    updateSettings({ currentIndex: idx });
  }, [displayList, updateSettings]);

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const handleRemember = useCallback(() => {
    if (!currentWord) return;
    const today = todayISO();
    updateWord(currentWord.id, (w) => markRemembered(w, today));
    recordStudyDay();
    goNext();
  }, [currentWord, updateWord, recordStudyDay, goNext]);

  const handleHard = useCallback(() => {
    if (!currentWord) return;
    const today = todayISO();
    updateWord(currentWord.id, (w) => markHard(w, today));
    recordStudyDay();
    goNext();
  }, [currentWord, updateWord, recordStudyDay, goNext]);

  const toggleFavorite = useCallback(() => {
    if (!currentWord) return;
    updateWord(currentWord.id, (w) => ({ ...w, favorite: !w.favorite }));
  }, [currentWord, updateWord]);

  const changeSortMode = useCallback(
    (mode) => {
      if (mode === SORT_MODES.RANDOM) {
        const shuffled = shuffleWithPriority(filteredWords);
        setOrderedIds(shuffled.map((w) => w.id));
      } else {
        setOrderedIds([]);
      }
      setCurrentIndex(0);
      updateSettings({ sortMode: mode, currentIndex: 0 });
    },
    [filteredWords, updateSettings]
  );

  const importWords = useCallback(
    (jsonData) => {
      const progressMap = extractProgress(words);
      const merged = mergeWordsWithProgress(jsonData, progressMap);
      setBaseWords(jsonData);
      setWords(merged);
      setCurrentIndex(0);
      if (settings.sortMode === SORT_MODES.RANDOM) {
        const shuffled = shuffleWithPriority(merged);
        setOrderedIds(shuffled.map((w) => w.id));
      }
      persist(merged, { ...settings, currentIndex: 0 }, studyHistory);
    },
    [words, settings, studyHistory, persist]
  );

  const exportWords = useCallback(() => words, [words]);

  return {
    words,
    displayList,
    currentWord,
    currentIndex,
    isFlipped,
    loading,
    error,
    settings,
    studyHistory,
    totalWords: words.length,
    filteredCount: displayList.length,
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
  };
}
