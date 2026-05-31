import { speakChinese, speakChineseSequence } from '../utils/speech';

function PriorityBadge({ priority }) {
  const colors = ['', '#64748b', '#94a3b8', '#38bdf8', '#818cf8', '#a78bfa'];
  return (
    <span className="badge priority-badge" style={{ '--priority-color': colors[priority] || colors[3] }}>
      P{priority}
    </span>
  );
}

function TagList({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={tag} className="badge tag-badge">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Flashcard({
  word,
  isFlipped,
  onFlip,
  hanziOnlyMode,
  onToggleFavorite,
  swipeRef,
}) {
  if (!word) {
    return (
      <div className="flashcard empty-card">
        <p>Không có từ vựng phù hợp bộ lọc.</p>
      </div>
    );
  }

  function handleSpeakWord(e) {
    e.stopPropagation();
    speakChinese(word.hanzi);
  }

  function handleSpeakExample(e, zh) {
    e.stopPropagation();
    speakChinese(zh);
  }

  function handleSpeakAllExamples(e) {
    e.stopPropagation();
    speakChineseSequence(word.examples?.map((ex) => ex.zh) || []);
  }

  return (
    <div className="flashcard-wrapper" ref={swipeRef}>
      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''} ${hanziOnlyMode && !isFlipped ? 'hanzi-only' : ''}`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label="Lật flashcard"
        onKeyDown={(e) => e.key === 'Enter' && onFlip()}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face front">
            <button
              type="button"
              className={`favorite-btn ${word.favorite ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              aria-label="Yêu thích"
            >
              ★
            </button>
            <div className="hanzi-display">{word.hanzi}</div>
            <p className="tap-hint">
              {hanziOnlyMode && !isFlipped ? 'Nhấn để xem nghĩa' : 'Nhấn để lật card'}
            </p>
          </div>

          <div className="flashcard-face back">
            <button
              type="button"
              className={`favorite-btn ${word.favorite ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              aria-label="Yêu thích"
            >
              ★
            </button>
            <div className="hanzi-display small">{word.hanzi}</div>
            <p className="pinyin-display">{word.pinyin}</p>
            <p className="meaning-display">{word.meaning}</p>

            {word.examples?.length > 0 && (
              <div className="examples">
                <div className="examples-header">
                  <span className="examples-label">Ví dụ</span>
                  {word.examples.length > 1 && (
                    <button
                      type="button"
                      className="speak-example-btn speak-all-btn"
                      onClick={handleSpeakAllExamples}
                      title="Đọc tất cả ví dụ"
                    >
                      🔊 Tất cả
                    </button>
                  )}
                </div>
                {word.examples.map((ex, i) => (
                  <div key={i} className="example-item">
                    <div className="example-content">
                      <p className="example-zh">{ex.zh}</p>
                      {ex.py && <p className="example-py">{ex.py}</p>}
                      <p className="example-vi">{ex.vi}</p>
                    </div>
                    <button
                      type="button"
                      className="speak-example-btn"
                      onClick={(e) => handleSpeakExample(e, ex.zh)}
                      title="Đọc câu ví dụ"
                      aria-label="Đọc câu ví dụ"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="meta-row">
              <PriorityBadge priority={Math.round(word.priority)} />
              <span className="meta-item">Đã học: {word.reviewCount}x</span>
              <span className="meta-item">Thêm: {word.createdAt}</span>
              {word.lastReviewed && (
                <span className="meta-item">Ôn: {word.lastReviewed}</span>
              )}
            </div>

            <TagList tags={word.tags} />

            <div className="speak-actions">
              <button type="button" className="speak-btn" onClick={handleSpeakWord}>
                🔊 Phát âm từ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
