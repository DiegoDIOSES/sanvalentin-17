"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function Day17SwirlMix({ onWin }: { onWin: () => void }) {
  // target “balance” chocolate/menta
  const TARGET = 0.58;
  const TOL = 0.035;

  // “vueltas” mínimas para que no sea instantáneo
  const MIN_STROKES = 12;

  const [mix, setMix] = useState(0.2); // 0..1 (menta->choco)
  const [strokes, setStrokes] = useState(0);
  const [won, setWon] = useState(false);

  const inRange = useMemo(() => Math.abs(mix - TARGET) <= TOL, [mix]);

  const wonRef = useRef(false);
  useEffect(() => {
    if (wonRef.current) return;
    if (inRange && strokes >= MIN_STROKES) {
      wonRef.current = true;
      setWon(true);
      onWin();
    }
  }, [inRange, strokes, onWin]);

  const reset = () => {
    setMix(0.2);
    setStrokes(0);
    setWon(false);
    wonRef.current = false;
    swirlRef.current = 0;
    lastAngleRef.current = null;
    setHint("Haz movimientos circulares dentro del helado 🌀");
  };

  // ===== Gesture / swirl math =====
  const areaRef = useRef<HTMLDivElement | null>(null);
  const lastAngleRef = useRef<number | null>(null);
  const swirlRef = useRef(0); // acumulador de “vueltas”
  const [hint, setHint] = useState("Haz movimientos circulares dentro del helado 🌀");

  const onMove = (e: React.PointerEvent) => {
    if (won) return;
    const el = areaRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // vector del dedo respecto al centro
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // si estás muy fuera del centro, el gesto es menos “puro”
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxR = Math.min(rect.width, rect.height) * 0.46;
    const r = clamp(dist / maxR, 0, 1);

    // ángulo actual
    const ang = Math.atan2(dy, dx); // -pi..pi

    if (lastAngleRef.current == null) {
      lastAngleRef.current = ang;
      return;
    }

    // delta de ángulo, normalizado para evitar saltos en -pi/pi
    let d = ang - lastAngleRef.current;
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;

    lastAngleRef.current = ang;

    // acumulamos “swirl” (vueltas). Pesamos por r para premiar circular “real”
    swirlRef.current += d * r;

    // convertimos a “vueltas” aproximadas
    const turns = swirlRef.current / (Math.PI * 2);

    // mezclado: mientras más vueltas, más se acerca al target,
    // pero el usuario controla “tendencia” con dirección:
    // si gira clockwise (d>0) empuja hacia choco, anticlock hacia menta.
    const dir = d > 0 ? 1 : -1;

    setMix((prev) => {
      // empuje base por gesto (suave)
      const push = 0.012 * r * dir;

      // “auto-ease” hacia el target cuando ya estás cerca y sigues mezclando
      const toward = (TARGET - prev) * 0.012 * r;

      // mezcla final
      const next = clamp(prev + push + toward, 0, 1);
      return next;
    });

    setStrokes((s) => s + 1);

    if (strokes < 2) setHint("Sigue girando… como si hicieras un swirl real 😌");
  };

  const onDown = (e: React.PointerEvent) => {
    if (won) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    lastAngleRef.current = null;
    onMove(e);
  };

  const onUp = () => {
    lastAngleRef.current = null;
  };

  // ===== Color feel =====
  const choco = `hsl(25, 38%, ${clamp(26 + mix * 10, 26, 38)}%)`;
  const mint = `hsl(155, 58%, ${clamp(74 - mix * 12, 58, 74)}%)`;

  const meterPct = mix * 100;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Progreso:{" "}
          <span className="font-semibold">
            {won ? "Final" : `${Math.min(strokes, MIN_STROKES)}/${MIN_STROKES}`}
          </span>
        </div>

        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-emerald-50 p-4 overflow-hidden">
        <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur shadow-soft overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Chocolate – Menta (swirl)
                </div>
                <div className="mt-1 text-sm text-zinc-700">
                  Mezcla con el dedo dentro del helado hasta que quede perfecto.
                </div>
              </div>

              <motion.div
                className="text-3xl"
                animate={won ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
                transition={{ duration: 0.7, repeat: won ? Infinity : 0 }}
              >
                {won ? "✨" : "🍦"}
              </motion.div>
            </div>
          </div>

          <div className="px-4 pb-4 pt-3">
            {/* Status row */}
            <div className="flex items-center justify-between">
              <div
                className={`text-[11px] px-3 py-1 rounded-full border ${
                  won
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : inRange
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-white border-zinc-200 text-zinc-600"
                }`}
              >
                {won ? "Perfecto ✨" : inRange ? "Vas perfecto… sigue" : "Mezcla…"}
              </div>

              <div className="text-xs text-zinc-600">
                Movimientos: <span className="font-semibold">{strokes}</span>
              </div>
            </div>

            {/* Meter */}
            <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-600">Balance</div>
                <div className="text-xs text-zinc-600">
                  <span className="font-semibold">Menta</span>{" "}
                  <span className="opacity-50">↔</span>{" "}
                  <span className="font-semibold">Choco</span>
                </div>
              </div>

              <div className="mt-3 relative h-10 rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden">
                {/* target band */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-200/45"
                  style={{
                    left: `${(TARGET - TOL) * 100}%`,
                    width: `${TOL * 2 * 100}%`,
                  }}
                />
                {/* fill */}
                <div
                  className="absolute top-0 bottom-0 left-0"
                  style={{
                    width: `${meterPct}%`,
                    background: `linear-gradient(90deg, ${mint}, ${choco})`,
                    opacity: 0.9,
                  }}
                />
                {/* knob */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-2xl bg-zinc-900 shadow-soft"
                  animate={{ left: `calc(${meterPct}% - 14px)` }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                />
              </div>

              <div className="mt-2 text-[11px] text-zinc-600">
                Quédate dentro de la franja verde (y llega a{" "}
                <span className="font-semibold">{MIN_STROKES}</span> movimientos).
              </div>
            </div>

            {/* Main arena */}
            <div className="mt-3 grid place-items-center">
              <div
                ref={areaRef}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                className={`relative h-[320px] w-full max-w-sm rounded-[30px] border border-zinc-200 overflow-hidden touch-none select-none ${
                  won ? "opacity-95" : ""
                }`}
                style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-50" />

                {/* Bowl */}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative">
                    {/* plate/bowl shadow */}
                    <div className="absolute left-1/2 top-[190px] -translate-x-1/2 h-10 w-56 rounded-full bg-zinc-200/40 blur-[2px]" />

                    {/* bowl */}
                    <div className="relative h-[210px] w-[250px] rounded-[44px] border border-zinc-200 bg-white overflow-hidden shadow-soft">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />

                      {/* ice cream mound */}
                      <div className="absolute left-1/2 top-6 -translate-x-1/2 h-44 w-44 rounded-full border border-zinc-200 bg-white overflow-hidden shadow-soft">
                        <motion.div
                          className="absolute -left-10 -top-10 h-64 w-64 rounded-full"
                          style={{
                            background: `conic-gradient(${mint}, ${choco}, ${mint}, ${choco}, ${mint})`,
                          }}
                          animate={{
                            rotate: won ? [0, 12, -12, 0] : clamp(strokes * 2, 0, 360),
                            scale: won ? [1, 1.02, 1] : 1,
                          }}
                          transition={{
                            duration: won ? 1.4 : 0.2,
                            repeat: won ? Infinity : 0,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
                        <div className="absolute inset-0 grid place-items-center text-2xl">
                          🍦
                        </div>
                      </div>

                      {/* bottom accent (bowl tint by mix) */}
                      <div
                        className="absolute left-0 right-0 bottom-0 h-20"
                        style={{
                          background: `linear-gradient(180deg, transparent, ${lerpColor(mint, choco, mix)})`,
                          opacity: 0.32,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hint */}
                <div className="absolute left-3 right-3 bottom-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-3 text-center">
                  <div className="text-[11px] text-zinc-600">{hint}</div>
                </div>
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {won && (
                <motion.div
                  className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                >
                  <div className="text-sm font-semibold text-zinc-900">
                    “Dos sabores raros… pero funcionan increíble.”
                  </div>
                  <div className="mt-1 text-sm text-zinc-700">
                    (como cuando algo inesperado te hace sonreír)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/** mezcla visual para el bowl (sin librerías) */
function lerpColor(a: string, b: string, t: number) {
  // a/b vienen como hsl(...) aquí, así que hacemos una mezcla simple:
  // para mantenerlo ligero, devolvemos un gradiente “mint->choco” en función de t
  // (no parseamos HSL para evitar overhead)
  return `rgba(17,24,39,${0.08 + t * 0.10})`;
}