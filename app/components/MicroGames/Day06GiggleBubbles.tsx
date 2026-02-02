"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Bubble = {
  id: string;
  x: number; // %
  y: number; // %
  s: number; // size px
  t: number; // duration
};

type Spark = {
  id: string;
  x: number;
  y: number;
  glyph: string;
  dx: number;
  dy: number;
  r: number;
};

const GLYPHS = ["✦", "✧", "❀", "✿", "✹", "✺", "✶"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeBubbles(count: number): Bubble[] {
  // posiciones bonitas y separadas (aprox)
  const positions = [
    [18, 28],
    [42, 22],
    [70, 28],
    [25, 55],
    [55, 48],
    [82, 55],
    [35, 78],
    [68, 78],
  ];

  const picked = positions.slice(0, count).map(([x, y], i) => ({
    id: `b-${i}-${Date.now()}`,
    x: x + rand(-4, 4),
    y: y + rand(-4, 4),
    s: Math.round(rand(56, 78)),
    t: rand(5.5, 8.5),
  }));

  return picked;
}

export default function Day06GiggleBubbles({ onWin }: { onWin: () => void }) {
  const TOTAL = 8; // puedes subir a 10 si quieres más largo
  const [bubbles, setBubbles] = useState<Bubble[]>(() => makeBubbles(TOTAL));
  const [popped, setPopped] = useState<Record<string, boolean>>({});
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [done, setDone] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const count = useMemo(() => {
    return bubbles.reduce((acc, b) => acc + (popped[b.id] ? 1 : 0), 0);
  }, [bubbles, popped]);

  useEffect(() => {
    if (done) return;
    if (count !== TOTAL) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(true);
    onWin();
  }, [count, done, onWin]);

  const reset = () => {
    setBubbles(makeBubbles(TOTAL));
    setPopped({});
    setSparks([]);
    setDone(false);
  };

  const spawnSparks = (clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const burst = Array.from({ length: 10 }).map((_, i) => ({
      id: `s-${Date.now()}-${i}`,
      x,
      y,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      dx: rand(-42, 42),
      dy: rand(-48, 26),
      r: rand(-18, 18),
    }));

    setSparks((prev) => [...prev, ...burst]);

    // limpia sparks luego de animar
    window.setTimeout(() => {
      setSparks((prev) =>
        prev.filter((s) => !burst.some((b) => b.id === s.id)),
      );
    }, 900);
  };

  const pop = (b: Bubble, e: React.PointerEvent) => {
    if (done) return;
    if (popped[b.id]) return;

    setPopped((prev) => ({ ...prev, [b.id]: true }));
    spawnSparks(e.clientX, e.clientY);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Explota las burbujas con calma:{" "}
          <span className="font-semibold">
            {count}/{TOTAL}
          </span>
        </div>

        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div
        ref={wrapRef}
        className="mt-3 relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 via-rose-50 to-white p-4"
      >
        {/* velo suave */}
        <div className="absolute inset-0 opacity-[0.65]">
          <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-amber-200/45 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
        </div>

        {/* área de juego */}
        <div className="relative h-[260px] md:h-[300px] rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur overflow-hidden">
          {/* micro partículas de fondo */}
          <div className="absolute inset-0 opacity-[0.35]">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[6px] w-[6px] rounded-full bg-white border border-white/70"
                style={{
                  left: `${(i * 47) % 100}%`,
                  top: `${(i * 31) % 100}%`,
                }}
                animate={{ y: [0, -10, 0], opacity: [0.35, 0.65, 0.35] }}
                transition={{
                  duration: rand(4, 7),
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* burbujas */}
          {bubbles.map((b) => {
            const isPopped = !!popped[b.id];

            return (
              <AnimatePresence key={b.id}>
                {!isPopped && (
                  <motion.button
                    type="button"
                    onPointerDown={(e) => pop(b, e)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      width: b.s,
                      height: b.s,
                    }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.25, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    aria-label="burbuja"
                  >
                    <motion.div
                      className="h-full w-full rounded-full border border-white/70 bg-white/35 backdrop-blur shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
                      animate={{
                        y: [0, -8, 0],
                        x: [0, 4, 0, -4, 0],
                      }}
                      transition={{
                        duration: b.t,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {/* brillo */}
                      <div className="absolute left-[18%] top-[18%] h-[35%] w-[35%] rounded-full bg-white/70 blur-[1px]" />
                      <div className="absolute left-[28%] top-[28%] h-[18%] w-[18%] rounded-full bg-white/80 blur-[0.5px]" />

                      {/* emoji mini */}
                      <div className="absolute inset-0 grid place-items-center text-lg opacity-[0.9]">
                        😄
                      </div>
                    </motion.div>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}

          {/* sparks */}
          <AnimatePresence>
            {sparks.map((s) => (
              <motion.div
                key={s.id}
                className="absolute pointer-events-none text-zinc-900/70"
                style={{ left: s.x, top: s.y }}
                initial={{ opacity: 0, scale: 0.8, rotate: s.r }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.9, 1.1, 0.85],
                  x: [0, s.dx],
                  y: [0, s.dy],
                  rotate: [s.r, s.r + rand(-24, 24)],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              >
                <span className="text-lg">{s.glyph}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* mensaje abajo */}
          <div className="absolute left-0 right-0 bottom-0 p-3">
            <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur px-4 py-3">
              <div className="text-[11px] text-zinc-600">Nota</div>
              <div className="mt-1 text-sm text-zinc-800 leading-relaxed">
                La risa también se entiende en silencio.
              </div>
            </div>
          </div>
        </div>

        {/* final */}
        {done && (
          <motion.div
            className="relative mt-4 rounded-2xl border border-zinc-200 bg-white p-4"
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="text-xs text-zinc-600">Listo 🤍</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900">
              Eso… esa es la vibra.
            </div>
            <div className="mt-2 text-sm text-zinc-700 leading-relaxed">
              “Me gusta cómo te ves cuando estás con Imanol.
              <br />
              Hay alegrías que se contagian solitas.”
            </div>

            <button
              onClick={reset}
              className="mt-3 w-full rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
            >
              Repetir momento ✨
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-2 text-[11px] text-zinc-600">
        Tip: si tocas suave, se siente más bonito 🙂
      </div>
    </div>
  );
}
