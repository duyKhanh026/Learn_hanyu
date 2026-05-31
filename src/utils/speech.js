export function speakChinese(text) {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85;

  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(
    (v) => v.lang.startsWith('zh') || v.lang.includes('CN')
  );
  if (chineseVoice) utterance.voice = chineseVoice;

  window.speechSynthesis.speak(utterance);
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
