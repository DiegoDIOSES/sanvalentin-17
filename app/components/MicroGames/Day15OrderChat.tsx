"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, Reorder } from "framer-motion";

type Msg = { id: string; text: string };

const CORRECT: Msg[] = [
  { id: "m1", text: "Oye 😌" },
  { id: "m2", text: "¿Te digo algo bonito?" },
  { id: "m3", text: "Me encanta cómo te ríes." },
  { id: "m4", text: "Y cómo haces que todo se sienta fácil." },
  { id: "m5", text: "Listo. Ya lo dije 🙈" },
];

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Day15OrderChat({ onWin }: { onWin: () => void }) {
  const [items, setItems] = useState<Msg[]>(() => shuffle(CORRECT));
  const [won, setWon] = useState(false);

  const ok = useMemo(() => {
    if (items.length !== CORRECT.length) return false;
    return items.every((x, i) => x.id === CORRECT[i].id);
  }, [items]);

  useEffect(() => {
    if (ok && !won) {
      setWon(true);
      onWin();
    }
  }, [ok, won, onWin]);

  const reset = () => {
    setItems(shuffle(CORRECT));
    setWon(false);
  };

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">
            Ordena el chat
          </div>
          <div className="mt-1 text-sm text-zinc-700">
            Arrastra para armar la conversación.
          </div>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="space-y-2"
        >
          {items.map((m, idx) => (
            <Reorder.Item
              key={m.id}
              value={m}
              className={`rounded-2xl px-4 py-3 text-sm border ${
                idx % 2 === 0
                  ? "bg-white border-zinc-200 text-zinc-900"
                  : "bg-emerald-50 border-emerald-200 text-zinc-900"
              }`}
            >
              {m.text}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
        {won ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-sm font-semibold text-zinc-900">
              Mensaje enviado ✔✔
            </div>
            <div className="mt-1 text-sm text-zinc-700">
              “Y sí… era para ti.”
            </div>
          </motion.div>
        ) : (
          <div className="text-sm text-zinc-700">
            Tip: la conversación debe “fluir”.
          </div>
        )}
      </div>
    </div>
  );
}
