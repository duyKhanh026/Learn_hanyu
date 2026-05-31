function getChineseVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.startsWith('zh') || v.lang.includes('CN'));
}

export function speakChinese(text) {
  if (!text || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85;

  const chineseVoice = getChineseVoice();
  if (chineseVoice) utterance.voice = chineseVoice;

  window.speechSynthesis.speak(utterance);
  return true;
}

/** Đọc lần lượt nhiều câu tiếng Trung */
export function speakChineseSequence(texts) {
  const list = texts.filter(Boolean);
  if (list.length === 0 || !('speechSynthesis' in window)) return false;

  window.speechSynthesis.cancel();
  const chineseVoice = getChineseVoice();
  let index = 0;

  function speakNext() {
    if (index >= list.length) return;

    const utterance = new SpeechSynthesisUtterance(list[index]);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;
    if (chineseVoice) utterance.voice = chineseVoice;

    utterance.onend = () => {
      index += 1;
      if (index < list.length) {
        setTimeout(speakNext, 400);
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNext();
  return true;
}

export function preloadVoices() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
