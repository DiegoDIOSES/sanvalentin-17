"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function r(n: number) {
  return Math.floor(Math.random() * n);
}

function makePuzzle() {
  const a = r(9) + 1;
  const b = r(9) + 1;
  const c = r(9) + 1;
  const d = r(9) + 1;

  // código
  const code = `${a}${b}${c}${d}`;

  // pistas simples y rápidas (sin texto largo)
  const hint1 = `1º dígito = ${a}`;
  const hint2 = `2º dígito = ${b}`;
  const hint3 = `3º dígito = ${c}`;
  const hint4 = `4º dígito = ${d}`;

  return { code, hints: [hint1, hint2, hint3, hint4] };
}

export default function Day13EscapeCode({ onWin }: { onWin: () => void }) {
  const [p, setP] = useState(() => makePuzzle());
  const [input, setInput] = useState("");
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (won) onWin();
  }, [won, onWin]);

  const ok = useMemo(() => input === p.code, [input, p.code]);

  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setWon(false);
  };

  const submit = () => {
    if (ok) setWon(true);
  };

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">
            Candado (4 dígitos)
          </div>
          <div className="mt-1 text-sm text-zinc-700">
            Lee las 4 pistas y escribe el código.
          </div>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Nuevo 🔁
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {p.hints.map((h) => (
          <div
            key={h}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700"
          >
            {h}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="____"
          className="w-32 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold tracking-[0.3em] text-center"
        />
        <button
          onClick={submit}
          className="flex-1 rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
        >
          Abrir 🔓
        </button>
      </div>

      {won && (
        <motion.div
          className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-sm font-semibold text-zinc-900">¡Abierto! ✔</div>
          <div className="mt-1 text-sm text-zinc-700">
            “Siempre encuentras la salida… y eso me encanta.”
          </div>
        </motion.div>
      )}
    </div>
  );
}
