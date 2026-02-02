"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Day06OneMoreThing({
  open,
  imageSrc,
  onClose,
  onDone,
}: {
  open: boolean;
  imageSrc: string; // /images/day06-imanol.jpg
  onClose: () => void;
  onDone: () => void; // aquí marcas “consumido”
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const THRESHOLD = 0.93;

  const hint = useMemo(() => {
    if (revealed) return "Listo 🤍";
    if (progress < 0.25) return "Espera… aún falta descubrir algo más.";
    if (progress < 0.55) return "Ya casi…";
    if (progress < 0.75) return "Solo un poco más…";
    if (progress < 0.88) return "Falta un poquito…";
    return "Ya casi ya casi…";
  }, [progress, revealed]);

  useEffect(() => {
    if (!open) return;
    setProgress(0);
    setRevealed(false);
  }, [open]);

  // init canvas when open
  useEffect(() => {
    if (!open) return;

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const paint = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctxRef.current = ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // cover
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // soft tint
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "#f4c5cf";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.globalAlpha = 1;
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [open]);

  const scratchAt = (x: number, y: number) => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!wrap || !canvas || !ctx || revealed) return;

    const rect = wrap.getBoundingClientRect();
    const lx = clamp(x - rect.left, 0, rect.width);
    const ly = clamp(y - rect.top, 0, rect.height);

    // erase
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(lx, ly, 38, 0, Math.PI * 2);
    ctx.fill();

    // progress sample
    const img = ctx.getImageData(0, 0, rect.width, rect.height);
    const data = img.data;
    let cleared = 0;
    const step = 24;
    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i] === 0) cleared++;
    }
    const total = Math.floor(data.length / (4 * step));
    const p = total > 0 ? cleared / total : 0;
    setProgress(p);

    if (p >= THRESHOLD) {
      setRevealed(true);
      // consumimos inmediatamente
      onDone();
    }
  };

  useEffect(() => {
    if (!open) return;

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
  }, [open, revealed]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-xl rounded-[26px] bg-white shadow-soft overflow-hidden"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-zinc-600">Un último detalle</div>
                <div className="text-lg font-semibold text-zinc-900">
                  {revealed ? "Ya lo viste 🤍" : "Espera…"}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-2xl bg-zinc-900 text-white px-4 py-2 text-sm font-semibold"
              >
                Cerrar
              </button>
            </div>

            <div className="p-5">
              <div
                ref={wrapRef}
                className="relative rounded-[22px] border border-zinc-200 overflow-hidden h-[360px] bg-zinc-100"
              >
                {/* imagen de fondo (borrosa si no reveló) */}
                <img
                  src={imageSrc}
                  alt="Secreto"
                  className={[
                    "absolute inset-0 h-full w-full object-cover",
                    revealed ? "blur-0" : "blur-2xl",
                  ].join(" ")}
                />

                {/* overlay scratch */}
                {!revealed && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 touch-none"
                  />
                )}

                {/* mensaje overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                  <div className="rounded-2xl bg-white/85 backdrop-blur border border-white/60 px-4 py-2 text-[12px] text-zinc-800 shadow-soft">
                    {hint}
                  </div>
                  <div className="rounded-2xl bg-white/85 backdrop-blur border border-white/60 px-4 py-2 text-[12px] text-zinc-800 shadow-soft">
                    {Math.round(progress * 100)}%
                  </div>
                </div>

                {revealed && (
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-soft">
                      Se reveló 🤍
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 text-[11px] text-zinc-600">
                Raspa todo el panel para enfocarlo.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}