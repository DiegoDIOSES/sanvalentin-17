"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const POINTS = [
  "Risa espontánea",
  "Mirada tranquila",
  "Una tarde simple",
  "Silencio cómodo",
  "Confianza",
  "Paz",
  "Alegría real",
];

export default function Day06Constellation({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [active, setActive] = useState<boolean[]>(
    Array(POINTS.length).fill(false),
  );

  const activate = (i: number) => {
    if (active[i]) return;
    const next = [...active];
    next[i] = true;
    setActive(next);

    if (next.every(Boolean)) {
      setTimeout(onComplete, 800);
    }
  };

  return (
    <div className="relative mx-auto mt-6 h-[320px] max-w-xl">
      {POINTS.map((text, i) => (
        <motion.button
          key={i}
          onClick={() => activate(i)}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${15 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 30}%`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: active[i] ? 1.3 : 1,
            opacity: 1,
            backgroundColor: active[i] ? "#fde68a" : "#fff",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <div className="h-12 w-12 rounded-full border border-zinc-200 grid place-items-center shadow-soft">
            ✨
          </div>

          {active[i] && (
            <motion.div
              className="absolute top-14 left-1/2 -translate-x-1/2 text-xs text-zinc-700 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {text}
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}