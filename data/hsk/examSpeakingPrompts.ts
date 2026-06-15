import { hskSpeakingTasks } from "@/data/hsk/speakingTasks";
import type { HSKSpeakingTask } from "@/data/hsk/contentTypes";
import type { HSKLevel } from "@/types";

export type ExamSpeakingPrompt = HSKSpeakingTask & {
  examId: string;
};

export const hskExamSpeakingPrompts: ExamSpeakingPrompt[] = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) =>
  hskSpeakingTasks
    .filter((task) => task.level === level)
    .slice(0, 2)
    .map((task, index) => ({
      ...task,
      examId: `exam-speaking-hsk${level}-${String(index + 1).padStart(2, "0")}`
    }))
);

export function getExamSpeakingPrompts(level: HSKLevel) {
  return hskExamSpeakingPrompts.filter((prompt) => prompt.level === level);
}
