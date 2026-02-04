"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export default function Day14FogTremor({ onWin }: { onWin: () => void }) {
  const [target, setTarget] = useState(() => randInt(0, 5));
  const [picked, setPicked] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (won) onWin();
  }, [won, onWin]);

  const reset = () => {
    setTarget(randInt(0, 5));
    setPicked(null);
    setWon(false);
  };

  const zones = useMemo(() => Array.from({ length: 6 }).map((_, i) => i), []);

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Niebla</div>
          <div className="mt-1 text-sm text-zinc-700">
            Pasa tu dedo por las zonas. Una “tiembla” un poquito.
          </div>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {zones.map((i) => {
          const isTarget = i === target;
          const isPicked = picked === i;

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => {
                if (won) return;
                setPicked(i);
                if (isTarget) setWon(true);
              }}
              className="relative h-24 rounded-2xl border border-zinc-200 bg-zinc-100 overflow-hidden"
              animate={
                !won && !isPicked && isTarget
                  ? { rotate: [0, 0.4, 0, -0.4, 0], y: [0, -1, 0] }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: 2.2,
                repeat: !won && !isPicked && isTarget ? Infinity : 0,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-100 to-white opacity-90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.20)_1px,transparent_0)] [background-size:12px_12px] opacity-10" />
              <div className="relative h-full w-full grid place-items-center text-2xl">
                {isPicked ? (isTarget ? "🧌" : "🌫️") : "🌫️"}
              </div>
            </motion.button>
          );
        })}
      </div>

      {won && (
        <motion.div
          className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-sm font-semibold text-zinc-900">JA 😅</div>
          <div className="mt-1 text-sm text-zinc-700">
            “Ok, sí me asusté… pero contigo no.”
          </div>
        </motion.div>
      )}
    </div>
  );
}
