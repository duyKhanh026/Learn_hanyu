import { isDue } from './sorting';

function getWeight(word) {
  let weight = Math.max(1, word.priority);

  if (isDue(word)) weight *= 2.5;
  if (word.difficultyScore > 0) weight *= 1 + word.difficultyScore * 0.3;
  if (word.favorite) weight *= 1.2;

  return weight;
}

export function weightedRandomIndex(words) {
  if (words.length === 0) return -1;
  if (words.length === 1) return 0;

  const weights = words.map(getWeight);
  const total = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * total;

  for (let i = 0; i < words.length; i++) {
    random -= weights[i];
    if (random <= 0) return i;
  }

  return words.length - 1;
}

export function shuffleWithPriority(words) {
  const result = [];
  const pool = [...words];

  while (pool.length > 0) {
    const idx = weightedRandomIndex(pool);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return result;
}
