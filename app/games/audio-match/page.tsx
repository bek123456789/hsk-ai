"use client";

import { MiniGameRunner } from "@/components/MiniGameRunner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AudioMatchGamePage() {
  return <ProtectedRoute><MiniGameRunner gameType="audio-match" /></ProtectedRoute>;
}
