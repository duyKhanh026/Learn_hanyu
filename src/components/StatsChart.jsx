import { useMemo } from 'react';
import { getAllTags } from '../utils/sorting';

export default function StatsChart({ words }) {
  const tagData = useMemo(() => {
    const tags = getAllTags(words);
    return tags.map((tag) => {
      const tagged = words.filter((w) => w.tags?.includes(tag));
      const learned = tagged.filter((w) => w.reviewCount > 0).length;
      return {
        tag,
        total: tagged.length,
        learned,
        percent: tagged.length > 0 ? Math.round((learned / tagged.length) * 100) : 0,
      };
    });
  }, [words]);

  const priorityData = useMemo(() => {
    const buckets = [1, 2, 3, 4, 5].map((p) => ({
      priority: p,
      count: words.filter((w) => Math.round(w.priority) === p).length,
    }));
    const max = Math.max(...buckets.map((b) => b.count), 1);
    return buckets.map((b) => ({ ...b, height: (b.count / max) * 100 }));
  }, [words]);

  if (words.length === 0) return null;

  return (
    <div className="stats-chart-section">
      <h3>Thống kê theo tag</h3>
      <div className="tag-chart">
        {tagData.map(({ tag, total, learned, percent }) => (
          <div key={tag} className="tag-chart-row">
            <span className="tag-chart-label">{tag}</span>
            <div className="tag-chart-bar-wrap">
              <div className="tag-chart-bar" style={{ width: `${percent}%` }} />
            </div>
            <span className="tag-chart-stat">
              {learned}/{total} ({percent}%)
            </span>
          </div>
        ))}
      </div>

      <h3>Phân bố priority</h3>
      <div className="priority-chart">
        {priorityData.map(({ priority, count, height }) => (
          <div key={priority} className="priority-bar-col">
            <div className="priority-bar" style={{ height: `${height}%` }} title={`P${priority}: ${count} từ`} />
            <span className="priority-label">P{priority}</span>
            <span className="priority-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
