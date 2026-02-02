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
  { id: "risa", label: "Risa espontánea", x: 18, y: 55 },
  { id: "mirada", label: "Mirada tranquila", x: 38, y: 35 },
  { id: "silencio", label: "Silencio cómodo", x: 74, y: 35 },
  { id: "tarde", label: "Una tarde simple", x: 58, y: 56 },
  { id: "alegria", label: "Alegría real", x: 78, y: 68 },
  { id: "confianza", label: "Confianza", x: 30, y: 72 },
  { id: "paz", label: "Paz", x: 55, y: 78 },
];

// orden “cinemático” de conexión
const ORDER = ["risa", "mirada", "silencio", "tarde", "alegria", "paz", "confianza"];

export default function Day06ConstellationCinematic({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [lit, setLit] = useState<Record<string, boolean>>({});

  const litCount = useMemo(
    () => Object.values(lit).filter(Boolean).length,
    [lit],
  );

  const allDone = litCount >= NODES.length;

  const lines = useMemo(() => {
    // conecta solo si ambos están encendidos y siguiendo el ORDER
    const pts = ORDER.map((id) => NODES.find((n) => n.id === id)!).filter(Boolean);

    const segments: Array<{ a: Node; b: Node; key: string }> = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      if (lit[a.id] && lit[b.id]) segments.push({ a, b, key: `${a.id}-${b.id}` });
    }
    return segments;
  }, [lit]);

  const handleTap = (id: string) => {
    setLit((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      // si justo terminó, dispara onComplete con micro delay para que se vea el último glow
      const nextCount = Object.values(next).filter(Boolean).length;
      if (nextCount === NODES.length) {
        setTimeout(() => onComplete(), 420);
      }
      return next;
    });
  };

  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white/65 backdrop-blur shadow-soft overflow-hidden">
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-700">
            Encendidas: <span className="font-semibold">{litCount}</span> / {NODES.length}
          </div>
          <div className="text-xs px-3 py-1 rounded-full border bg-white border-zinc-200 text-zinc-700">
            Toca puntos ✨
          </div>
        </div>
      </div>

      <div className="px-4 md:px-5 pb-5">
        <div className="relative rounded-[22px] border border-zinc-200 bg-gradient-to-br from-white via-white to-amber-50/40 overflow-hidden">
          {/* “cielo” suave */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.35)_1px,transparent_0)] [background-size:18px_18px]" />

          {/* área */}
          <div className="relative h-[360px] md:h-[420px]">
            {/* líneas */}
            <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              {lines.map(({ a, b, key }) => (
                <motion.line
                  key={key}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="rgba(24,24,27,0.20)"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45 }}
                />
              ))}
            </svg>

            {/* nodos */}
            {NODES.map((n) => {
              const active = !!lit[n.id];
              return (
                <button
                  key={n.id}
                  onClick={() => handleTap(n.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <motion.div
                    className={[
                      "h-16 w-16 md:h-20 md:w-20 rounded-3xl grid place-items-center",
                      "border bg-white/70 backdrop-blur shadow-soft",
                      active ? "border-amber-200" : "border-white/60",
                    ].join(" ")}
                    animate={
                      active
                        ? { scale: [1, 1.06, 1], boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 40px rgba(251,191,36,0.25)", "0 0 0 rgba(0,0,0,0)"] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.9, repeat: active ? Infinity : 0 }}
                  >
                    <span className="text-xl md:text-2xl">✨</span>
                  </motion.div>

                  {/* label */}
                  <div className="mt-2 w-28 md:w-36 text-center text-[12px] md:text-sm text-zinc-700 leading-tight">
                    {n.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* barra */}
          <div className="p-4 md:p-5 pt-0">
            <div className="flex items-center justify-between text-[11px] text-zinc-600">
              <span>Progreso</span>
              <span className="font-semibold">{Math.round((litCount / NODES.length) * 100)}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-zinc-200 overflow-hidden">
              <div
                className="h-full bg-zinc-900"
                style={{ width: `${(litCount / NODES.length) * 100}%` }}
              />
            </div>

            {allDone && (
              <div className="mt-3 text-sm text-zinc-800">
                <span className="font-semibold">Listo.</span> Se conecta solito 🤍
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}