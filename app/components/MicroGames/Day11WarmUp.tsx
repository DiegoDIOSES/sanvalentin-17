"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ItemId =
  | "hat"
  | "scarf"
  | "gloves"
  | "coat"
  | "boots"
  | "hot"
  | "wind"
  | "snow";

type Item = {
  id: ItemId;
  label: string;
  emoji: string;
  added: boolean;
};

const ITEMS: Item[] = [
  { id: "hat", label: "Gorro", emoji: "🧢", added: false },
  { id: "scarf", label: "Bufanda", emoji: "🧣", added: false },
  { id: "gloves", label: "Guantes", emoji: "🧤", added: false },
  { id: "coat", label: "Abrigo", emoji: "🧥", added: false },
  { id: "boots", label: "Botas", emoji: "🥾", added: false },
  { id: "hot", label: "Chocolate", emoji: "☕️", added: false },
  { id: "wind", label: "Viento", emoji: "🌬️", added: false },
  { id: "snow", label: "Nieve", emoji: "🌨️", added: false },
];

export default function Day11WarmUp({ onWin }: { onWin: () => void }) {
  const [items, setItems] = useState<Item[]>(ITEMS.map((i) => ({ ...i })));
  const [draggingId, setDraggingId] = useState<ItemId | null>(null);

  const addedCount = useMemo(
    () => items.filter((i) => i.added).length,
    [items],
  );
  const done = addedCount === items.length;

  const wonRef = useRef(false);
  useEffect(() => {
    if (!done || wonRef.current) return;
    wonRef.current = true;
    onWin();
  }, [done, onWin]);

  const reset = () => {
    setItems(ITEMS.map((i) => ({ ...i })));
    setDraggingId(null);
    wonRef.current = false;
  };

  const addItem = (id: ItemId) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, added: true } : i)),
    );
  };

  const positions: Record<ItemId, { top: string; left: string }> = {
    hat: { top: "8%", left: "50%" },
    scarf: { top: "28%", left: "50%" },
    gloves: { top: "40%", left: "30%" },
    coat: { top: "48%", left: "50%" },
    boots: { top: "78%", left: "50%" },
    hot: { top: "52%", left: "72%" },
    wind: { top: "20%", left: "78%" },
    snow: { top: "18%", left: "22%" },
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-700">
          Objetos: <span className="font-semibold">{addedCount}/8</span>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 grid md:grid-cols-2 gap-4">
        {/* EMOJIS */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm font-semibold text-zinc-900">
            Arrastra los emojis
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {items.map((it) => (
              <div
                key={it.id}
                draggable={!it.added}
                onDragStart={() => setDraggingId(it.id)}
                onDragEnd={() => setDraggingId(null)}
                className={`rounded-2xl border bg-white p-3 grid place-items-center text-2xl cursor-grab ${
                  it.added ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                {it.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* MUÑECO */}
        <div
          className="relative rounded-2xl border border-zinc-200 bg-white overflow-hidden h-[420px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggingId) addItem(draggingId);
            setDraggingId(null);
          }}
        >
          {/* imagen base */}
          <img
            src="/images/snowman.png"
            alt="Muñeco de nieve"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />

          {/* overlays */}
          <AnimatePresence>
            {items
              .filter((i) => i.added)
              .map((i) => (
                <motion.div
                  key={i.id}
                  className="absolute text-3xl"
                  style={{
                    top: positions[i.id].top,
                    left: positions[i.id].left,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  {i.emoji}
                </motion.div>
              ))}
          </AnimatePresence>

          {/* mensaje final */}
          {done && (
            <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 border border-zinc-200 p-4 text-center">
              <div className="text-sm font-semibold">
                “Si hace frío… yo te abrigo.” 🤍
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
