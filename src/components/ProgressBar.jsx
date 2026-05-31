import { computeStats } from '../utils/sorting';

export default function ProgressBar({ words }) {
  const { total, learned } = computeStats(words);
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span>Tiến độ học</span>
        <span className="progress-percent">{percent}%</span>
      </div>
      <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-detail">
        {learned} / {total} từ đã xem ít nhất 1 lần
      </p>
    </div>
  );
}
