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

type DragState = {
  id: ItemId;
  emoji: string;
  x: number;
  y: number;
  active: boolean;
} | null;

export default function Day11WarmUp({ onWin }: { onWin: () => void }) {
  const [items, setItems] = useState<Item[]>(ITEMS.map((i) => ({ ...i })));
  const [drag, setDrag] = useState<DragState>(null);

  const dropRef = useRef<HTMLDivElement | null>(null);

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
    setDrag(null);
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

  const isInsideDrop = (clientX: number, clientY: number) => {
    const el = dropRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return (
      clientX >= r.left &&
      clientX <= r.right &&
      clientY >= r.top &&
      clientY <= r.bottom
    );
  };

  const startDrag = (id: ItemId, emoji: string) => (e: React.PointerEvent) => {
    const it = items.find((x) => x.id === id);
    if (!it || it.added) return;

    // importante: evitar selección / scroll raro
    e.preventDefault();

    // capturar pointer para seguir moviendo aunque el dedo salga del botón
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    setDrag({
      id,
      emoji,
      x: e.clientX,
      y: e.clientY,
      active: true,
    });
  };

  const moveDrag = (e: React.PointerEvent) => {
    if (!drag?.active) return;
    e.preventDefault();
    setDrag((prev) =>
      prev ? { ...prev, x: e.clientX, y: e.clientY } : prev,
    );
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!drag?.active) return;
    e.preventDefault();

    const ok = isInsideDrop(e.clientX, e.clientY);
    const droppedId = drag.id;

    setDrag(null);

    if (ok) addItem(droppedId);
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
            Arrastra el emoji al muñeco de nieve ⛄️
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2">
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                onPointerDown={startDrag(it.id, it.emoji)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={() => setDrag(null)}
                onContextMenu={(e) => e.preventDefault()} // iOS long-press menu
                className={`rounded-2xl border bg-white p-3 grid place-items-center text-2xl ${
                  it.added ? "opacity-40" : "active:scale-[0.99]"
                }`}
                disabled={it.added}
                style={{
                  touchAction: "none", // clave: permite drag suave en mobile
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  WebkitTouchCallout: "none", // clave: evita “copiar”
                }}
              >
                {it.emoji}
              </button>
            ))}
          </div>

          <div className="mt-3 text-[11px] text-zinc-600">
            Tip: suelta el emoji encima del muñeco para colocarlo.
          </div>
        </div>

        {/* MUÑECO */}
        <div
          ref={dropRef}
          className="relative rounded-2xl border border-zinc-200 bg-white overflow-hidden h-[420px]"
          style={{
            touchAction: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
          }}
          onContextMenu={(e) => e.preventDefault()}
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

          {/* highlight si estás encima */}
          {drag?.active && (
            <div
              className={`absolute inset-0 pointer-events-none transition ${
                drag ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-3 rounded-2xl border border-emerald-300/60 bg-emerald-200/10" />
            </div>
          )}

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

      {/* EMOJI FLOTANTE (drag ghost) */}
      <AnimatePresence>
        {drag?.active && (
          <motion.div
            className="fixed z-[9999] text-4xl pointer-events-none"
            style={{
              left: drag.x,
              top: drag.y,
              transform: "translate(-50%, -60%)",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {drag.emoji}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}