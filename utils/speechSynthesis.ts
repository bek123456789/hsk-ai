export function speakChinese(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { ok: false, reason: "unsupported" as const };
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("zh"));
  if (chineseVoice) utterance.voice = chineseVoice;
  utterance.lang = "zh-CN";
  utterance.rate = 0.86;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return { ok: true, reason: chineseVoice ? "voice" : "fallback" };
}
