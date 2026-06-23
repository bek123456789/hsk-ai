"use client";

import { Eye, EyeOff, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { HSKWord } from "@/types";
import { saveOptionalFeatureResult } from "@/utils/featureProgressSync";
import { useI18n } from "@/utils/i18n";
import { readLocalList } from "@/utils/localLearning";

type Point = { x: number; y: number };
type Stroke = Point[];
type SelfRating = "good" | "practice_more";

type WritingPracticeRecord = {
  id: string;
  wordId?: string;
  hanzi?: string;
  hskLevel?: number;
  selfRating: SelfRating;
  practiceCount: number;
  practicedAt: string;
};

type HanziWritingPadProps = {
  word?: Pick<HSKWord, "id" | "chinese" | "hskLevel">;
  onComplete?: (rating: SelfRating) => void;
};

const LOCAL_WRITING_KEY = "hanziflow_writing_practice";

function createRecordId(word?: Pick<HSKWord, "id" | "chinese">) {
  const base = word?.id ?? word?.chinese ?? "custom";
  return `${base}-${Date.now()}`;
}

export function HanziWritingPad({ word, onComplete }: HanziWritingPadProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [saving, setSaving] = useState(false);

  const hasDrawing = strokeCount > 0;

  const setupContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = rect.width < 420 ? 5 : 6;
    ctx.strokeStyle = "#241A14";
    return ctx;
  }, []);

  const redraw = useCallback(() => {
    const ctx = setupContext();
    if (!ctx) return;

    for (const stroke of strokesRef.current) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (const point of stroke.slice(1)) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }
  }, [setupContext]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    redraw();
    const observer = new ResizeObserver(() => redraw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const point = getPoint(event);
    isDrawingRef.current = true;
    lastPointRef.current = point;
    currentStrokeRef.current = [point];
    setMessage(null);
  };

  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current || !currentStrokeRef.current) return;
    event.preventDefault();

    const canvas = event.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const point = getPoint(event);
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = rect.width < 420 ? 5 : 6;
    ctx.strokeStyle = "#241A14";
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    currentStrokeRef.current.push(point);
    lastPointRef.current = point;
  };

  const stopDrawing = (event?: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    event?.preventDefault();

    const stroke = currentStrokeRef.current;
    if (stroke && stroke.length > 1) {
      strokesRef.current = [...strokesRef.current, stroke];
      setStrokeCount(strokesRef.current.length);
    }

    if (event?.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    isDrawingRef.current = false;
    lastPointRef.current = null;
    currentStrokeRef.current = null;
  };

  function clear() {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    lastPointRef.current = null;
    isDrawingRef.current = false;
    setStrokeCount(0);
    setMessage(null);
    redraw();
  }

  function undo() {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    setMessage(null);
    redraw();
  }

  async function savePractice(selfRating: SelfRating) {
    if (!hasDrawing) {
      setMessage(t("writing.tryFirst"));
      return;
    }

    setSaving(true);
    const practicedAt = new Date().toISOString();
    const previous = readLocalList<WritingPracticeRecord>(LOCAL_WRITING_KEY);
    const practiceCount = previous.filter((item) => item.wordId === word?.id || item.hanzi === word?.chinese).length + 1;
    const localItem: WritingPracticeRecord = {
      id: createRecordId(word),
      wordId: word?.id,
      hanzi: word?.chinese,
      hskLevel: word?.hskLevel,
      selfRating,
      practiceCount,
      practicedAt
    };

    await saveOptionalFeatureResult({
      localKey: LOCAL_WRITING_KEY,
      table: "writing_practice_results",
      localItem,
      supabasePayload: {
        word_id: word?.id,
        hanzi: word?.chinese,
        hsk_level: word?.hskLevel,
        self_rating: selfRating,
        practice_count: practiceCount,
        practiced_at: practicedAt
      }
    });

    setMessage(t("writing.saved"));
    setSaving(false);
    onComplete?.(selfRating);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-black text-ink">{t("writing.draw")}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGuide((value) => !value)}
            className="warm-focus inline-flex h-11 items-center gap-2 rounded-full bg-cream px-4 text-xs font-black text-stone-700 shadow-soft"
          >
            {showGuide ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showGuide ? t("writing.hideGuide") : t("writing.showGuide")}
          </button>
          <button
            type="button"
            onClick={undo}
            disabled={!hasDrawing}
            aria-label={t("writing.undo")}
            className="warm-focus flex h-11 w-11 items-center justify-center rounded-full bg-cream text-stone-600 shadow-soft disabled:opacity-40"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={!hasDrawing}
            aria-label={t("writing.clear")}
            className="warm-focus flex h-11 w-11 items-center justify-center rounded-full bg-cream text-stone-600 shadow-soft disabled:opacity-40"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="relative aspect-square w-full overflow-hidden rounded-[2rem] border-2 border-dashed border-orange-brand/35 bg-cream shadow-inner"
        aria-label={t("writing.drawingArea")}
      >
        {showGuide ? (
          <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2">
            <span className="border-r border-b border-orange-brand/20" />
            <span className="border-b border-orange-brand/20" />
            <span className="border-r border-orange-brand/20" />
            <span />
          </div>
        ) : null}
        {showGuide && word?.chinese ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-[28vw] font-black leading-none text-orange-brand/10 sm:text-[8rem]">
            {word.chinese}
          </div>
        ) : null}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none pointer-events-auto"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
        />
      </div>

      {message ? (
        <p className="mt-3 rounded-3xl bg-orange-soft px-4 py-3 text-sm font-black text-orange-deep">{message}</p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => savePractice("good")}
          disabled={saving}
          className="warm-focus rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-5 py-4 text-sm font-black text-white shadow-card disabled:opacity-60"
        >
          {t("writing.wroteWell")}
        </button>
        <button
          type="button"
          onClick={() => savePractice("practice_more")}
          disabled={saving}
          className="warm-focus rounded-full border border-orange-soft/80 bg-white/90 px-5 py-4 text-sm font-black text-ink shadow-soft disabled:opacity-60"
        >
          {t("writing.needPractice")}
        </button>
      </div>
    </div>
  );
}
