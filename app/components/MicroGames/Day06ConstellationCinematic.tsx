"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Moment = {
  id: string;
  label: string;
  emoji: string;
};

export default function Day06ConstellationCinematic({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const moments: Moment[] = useMemo(
    () => [
      { id: "risa", label: "Risa espontánea", emoji: "✨" },
      { id: "mirada", label: "Mirada tranquila", emoji: "✨" },
      { id: "silencio", label: "Silencio cómodo", emoji: "✨" },
      { id: "confianza", label: "Confianza", emoji: "✨" },
      { id: "paz", label: "Paz", emoji: "✨" },
      { id: "tarde", label: "Una tarde simple", emoji: "✨" },
      { id: "alegria", label: "Alegría real", emoji: "✨" },
    ],
    [],
  );

  const [on, setOn] = useState<Record<string, boolean>>({});

  const litCount = useMemo(
    () => moments.reduce((acc, m) => acc + (on[m.id] ? 1 : 0), 0),
    [moments, on],
  );

  const allLit = litCount === moments.length;

  useEffect(() => {
    if (allLit) {
      const t = setTimeout(() => onComplete(), 450);
      return () => clearTimeout(t);
    }
  }, [allLit, onComplete]);

  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white/70 backdrop-blur shadow-soft overflow-hidden">
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm md:text-base font-semibold text-zinc-900">
            Encendidas:{" "}
            <span className="tabular-nums">{litCount}</span> / {moments.length}
          </div>

          <div className="rounded-2xl bg-white border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700">
            Toca puntos ✨
          </div>
        </div>

        {/* grid compacto en móvil */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 md:gap-3 md:grid-cols-3">
          {moments.map((m) => {
            const active = !!on[m.id];

            return (
              <motion.button
                key={m.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setOn((prev) => ({ ...prev, [m.id]: !prev[m.id] }))
                }
                className={[
                  "rounded-2xl border px-3 py-3 md:px-4 md:py-4 text-left transition",
                  "min-h-[74px] md:min-h-[86px]",
                  active
                    ? "border-amber-200 bg-amber-50 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                    : "border-zinc-200 bg-white",
                ].join(" ")}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={[
                      "h-9 w-9 md:h-10 md:w-10 rounded-xl grid place-items-center border",
                      active
                        ? "bg-white border-amber-200"
                        : "bg-zinc-50 border-zinc-200",
                    ].join(" ")}
                  >
                    <span className="text-base md:text-lg">{m.emoji}</span>
                  </div>

                  <div className="min-w-0">
                    <div
                      className={[
                        "font-medium leading-tight",
                        "text-[12px] md:text-[13px]",
                        active ? "text-zinc-900" : "text-zinc-700",
                      ].join(" ")}
                    >
                      {m.label}
                    </div>
                    <div className="mt-1 text-[10px] md:text-[11px] text-zinc-500">
                      Toca para encender
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-zinc-600">
            <span>Progreso</span>
            <span className="tabular-nums">
              {litCount}/{moments.length} {allLit ? "• Listo ✨" : ""}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-zinc-900"
              style={{ width: `${(litCount / moments.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}