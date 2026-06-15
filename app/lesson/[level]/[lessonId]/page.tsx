import { notFound } from "next/navigation";
import { LessonDetailExperience } from "@/components/LessonDetailExperience";
import { HskLevelGuard } from "@/components/HskLevelGuard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurriculumLesson } from "@/data/hsk/lessonCurriculum";
import type { HSKLevel } from "@/types";

export default async function LessonDetailPage({ params }: { params: Promise<{ level: string; lessonId: string }> }) {
  const { level: levelValue, lessonId } = await params;
  const level = Number(levelValue) as HSKLevel;
  if (![1, 2, 3, 4, 5, 6].includes(level)) notFound();
  const lesson = getCurriculumLesson(level, lessonId);
  if (!lesson) notFound();
  return <ProtectedRoute><HskLevelGuard level={level}><LessonDetailExperience lesson={lesson} /></HskLevelGuard></ProtectedRoute>;
}
