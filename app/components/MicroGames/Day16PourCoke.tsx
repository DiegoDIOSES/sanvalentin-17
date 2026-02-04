"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

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
  const pourOk = pour >= 62 && pour <= 78; // “perfecto”
  const pourDone = capDone && pourOk;
  const allDone = capDone && pourOk && lemon;

  useEffect(() => {
    if (allDone && !won) {
      setWon(true);
      onWin();
    }
  }, [allDone, won, onWin]);

  const reset = () => {
    setCap(0);
    setPour(0);
    setLemon(false);
    setWon(false);
  };

  const stage = useMemo(() => {
    if (!capDone) return 1;
    if (!pourDone) return 2;
    if (!lemon) return 3;
    return 4;
  }, [capDone, pourDone, lemon]);

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">
            Coquita perfecta
          </div>
          <div className="mt-1 text-sm text-zinc-700">
            {stage === 1
              ? "1) Destapa"
              : stage === 2
                ? "2) Sirve (sin pasarte)"
                : stage === 3
                  ? "3) Pon el limón"
                  : "Perfecto ✨"}
          </div>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {/* destapar */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <span>Destapar</span>
            <span className="font-semibold">{cap}%</span>
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
          <div className="mt-2 text-[11px] text-zinc-600">Llévalo al 100%.</div>
        </div>

        {/* servir */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <span>Servir</span>
            <span
              className={`font-semibold ${pourOk && capDone ? "text-emerald-700" : "text-zinc-700"}`}
            >
              {pour}%
            </span>
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

          <div className="mt-3 flex items-end justify-center gap-3">
            <div className="relative h-24 w-14 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-zinc-900/80"
                style={{ height: `${capDone ? pour : 0}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
            </div>

            <div className="text-3xl">{capDone ? "🥤" : "🧴"}</div>
          </div>

          <div className="mt-2 text-[11px] text-zinc-600">
            Objetivo: entre <span className="font-semibold">62% y 78%</span>.
          </div>
        </div>

        {/* limón */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-600">Limón</div>
            <button
              disabled={!pourDone || lemon}
              onClick={() => setLemon(true)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold border ${
                lemon
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : !pourDone
                    ? "bg-white text-zinc-400 border-zinc-200"
                    : "bg-white text-zinc-900 border-zinc-200"
              }`}
            >
              {lemon ? "Listo 🍋" : "Poner 🍋"}
            </button>
          </div>

          {won && (
            <motion.div
              className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="text-sm font-semibold text-zinc-900">
                Perfecta ✨
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                “Los detalles contigo… me encantan.”
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
