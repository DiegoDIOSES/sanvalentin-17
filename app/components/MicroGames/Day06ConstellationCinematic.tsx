"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type Dot = {
  id: string;
  label: string;
  x: number; // 0..1
  y: number; // 0..1
};

export default function Day06ConstellationCinematic({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const dots: Dot[] = useMemo(
    () => [
      { id: "risa", label: "Risa espontánea", x: 0.18, y: 0.58 },
      { id: "mirada", label: "Mirada tranquila", x: 0.40, y: 0.40 },
      { id: "silencio", label: "Silencio cómodo", x: 0.72, y: 0.42 },
      { id: "confianza", label: "Confianza", x: 0.30, y: 0.80 },
      { id: "paz", label: "Paz", x: 0.52, y: 0.82 },
      { id: "simple", label: "Una tarde simple", x: 0.56, y: 0.62 },
      { id: "alegria", label: "Alegría real", x: 0.78, y: 0.78 },
    ],
    [],
  );

  const total = dots.length;
  const [onIds, setOnIds] = useState<Record<string, boolean>>({});

  const litCount = useMemo(
    () => dots.reduce((acc, d) => acc + (onIds[d.id] ? 1 : 0), 0),
    [dots, onIds],
  );

  const done = litCount >= total;

  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white/70 backdrop-blur shadow-soft overflow-hidden">
      <div className="p-4 md:p-5 flex items-center justify-between">
        <div className="text-sm text-zinc-700">
          Encendidas:{" "}
          <span className="font-semibold text-zinc-900">
            {litCount} / {total}
          </span>
        </div>

        <div className="text-[12px] px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700">
          Toca puntos ✨
        </div>
      </div>

      <div className="px-4 md:px-5 pb-4 md:pb-5">
        <div className="relative h-[360px] md:h-[420px] rounded-[22px] border border-zinc-200 bg-gradient-to-br from-white to-amber-50 overflow-hidden">
          {/* grain */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.45)_1px,transparent_0)] [background-size:14px_14px]" />

          {/* dots */}
          {dots.map((d, idx) => {
            const on = !!onIds[d.id];
            return (
              <motion.button
                key={d.id}
                onClick={() => {
                  if (on) return;
                  const next = { ...onIds, [d.id]: true };
                  setOnIds(next);

                  // cuando prende el último, completa
                  const nextCount =
                    Object.values(next).filter(Boolean).length;
                  if (nextCount >= total) {
                    setTimeout(() => onComplete(), 450);
                  }
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
                style={{
                  left: `${d.x * 100}%`,
                  top: `${d.y * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
              >
                <div
                  className={[
                    "rounded-2xl px-4 py-3 md:px-5 md:py-4 text-center shadow-soft border",
                    on
                      ? "bg-white border-amber-200"
                      : "bg-white/70 border-zinc-200",
                  ].join(" ")}
                  style={{
                    minWidth: 150,
                  }}
                >
                  <div
                    className={[
                      "mx-auto h-12 w-12 md:h-14 md:w-14 rounded-2xl grid place-items-center",
                      on
                        ? "bg-amber-100"
                        : "bg-zinc-100",
                    ].join(" ")}
                  >
                    <motion.div
                      animate={
                        on
                          ? { scale: [1, 1.08, 1] }
                          : { scale: 1 }
                      }
                      transition={{
                        duration: 0.9,
                        repeat: on ? Infinity : 0,
                      }}
                      className="text-xl"
                    >
                      ✨
                    </motion.div>
                  </div>

                  <div className="mt-2 text-sm font-medium text-zinc-800">
                    {d.label}
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* ambient tiny dust */}
          {[...Array(22)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-zinc-200/50"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 19) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-600">
            <span>Progreso</span>
            <span className="font-semibold">{done ? "Listo ✨" : `${litCount}/${total}`}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-zinc-900"
              style={{ width: `${(litCount / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}