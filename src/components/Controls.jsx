import { SORT_MODES } from '../utils/sorting';

const SORT_OPTIONS = [
  { value: SORT_MODES.RANDOM, label: 'Random (ưu tiên priority)' },
  { value: SORT_MODES.NEWEST, label: 'Mới nhất → cũ nhất' },
  { value: SORT_MODES.OLDEST, label: 'Cũ nhất → mới nhất' },
  { value: SORT_MODES.PRIORITY, label: 'Priority cao trước' },
  { value: SORT_MODES.UNLEARNED, label: 'Chưa học trước' },
  { value: SORT_MODES.DUE, label: 'Ôn lại lâu chưa xem' },
];

export default function Controls({
  sortMode,
  onSortChange,
  hanziOnlyMode,
  onHanziOnlyToggle,
  favoritesOnly,
  onFavoritesToggle,
  viewMode,
  onViewModeChange,
  onRemember,
  onHard,
  hasWord,
}) {
  return (
    <div className="controls-panel">
      <div className="controls-row">
        <label className="control-label">
          Chế độ học
          <select value={sortMode} onChange={(e) => onSortChange(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control-label">
          Giao diện
          <select value={viewMode} onChange={(e) => onViewModeChange(e.target.value)}>
            <option value="flashcard">Flashcard</option>
            <option value="quiz">Quiz mode</option>
          </select>
        </label>
      </div>

      <div className="controls-row toggles">
        <label className="toggle-label">
          <input type="checkbox" checked={hanziOnlyMode} onChange={onHanziOnlyToggle} />
          Chỉ hiện Hanzi
        </label>
        <label className="toggle-label">
          <input type="checkbox" checked={favoritesOnly} onChange={onFavoritesToggle} />
          Chỉ yêu thích
        </label>
      </div>

      <div className="memory-buttons">
        <button
          type="button"
          className="btn btn-success"
          onClick={onRemember}
          disabled={!hasWord}
        >
          ✓ Đã nhớ
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onHard}
          disabled={!hasWord}
        >
          ✗ Khó nhớ
        </button>
      </div>
    </div>
  );
}
