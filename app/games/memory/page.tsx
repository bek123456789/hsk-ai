"use client";

import { MiniGameRunner } from "@/components/MiniGameRunner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MemoryGamePage() {
  return <ProtectedRoute><MiniGameRunner gameType="memory" /></ProtectedRoute>;
}
