"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Layer = {
  id: string;
  label: string;
  emoji: string;
  added: boolean;
  heat: number;
};

const BASE: Layer[] = [
  { id: "scarf", label: "Bufanda", emoji: "🧣", added: false, heat: 28 },
  { id: "hat", label: "Gorro", emoji: "🧢", added: false, heat: 22 },
  { id: "gloves", label: "Guantes", emoji: "🧤", added: false, heat: 25 },
  { id: "coat", label: "Abrigo", emoji: "🧥", added: false, heat: 35 },
];

export default function Day11WarmUp({ onWin }: { onWin: () => void }) {
  const [layers, setLayers] = useState<Layer[]>(() =>
    BASE.map((x) => ({ ...x })),
  );
  const heat = useMemo(
    () => layers.reduce((acc, l) => acc + (l.added ? l.heat : 0), 10),
    [layers],
  );
  const done = heat >= 100;

  useEffect(() => {
    if (done) onWin();
  }, [done, onWin]);

  const toggle = (id: string) => {
    if (done) return;
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, added: !l.added } : l)),
    );
  };

  const reset = () => setLayers(BASE.map((x) => ({ ...x })));

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Calor: <span className="font-semibold">{Math.min(100, heat)}%</span>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Abriga el corazón
            </div>
            <div className="mt-1 text-sm text-zinc-700">
              Agrega capas hasta llegar a 100%.
            </div>
          </div>
          <motion.div
            className="text-3xl"
            animate={done ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, repeat: done ? Infinity : 0 }}
          >
            {done ? "🔥" : "❄️"}
          </motion.div>
        </div>

        <div className="mt-3 h-2 rounded-full bg-zinc-200 overflow-hidden">
          <div
            className="h-full bg-zinc-900"
            style={{ width: `${Math.min(100, heat)}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {layers.map((l) => (
            <button
              key={l.id}
              onClick={() => toggle(l.id)}
              className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                l.added
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900"
              }`}
            >
              <span className="mr-2">{l.emoji}</span>
              {l.label}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-zinc-700">
          {done ? (
            <>
              “Si hace frío… yo te abrigo.”{" "}
              <span className="font-semibold">🤍</span>
            </>
          ) : (
            "Tip: el abrigo calienta bastante 😉"
          )}
        </div>
      </div>
    </div>
  );
}
