import { todayISO } from './storage';

export const SORT_MODES = {
  RANDOM: 'random',
  NEWEST: 'newest',
  OLDEST: 'oldest',
  PRIORITY: 'priority',
  UNLEARNED: 'unlearned',
  DUE: 'due',
};

export function sortWords(words, mode) {
  const list = [...words];

  switch (mode) {
    case SORT_MODES.NEWEST:
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case SORT_MODES.OLDEST:
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case SORT_MODES.PRIORITY:
      return list.sort((a, b) => b.priority - a.priority || b.reviewCount - a.reviewCount);
    case SORT_MODES.UNLEARNED:
      return list.sort((a, b) => {
        const aLearned = a.reviewCount > 0 ? 1 : 0;
        const bLearned = b.reviewCount > 0 ? 1 : 0;
        return aLearned - bLearned || b.priority - a.priority;
      });
    case SORT_MODES.DUE:
      return list.sort((a, b) => {
        const aDue = isDue(a) ? 0 : 1;
        const bDue = isDue(b) ? 0 : 1;
        if (aDue !== bDue) return aDue - bDue;
        const aDate = a.lastReviewed ? new Date(a.lastReviewed) : new Date(0);
        const bDate = b.lastReviewed ? new Date(b.lastReviewed) : new Date(0);
        return aDate - bDate;
      });
    case SORT_MODES.RANDOM:
    default:
      return list;
  }
}

export function isDue(word) {
  const today = todayISO();
  if (!word.lastReviewed) return true;
  if (word.nextReviewDate && word.nextReviewDate <= today) return true;
  return false;
}

export function isReviewedToday(word) {
  return word.lastReviewed === todayISO();
}

export function filterWords(words, { searchQuery = '', selectedTags = [], favoritesOnly = false }) {
  const q = searchQuery.trim().toLowerCase();

  return words.filter((word) => {
    if (favoritesOnly && !word.favorite) return false;

    if (selectedTags.length > 0) {
      const hasTag = selectedTags.some((tag) => word.tags?.includes(tag));
      if (!hasTag) return false;
    }

    if (!q) return true;

    const haystack = [
      word.hanzi,
      word.pinyin,
      word.meaning,
      ...(word.examples?.flatMap((e) => [e.zh, e.vi]) || []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function getAllTags(words) {
  const tags = new Set();
  for (const word of words) {
    for (const tag of word.tags || []) {
      tags.add(tag);
    }
  }
  return [...tags].sort();
}

export function computeStats(words) {
  const today = todayISO();
  const total = words.length;
  const learned = words.filter((w) => w.reviewCount > 0).length;
  const unlearned = total - learned;
  const reviewedToday = words.filter((w) => w.lastReviewed === today).length;
  const dueToday = words.filter((w) => isDue(w)).length;
  const favorites = words.filter((w) => w.favorite).length;

  return { total, learned, unlearned, reviewedToday, dueToday, favorites };
}
