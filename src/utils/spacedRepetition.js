const INTERVALS = [1, 2, 4, 7, 14, 30, 60];

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function markRemembered(word, today) {
  const reviewCount = (word.reviewCount || 0) + 1;
  const intervalIndex = Math.min(reviewCount - 1, INTERVALS.length - 1);
  const days = INTERVALS[intervalIndex];

  return {
    ...word,
    reviewCount,
    lastReviewed: today,
    nextReviewDate: addDays(today, days),
    priority: Math.max(1, (word.priority || 3) - 0.5),
    difficultyScore: Math.max(0, (word.difficultyScore || 0) - 1),
  };
}

export function markHard(word, today) {
  const reviewCount = (word.reviewCount || 0) + 1;

  return {
    ...word,
    reviewCount,
    lastReviewed: today,
    nextReviewDate: addDays(today, 1),
    priority: Math.min(5, (word.priority || 3) + 1),
    difficultyScore: (word.difficultyScore || 0) + 1,
  };
}

export function recordView(word, today) {
  return {
    ...word,
    lastReviewed: today,
    reviewCount: (word.reviewCount || 0) + 1,
  };
}
