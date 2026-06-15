export function getStrokeSteps(hanzi: string) {
  const count = Math.max(3, Math.min(8, hanzi.length + 3));
  return Array.from({ length: count }, (_, index) => ({
    id: `${hanzi}-stroke-${index + 1}`,
    titleUz: `${index + 1}-qadam`,
    titleRu: `${index + 1}-шаг`,
    noteUz: "Chiziq tartibi ma’lumotlari tayyorlanmoqda. Hozircha yozish mashqi rejimida davom eting.",
    noteRu: "Данные порядка черт готовятся. Пока продолжайте в режиме практики письма."
  }));
}
