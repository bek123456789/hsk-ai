"use client";

import { MiniGameRunner } from "@/components/MiniGameRunner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MatchingGamePage() {
  return <ProtectedRoute><MiniGameRunner gameType="matching" /></ProtectedRoute>;
}
