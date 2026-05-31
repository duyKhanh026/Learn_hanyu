import { useState, useMemo, useCallback } from 'react';
import { speakChinese } from '../utils/speech';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizMode({ words, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = useMemo(() => {
    if (words.length < 4) return [];
    return shuffleArray(words).slice(0, Math.min(words.length, 20));
  }, [words]);

  const current = questions[questionIndex];

  const options = useMemo(() => {
    if (!current) return [];
    const others = words.filter((w) => w.id !== current.id);
    const distractors = shuffleArray(others).slice(0, 3);
    return shuffleArray([current, ...distractors]);
  }, [current, words]);

  const handleSelect = useCallback(
    (word) => {
      if (revealed) return;
      setSelected(word.id);
      setRevealed(true);
    },
    [revealed]
  );

  const handleNext = useCallback(() => {
    setSelected(null);
    setRevealed(false);
    if (questionIndex + 1 >= questions.length) {
      setQuestionIndex(0);
    } else {
      setQuestionIndex((i) => i + 1);
    }
    onNext?.();
  }, [questionIndex, questions.length, onNext]);

  if (words.length < 4) {
    return (
      <div className="quiz-mode empty">
        <p>Cần ít nhất 4 từ để chơi quiz mode.</p>
      </div>
    );
  }

  if (!current) return null;

  const isCorrect = selected === current.id;

  return (
    <div className="quiz-mode">
      <div className="quiz-question">
        <p className="quiz-label">Đoán Hanzi cho nghĩa:</p>
        <p className="quiz-meaning">{current.meaning}</p>
        <p className="quiz-pinyin-hint">Gợi ý pinyin: {current.pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '?')}</p>
      </div>

      <div className="quiz-options">
        {options.map((opt) => {
          let className = 'quiz-option';
          if (revealed) {
            if (opt.id === current.id) className += ' correct';
            else if (opt.id === selected) className += ' wrong';
          } else if (selected === opt.id) {
            className += ' selected';
          }

          return (
            <button
              key={opt.id}
              type="button"
              className={className}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
            >
              {opt.hanzi}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`quiz-result ${isCorrect ? 'correct' : 'wrong'}`}>
          <p>{isCorrect ? '✓ Chính xác!' : `✗ Đáp án: ${current.hanzi}`}</p>
          <p className="quiz-example">{current.examples?.[0]?.zh}</p>
          {current.examples?.[0]?.py && (
            <p className="quiz-example-py">{current.examples[0].py}</p>
          )}
          <div className="quiz-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                speakChinese(current.examples?.[0]?.zh || current.hanzi)
              }
            >
              🔊 {current.examples?.[0]?.zh ? 'Đọc ví dụ' : 'Phát âm'}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleNext}>
              Câu tiếp →
            </button>
          </div>
        </div>
      )}

      <p className="quiz-progress">
        Câu {questionIndex + 1} / {questions.length}
      </p>
    </div>
  );
}
