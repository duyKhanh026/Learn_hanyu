import { useEffect } from 'react';

export function useKeyboardShortcuts({ onPrev, onNext, onFlip, onRandom, enabled = true }) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e) {
      if (e.target.matches('input, textarea, select')) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case ' ':
          e.preventDefault();
          onFlip();
          break;
        case 'r':
        case 'R':
          onRandom();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext, onFlip, onRandom, enabled]);
}
