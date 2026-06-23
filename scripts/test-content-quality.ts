import { hskListeningContent } from "../data/hsk/listening";
import { hskReadingContent } from "../data/hsk/reading";
import { hskSpeakingTasks } from "../data/hsk/speakingTasks";
import { hskExamSpeakingPrompts } from "../data/hsk/examSpeakingPrompts";
import { hskExamWritingPrompts } from "../data/hsk/examWritingPrompts";
import { hskCentralGrammar } from "../data/hsk/grammar";
import { hskQuizQuestions } from "../data/hsk/quizQuestions";
import { hskCentralExamQuestions } from "../data/hsk/examQuestions";
import { hskLessonCurriculum } from "../data/hsk/lessonCurriculum";
import { vocabularyEntries } from "../data/hsk/vocabulary";

const failures: string[] = [];
const hanzi = /[\u3400-\u9fff]/;
const pinyinTone = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹḿ]/i;
const neutralPinyin = new Set(["de", "ma", "ne", "zhe", "le", "zi", "men"]);
const malformedChinese = /(你要买不|不要我|买不|吗吗|，，|。。|？！|！？|undefined|null)/i;

function requireText(value: string | undefined, label: string, id: string) {
  if (!value || !value.trim()) failures.push(`${id}: ${label} bo‘sh`);
}

function checkChinese(value: string | undefined, label: string, id: string) {
  requireText(value, label, id);
  if (value && !hanzi.test(value)) failures.push(`${id}: ${label} hanzi emas`);
  if (value && malformedChinese.test(value)) failures.push(`${id}: ${label} shubhali xitoycha phrase`);
}

function checkPinyin(value: string | undefined, label: string, id: string) {
  requireText(value, label, id);
  if (value && !pinyinTone.test(value) && !value.split(/\s+/).every((part) => neutralPinyin.has(part.replace(/[^a-z]/gi, "").toLowerCase()))) {
    failures.push(`${id}: ${label} tone mark yo‘q`);
  }
}

function checkTranslations(uz: string | undefined, ru: string | undefined, id: string) {
  requireText(uz, "uz", id);
  requireText(ru, "ru", id);
  if (uz && /[А-Яа-яЁё]/.test(uz)) failures.push(`${id}: Uzbek matnida kirill bor`);
  if (ru && !/[А-Яа-яЁё]/.test(ru)) failures.push(`${id}: Russian matnida kirill ko‘rinmadi`);
}

function checkSpeakingKeywords(item: { id: string; textZh: string; sampleAnswerZh: string; keywordsZh: string[] }) {
  const combined = `${item.textZh}${item.sampleAnswerZh}`;
  for (const keyword of item.keywordsZh) {
    if (!combined.includes(keyword)) {
      failures.push(`${item.id}: speaking keyword prompt/sample bilan bog‘lanmagan: ${keyword}`);
    }
  }
  const dailyMatch = item.textZh.match(/要买([^，。]+)，不要([^，。]+)/);
  if (dailyMatch) {
    const [, wanted, rejected] = dailyMatch;
    if (!item.sampleAnswerZh.includes(wanted) || !item.sampleAnswerZh.includes(rejected)) {
      failures.push(`${item.id}: daily-situation sampleAnswerZh task-specific nounlarni ishlatmagan`);
    }
  }
}

function checkDuplicateIds(items: Array<{ id: string }>, label: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) failures.push(`${label}: duplicate id ${item.id}`);
    seen.add(item.id);
  }
}

function checkDuplicateField<T extends { id: string; level: number }>(items: T[], label: string, getValue: (item: T) => string | undefined) {
  const seen = new Map<string, string>();
  for (const item of items) {
    const value = getValue(item)?.replace(/\s+/g, "").toLowerCase();
    if (!value) continue;
    const key = `${item.level}:${value}`;
    const previous = seen.get(key);
    if (previous) failures.push(`${label}: duplicate content ${previous} va ${item.id}`);
    seen.set(key, item.id);
  }
}

checkDuplicateIds(vocabularyEntries, "vocabulary");
for (const word of vocabularyEntries) {
  checkChinese(word.hanzi, "hanzi", word.id);
  checkPinyin(word.pinyin, "pinyin", word.id);
  checkChinese(word.exampleZh, "exampleZh", word.id);
  checkPinyin(word.examplePinyin, "examplePinyin", word.id);
  checkTranslations(word.uz, word.ru, word.id);
  checkTranslations(word.exampleUz, word.exampleRu, word.id);
}

checkDuplicateIds(hskReadingContent, "reading");
checkDuplicateField(hskReadingContent, "reading passage", (item) => "passageZh" in item ? item.passageZh : undefined);
for (const item of hskReadingContent) {
  checkChinese(item.passageZh, "passageZh", item.id);
  checkPinyin(item.passagePinyin, "passagePinyin", item.id);
  checkTranslations(item.passageUz, item.passageRu, item.id);
  item.questions.forEach((question) => checkTranslations(question.questionUz, question.questionRu, question.id));
}

checkDuplicateIds(hskListeningContent, "listening");
checkDuplicateField(hskListeningContent, "listening transcript", (item) => "audioTextZh" in item ? item.audioTextZh : undefined);
for (const item of hskListeningContent) {
  checkChinese(item.audioTextZh, "audioTextZh", item.id);
  checkPinyin(item.audioTextPinyin, "audioTextPinyin", item.id);
  checkTranslations(item.transcriptUz, item.transcriptRu, item.id);
}

checkDuplicateIds(hskSpeakingTasks, "speaking");
for (const item of hskSpeakingTasks) {
  checkChinese(item.textZh, "textZh", item.id);
  checkPinyin(item.textPinyin, "textPinyin", item.id);
  checkChinese(item.sampleAnswerZh, "sampleAnswerZh", item.id);
  checkPinyin(item.sampleAnswerPinyin, "sampleAnswerPinyin", item.id);
  checkTranslations(item.textUz, item.textRu, item.id);
  if (!item.keywordsZh.length) failures.push(`${item.id}: speaking keywordsZh yo‘q`);
  checkSpeakingKeywords(item);
}

checkDuplicateIds(hskExamSpeakingPrompts, "exam speaking");
checkDuplicateIds(hskExamWritingPrompts, "exam writing");
for (const item of hskExamWritingPrompts) {
  checkChinese(item.sampleAnswerZh, "sampleAnswerZh", item.id);
  checkPinyin(item.sampleAnswerPinyin, "sampleAnswerPinyin", item.id);
  checkTranslations(item.sampleAnswerUz, item.sampleAnswerRu, item.id);
  if (!item.expectedKeywordsZh.length) failures.push(`${item.id}: expectedKeywordsZh yo‘q`);
}

checkDuplicateIds(hskCentralGrammar, "grammar");
checkDuplicateIds(hskQuizQuestions, "quiz");
checkDuplicateIds(hskCentralExamQuestions, "exam questions");
checkDuplicateIds(hskLessonCurriculum, "lesson curriculum");

if (failures.length) {
  console.error(`Content quality test xato: ${failures.length}`);
  failures.slice(0, 80).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Content quality: hanzi, pinyin, tarjima, duplicate va malformed phrase tekshiruvlari o‘tdi.");
