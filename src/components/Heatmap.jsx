import { useMemo } from 'react';

function getWeeks(history, weeks = 12) {
  const result = [];
  const today = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    const week = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - w * 7 - d);
      const key = date.toISOString().slice(0, 10);
      week.push({ date: key, count: history[key] || 0 });
    }
    result.push(week);
  }

  return result;
}

function intensityClass(count) {
  if (count === 0) return 'level-0';
  if (count <= 2) return 'level-1';
  if (count <= 5) return 'level-2';
  if (count <= 10) return 'level-3';
  return 'level-4';
}

export default function Heatmap({ studyHistory }) {
  const weeks = useMemo(() => getWeeks(studyHistory), [studyHistory]);
  const totalDays = Object.keys(studyHistory).length;
  const totalReviews = Object.values(studyHistory).reduce((s, c) => s + c, 0);

  if (totalDays === 0) {
    return (
      <div className="heatmap-section">
        <h3>Lịch sử học</h3>
        <p className="empty-heatmap">Chưa có dữ liệu học. Bắt đầu ôn từ để xem heatmap!</p>
      </div>
    );
  }

  return (
    <div className="heatmap-section">
      <div className="heatmap-header">
        <h3>Lịch sử học</h3>
        <span className="heatmap-summary">{totalReviews} lần ôn · {totalDays} ngày</span>
      </div>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((day) => (
              <div
                key={day.date}
                className={`heatmap-cell ${intensityClass(day.count)}`}
                title={`${day.date}: ${day.count} lần ôn`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Ít</span>
        <div className="heatmap-cell level-0" />
        <div className="heatmap-cell level-1" />
        <div className="heatmap-cell level-2" />
        <div className="heatmap-cell level-3" />
        <div className="heatmap-cell level-4" />
        <span>Nhiều</span>
      </div>
    </div>
  );
}
