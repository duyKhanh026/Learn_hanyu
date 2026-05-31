export default function Navigation({ onPrev, onNext, onRandom, onFlip, currentIndex, total }) {
  return (
    <div className="navigation">
      <div className="nav-buttons">
        <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={total === 0}>
          ← Previous
        </button>
        <button type="button" className="btn btn-primary" onClick={onFlip} disabled={total === 0}>
          Flip
        </button>
        <button type="button" className="btn btn-secondary" onClick={onNext} disabled={total === 0}>
          Next →
        </button>
        <button type="button" className="btn btn-accent" onClick={onRandom} disabled={total === 0}>
          Random
        </button>
      </div>
      <p className="nav-counter">
        {total > 0 ? `${currentIndex + 1} / ${total}` : '0 / 0'}
      </p>
      <p className="keyboard-hints">
        <kbd>←</kbd> <kbd>→</kbd> điều hướng · <kbd>Space</kbd> lật · <kbd>R</kbd> random
      </p>
    </div>
  );
}
