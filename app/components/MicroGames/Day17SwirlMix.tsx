"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Day17SwirlMix({ onWin }: { onWin: () => void }) {
  // objetivo: “swirl balanceado”
  const TARGET = 0.58;
  const TOL = 0.035;

  const [v, setV] = useState(0.2);
  const [won, setWon] = useState(false);
  const [strokes, setStrokes] = useState(0);

  const inRange = useMemo(() => Math.abs(v - TARGET) <= TOL, [v]);

  useEffect(() => {
    if (won) return;
    if (inRange && strokes >= 10) {
      setWon(true);
      onWin();
    }
  }, [inRange, strokes, won, onWin]);

  const reset = () => {
    setV(0.2);
    setWon(false);
    setStrokes(0);
  };

  const areaRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    if (won) return;
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    // x controla mezcla
    setV(x);
    setStrokes((s) => s + 1);
  };

  const choco = `hsl(25, 35%, ${clamp(28 + v * 8, 28, 36)}%)`;
  const mint = `hsl(155, 55%, ${clamp(72 - v * 10, 60, 72)}%)`;

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">
            Swirl perfecto
          </div>
          <div className="mt-1 text-sm text-zinc-700">
            Pasa el dedo dentro del helado para mezclar.
          </div>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div
          className={`text-[11px] px-3 py-1 rounded-full border ${
            won
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : inRange
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-zinc-200 text-zinc-600"
          }`}
        >
          {won ? "Perfecto ✨" : inRange ? "Vas bien… sigue" : "Mezcla…"}
        </div>

        <div className="text-xs text-zinc-600">
          Movimientos: <span className="font-semibold">{strokes}</span>
        </div>
      </div>

      <div className="mt-4 grid place-items-center">
        <div
          ref={areaRef}
          onPointerMove={onMove}
          onPointerDown={onMove}
          className="relative h-[260px] w-full max-w-sm rounded-[28px] border border-zinc-200 overflow-hidden touch-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-50" />

          {/* helado */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative h-44 w-44 rounded-full border border-zinc-200 bg-white overflow-hidden shadow-soft">
              <motion.div
                className="absolute -left-10 -top-10 h-56 w-56 rounded-full"
                style={{
                  background: `conic-gradient(${mint}, ${choco}, ${mint}, ${choco})`,
                }}
                animate={{ rotate: won ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 1.6, repeat: won ? Infinity : 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/45 to-transparent" />
              <div className="absolute inset-0 grid place-items-center text-2xl">
                🍦
              </div>
            </div>
          </div>

          {/* guía */}
          <div className="absolute left-3 right-3 bottom-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-3 text-center">
            <div className="text-[11px] text-zinc-600">
              Mezcla hasta que “se sienta” correcto (y haz mínimo 10
              movimientos)
            </div>
          </div>
        </div>
      </div>

      {won && (
        <motion.div
          className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-sm font-semibold text-zinc-900">
            “Dos sabores raros… pero funcionan increíble.”
          </div>
          <div className="mt-1 text-sm text-zinc-700">
            (como cuando algo inesperado te hace sonreír)
          </div>
        </motion.div>
      )}
    </div>
  );
}
