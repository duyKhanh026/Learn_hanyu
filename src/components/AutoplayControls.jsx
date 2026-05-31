export default function AutoplayControls({
  playing,
  onToggle,
  interval,
  onIntervalChange,
  disabled,
}) {
  return (
    <div className="autoplay-controls">
      <button
        type="button"
        className={`btn btn-sm ${playing ? 'btn-danger' : 'btn-accent'}`}
        onClick={onToggle}
        disabled={disabled}
      >
        {playing ? '⏹ Dừng autoplay' : '▶ Autoplay'}
      </button>
      <label className="autoplay-interval">
        <span>Mỗi</span>
        <select
          value={interval}
          onChange={(e) => onIntervalChange(Number(e.target.value))}
          disabled={playing}
        >
          <option value={3}>3 giây</option>
          <option value={5}>5 giây</option>
          <option value={8}>8 giây</option>
          <option value={12}>12 giây</option>
          <option value={20}>20 giây</option>
        </select>
      </label>
    </div>
  );
}
