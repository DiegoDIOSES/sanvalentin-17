"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TapGame({ onWin }: { onWin: () => void }) {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!active) return;

    const start = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, 5000 - (Date.now() - start));
      setTimeLeft(left);
      if (left === 0) {
        setActive(false);
        if (score >= 12) onWin();
      }
    }, 40);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>Toca rápido por 5s</span>
        <span className="font-mono">
          {active ? `${Math.ceil(timeLeft / 1000)}s` : "—"}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => {
            if (!active) {
              setScore(0);
              setActive(true);
              setTimeLeft(5000);
              return;
            }
            setScore((s) => s + 1);
          }}
          className="rounded-2xl bg-rose-500 text-white px-4 py-3 text-sm font-semibold"
        >
          {active ? "💗 TAP!" : "Empezar 💗"}
        </button>

        <div className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm">
          Score: <span className="font-semibold">{score}</span>
        </div>
      </div>

      <AnimatePresence>
        {!active && score > 0 && (
          <motion.div
            className="mt-3 text-xs text-zinc-600"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            Meta: 12 taps para ganar ✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
