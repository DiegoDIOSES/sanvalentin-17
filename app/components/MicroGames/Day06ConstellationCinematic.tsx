"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const MOMENTS = [
  "Risa espontánea",
  "Mirada tranquila",
  "Silencio cómodo",
  "Confianza",
  "Paz",
  "Una tarde simple",
  "Alegría real",
];

export default function Day06ConstellationCinematic({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [active, setActive] = useState<number[]>([]);

  const handleTap = (i: number) => {
    if (active.includes(i)) return;

    const next = [...active, i];
    setActive(next);

    if (next.length === MOMENTS.length) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div className="mt-6 rounded-3xl bg-white/70 border border-white/60 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-zinc-600 mb-4">
        <span>Encendidas: {active.length} / {MOMENTS.length}</span>
        <span className="px-3 py-1 rounded-full bg-white border border-zinc-200">
          Toca puntos ✨
        </span>
      </div>

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
          sm:gap-4
        "
      >
        {MOMENTS.map((label, i) => {
          const isOn = active.includes(i);

          return (
            <motion.button
              key={i}
              onClick={() => handleTap(i)}
              className={`
                relative
                rounded-2xl
                border
                px-3 py-4
                sm:px-4 sm:py-5
                text-center
                transition
                ${
                  isOn
                    ? "bg-amber-100/70 border-amber-300"
                    : "bg-white border-zinc-200"
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`
                  mx-auto mb-1
                  h-8 w-8
                  sm:h-10 sm:w-10
                  rounded-xl
                  grid place-items-center
                  ${
                    isOn
                      ? "bg-amber-200 text-amber-800"
                      : "bg-zinc-100 text-zinc-400"
                  }
                `}
              >
                ✨
              </div>

              <div className="text-[11px] sm:text-xs text-zinc-700 leading-tight">
                {label}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-all"
            style={{ width: `${(active.length / MOMENTS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}