"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Act = 1 | 2 | 3 | 4;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Day14TrollQuest({ onWin }: { onWin: () => void }) {
  const [act, setAct] = useState<Act>(1);
  const [won, setWon] = useState(false);

  /* -------------------------
     ACT 1 — Items (bag)
  ------------------------- */
  const items = useMemo(
    () =>
      shuffle([
        { id: "i1", emoji: "🧿", label: "Amuleto" },
        { id: "i2", emoji: "🧤", label: "Guantes" },
        { id: "i3", emoji: "🧣", label: "Bufanda" },
        { id: "i4", emoji: "🕯️", label: "Vela" },
        { id: "i5", emoji: "🧭", label: "Brújula" },
        { id: "i6", emoji: "🪨", label: "Piedra" },
      ]),
    [],
  );

  const [bag, setBag] = useState<(string | null)[]>([null, null, null]);
  const bagDone = useMemo(() => bag.every(Boolean), [bag]);

  /* -------------------------
     ACT 2 — Ritual
  ------------------------- */
  const nodes = useMemo(
    () => [
      { id: "n1", x: 18, y: 62 },
      { id: "n2", x: 35, y: 28 },
      { id: "n3", x: 52, y: 62 },
      { id: "n4", x: 70, y: 28 },
      { id: "n5", x: 86, y: 62 },
    ],
    [],
  );

  const pattern = useMemo(() => ["n2", "n1", "n3", "n5", "n4"], []);
  const [seq, setSeq] = useState<string[]>([]);
  const [ritualOK, setRitualOK] = useState(false);

  const tapNode = (id: string) => {
    if (ritualOK) return;

    const nextIndex = seq.length;
    const expected = pattern[nextIndex];

    if (id !== expected) {
      setSeq([]); // reset suave
      return;
    }

    const next = [...seq, id];
    setSeq(next);
    if (next.length === pattern.length) setRitualOK(true);
  };

  /* -------------------------
     ACT 3 — Escape
  ------------------------- */
  const [lane, setLane] = useState<-1 | 1>(-1);
  const laneRef = useRef<-1 | 1>(-1);
  useEffect(() => {
    laneRef.current = lane;
  }, [lane]);

  const [rocks, setRocks] = useState<{ id: string; lane: -1 | 1; t: number }[]>(
    [],
  );
  const [escapeMs, setEscapeMs] = useState(5200);
  const escapeDone = escapeMs <= 0;

  const swipeStartX = useRef<number | null>(null);

  // ✅ loop del Acto 3 (con inicialización integrada)
  useEffect(() => {
    if (act !== 3) return;

    let alive = true;
    let initialized = false;

    // ✅ MÁS ESPACIO ENTRE ROCAS
    const rockEvery = 1150;

    // velocidad un pelín más suave para dar margen real
    const speed = 1.25;
    const tick = 40;

    // ✅ evita 2 rocas seguidas en el mismo carril
    let lastLane: -1 | 1 | null = null;
    const pickLane = (): -1 | 1 => {
      const l: -1 | 1 = Math.random() > 0.5 ? 1 : -1;
      if (l === lastLane) return pickLane();
      lastLane = l;
      return l;
    };

    const spawn = window.setInterval(() => {
      if (!alive) return;

      // Initialize on first interval tick
      if (!initialized) {
        initialized = true;
        setRocks([]);
        setLane(-1);
        setEscapeMs(5200);
      }

      setRocks((prev) => [
        ...prev,
        {
          id: `r_${Date.now()}_${Math.random()}`,
          lane: pickLane(),
          t: 0,
        },
      ]);
    }, rockEvery);

    const loop = window.setInterval(() => {
      if (!alive) return;

      setEscapeMs((ms) => Math.max(0, ms - tick));

      setRocks((prev) => {
        const next = prev
          .map((r) => ({ ...r, t: r.t + speed }))
          .filter((r) => r.t < 100);

        // ✅ colisión más justa (ventana más tarde)
        const currentLane = laneRef.current;
        const danger = next.find(
          (r) => r.t > 90 && r.t < 98 && r.lane === currentLane,
        );

        if (danger) {
          // reinicia escape rápido
          setEscapeMs(5200);
          return [];
        }

        return next;
      });
    }, tick);

    return () => {
      alive = false;
      window.clearInterval(spawn);
      window.clearInterval(loop);
    };
  }, [act]);

  /* -------------------------
     ACT TRANSITIONS (sin cascadas)
  ------------------------- */
  const finishedRef = useRef(false);

  useEffect(() => {
    if (act === 1 && bagDone) {
      const id = window.setTimeout(() => setAct(2), 420);
      return () => window.clearTimeout(id);
    }
  }, [act, bagDone]);

  useEffect(() => {
    if (act === 2 && ritualOK) {
      const id = window.setTimeout(() => setAct(3), 520);
      return () => window.clearTimeout(id);
    }
  }, [act, ritualOK]);

  useEffect(() => {
    if (act !== 3) return;
    if (!escapeDone) return;
    if (finishedRef.current) return;

    const id = window.setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setWon(true);
      setAct(4);
    }, 0);

    return () => window.clearTimeout(id);
  }, [act, escapeDone]);

  // ✅ dispara onWin una sola vez
  const onWinRef = useRef(false);
  useEffect(() => {
    if (!won) return;
    if (onWinRef.current) return;
    onWinRef.current = true;
    onWin();
  }, [won, onWin]);

  const resetAll = () => {
    onWinRef.current = false;
    finishedRef.current = false;

    setAct(1);
    setWon(false);
    setBag([null, null, null]);
    setSeq([]);
    setRitualOK(false);
    setLane(-1);
    setRocks([]);
    setEscapeMs(5200);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Progreso:{" "}
          <span className="font-semibold">
            {act === 4 ? "Final" : `Acto ${act}/3`}
          </span>
        </div>

        <button
          onClick={resetAll}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-emerald-50 p-4 overflow-hidden">
        <div className="relative rounded-2xl border border-white/70 bg-white/60 backdrop-blur shadow-soft overflow-hidden">
          <div className="absolute left-3 right-3 top-3 z-20">
            <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur px-4 py-3">
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                {act === 1
                  ? "Acto 1 — Prepárate (arrastrar)"
                  : act === 2
                    ? "Acto 2 — Ritual (orden exacto)"
                    : act === 3
                      ? "Acto 3 — Escape (swipe izquierda / derecha)"
                      : "Final — Mensaje"}
              </div>
            </div>
          </div>

          <div className="pt-[86px] px-3 pb-3">
            <AnimatePresence mode="wait">
              {act === 1 && (
                <motion.div
                  key="a1"
                  className="p-3 md:p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Act1DragBag
                    items={items}
                    bag={bag}
                    setBag={setBag}
                    done={bagDone}
                  />
                </motion.div>
              )}

              {act === 2 && (
                <motion.div
                  key="a2"
                  className="p-3 md:p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Act2Ritual
                    nodes={nodes}
                    pattern={pattern}
                    seq={seq}
                    ritualOK={ritualOK}
                    onTapNode={tapNode}
                    onReset={() => {
                      setSeq([]);
                      setRitualOK(false);
                    }}
                  />
                </motion.div>
              )}

              {act === 3 && (
                <motion.div
                  key="a3"
                  className="p-3 md:p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Act3Escape
                    lane={lane}
                    setLane={setLane}
                    rocks={rocks}
                    ms={escapeMs}
                    onSwipeStart={(x) => (swipeStartX.current = x)}
                    onSwipeEnd={(x) => {
                      if (swipeStartX.current == null) return;
                      const dx = x - swipeStartX.current;
                      swipeStartX.current = null;
                      if (Math.abs(dx) > 24) setLane(dx > 0 ? 1 : -1);
                    }}
                  />
                </motion.div>
              )}

              {act === 4 && (
                <motion.div
                  key="a4"
                  className="p-4 md:p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <FinalCard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   ACT 1 — DRAG ITEMS TO BAG
========================= */

function Act1DragBag({
  items,
  bag,
  setBag,
  done,
}: {
  items: { id: string; emoji: string; label: string }[];
  bag: (string | null)[];
  setBag: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  done: boolean;
}) {
  const filled = bag.filter(Boolean).length;

  const place = (itemId: string) => {
    setBag((prev) => {
      if (prev.includes(itemId)) return prev;
      const idx = prev.findIndex((x) => x == null);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = itemId;
      return next;
    });
  };

  const remove = (slot: number) => {
    setBag((prev) => {
      const next = [...prev];
      next[slot] = null;
      return next;
    });
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Elige 3 cosas
            </div>
            <div className="mt-1 text-xs text-zinc-600">
              AMantén presionado para arrastar las cosas y equipar tu mochila.
            </div>
          </div>
          <div className="text-xs px-3 py-1 rounded-full border bg-zinc-50 border-zinc-200 text-zinc-700">
            {filled}/3
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", it.id)}
              onClick={() => place(it.id)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-center shadow-soft active:scale-[0.99]"
            >
              <div className="text-2xl">{it.emoji}</div>
              <div className="mt-1 text-[10px] text-zinc-600">{it.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl border border-zinc-200 bg-white p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData("text/plain");
          if (id) place(id);
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Mochila</div>
            <div className="mt-1 text-xs text-zinc-600">
              Llénala para seguir.
            </div>
          </div>
          <div className="text-2xl">🎒</div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {bag.map((id, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => remove(idx)}
              className={`rounded-2xl border p-4 text-center ${
                id
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-zinc-50 text-zinc-500"
              }`}
              title={id ? "Toca para quitar" : "Vacío"}
            >
              <div className="text-2xl">{id ? "✓" : "—"}</div>
              <div className="mt-1 text-[10px] opacity-90">
                {id ? "Listo" : "Slot"}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <div className="text-sm font-semibold text-emerald-800">
                Perfecto. Ya estás listo.
              </div>
              <div className="mt-1 text-sm text-emerald-700">
                A veces lo importante es{" "}
                <span className="font-semibold">estar preparado</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =========================
   ACT 2 — RITUAL ORDER
========================= */

function Act2Ritual({
  nodes,
  pattern,
  seq,
  ritualOK,
  onTapNode,
  onReset,
}: {
  nodes: { id: string; x: number; y: number }[];
  pattern: string[];
  seq: string[];
  ritualOK: boolean;
  onTapNode: (id: string) => void;
  onReset: () => void;
}) {
  const nextId = pattern[seq.length];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">
            Ritual del valle
          </div>
          <div className="mt-1 text-xs text-zinc-600">
            Toca las runas en orden. Si fallas, se reinicia.
          </div>
        </div>

        <button
          onClick={onReset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Reiniciar
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-zinc-700">
          Progreso:{" "}
          <span className="font-semibold">
            {seq.length}/{pattern.length}
          </span>
        </div>
        <div className="text-xs px-3 py-1 rounded-full border bg-zinc-50 border-zinc-200 text-zinc-700">
          siguiente:{" "}
          <span className="font-semibold">{nextId ? "🧿" : "—"}</span>
        </div>
      </div>

      <div className="mt-4 relative h-[240px] md:h-[280px] rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-emerald-50 overflow-hidden">
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {seq.map((id, i) => {
            if (i === 0) return null;
            const a = nodes.find((n) => n.id === seq[i - 1])!;
            const b = nodes.find((n) => n.id === id)!;
            return (
              <line
                key={`${id}_${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(17,24,39,0.55)"
                strokeWidth="1.6"
              />
            );
          })}
        </svg>

        {nodes.map((n) => {
          const active = nextId === n.id && !ritualOK;
          const picked = seq.includes(n.id);

          return (
            <motion.button
              key={n.id}
              type="button"
              onClick={() => onTapNode(n.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border shadow-soft ${
                picked
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : active
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-zinc-200 bg-white text-zinc-800"
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%`, width: 54, height: 54 }}
              animate={
                active
                  ? { y: [0, -3, 0], rotate: [0, 1, 0, -1, 0] }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                duration: 1.8,
                repeat: active ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <div className="text-xl">{picked ? "✓" : "🧿"}</div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {ritualOK && (
          <motion.div
            className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div className="text-sm font-semibold text-emerald-800">
              Ritual completo.
            </div>
            <div className="mt-1 text-sm text-emerald-700">
              Cuando tú estás…{" "}
              <span className="font-semibold">todo encaja</span>.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================
   ACT 3 — ESCAPE SWIPE
========================= */

function Act3Escape({
  lane,
  setLane,
  rocks,
  ms,
  onSwipeStart,
  onSwipeEnd,
}: {
  lane: -1 | 1;
  setLane: (l: -1 | 1) => void;
  rocks: { id: string; lane: -1 | 1; t: number }[];
  ms: number;
  onSwipeStart: (x: number) => void;
  onSwipeEnd: (x: number) => void;
}) {
  const pct = clamp(ms / 5200, 0, 1);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Escape</div>
          <div className="mt-1 text-xs text-zinc-600">
            Swipe izquierda/derecha para esquivar. Si te golpea, reinicia.
          </div>
        </div>
        <div className="text-xl">🏃‍♀️</div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-zinc-200 overflow-hidden">
        <div
          className="h-full bg-zinc-900"
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      <div
        className="mt-4 relative h-[320px] md:h-[380px] rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 overflow-hidden select-none touch-none"
        onPointerDown={(e) => onSwipeStart(e.clientX)}
        onPointerUp={(e) => onSwipeEnd(e.clientX)}
        onPointerCancel={() => onSwipeStart(0)}
      >
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="border-r border-zinc-200/70" />
          <div />
        </div>

        <div className="absolute left-3 bottom-3 right-3 flex gap-2 z-20">
          <button
            type="button"
            onClick={() => setLane(-1)}
            className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              lane === -1
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white"
            }`}
          >
            ← Izq
          </button>
          <button
            type="button"
            onClick={() => setLane(1)}
            className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              lane === 1
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white"
            }`}
          >
            Der →
          </button>
        </div>

        <motion.div
          className="absolute bottom-[76px] md:bottom-[86px] h-12 w-12 rounded-2xl bg-zinc-900 text-white grid place-items-center shadow-soft z-10"
          animate={{ left: lane === -1 ? "25%" : "75%" }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{ transform: "translateX(-50%)" }}
        >
          🧍‍♀️
        </motion.div>

        {rocks.map((r) => (
          <motion.div
            key={r.id}
            className="absolute top-[-18px] h-9 w-9 rounded-2xl bg-zinc-200 border border-zinc-300 grid place-items-center shadow-soft"
            style={{
              left: r.lane === -1 ? "25%" : "75%",
              transform: "translateX(-50%)",
            }}
            animate={{ y: `${r.t * 3.1}px`, rotate: r.lane === -1 ? 8 : -8 }}
            transition={{ duration: 0.04, ease: "linear" }}
          >
            🪨
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FinalCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="text-xs text-zinc-600">Final</div>
      <div className="mt-1 text-lg md:text-xl font-semibold text-zinc-900">
        “Contigo, incluso el caos se vuelve algo lindo.”
      </div>
      <div className="mt-2 text-sm text-zinc-700 leading-relaxed">
        Porque tú tienes esa habilidad rara de hacer que uno se sienta en casa,
        aunque el mundo esté temblando.
      </div>
    </div>
  );
}
