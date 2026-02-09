"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

type Stage = 1 | 2 | 3 | 4;

export default function Day16PourCoke({ onWin }: { onWin: () => void }) {
  // 1) destapar  2) servir  3) limón  4) win
  const [cap, setCap] = useState(0); // 0..100
  const [pour, setPour] = useState(0); // 0..100
  const [lemon, setLemon] = useState(false);
  const [won, setWon] = useState(false);

  const capDone = cap >= 100;
  const pourOk = pour >= 62 && pour <= 78;
  const pourDone = capDone && pourOk;
  const allDone = capDone && pourOk && lemon;

  // stage
  const stage: Stage = useMemo(() => {
    if (!capDone) return 1;
    if (!pourDone) return 2;
    if (!lemon) return 3;
    return 4;
  }, [capDone, pourDone, lemon]);

  // win
  const winRef = useRef(false);
  useEffect(() => {
    if (!allDone || winRef.current) return;
    winRef.current = true;
    setWon(true);
    onWin();
  }, [allDone, onWin]);

  const reset = () => {
    setCap(0);
    setPour(0);
    setLemon(false);
    setWon(false);
    winRef.current = false;
    // reset drag lemon
    setLemonDrag({ x: 0, y: 0, active: false, dropped: false });
  };

  /* =========================
     DRAG LIMÓN (iOS FIX)
     - No HTML draggable
     - Pointer events + touch-action none
  ========================= */
  const jarRef = useRef<HTMLDivElement | null>(null);

  const [lemonDrag, setLemonDrag] = useState<{
    x: number;
    y: number;
    active: boolean;
    dropped: boolean;
  }>({ x: 0, y: 0, active: false, dropped: false });

  const startPt = useRef<{ x: number; y: number } | null>(null);

  const onLemonDown = (e: React.PointerEvent) => {
    if (stage !== 3 || lemon) return;

    // evitar menú iOS / selección
    e.preventDefault();

    startPt.current = { x: e.clientX, y: e.clientY };
    setLemonDrag((p) => ({ ...p, active: true }));

    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onLemonMove = (e: React.PointerEvent) => {
    if (!lemonDrag.active) return;
    if (!startPt.current) return;

    const dx = e.clientX - startPt.current.x;
    const dy = e.clientY - startPt.current.y;

    setLemonDrag((p) => ({
      ...p,
      x: dx,
      y: dy,
    }));
  };

  const onLemonUp = () => {
    if (!lemonDrag.active) return;

    // check drop inside glass
    const jar = jarRef.current;
    if (jar) {
      const r = jar.getBoundingClientRect();
      // “zona de drop” dentro del vaso (centro)
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.46;

      const lx = cx + lemonDrag.x;
      const ly = cy + lemonDrag.y;

      // tolerancia: si está cerca del centro del vaso, cuenta como drop
      const dist = Math.sqrt(
        Math.pow(lx - cx, 2) + Math.pow(ly - cy, 2),
      );

      if (dist < Math.min(r.width, r.height) * 0.18) {
        setLemon(true);
        setLemonDrag({ x: 0, y: 0, active: false, dropped: true });
        return;
      }
    }

    // si falló, vuelve suave
    setLemonDrag({ x: 0, y: 0, active: false, dropped: false });
    startPt.current = null;
  };

  /* =========================
     UI helpers
  ========================= */
  const capPct = clamp(cap / 100, 0, 1);
  const pourPct = clamp(pour / 100, 0, 1);

  return (
    <div className="mt-3">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Etapa:{" "}
          <span className="font-semibold">{stage === 4 ? "3/3" : `${stage}/3`}</span>
        </div>

        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      {/* Main card */}
      <div className="mt-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-emerald-50 p-4 overflow-hidden">
        <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur shadow-soft overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Coquita perfecta
                </div>
                <div className="mt-1 text-sm text-zinc-700">
                  {stage === 1
                    ? "1) Destapa la botella"
                    : stage === 2
                      ? "2) Sirve en la franja perfecta"
                      : stage === 3
                        ? "3) Arrastra el limón al vaso"
                        : "Perfecto ✨"}
                </div>
              </div>

              <motion.div
                className="text-3xl"
                animate={won ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
                transition={{ duration: 0.8, repeat: won ? Infinity : 0 }}
              >
                {won ? "✨" : "🥤"}
              </motion.div>
            </div>

            {/* Pills */}
            <div className="mt-3 flex items-center gap-2">
              <Pill ok={capDone} text="Destapar" />
              <Pill ok={capDone && pourOk} text="Servir" />
              <Pill ok={lemon} text="Limón" />
            </div>
          </div>

          {/* Scene */}
          <div className="px-4 pb-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Left: Controls */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                {/* Control 1 */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900">
                    Destapar
                  </div>
                  <div className="text-xs text-zinc-600">
                    <span className="font-semibold">{cap}%</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-zinc-600">
                  Llévalo al 100% para continuar.
                </div>

                <div className="mt-3">
                  <div className="relative h-10 rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${capPct * 100}%`,
                        background:
                          "linear-gradient(90deg, rgba(17,24,39,0.9), rgba(17,24,39,0.6))",
                      }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-2xl bg-zinc-900 shadow-soft"
                      animate={{ left: `calc(${capPct * 100}% - 14px)` }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    />
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={cap}
                    disabled={capDone}
                    onChange={(e) => setCap(Number(e.target.value))}
                    className="mt-3 w-full"
                  />
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-zinc-200/70" />

                {/* Control 2 */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900">Servir</div>
                  <div
                    className={`text-xs font-semibold ${
                      capDone && pourOk ? "text-emerald-700" : "text-zinc-700"
                    }`}
                  >
                    {pour}%
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-zinc-600">
                  Zona perfecta: <span className="font-semibold">62%–78%</span>
                </div>

                <div className="mt-3 relative h-10 rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden">
                  {/* perfect band */}
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-200/45"
                    style={{ left: "62%", width: "16%" }}
                  />
                  {/* fill */}
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${capDone ? pourPct * 100 : 0}%`,
                      background:
                        "linear-gradient(90deg, rgba(17,24,39,0.88), rgba(17,24,39,0.55))",
                    }}
                  />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-2xl bg-zinc-900 shadow-soft"
                    animate={{
                      left: `calc(${(capDone ? pourPct : 0) * 100}% - 14px)`,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  />
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

                {/* Control 3 */}
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-600">Limón</div>
                    <div className="text-xs text-zinc-600">
                      {lemon ? (
                        <span className="font-semibold text-emerald-700">Listo</span>
                      ) : (
                        <span className="font-semibold">
                          {stage < 3 ? "Bloqueado" : "Pendiente"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-zinc-600">
                    {stage < 3
                      ? "Primero destapa y sirve perfecto."
                      : "Arrastra el limón al vaso (sin mantener para copiar)."}
                  </div>

                  <div className="mt-3 flex justify-center">
                    <motion.div
                      onPointerDown={onLemonDown}
                      onPointerMove={onLemonMove}
                      onPointerUp={onLemonUp}
                      onPointerCancel={onLemonUp}
                      className={`h-16 w-16 rounded-2xl border bg-white grid place-items-center text-3xl ${
                        stage !== 3 || lemon
                          ? "opacity-40 border-zinc-200"
                          : "border-zinc-300 shadow-soft"
                      }`}
                      style={{
                        transform: `translate(${lemonDrag.x}px, ${lemonDrag.y}px)`,
                        touchAction: "none",
                        WebkitUserSelect: "none",
                        userSelect: "none",
                        WebkitTouchCallout: "none",
                      }}
                      animate={
                        stage === 3 && !lemon && !lemonDrag.active
                          ? { y: [0, -2, 0] }
                          : { y: 0 }
                      }
                      transition={{
                        duration: 1.8,
                        repeat: stage === 3 && !lemon && !lemonDrag.active ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    >
                      🍋
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Tu vaso</div>
                    <div className="mt-1 text-xs text-zinc-600">
                      {stage === 1
                        ? "Primero destapa."
                        : stage === 2
                          ? "Sirve sin pasarte."
                          : stage === 3
                            ? "Ahora el limón."
                            : "Listo 😌"}
                    </div>
                  </div>

                  {/* Bottle icon */}
                  <motion.div
                    className="text-3xl"
                    animate={
                      capDone ? { rotate: 0 } : { rotate: [0, -3, 3, 0] }
                    }
                    transition={{ duration: 1.8, repeat: capDone ? 0 : Infinity }}
                  >
                    🧴
                  </motion.div>
                </div>

                {/* Scene area */}
                <div className="mt-4 grid place-items-center">
                  <div className="relative h-[320px] w-full max-w-sm rounded-[30px] border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 overflow-hidden">
                    {/* subtle glow when in perfect range */}
                    <AnimatePresence>
                      {capDone && pourOk && !won && (
                        <motion.div
                          className="absolute inset-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            background:
                              "radial-gradient(circle at 50% 55%, rgba(16,185,129,0.18), transparent 55%)",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Glass */}
                    <div
                      ref={jarRef}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="relative h-56 w-40 rounded-[34px] border border-zinc-200 bg-white shadow-soft overflow-hidden">
                        {/* liquid */}
                        <div
                          className="absolute bottom-0 left-0 right-0"
                          style={{
                            height: `${capDone ? pourPct * 100 : 0}%`,
                            background:
                              "linear-gradient(180deg, rgba(17,24,39,0.75), rgba(17,24,39,0.95))",
                          }}
                        />
                        {/* perfect band */}
                        <div
                          className="absolute left-0 right-0"
                          style={{
                            bottom: "62%",
                            height: "16%",
                            background: "rgba(16,185,129,0.12)",
                            borderTop: "1px solid rgba(16,185,129,0.18)",
                            borderBottom: "1px solid rgba(16,185,129,0.18)",
                          }}
                        />

                        {/* glass shine */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/55 to-transparent" />

                        {/* straw */}
                        <motion.div
                          className="absolute -top-6 right-8 h-28 w-3 rounded-full"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(239,68,68,0.95), rgba(239,68,68,0.55))",
                            transformOrigin: "bottom",
                          }}
                          animate={{
                            rotate: won ? [0, -4, 4, 0] : 0,
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: won ? Infinity : 0,
                          }}
                        />

                        {/* lemon inside */}
                        <AnimatePresence>
                          {lemon && (
                            <motion.div
                              className="absolute left-1/2 top-[44%] -translate-x-1/2 text-4xl"
                              initial={{ y: -10, opacity: 0, scale: 0.8 }}
                              animate={{ y: 0, opacity: 1, scale: 1 }}
                              transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            >
                              🍋
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* top label */}
                        <div className="absolute left-3 top-3 right-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur px-3 py-2">
                          <div className="text-[11px] text-zinc-600">
                            {capDone ? (
                              <>
                                Servir:{" "}
                                <span
                                  className={`font-semibold ${
                                    pourOk ? "text-emerald-700" : "text-zinc-900"
                                  }`}
                                >
                                  {pour}%
                                </span>
                              </>
                            ) : (
                              <>
                                Destapar:{" "}
                                <span className="font-semibold text-zinc-900">{cap}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom hint */}
                    <div className="absolute left-3 right-3 bottom-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-3 text-center">
                      <div className="text-[11px] text-zinc-600">
                        {stage === 1
                          ? "Tip: lleva Destapar al 100%."
                          : stage === 2
                            ? "Tip: quédate en la franja verde (62–78%)."
                            : stage === 3
                              ? "Tip: suelta el 🍋 dentro del vaso."
                              : "Perfecta. Detalles que enamoran 😌"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Win card */}
                <AnimatePresence>
                  {won && (
                    <motion.div
                      className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                    >
                      <div className="text-sm font-semibold text-emerald-800">
                        Coquita perfecta ✔
                      </div>
                      <div className="mt-1 text-sm text-emerald-700">
                        “Los detalles contigo… me encantan.”
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={`text-[11px] px-3 py-1 rounded-full border ${
        ok
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-white border-zinc-200 text-zinc-600"
      }`}
    >
      {text}
    </div>
  );
}