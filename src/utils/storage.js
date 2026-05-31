export const STORAGE_KEY = 'learn-hanyu-state';

export const DEFAULT_SETTINGS = {
  darkMode: true,
  sortMode: 'random',
  currentIndex: 0,
  hanziOnlyMode: false,
  favoritesOnly: false,
  selectedTags: [],
  searchQuery: '',
  viewMode: 'flashcard',
  autoplayInterval: 5,
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function mergeWordsWithProgress(baseWords, progressMap = {}) {
  return baseWords.map((word) => {
    const progress = progressMap[word.id] || {};
    return {
      ...word,
      priority: progress.priority ?? word.priority,
      lastReviewed: progress.lastReviewed ?? word.lastReviewed,
      reviewCount: progress.reviewCount ?? word.reviewCount,
      favorite: progress.favorite ?? false,
      nextReviewDate: progress.nextReviewDate ?? null,
      difficultyScore: progress.difficultyScore ?? 0,
    };
  });
}

export function extractProgress(words) {
  const progressMap = {};
  for (const word of words) {
    progressMap[word.id] = {
      priority: word.priority,
      lastReviewed: word.lastReviewed,
      reviewCount: word.reviewCount,
      favorite: word.favorite ?? false,
      nextReviewDate: word.nextReviewDate ?? null,
      difficultyScore: word.difficultyScore ?? 0,
    };
  }
  return progressMap;
}
