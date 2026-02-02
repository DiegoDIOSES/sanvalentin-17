"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type Node = {
  id: string;
  label: string;
  x: number; // %
  y: number; // %
};

const NODES: Node[] = [
  { id: "a", label: "Risa espontánea", x: 18, y: 52 },
  { id: "b", label: "Mirada tranquila", x: 36, y: 34 },
  { id: "c", label: "Una tarde simple", x: 54, y: 52 },
  { id: "d", label: "Silencio cómodo", x: 72, y: 36 },
  { id: "e", label: "Confianza", x: 28, y: 70 },
  { id: "f", label: "Paz", x: 50, y: 72 },
  { id: "g", label: "Alegría real", x: 70, y: 66 },
];

const EDGES = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
  ["a", "e"],
  ["e", "f"],
  ["f", "g"],
  ["c", "f"],
] as const;

export default function Day06ConstellationCinematic({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const activatedCount = useMemo(
    () => Object.values(active).filter(Boolean).length,
    [active],
  );

  const allDone = activatedCount === NODES.length;

  const activate = (id: string) => {
    setActive((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      return next;
    });
  };

  // cuando todos se encienden
  if (allDone) {
    setTimeout(() => onComplete(), 650);
  }

  const isEdgeOn = (a: string, b: string) => !!active[a] && !!active[b];

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-zinc-200 bg-white/65 backdrop-blur shadow-soft p-4 md:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-rose-50/40 to-amber-50/50" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between text-xs text-zinc-700">
          <div>
            Encendidas:{" "}
            <span className="font-semibold">{activatedCount}</span> /{" "}
            {NODES.length}
          </div>
          <div className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-[11px]">
            Toca puntos ✨
          </div>
        </div>

        <div className="mt-4 relative h-[380px] md:h-[420px] rounded-2xl border border-white/70 bg-white/55 overflow-hidden">
          {/* líneas */}
          <svg
            className="absolute inset-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {EDGES.map(([a, b]) => {
              const A = NODES.find((n) => n.id === a)!;
              const B = NODES.find((n) => n.id === b)!;
              const on = isEdgeOn(a, b);
              return (
                <motion.line
                  key={`${a}-${b}`}
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke={on ? "rgba(17,24,39,0.55)" : "rgba(17,24,39,0.12)"}
                  strokeWidth={on ? 0.8 : 0.45}
                  initial={false}
                />
              );
            })}
          </svg>

          {/* polvo estelar */}
          <StarDust />

          {/* nodos */}
          {NODES.map((n) => {
            const on = !!active[n.id];
            return (
              <div
                key={n.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <motion.button
                  type="button"
                  onClick={() => activate(n.id)}
                  className="relative h-16 w-16 md:h-20 md:w-20 rounded-3xl border border-white/70 bg-white/65 backdrop-blur shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                  whileTap={{ scale: 0.98 }}
                  animate={
                    on
                      ? { scale: [1, 1.06, 1], boxShadow: "0 0 0 10px rgba(251,191,36,0.18)" }
                      : { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
                  }
                  transition={{ duration: 1.1, repeat: on ? Infinity : 0 }}
                  aria-label={n.label}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-transparent" />
                  <div className="relative h-full w-full grid place-items-center">
                    <motion.div
                      className="text-xl md:text-2xl"
                      animate={on ? { rotate: [0, 2, 0, -2, 0] } : { rotate: 0 }}
                      transition={{
                        duration: 3.4,
                        repeat: on ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    >
                      ✨
                    </motion.div>
                  </div>
                </motion.button>

                <motion.div
                  className="mt-2 text-center text-xs md:text-sm text-zinc-700"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: on ? 1 : 0.75 }}
                >
                  {n.label}
                </motion.div>
              </div>
            );
          })}

          {/* mensaje final */}
          {allDone && (
            <motion.div
              className="absolute left-4 right-4 bottom-4 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur p-4 text-center"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="text-xs text-zinc-600">Listo.</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Se conectó el momento.
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                Ahora… viene lo importante.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StarDust() {
  const dots = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 1 + Math.random() * 1.6,
      d: 2.8 + Math.random() * 2.8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-zinc-900/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.s * 3}px`,
            height: `${p.s * 3}px`,
          }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}