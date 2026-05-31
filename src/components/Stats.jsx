import { computeStats } from '../utils/sorting';

export default function Stats({ words }) {
  const stats = computeStats(words);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Tổng từ</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.learned}</span>
        <span className="stat-label">Đã học</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.unlearned}</span>
        <span className="stat-label">Chưa học</span>
      </div>
      <div className="stat-card highlight">
        <span className="stat-value">{stats.reviewedToday}</span>
        <span className="stat-label">Ôn hôm nay</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.dueToday}</span>
        <span className="stat-label">Cần ôn</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.favorites}</span>
        <span className="stat-label">Yêu thích</span>
      </div>
    </div>
  );
}
