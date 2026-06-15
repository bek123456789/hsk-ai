import { hskListeningContent } from "@/data/hsk/listening";
import { hskReadingContent } from "@/data/hsk/reading";
import { getExamSpeakingPrompts, type ExamSpeakingPrompt } from "@/data/hsk/examSpeakingPrompts";
import { getExamWritingPrompts, type ExamWritingPrompt } from "@/data/hsk/examWritingPrompts";
import type { HSKListeningPrompt, HSKReadingPassage } from "@/data/hsk/contentTypes";
import type { ExamSkill, HSKLevel } from "@/types";

export type HSKExamSection =
  | { id: "listening"; titleUz: string; titleRu: string; skill: "listening"; weight: 25; questions: HSKListeningPrompt[] }
  | { id: "reading"; titleUz: string; titleRu: string; skill: "reading"; weight: 25; questions: HSKReadingPassage[] }
  | { id: "speaking"; titleUz: string; titleRu: string; skill: "speaking"; weight: 25; prompts: ExamSpeakingPrompt[] }
  | { id: "writing"; titleUz: string; titleRu: string; skill: "writing"; weight: 25; prompts: ExamWritingPrompt[] };

export type HSKExamTemplate = {
  id: string;
  level: HSKLevel;
  titleUz: string;
  titleRu: string;
  descriptionUz: string;
  descriptionRu: string;
  passingScore: 80;
  estimatedMinutes: number;
  sections: HSKExamSection[];
};

const minutes: Record<HSKLevel, number> = { 1: 35, 2: 45, 3: 60, 4: 75, 5: 90, 6: 105 };

function buildTemplate(level: HSKLevel): HSKExamTemplate {
  const listening = hskListeningContent.filter((item) => item.level === level).slice(0, 4);
  const reading = hskReadingContent.filter((item) => item.level === level).slice(0, 4);
  return {
    id: `hsk-${level}-preparation-exam`,
    level,
    titleUz: `HSK ${level} tayyorgarlik imtihoni`,
    titleRu: `Экзамен для подготовки к HSK ${level}`,
    descriptionUz: "Tinglash, o‘qish, gapirish va yozish ko‘nikmalarini tekshiradigan original HSK uslubidagi imtihon.",
    descriptionRu: "Оригинальный экзамен в стиле HSK для проверки аудирования, чтения, говорения и письма.",
    passingScore: 80,
    estimatedMinutes: minutes[level],
    sections: [
      { id: "listening", titleUz: "Listening bo‘limi", titleRu: "Раздел аудирования", skill: "listening", weight: 25, questions: listening },
      { id: "reading", titleUz: "O‘qish bo‘limi", titleRu: "Раздел чтения", skill: "reading", weight: 25, questions: reading },
      { id: "speaking", titleUz: "Speaking bo‘limi", titleRu: "Раздел говорения", skill: "speaking", weight: 25, prompts: getExamSpeakingPrompts(level) },
      { id: "writing", titleUz: "Writing bo‘limi", titleRu: "Раздел письма", skill: "writing", weight: 25, prompts: getExamWritingPrompts(level) }
    ]
  };
}

export const hskExamTemplates = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).map(buildTemplate);

export function getExamTemplate(level: HSKLevel) {
  return hskExamTemplates.find((template) => template.level === level) ?? hskExamTemplates[0];
}

export function getExamSection(template: HSKExamTemplate, skill: ExamSkill) {
  return template.sections.find((section) => section.skill === skill);
}
