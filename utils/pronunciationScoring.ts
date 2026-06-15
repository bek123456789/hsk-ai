function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\u3400-\u9fff]+/gu, "")
    .trim();
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, index) => [index]);
  for (let index = 1; index <= b.length; index += 1) matrix[0][index] = index;

  for (let row = 1; row <= a.length; row += 1) {
    for (let col = 1; col <= b.length; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(matrix[row - 1][col] + 1, matrix[row][col - 1] + 1, matrix[row - 1][col - 1] + cost);
    }
  }

  return matrix[a.length][b.length];
}

export function scorePronunciation(input: { targetHanzi: string; targetPinyin: string; recognizedText: string }) {
  const targetHanzi = normalize(input.targetHanzi);
  const targetPinyin = normalize(input.targetPinyin);
  const userSpeech = normalize(input.recognizedText);

  if (!userSpeech) return { score: 0, isCorrect: false, normalizedTarget: targetHanzi, normalizedUserSpeech: userSpeech };
  if (userSpeech.includes(targetHanzi) || targetHanzi.includes(userSpeech)) return { score: 96, isCorrect: true, normalizedTarget: targetHanzi, normalizedUserSpeech: userSpeech };
  if (userSpeech.includes(targetPinyin) || targetPinyin.includes(userSpeech)) return { score: 88, isCorrect: true, normalizedTarget: targetPinyin, normalizedUserSpeech: userSpeech };

  const hanziDistance = levenshtein(targetHanzi, userSpeech);
  const pinyinDistance = levenshtein(targetPinyin, userSpeech);
  const hanziScore = Math.max(0, 100 - Math.round((hanziDistance / Math.max(1, targetHanzi.length)) * 100));
  const pinyinScore = Math.max(0, 100 - Math.round((pinyinDistance / Math.max(1, targetPinyin.length)) * 100));
  const score = Math.max(hanziScore, pinyinScore);

  return {
    score,
    isCorrect: score >= 85,
    normalizedTarget: score === pinyinScore ? targetPinyin : targetHanzi,
    normalizedUserSpeech: userSpeech
  };
}

export function pronunciationFeedback(score: number, pinyin: string, language: "uz" | "ru") {
  if (language === "ru") {
    if (score >= 85) return `Отлично! Вы произнесли слово правильно. Правильное произношение: ${pinyin}.`;
    if (score >= 65) return `Хорошо, но немного улучшите тон. Правильное произношение: ${pinyin}.`;
    return `Слово распознано неправильно. Попробуйте ещё раз. Правильное произношение: ${pinyin}.`;
  }

  if (score >= 85) return `Zo‘r! So‘zni to‘g‘ri aytdingiz. To‘g‘ri talaffuz: ${pinyin}.`;
  if (score >= 65) return `Yaxshi, lekin ohangni biroz yaxshilang. To‘g‘ri talaffuz: ${pinyin}.`;
  return `Bu so‘z noto‘g‘ri eshitildi. Qayta urinib ko‘ring. To‘g‘ri talaffuz: ${pinyin}.`;
}
