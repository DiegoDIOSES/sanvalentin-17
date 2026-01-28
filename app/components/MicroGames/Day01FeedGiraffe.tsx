"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Day01FeedGiraffe({ onWin }: { onWin: () => void }) {
  const GOAL = 20; // ✅ confetti al llegar a 20
  const BONUS = 25; // ✅ jirafa aparece al llegar a 25
  const DURATION = 5000; // ✅ 5 segundos

  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [leaves, setLeaves] = useState(0);

  const [won, setWon] = useState(false);
  const [bonus, setBonus] = useState(false);

  const startRef = useRef<number>(0);
  const wonRef = useRef(false);
  const bonusRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, DURATION - (Date.now() - startRef.current));
      setTimeLeft(left);
      if (left === 0) setActive(false);
    }, 40);

    return () => clearInterval(t);
  }, [active]);

  const startGame = () => {
    wonRef.current = false;
    bonusRef.current = false;
    setWon(false);
    setBonus(false);
    setLeaves(0);
    setTimeLeft(DURATION);
    setActive(true);
  };

  const triggerWin = () => {
    if (wonRef.current) return;
    wonRef.current = true;
    setWon(true);
    onWin(); // ✅ confetti + sonido (lo hace DayModal)
  };

  const triggerBonus = () => {
    if (bonusRef.current) return;
    bonusRef.current = true;
    setBonus(true);
    // se oculta sola luego de un ratito
    setTimeout(() => setBonus(false), 1600);
  };

  const addLeaf = () => {
    if (!active) return;

    setLeaves((prev) => {
      const next = prev + 1;

      // ✅ Gana al llegar a 20 (pero puedes seguir hasta 25 si te da tiempo)
      if (next >= GOAL && !wonRef.current) {
        setTimeout(() => triggerWin(), 80);
      }

      // ✅ Bonus al llegar a 25: aparece jirafa desde esquina
      if (next >= BONUS && !bonusRef.current) {
        setTimeout(() => triggerBonus(), 60);
      }

      return Math.min(next, BONUS);
    });
  };

  return (
    <div className="mt-4">
      {/* Barra de progreso + tiempo */}
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>
          Hojas: <span className="font-semibold text-zinc-900">{leaves}</span> /{" "}
          {GOAL}
          <span className="ml-2 text-[11px] text-zinc-500">
            (bonus en {BONUS})
          </span>
        </span>
        <span className="font-mono">
          {active ? `${Math.ceil(timeLeft / 1000)}s` : "—"}
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 overflow-hidden relative">
        <div className="h-3 rounded-full bg-zinc-50 border border-zinc-200 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            animate={{ width: `${Math.min(100, (leaves / GOAL) * 100)}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          />
        </div>

        {/* Botón principal */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => (active ? addLeaf() : startGame())}
            className="rounded-2xl bg-emerald-600 text-white px-4 py-3 text-sm font-semibold"
          >
            {active ? "🌿 +1" : "Empezar 🌿"}
          </button>

          {/* Estado elegante (sin “ñom”) */}
          <div className="text-xs text-zinc-600">
            {won ? (
              <span className="font-semibold text-zinc-900">Completado 💗</span>
            ) : (
              <span>
                Consigue {GOAL} en {DURATION / 1000}s
              </span>
            )}
          </div>
        </div>

        {/* ✅ Bonus: jirafa entra desde esquina */}
        <AnimatePresence>
          {bonus && (
            <motion.div
              className="fixed bottom-6 right-6 z-[9999] text-6xl pointer-events-none"
              initial={{ x: 160, y: 160, rotate: 12, opacity: 0 }}
              animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              exit={{ x: 180, y: 180, rotate: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            >
              🦒
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
