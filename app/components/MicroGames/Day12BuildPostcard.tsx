"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Sticker = {
  id: string;
  emoji: string;
  label: string;
  placed: boolean;
};

const STICKERS: Sticker[] = [
  { id: "sun", emoji: "☀️", label: "Sol", placed: false },
  { id: "wave", emoji: "🌊", label: "Ola", placed: false },
  { id: "shell", emoji: "🐚", label: "Concha", placed: false },
  { id: "palm", emoji: "🌴", label: "Palmera", placed: false },
  { id: "towel", emoji: "🧺", label: "Toalla", placed: false },
  { id: "lens", emoji: "🕶️", label: "Lentes", placed: false },
];

export default function Day12BuildPostcard({ onWin }: { onWin: () => void }) {
  const [s, setS] = useState<Sticker[]>(() => STICKERS.map((x) => ({ ...x })));

  const doneCount = useMemo(() => s.filter((x) => x.placed).length, [s]);
  const done = doneCount === s.length;

  useEffect(() => {
    if (done) onWin();
  }, [done, onWin]);

  const place = (id: string) => {
    if (done) return;
    setS((prev) => prev.map((x) => (x.id === id ? { ...x, placed: true } : x)));
  };

  const reset = () => setS(STICKERS.map((x) => ({ ...x })));

  // “sombras” guía (posiciones suaves)
  const targets: Record<string, { left: string; top: string }> = {
    sun: { left: "78%", top: "14%" },
    wave: { left: "50%", top: "56%" },
    shell: { left: "18%", top: "78%" },
    palm: { left: "18%", top: "36%" },
    towel: { left: "70%", top: "78%" },
    lens: { left: "54%", top: "76%" },
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Postal:{" "}
          <span className="font-semibold">
            {doneCount}/{s.length}
          </span>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <div className="text-sm font-semibold text-zinc-900">
          Construye la postal
        </div>
        <div className="mt-1 text-sm text-zinc-700">
          Toca cada sticker para “colocarlo” en su sombra.
        </div>

        <div className="mt-4 relative h-[320px] overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-cyan-100 via-cyan-50 to-amber-100">
          {/* mar */}
          <div className="absolute left-0 right-0 top-[42%] h-[22%] bg-cyan-200/55" />
          {/* arena */}
          <div className="absolute left-0 right-0 top-[64%] bottom-0 bg-amber-200/55" />

          {/* sombras guía */}
          {s.map((x) => (
            <div
              key={`t-${x.id}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: targets[x.id].left, top: targets[x.id].top }}
            >
              <div
                className={`h-12 w-12 rounded-2xl border border-white/70 bg-white/35 backdrop-blur ${
                  x.placed ? "opacity-0" : "opacity-60"
                }`}
              />
            </div>
          ))}

          {/* stickers colocados */}
          {s
            .filter((x) => x.placed)
            .map((x) => (
              <motion.div
                key={`p-${x.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl"
                style={{ left: targets[x.id].left, top: targets[x.id].top }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                {x.emoji}
              </motion.div>
            ))}

          {done && (
            <motion.div
              className="absolute left-3 right-3 bottom-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="text-sm font-semibold text-zinc-900">
                Postal lista ✨
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                “Contigo todo se ve más bonito.”
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {s.map((x) => (
            <button
              key={x.id}
              onClick={() => place(x.id)}
              disabled={x.placed || done}
              className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                x.placed
                  ? "border-zinc-200 bg-zinc-100 text-zinc-400"
                  : "border-zinc-200 bg-white text-zinc-900"
              }`}
            >
              <span className="mr-2">{x.emoji}</span>
              {x.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
