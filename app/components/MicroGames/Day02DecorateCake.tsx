"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Ing = { id: number; emoji: string };

const EMOJIS = [
  "🍫","🍓","🍒","🍪","🍬","🧁","🍩","🍯","🥜","🍌","🍇","🥥","🍊","🍍","✨","💗",
  "🍫","🍓","🍒","🍪","🍬","🧁","🍩","🍯","🥜","🍌","🍇","🥥","🍊","🍍","✨","💗",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function Day02DecorateCake({ onWin }: { onWin: () => void }) {
  const WIN_GOAL = 10;
  const DURATION = 12; // ✅ más tiempo (antes 8)

  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [placed, setPlaced] = useState(0);

  const [showRecipe, setShowRecipe] = useState(false);

  const startRef = useRef<number>(0);
  const wonRef = useRef(false);

  const ingredients: Ing[] = useMemo(
    () => EMOJIS.map((e, idx) => ({ id: idx + 1, emoji: e })),
    []
  );

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();
    const t = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left = Math.max(0, DURATION - elapsed);
      setTimeLeft(left);

      if (left <= 0) setActive(false);
    }, 50);

    return () => clearInterval(t);
  }, [active]);

  const startGame = () => {
    wonRef.current = false;
    setShowRecipe(false);
    setPlaced(0);
    setTimeLeft(DURATION);
    setActive(true);
  };

  const handleDrop = () => {
    if (!active) return;

    setPlaced((prev) => {
      const next = prev + 1;

      if (next >= WIN_GOAL && !wonRef.current) {
        wonRef.current = true;
        setActive(false);
        onWin();
        setShowRecipe(true);
      }

      return next;
    });
  };

  const seconds = Math.floor(timeLeft);
  const centis = Math.floor((timeLeft - seconds) * 100);

  const progress = Math.min(100, (placed / WIN_GOAL) * 100);

  return (
    <div className="mt-4">
      {/* Top bar (contador + tiempo) */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-600">
          Decoración:{" "}
          <span className="font-semibold text-zinc-900">{placed}</span> / {WIN_GOAL}
        </div>

        <div className="font-mono text-xs text-zinc-700 rounded-full bg-white/70 border border-zinc-200 px-3 py-1">
          {pad2(seconds)}.{pad2(centis)}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-2 h-2 rounded-full bg-white/70 border border-zinc-200 overflow-hidden">
        <motion.div
          className="h-full bg-amber-500"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        />
      </div>

      {/* Game area */}
      <div className="mt-3 relative rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 overflow-hidden">
        {/* Start pill */}
        {!active && !showRecipe && (
          <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-center">
            <div className="text-[11px] text-zinc-600">
              Arrastra ingredientes a la torta ✨
            </div>
            <button
              onClick={startGame}
              className="rounded-full bg-zinc-900 text-white px-4 py-2 text-xs font-semibold shadow-soft"
            >
              Empezar
            </button>
          </div>
        )}

        {/* Ingredient tray */}
        <div className="relative z-[1] p-4 pt-12">
          <div className="rounded-2xl bg-white/60 border border-zinc-200 p-3">
            <div className="text-[11px] text-zinc-600 mb-2">
              Bandeja de ingredientes
              <span className="ml-2 text-zinc-500">(arrastra)</span>
            </div>

            <div className="relative h-28 overflow-hidden">
              {active &&
                ingredients.slice(0, 22).map((ing, i) => (
                  <motion.div
                    key={ing.id}
                    drag
                    dragMomentum={false}
                    whileTap={{ scale: 0.92 }}
                    className="absolute select-none cursor-grab active:cursor-grabbing"
                    style={{
                      left: 10 + (i % 11) * 30,
                      top: 10 + Math.floor(i / 11) * 42,
                    }}
                    onDragEnd={(_, info) => {
                      // si lo sueltas en la parte baja del modal, cuenta como drop en torta
                      if (info.point.y > window.innerHeight * 0.62) handleDrop();
                    }}
                  >
                    <div className="h-9 w-9 rounded-full bg-white border border-zinc-200 grid place-items-center shadow-soft">
                      <span className="text-xl">{ing.emoji}</span>
                    </div>
                  </motion.div>
                ))}

              {!active && (
                <div className="h-full grid place-items-center text-xs text-zinc-600">
                  Presiona <span className="mx-1 font-semibold text-zinc-900">Empezar</span> para jugar 🍰
                </div>
              )}
            </div>
          </div>

          {/* Drop zone cake */}
          <div className="mt-4 rounded-2xl bg-white/60 border border-zinc-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-zinc-600">Zona torta</div>
              <div className="text-[11px] text-zinc-500">
                meta: {WIN_GOAL} ingredientes
              </div>
            </div>

            <div className="mt-3 flex justify-center">
              <div className="relative">
                {/* halo */}
                <motion.div
                  className="absolute -inset-6 rounded-full bg-amber-400/15 blur-xl"
                  animate={active ? { opacity: [0.35, 0.6, 0.35] } : { opacity: 0.25 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="h-28 w-48 rounded-2xl bg-amber-900/80 grid place-items-center text-5xl shadow-inner"
                  animate={placed > 0 ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  🍰
                </motion.div>
                <div className="mt-2 text-center text-[11px] text-zinc-600">
                  Suelta aquí los ingredientes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ POPUP RECETA (se mantiene igual, solo lo dejo) */}
      <AnimatePresence>
        {showRecipe && (
          <motion.div
            className="fixed inset-0 z-[10000] bg-black/35 flex items-end md:items-center justify-center p-3 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setShowRecipe(false)}
          >
            <motion.div
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[26px] bg-white shadow-soft overflow-hidden"
              initial={{ y: 30, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="p-5 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 border-b border-zinc-200">
                <div className="text-xs text-zinc-600">RECETA ESPECIAL</div>
                <div className="mt-1 text-xl font-semibold text-zinc-900">
                  Torta de Chocolate (versión tú) 💗
                </div>
                <div className="mt-2 text-xs text-zinc-600">
                  Rendimiento: 1 sonrisa eterna · Tiempo: lo que dure contigo
                </div>
              </div>

              <div className="p-5">
                <div className="text-sm font-semibold text-zinc-900">Ingredientes</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  <li>• 200g de chocolate 🍫 (el real… pero el tuyo gana)</li>
                  <li>• 100g de tu sonrisa 😊</li>
                  <li>• 2 cucharadas de “qué rico” 😋</li>
                  <li>• 1 pizca de drama (muy poquito) 🎭</li>
                  <li>• 3 abrazos tibios 🫶</li>
                  <li>• 1 mirada que diga “sí quiero más” 👀</li>
                  <li>• Amor al gusto (sin medir) 💗</li>
                </ul>

                <div className="mt-5 text-sm font-semibold text-zinc-900">Preparación</div>
                <ol className="mt-3 space-y-2 text-sm text-zinc-700">
                  <li>1) Mezcla todo con paciencia (y con música de fondo) 🎶</li>
                  <li>2) Hornea a “temperatura corazón” hasta que te rías 😄</li>
                  <li>3) Sirve con un “ven” y sin excusas 🍰</li>
                </ol>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setShowRecipe(false)}
                    className="flex-1 rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
                  >
                    Guardar en mi corazón 💗
                  </button>
                  <button
                    onClick={startGame}
                    className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm font-semibold"
                  >
                    Repetir ✨
                  </button>
                </div>

                <div className="mt-3 text-[11px] text-zinc-500">
                  *Advertencia: puede causar antojos y ganas de verte.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}