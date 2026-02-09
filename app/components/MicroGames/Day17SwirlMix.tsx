"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

type PieceType = "scoop" | "topping";

type Piece = {
  id: string;
  type: PieceType;
  label: string;
  emoji: string;
};

type Placed = {
  id: string;
  type: PieceType;
  emoji: string;
  index: number;
};

const SCOOPS: Piece[] = [
  // ✅ obligatorios para ganar
  { id: "s_choco", type: "scoop", label: "Chocolate", emoji: "🍫" },
  { id: "s_mint", type: "scoop", label: "Menta", emoji: "🌿" },

  // extras
  { id: "s_vain", type: "scoop", label: "Vainilla", emoji: "🍦" },
  { id: "s_straw", type: "scoop", label: "Fresa", emoji: "🍓" },
  { id: "s_blue", type: "scoop", label: "Arándano", emoji: "🫐" },
  { id: "s_mango", type: "scoop", label: "Mango", emoji: "🥭" },
];

const TOPPINGS: Piece[] = [
  { id: "t_cherry", type: "topping", label: "Cereza", emoji: "🍒" },
  { id: "t_cookie", type: "topping", label: "Galleta", emoji: "🍪" },
  { id: "t_spark", type: "topping", label: "Sprinkles", emoji: "✨" },
];

