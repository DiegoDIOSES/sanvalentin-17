"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Day01FeedGiraffe({ onWin }: { onWin: () => void }) {
  const GOAL = 10;
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [leaves, setLeaves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!active) return;

    const start = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, 6000 - (Date.now() - start));
      setTimeLeft(left);
      if (left === 0) {
        setActive(false);
        if (leaves >= GOAL) {
          setWon(true);
          onWin();
        }
      }
    }, 40);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>Mini juego: Alimenta a la jirafa 🦒🌿</span>
        <span className="font-mono">
          {active ? `${Math.ceil(timeLeft / 1000)}s` : "—"}
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 overflow-hidden">
        {/* barra */}
        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>Hojas</span>
          <span>
            <span className="font-semibold text-zinc-900">{leaves}</span> /{" "}
            {GOAL}
          </span>
        </div>

        <div className="mt-2 h-3 rounded-full bg-zinc-50 border border-zinc-200 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400"
            animate={{ width: `${Math.min(100, (leaves / GOAL) * 100)}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          />
        </div>

        {/* zona de tap */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => {
              if (!active) {
                setLeaves(0);
                setWon(false);
                setActive(true);
                setTimeLeft(6000);
                return;
              }
              setLeaves((x) => x + 1);
            }}
            className="rounded-2xl bg-emerald-600 text-white px-4 py-3 text-sm font-semibold"
          >
            {active ? "🌿 dar hoja" : "Empezar 🌿"}
          </button>

          <div className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold">
            🦒 ñom
          </div>
        </div>

        <AnimatePresence>
          {won && (
            <motion.div
              className="mt-3 text-sm font-semibold text-zinc-900"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              ¡Le encantó! 💗
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 text-[11px] text-zinc-600">
        Meta: 10 hojas en 6 segundos ✨
      </div>
    </div>
  );
}
