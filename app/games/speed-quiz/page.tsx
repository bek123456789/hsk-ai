"use client";

import { MiniGameRunner } from "@/components/MiniGameRunner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SpeedQuizGamePage() {
  return <ProtectedRoute><MiniGameRunner gameType="speed-quiz" /></ProtectedRoute>;
}
