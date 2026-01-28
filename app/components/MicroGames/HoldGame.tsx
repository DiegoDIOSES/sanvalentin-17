"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HoldGame({ onWin }: { onWin: () => void }) {
  const [v, setV] = useState(0);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    if (!holding) return;

    const t = setInterval(() => {
      setV((x) => {
        const nx = Math.min(100, x + 2);
        if (nx === 100) {
          onWin();
          return 0;
        }
        return nx;
      });
    }, 25);

    return () => clearInterval(t);
  }, [holding, onWin]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>Mantén presionado para llenar</span>
        <span>{v}%</span>
      </div>

      <div className="mt-3 h-3 rounded-full bg-white border border-zinc-200 overflow-hidden">
        <motion.div
          className="h-full bg-rose-500"
          animate={{ width: `${v}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onMouseDown={() => setHolding(true)}
          onMouseUp={() => setHolding(false)}
          onMouseLeave={() => setHolding(false)}
          onTouchStart={() => setHolding(true)}
          onTouchEnd={() => setHolding(false)}
          className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
        >
          Mantener ✨
        </button>

        <div className="text-xs text-zinc-600">
          Cuando llegue a 100%, ganas.
        </div>
      </div>
    </div>
  );
}