export default function Day17BuildIceCream({ onWin }: { onWin: () => void }) {
  const tray = useMemo(() => {
    const all = [...SCOOPS, ...TOPPINGS];
    return [...all].sort(() => Math.random() - 0.5);
  }, []);

  const [placed, setPlaced] = useState<Placed[]>([]);
  const [won, setWon] = useState(false);

  const scoopsCount = useMemo(
    () => placed.filter((p) => p.type === "scoop").length,
    [placed],
  );
  const toppingsCount = useMemo(
    () => placed.filter((p) => p.type === "topping").length,
    [placed],
  );

  const hasChocolate = useMemo(
    () => placed.some((p) => p.emoji === "🍫"),
    [placed],
  );
  const hasMint = useMemo(() => placed.some((p) => p.emoji === "🌿"), [placed]);

  const MAX_STACK = 5;
  const canWin =
    scoopsCount >= 3 &&
    toppingsCount >= 1 &&
    placed.length <= MAX_STACK &&
    hasChocolate &&
    hasMint;

  const wonRef = useRef(false);
  useEffect(() => {
    if (!canWin || wonRef.current) return;
    wonRef.current = true;
    setWon(true);
    onWin();
  }, [canWin, onWin]);

  const cupRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     DRAG (iOS PRO / window listeners)
  ========================= */
  const [drag, setDrag] = useState<{
    id: string | null;
    emoji: string;
    active: boolean;
    x: number;
    y: number;
  }>({ id: null, emoji: "", active: false, x: 0, y: 0 });

  const draggingPieceRef = useRef<Piece | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  // Guardamos posición real en ref (más confiable que state para el drop)
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const startDrag = (e: React.PointerEvent, piece: Piece) => {
    if (won) return;

    const already = placed.some((p) => p.id === piece.id);
    if (already) return;

    if (placed.length >= MAX_STACK) return;

    // 🔥 clave para iOS: evitar selección / contexto
    e.preventDefault();

    pointerIdRef.current = e.pointerId;
    draggingPieceRef.current = piece;

    posRef.current = { x: e.clientX, y: e.clientY };

    setDrag({
      id: piece.id,
      emoji: piece.emoji,
      active: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const finishDrag = () => {
    if (!drag.active) return;

    const piece = draggingPieceRef.current;
    draggingPieceRef.current = null;
    pointerIdRef.current = null;

    const cup = cupRef.current;
    const { x, y } = posRef.current;

    const inCup = (() => {
      if (!cup) return false;
      const r = cup.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    })();

    if (piece && inCup) {
      setPlaced((prev) => {
        if (prev.some((p) => p.id === piece.id)) return prev;
        if (prev.length >= MAX_STACK) return prev;
        const nextIndex = prev.length;
        return [
          ...prev,
          { id: piece.id, type: piece.type, emoji: piece.emoji, index: nextIndex },
        ];
      });
    }

    setDrag({ id: null, emoji: "", active: false, x: 0, y: 0 });
  };

  // ✅ listeners globales (soluciona el drag en iPhone)
  useEffect(() => {
    if (!drag.active) return;

    const onMove = (ev: PointerEvent) => {
      if (pointerIdRef.current == null) return;
      if (ev.pointerId !== pointerIdRef.current) return;

      // evitar scroll / rubber band
      ev.preventDefault?.();

      posRef.current = { x: ev.clientX, y: ev.clientY };
      setDrag((d) => (d.active ? { ...d, x: ev.clientX, y: ev.clientY } : d));
    };

    const onUp = (ev: PointerEvent) => {
      if (pointerIdRef.current == null) return;
      if (ev.pointerId !== pointerIdRef.current) return;
      ev.preventDefault?.();
      finishDrag();
    };

    const onCancel = (ev: PointerEvent) => {
      if (pointerIdRef.current == null) return;
      if (ev.pointerId !== pointerIdRef.current) return;
      ev.preventDefault?.();
      finishDrag();
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { passive: false });
    window.addEventListener("pointercancel", onCancel, { passive: false });

    return () => {
      window.removeEventListener("pointermove", onMove as any);
      window.removeEventListener("pointerup", onUp as any);
      window.removeEventListener("pointercancel", onCancel as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag.active]);

  const reset = () => {
    setPlaced([]);
    setWon(false);
    wonRef.current = false;

    setDrag({ id: null, emoji: "", active: false, x: 0, y: 0 });
    draggingPieceRef.current = null;
    pointerIdRef.current = null;
  };

  const status = useMemo(() => {
    if (won) return { tone: "ok", text: "Helado perfecto ✨" };

    const missing: string[] = [];
    if (!hasChocolate) missing.push("🍫");
    if (!hasMint) missing.push("🌿");
    if (scoopsCount < 3) missing.push("3 bolitas");
    if (toppingsCount < 1) missing.push("1 topping");

    return {
      tone: missing.length ? "wait" : "ok",
      text: missing.length
        ? `Falta: ${missing.join(" · ")}`
        : "¡Casi! suéltalo en la copa",
    };
  }, [won, hasChocolate, hasMint, scoopsCount, toppingsCount]);

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Heladito 🍫🌿</div>
          <div className="mt-1 text-sm text-zinc-700">
            Arma tu helado. Para ganar debe tener{" "}
            <span className="font-semibold">Chocolate 🍫</span> y{" "}
            <span className="font-semibold">Menta 🌿</span>.
          </div>
        </div>

        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div
          className={`text-[11px] px-3 py-1 rounded-full border ${
            status.tone === "ok"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-white border-zinc-200 text-zinc-600"
          }`}
        >
          {status.text}
        </div>

        <div className="text-xs text-zinc-600">
          En copa: <span className="font-semibold">{placed.length}/{MAX_STACK}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* TRAY */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm font-semibold text-zinc-900">Elige y arrastra</div>
          <div className="mt-1 text-xs text-zinc-600">
            Mantén presionado y arrastra.
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {tray.map((p) => {
              const used = placed.some((x) => x.id === p.id);
              const disabled = used || won || placed.length >= MAX_STACK;

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border bg-white p-3 grid place-items-center ${
                    disabled ? "opacity-40" : "active:scale-[0.99]"
                  }`}
                  // ✅ iOS anti-copy + anti-select + anti-callout
                  style={{
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                    touchAction: "none",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onPointerDown={(e) => !disabled && startDrag(e, p)}
                >
                  <div className="text-2xl">{p.emoji}</div>
                  <div className="mt-1 text-[10px] text-zinc-600 text-center">
                    {p.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-zinc-600">
            Reglas: 3 bolitas + 1 topping + <span className="font-semibold">🍫</span> +{" "}
            <span className="font-semibold">🌿</span>.
          </div>
        </div>

        {/* CUP */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">Tu copa</div>
            <div className="text-xl">🍨</div>
          </div>

          <div
            ref={cupRef}
            className="mt-3 relative h-[360px] rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 overflow-hidden"
            style={{
              WebkitUserSelect: "none",
              userSelect: "none",
              WebkitTouchCallout: "none",
              touchAction: "none",
            }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* base copa */}
            <div className="absolute inset-x-0 bottom-6 grid place-items-center">
              <div className="relative w-48 h-52">
                <div className="absolute inset-x-0 top-10 h-36 rounded-[28px] border border-zinc-200 bg-white shadow-soft" />
                <div className="absolute inset-x-10 top-0 h-16 rounded-[26px] border border-zinc-200 bg-white shadow-soft" />
                <div className="absolute inset-x-16 bottom-0 h-10 rounded-[22px] border border-zinc-200 bg-white shadow-soft" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/55 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* stack */}
            <AnimatePresence>
              {placed.map((p) => {
                const baseY = 250;
                const gap = 44;
                const y = baseY - p.index * gap;
                const wobble = (p.index % 2 === 0 ? -10 : 10) * 0.6;

                return (
                  <motion.div
                    key={p.id}
                    className="absolute left-1/2 text-[44px]"
                    style={{
                      top: y,
                      transform: `translate(-50%, -50%) translateX(${wobble}px)`,
                      filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.10))",
                    }}
                    initial={{ scale: 0.7, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {p.emoji}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {!won && (
              <div className="absolute left-3 right-3 top-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-3 text-center">
                <div className="text-[11px] text-zinc-600">
                  Suelta aquí. Obligatorio: <span className="font-semibold">🍫</span> y{" "}
                  <span className="font-semibold">🌿</span>
                </div>
              </div>
            )}

            {won && (
              <motion.div
                className="absolute left-3 right-3 bottom-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="text-sm font-semibold text-emerald-800">
                  Chocolate + Menta… combinación top ✔✨
                </div>
                <div className="mt-1 text-sm text-emerald-700">
                  “Dos sabores raros… pero contigo funcionan increíble.”
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Drag ghost */}
      <AnimatePresence>
        {drag.active && (
          <motion.div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: drag.x,
              top: drag.y,
              transform: "translate(-50%, -70%)",
              filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.18))",
            }}
            initial={{ scale: 0.95, opacity: 0.9 }}
            animate={{ scale: 1.05, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-[44px]">{drag.emoji}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}