"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Day06CleanReveal({
  coverColor = "#f4c5cf",
  message,
  subtitle,
  onReveal,
  backgroundImageSrc, // 👈 nueva: imagen de fondo (normal)
}: {
  coverColor?: string;
  message: string;
  subtitle?: string;
  onReveal?: () => void;
  backgroundImageSrc?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const W = 900;
  const H = 520;

  const messages = useMemo(
    () => ["Espera…", "Ya casi…", "Solo un poquito…", "Falta nada…"],
    [],
  );
  const [hint, setHint] = useState(messages[0]);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => {
      setHint((h) => {
        const idx = messages.indexOf(h);
        return messages[(idx + 1) % messages.length];
      });
    }, 1200);
    return () => window.clearInterval(id);
  }, [done, messages]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, W, H);

    // blend mode borrador
    ctx.globalCompositeOperation = "destination-out";

    setPct(0);
    setDone(false);
  }, [coverColor]);

  const calcPct = () => {
    const c = canvasRef.current;
    if (!c) return 0;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;

    const img = ctx.getImageData(0, 0, c.width, c.height);
    const data = img.data;

    let cleared = 0;
    // contamos alpha = 0 como limpio
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) cleared++;
    }
    const total = data.length / 4;
    return cleared / total;
  };

  const finish = () => {
    if (done) return;
    setDone(true);
    setPct(1);
    onReveal?.();
  };

  const eraseAt = (clientX: number, clientY: number) => {
    const c = canvasRef.current;
    const wrap = wrapRef.current;
    if (!c || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    const y = ((clientY - rect.top) / rect.height) * H;

    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, 42, 0, Math.PI * 2); // radio más grande y uniforme
    ctx.fill();

    const p = clamp(calcPct(), 0, 1);
    setPct(p);

    // ✅ auto-complete desde 90%
    if (p >= 0.9) finish();
  };

  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white shadow-soft overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-900">Carta</div>

        <div className="flex items-center gap-2">
          {!done && (
            <div className="text-xs text-zinc-600 rounded-full border border-zinc-200 px-3 py-1">
              {Math.round(pct * 100)}%
            </div>
          )}
          {!done && pct >= 0.85 && (
            <button
              onClick={finish}
              className="text-xs font-semibold rounded-full bg-zinc-900 text-white px-4 py-2"
            >
              Terminar ✨
            </button>
          )}
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        {/* Fondo: borroso mientras no termine */}
        <div className="absolute inset-0">
          {backgroundImageSrc ? (
            <img
              src={backgroundImageSrc}
              alt="fondo"
              className={`h-full w-full object-cover ${
                done ? "blur-0" : "blur-2xl"
              } transition-[filter] duration-500`}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-zinc-50 to-rose-50" />
          )}

          {/* capa suave para lectura */}
          <div className="absolute inset-0 bg-white/40" />
        </div>

        {/* Texto centrado */}
        <div className="absolute inset-0 grid place-items-center p-8">
          <div className="max-w-xl text-center">
            <div className="text-xl md:text-2xl font-semibold text-zinc-900 whitespace-pre-line leading-relaxed">
              {message}
            </div>
            {subtitle && (
              <div className="mt-3 text-sm text-zinc-700">{subtitle}</div>
            )}

            {!done && (
              <motion.div
                className="mt-6 text-sm font-semibold text-zinc-800"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {hint}
              </motion.div>
            )}
          </div>
        </div>

        {/* Canvas raspado */}
        {!done && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none"
            onPointerDown={(e) => {
              setDrawing(true);
              eraseAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!drawing) return;
              eraseAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => setDrawing(false)}
            onPointerCancel={() => setDrawing(false)}
          />
        )}
      </div>
    </div>
  );
}