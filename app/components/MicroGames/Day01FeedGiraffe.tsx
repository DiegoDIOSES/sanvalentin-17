"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Day01FeedGiraffe({ onWin }: { onWin: () => void }) {
  const GOAL = 10;
  const DURATION = 6000;

  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [leaves, setLeaves] = useState(0);
  const [won, setWon] = useState(false);

  const startRef = useRef<number>(0);
  const wonRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, DURATION - (Date.now() - startRef.current));
      setTimeLeft(left);

      if (left === 0) {
        setActive(false);
      }
    }, 40);

    return () => clearInterval(t);
  }, [active]);

  const triggerWin = () => {
    if (wonRef.current) return;
    wonRef.current = true;
    setWon(true);
    setActive(false);
    onWin();
  };

  const startGame = () => {
    wonRef.current = false;
    setWon(false);
    setLeaves(0);
    setTimeLeft(DURATION);
    setActive(true);
  };

  const addLeaf = () => {
    if (!active) return;

    setLeaves((prev) => {
      const next = prev + 1;

      // ✅ GANA INMEDIATO al llegar a la meta
      if (next >= GOAL) {
        // pequeño delay para que se vea el “10/10” en UI
        setTimeout(() => triggerWin(), 120);
        return GOAL;
      }

      return next;
    });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>Mini juego: Alimenta a la jirafa 🦒🌿</span>
        <span className="font-mono">
          {active ? `${Math.ceil(timeLeft / 1000)}s` : "—"}
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 overflow-hidden">
        {/* barra */}
        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>Hojas</span>
          <span>
            <span className="font-semibold text-zinc-900">{leaves}</span> /{" "}
            {GOAL}
          </span>
        </div>

        <div className="mt-2 h-3 rounded-full bg-zinc-50 border border-zinc-200 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            animate={{ width: `${Math.min(100, (leaves / GOAL) * 100)}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          />
        </div>

        {/* zona de acción */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => (active ? addLeaf() : startGame())}
            className="rounded-2xl bg-emerald-600 text-white px-4 py-3 text-sm font-semibold"
          >
            {active ? "🌿 dar hoja" : "Empezar 🌿"}
          </button>

          <motion.div
            className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold select-none"
            animate={active ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 0.9, repeat: active ? Infinity : 0 }}
          >
            🦒 ñom
          </motion.div>

          <AnimatePresence>
            {won && (
              <motion.div
                className="ml-auto text-sm font-semibold text-zinc-900"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
              >
                ¡Le encantó! 💗
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-zinc-600">
        Meta: 10 hojas en 6 segundos ✨
      </div>
    </div>
  );
}
