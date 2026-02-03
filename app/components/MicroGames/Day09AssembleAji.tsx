"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function vibrate(ms: number) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      // @ts-ignore
      navigator.vibrate(ms);
    }
  } catch {}
}

type Ingredient = {
  id: string;
  label: string;
  emoji: string;
};

const ORDER: Ingredient[] = [
  { id: "bread", label: "Pan", emoji: "🥖" },
  { id: "milk", label: "Leche", emoji: "🥛" },
  { id: "aji", label: "Ají amarillo", emoji: "🌶️" },
  { id: "chicken", label: "Gallina", emoji: "🍗" },
  { id: "cheese", label: "Queso", emoji: "🧀" },
  { id: "potato", label: "Papa", emoji: "🥔" },
];

const POOL: Ingredient[] = [
  ...ORDER,
  { id: "egg", label: "Huevo", emoji: "🥚" }, // “distractor” simpático
];

export default function Day09AssembleAji({ onWin }: { onWin: () => void }) {
  const [step, setStep] = useState(0); // 0..ORDER.length
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);

  const progress = useMemo(() => step / ORDER.length, [step]);

  useEffect(() => {
    if (!won && step >= ORDER.length) {
      setWon(true);
      vibrate(40);
      onWin();
    }
  }, [step, won, onWin]);

  const onPick = (ing: Ingredient) => {
    if (won) return;

    const expected = ORDER[step];
    if (ing.id === expected.id) {
      vibrate(10);
      setStep((s) => s + 1);
      return;
    }

    // wrong
    vibrate(18);
    setShake(true);
    window.setTimeout(() => setShake(false), 350);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Plato:{" "}
          <span className="font-semibold">
            {Math.min(step, ORDER.length)}/{ORDER.length}
          </span>
        </div>
        <div className="text-[11px] text-zinc-600">
          {won ? "Listo 🍽️" : "Toca en orden"}
        </div>
      </div>

      <div className="mt-3 relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 via-rose-50 to-white p-4">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="relative rounded-2xl border border-white/70 bg-white/60 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-600">Mini juego</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Arma el Ají de Gallina ✨
              </div>
              <div className="mt-1 text-xs text-zinc-700">
                Siguiente:{" "}
                <span className="font-semibold">
                  {won
                    ? "servir"
                    : ORDER[Math.min(step, ORDER.length - 1)].label}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 border border-white/60 px-3 py-2 text-xs text-zinc-700">
              {Math.round(progress * 100)}%
            </div>
          </div>

          <div className="mt-3 h-2 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-zinc-900"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* “Plato” */}
          <motion.div
            className="mt-4 rounded-3xl border border-zinc-200 bg-white p-4 text-center"
            animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-2xl">🍽️</div>
            <div className="mt-2 text-sm font-semibold text-zinc-900">
              {won ? "Hecho con cariño." : "Elige el ingrediente correcto"}
            </div>
            <div className="mt-1 text-xs text-zinc-700">
              {won
                ? "Como las cosas que valen."
                : "Si te equivocas, no pasa nada. Vuelve a intentar."}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {ORDER.slice(0, step).map((ing) => (
                <div
                  key={ing.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700"
                >
                  {ing.emoji} {ing.label}
                </div>
              ))}
              {!won && step === 0 && (
                <div className="text-[11px] text-zinc-500">Aún vacío…</div>
              )}
            </div>
          </motion.div>

          {/* ingredientes */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POOL.map((ing) => {
              const disabled = won;
              const isExpected = !won && ORDER[step]?.id === ing.id;

              return (
                <button
                  key={ing.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(ing)}
                  className={[
                    "rounded-2xl border px-3 py-3 text-left transition",
                    "bg-white",
                    isExpected ? "border-zinc-900" : "border-zinc-200",
                    disabled ? "opacity-60" : "hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <div className="text-lg">{ing.emoji}</div>
                  <div className="mt-1 text-xs font-semibold text-zinc-900">
                    {ing.label}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {won && (
              <motion.div
                className="mt-4 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="text-xs text-zinc-600">Final</div>
                <div className="mt-1 text-sm font-semibold text-zinc-900">
                  “Hay cosas que abrazan… sin decir nada.”
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
