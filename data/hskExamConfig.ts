import type { HSKLevel } from "@/types";
import { examStructure } from "@/utils/examGenerator";

export const hskExamConfig = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((level) => ({
  hskLevel: level,
  totalQuestions: examStructure[level].total,
  totalMinutes: examStructure[level].minutes,
  sections: {
    listening: examStructure[level].listening,
    reading: examStructure[level].reading,
    writing: examStructure[level].writing
  },
  passingScore: 70,
  labelUz: "HSK uslubidagi tayyorgarlik materiali",
  labelRu: "Тренировочный материал в формате HSK",
  disclaimerUz: "Bu rasmiy imtihon materiali emas. Bu HSK formatiga o‘xshash o‘quv va tayyorgarlik materiali.",
  disclaimerRu: "Это не официальный материал HSK. Это учебный и тренировочный материал в формате HSK."
}));

export function getHskExamConfig(level: HSKLevel) {
  return hskExamConfig.find((config) => config.hskLevel === level) ?? hskExamConfig[0];
}
