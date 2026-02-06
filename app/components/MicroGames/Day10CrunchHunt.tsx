"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Bag = { id: string; crunchy: boolean; found: boolean };

const GRID = 5;
const TOTAL = GRID * GRID;
const MAX_TRIES = 5;

function makeBags() {
  const idx = Math.floor(Math.random() * TOTAL);
  return Array.from({ length: TOTAL }).map((_, i) => ({
    id: `b${i}`,
    crunchy: i === idx,
    found: false,
  }));
}

export default function Day10CrunchHunt({ onWin }: { onWin: () => void }) {
  const [bags, setBags] = useState<Bag[]>(() => makeBags());
  const [tries, setTries] = useState(0);
  const [won, setWon] = useState(false);

  const remaining = useMemo(() => Math.max(0, MAX_TRIES - tries), [tries]);

  useEffect(() => {
    if (!won) return;
    onWin();
  }, [won, onWin]);

  const reset = () => {
    setBags(makeBags());
    setTries(0);
    setWon(false);
  };

  const pick = (id: string) => {
    if (won) return;
    if (tries >= MAX_TRIES) return;

    // ✅ evita contar doble click en el mismo
    const already = bags.find((b) => b.id === id)?.found;
    if (already) return;

    setBags((prev) =>
      prev.map((b) => (b.id === id ? { ...b, found: true } : b)),
    );
    setTries((t) => t + 1);

    const chosen = bags.find((b) => b.id === id);
    if (chosen?.crunchy) setWon(true);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Intentos: <span className="font-semibold">{remaining}</span> /{" "}
          {MAX_TRIES}
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      {/* ✅ 5 columnas */}
      <div className="mt-3 grid grid-cols-5 gap-2">
        {bags.map((b) => {
          const disabled = won || tries >= MAX_TRIES;
          const show = b.found;

          return (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => pick(b.id)}
              disabled={disabled}
              className="relative rounded-2xl border border-zinc-200 bg-white p-3 shadow-soft overflow-hidden"
              whileTap={{ scale: 0.98 }}
              animate={
                !show && !disabled && b.crunchy
                  ? { y: [0, -2, 0], rotate: [0, 1, 0, -1, 0] }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                duration: 2.2,
                repeat: !show && !disabled && b.crunchy ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-white" />
              <div className="relative grid place-items-center">
                <div className="text-xl">🥔</div>
                <div className="mt-1 text-[10px] text-zinc-600">
                  {show ? (b.crunchy ? "CRUNCH 😌" : "no :(") : "?"}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4">
        {won ? (
          <>
            <div className="text-sm font-semibold text-zinc-900">
              Ese era. Perfecto.
            </div>
            <div className="mt-1 text-sm text-zinc-700">
              “Lo simple contigo… siempre cae bien.”
            </div>
          </>
        ) : tries >= MAX_TRIES ? (
          <>
            <div className="text-sm font-semibold text-zinc-900">Casi 😅</div>
            <div className="mt-1 text-sm text-zinc-700">
              Repite y fíjate cuál es distinta.
            </div>
          </>
        ) : (
          <div className="text-sm text-zinc-700"></div>
        )}
      </div>
    </div>
  );
}
