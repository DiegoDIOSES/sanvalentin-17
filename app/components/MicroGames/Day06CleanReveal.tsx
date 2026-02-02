"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Day06CleanReveal({
  coverColor = "#f4c5cf",
  message,
  subtitle,
  onReveal,
}: {
  coverColor?: string;
  message: string;
  subtitle?: string;
  onReveal?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [hint, setHint] = useState("Limpia todo el panel…");

  const THRESHOLD = 0.92; // casi todo

  const hintText = useMemo(() => {
    if (revealed) return "Listo 🤍";
    if (progress < 0.25) return "Empieza suave…";
    if (progress < 0.55) return "Sigue…";
    if (progress < 0.75) return "Ya casi…";
    if (progress < 0.88) return "Falta un poquito…";
    return "Solo un poco más…";
  }, [progress, revealed]);

  useEffect(() => setHint(hintText), [hintText]);

  // init canvas
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctxRef.current = ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // cover layer
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // subtle highlight
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.globalAlpha = 1;

      setProgress(0);
      setRevealed(false);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [coverColor]);

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !wrap || !ctx || revealed) return;

    const rect = wrap.getBoundingClientRect();
    const lx = clamp(x - rect.left, 0, rect.width);
    const ly = clamp(y - rect.top, 0, rect.height);

    // erase big brush
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(lx, ly, 34, 0, Math.PI * 2);
    ctx.fill();

    // measure progress (throttle-ish)
    // Nota: para evitar “paradas raras”, medimos en áreas grandes
    const img = ctx.getImageData(0, 0, rect.width, rect.height);
    const data = img.data;
    let cleared = 0;
    const step = 24; // sample
    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i] === 0) cleared++;
    }
    const total = Math.floor(data.length / (4 * step));
    const p = total > 0 ? cleared / total : 0;

    setProgress(p);

    if (p >= THRESHOLD && !revealed) {
      setRevealed(true);
      onReveal?.();
    }
  };

  // pointer handling
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let down = false;

    const onDown = (e: PointerEvent) => {
      down = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      scratchAt(e.clientX, e.clientY);
    };

    const onMove = (e: PointerEvent) => {
      if (!down) return;
      scratchAt(e.clientX, e.clientY);
    };

    const onUp = () => {
      down = false;
    };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [revealed]);

  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white shadow-soft overflow-hidden">
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-600">Carta</div>
          <div className="text-[11px] px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700">
            {Math.round(progress * 100)}%
          </div>
        </div>
      </div>

      <div className="px-4 md:px-5 pb-5">
        <div
          ref={wrapRef}
          className="relative rounded-[22px] border border-zinc-200 overflow-hidden h-[320px] md:h-[360px] bg-zinc-50"
        >
          {/* contenido debajo */}
          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="text-center max-w-xl">
              <div className="text-lg md:text-xl font-semibold text-zinc-900 whitespace-pre-line">
                {message}
              </div>
              {subtitle && (
                <div className="mt-3 text-sm text-zinc-600">{subtitle}</div>
              )}
            </div>
          </div>

          {/* overlay scratch */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none"
          />

          {/* hint */}
          <AnimatePresence>
            {!revealed && (
              <motion.div
                className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 px-4 py-2 text-[12px] text-zinc-700 shadow-soft">
                  {hint}
                </div>
                <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 px-4 py-2 text-[12px] text-zinc-700 shadow-soft">
                  Raspa ✨
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-3 text-[11px] text-zinc-600">
          Tip: en móvil usa el dedo; en PC, click y arrastra.
        </div>
      </div>
    </div>
  );
}