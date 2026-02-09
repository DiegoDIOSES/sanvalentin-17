"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Day16PourCoke({ onWin }: { onWin: () => void }) {
  // etapas: destapar -> servir -> limon
  const [cap, setCap] = useState(0); // 0..100
  const [pour, setPour] = useState(0); // 0..100
  const [lemon, setLemon] = useState(false);
  const [won, setWon] = useState(false);

  const capDone = cap >= 100;
  const pourOk = pour >= 62 && pour <= 78;
  const pourDone = capDone && pourOk;
  const allDone = capDone && pourOk && lemon;

  const wonRef = useRef(false);
  useEffect(() => {
    if (!allDone || wonRef.current) return;
    wonRef.current = true;
    setWon(true);
    onWin();
  }, [allDone, onWin]);

  const reset = () => {
    setCap(0);
    setPour(0);
    setLemon(false);
    setWon(false);
    wonRef.current = false;
    setDraggingLemon(false);
  };

  const stage = useMemo(() => {
    if (!capDone) return 1;
    if (!pourDone) return 2;
    if (!lemon) return 3;
    return 4;
  }, [capDone, pourDone, lemon]);

  const stageText =
    stage === 1
      ? "1) Destapa"
      : stage === 2
        ? "2) Sirve (zona perfecta)"
        : stage === 3
          ? "3) Arrastra el limón al vaso"
          : "Perfecto ✨";

  // ===== Lemon drag (iOS safe pointer drag) =====
  const cupRef = useRef<HTMLDivElement | null>(null);
  const [draggingLemon, setDraggingLemon] = useState(false);
  const [lemonPos, setLemonPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const isInsideCup = (clientX: number, clientY: number) => {
    const el = cupRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return (
      clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom
    );
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Etapa:{" "}
          <span className="font-semibold">
            {stage === 4 ? "Final" : `${stage}/3`}
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
          {/* header */}
          <div className="px-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Coquita perfecta
                </div>
                <div className="mt-1 text-sm text-zinc-700">{stageText}</div>
              </div>

              <motion.div
                className="text-3xl"
                animate={
                  won
                    ? { rotate: [0, -6, 6, -4, 4, 0], y: [0, -2, 0] }
                    : capDone
                      ? { scale: [1, 1.03, 1] }
                      : { scale: 1 }
                }
                transition={{ duration: won ? 0.8 : 1.6, repeat: won ? 0 : Infinity }}
              >
                {won ? "✨" : capDone ? "🥤" : "🥛"}
              </motion.div>
            </div>
          </div>

          {/* main scene */}
          <div className="px-4 pb-4 pt-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-600">Barra</div>
                <div className="text-xs text-zinc-600">
                  Zona perfecta:{" "}
                  <span className="font-semibold text-zinc-900">62–78%</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 items-end">
                {/* Bottle */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-600">Destapar</div>
                    <div className="text-xs font-semibold text-zinc-900">
                      {cap}%
                    </div>
                  </div>

                  <div className="mt-3 flex justify-center">
                    <div className="relative h-28 w-16 rounded-3xl border border-zinc-200 bg-white overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/55 to-transparent" />
                      <motion.div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-10 rounded-2xl border border-zinc-200 bg-white grid place-items-center text-[11px]"
                        animate={
                          capDone
                            ? { y: -6, rotate: -8, opacity: 0 }
                            : { y: 0, rotate: 0, opacity: 1 }
                        }
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        🧢
                      </motion.div>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-2xl">
                        🧴
                      </div>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={cap}
                    disabled={capDone || won}
                    onChange={(e) => setCap(Number(e.target.value))}
                    className="mt-3 w-full"
                  />

                  <div className="mt-2 text-[11px] text-zinc-600">
                    Llévalo al <span className="font-semibold">100%</span>.
                  </div>
                </div>

                {/* Cup */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-600">Servir</div>
                    <div
                      className={`text-xs font-semibold ${
                        capDone && pourOk
                          ? "text-emerald-700"
                          : !capDone
                            ? "text-zinc-400"
                            : "text-zinc-900"
                      }`}
                    >
                      {pour}%
                    </div>
                  </div>

                  <div className="mt-3 flex justify-center">
                    <div
                      ref={cupRef}
                      className="relative h-40 w-20 rounded-[28px] border border-zinc-200 bg-white overflow-hidden"
                    >
                      {/* perfect zone highlight */}
                      <div
                        className="absolute left-0 right-0 bg-emerald-200/35"
                        style={{
                          bottom: `${62}%`,
                          height: `${78 - 62}%`,
                        }}
                      />
                      {/* fill */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-zinc-900/85"
                        animate={{ height: `${capDone ? pour : 0}%` }}
                        transition={{ type: "spring", stiffness: 220, damping: 24 }}
                      />
                      {/* glass shine */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/55 to-transparent" />

                      {/* lemon indicator */}
                      <AnimatePresence>
                        {lemon && (
                          <motion.div
                            className="absolute top-3 left-1/2 -translate-x-1/2 text-2xl"
                            initial={{ scale: 0.7, opacity: 0, y: -6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                          >
                            🍋
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pour}
                    disabled={!capDone || won}
                    onChange={(e) => setPour(Number(e.target.value))}
                    className="mt-3 w-full"
                  />

                  <div className="mt-2 text-[11px] text-zinc-600">
                    Quédate en la{" "}
                    <span className="font-semibold">franja verde</span>.
                  </div>
                </div>

                {/* Lemon */}
                <div
                  className={`rounded-2xl border border-zinc-200 bg-zinc-50 p-3 ${
                    !pourDone ? "opacity-70" : ""
                  }`}
                  style={{
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-600">Limón</div>
                    <div className="text-xs font-semibold text-zinc-900">
                      {lemon ? "Listo" : "Pendiente"}
                    </div>
                  </div>

                  <div className="mt-3 grid place-items-center">
                    {!lemon ? (
                      <button
                        type="button"
                        disabled={!pourDone || won}
                        className={`relative rounded-2xl border bg-white px-5 py-4 shadow-soft touch-none select-none ${
                          !pourDone || won ? "border-zinc-200" : "border-zinc-900"
                        }`}
                        onPointerDown={(e) => {
                          if (!pourDone || won) return;
                          e.preventDefault();
                          setDraggingLemon(true);
                          setLemonPos({ x: e.clientX, y: e.clientY });
                          (e.currentTarget as HTMLButtonElement).setPointerCapture(
                            e.pointerId,
                          );
                        }}
                        onPointerMove={(e) => {
                          if (!draggingLemon) return;
                          e.preventDefault();
                          setLemonPos({ x: e.clientX, y: e.clientY });
                        }}
                        onPointerUp={(e) => {
                          if (!draggingLemon) return;
                          e.preventDefault();
                          setDraggingLemon(false);
                          setLemonPos(null);

                          if (isInsideCup(e.clientX, e.clientY)) setLemon(true);
                        }}
                        onPointerCancel={() => {
                          setDraggingLemon(false);
                          setLemonPos(null);
                        }}
                        aria-label="Arrastra el limón"
                      >
                        <div className="text-3xl">🍋</div>
                        <div className="mt-1 text-[11px] text-zinc-600">
                          Arrastra
                        </div>
                      </button>
                    ) : (
                      <motion.div
                        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="text-3xl">🍋</div>
                        <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
                          Perfecto
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] text-zinc-600">
                    Suéltalo dentro del vaso.
                  </div>

                  <AnimatePresence>
                    {draggingLemon && lemonPos && (
                      <motion.div
                        className="fixed z-[9999] pointer-events-none"
                        style={{
                          left: lemonPos.x,
                          top: lemonPos.y,
                          transform: "translate(-50%, -50%)",
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.92, opacity: 0 }}
                      >
                        <div className="text-4xl drop-shadow">🍋</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* status bar */}
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
                {won ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-sm font-semibold text-zinc-900">
                      Perfecta ✨
                    </div>
                    <div className="mt-1 text-sm text-zinc-700">
                      “Los detalles contigo… me encantan.”
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-sm text-zinc-700">
                    {stage === 1
                      ? "Tip: destápala completo para servir."
                      : stage === 2
                        ? "Tip: apunta a la franja verde."
                        : "Tip: suelta el 🍋 dentro del vaso."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}