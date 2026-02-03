"use client";

import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  key: string;
  label: string; // lo que se muestra (LECHE, PAN...)
  emoji: string; // lo que debe encontrar
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Day09FindIngredients({ onWin }: { onWin: () => void }) {
  const ITEMS: Item[] = useMemo(
    () => [
      { key: "milk", label: "LECHE", emoji: "🥛" },
      { key: "bread", label: "PAN", emoji: "🍞" },
      { key: "chicken", label: "GALLINA", emoji: "🍗" },
      { key: "aji", label: "AJÍ", emoji: "🌶️" },
      { key: "cheese", label: "QUESO", emoji: "🧀" },
      { key: "potato", label: "PAPA", emoji: "🥔" },
    ],
    [],
  );

  const DISTRACTORS = useMemo(
    () => [
      "🍓",
      "🍌",
      "🍍",
      "🍋",
      "🍉",
      "🍇",
      "🥑",
      "🥕",
      "🧅",
      "🍅",
      "🥬",
      "🍪",
      "🍫",
      "🍯",
      "🥜",
      "🍚",
      "🥖",
      "🥨",
      "🍳",
      "🥩",
      "🧈",
      "🥣",
      "🍮",
      "🍬",
      "🫒",
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<Item[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(2.0);
  const [status, setStatus] = useState<"idle" | "ok" | "bad" | "done">("idle");

  const timerRef = useRef<number | null>(null);
  const lockRef = useRef(false);

  const current = ITEMS[index];
  const finished = placed.length === ITEMS.length;

  const buildPool = (targetEmoji: string) => {
    // 24 emojis (1 target + 23 distractores)
    const distract = shuffle(DISTRACTORS).slice(0, 23);
    const combined = shuffle([targetEmoji, ...distract]);
    setPool(combined);
  };

  const resetRound = (nextIndex: number) => {
    setStatus("idle");
    lockRef.current = false;
    setTimeLeft(2.0);
    buildPool(ITEMS[nextIndex].emoji);
  };

  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    // init
    resetRound(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    stopTimer();
    if (finished) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        const nt = Math.max(0, Math.round((t - 0.1) * 10) / 10);
        return nt;
      });
    }, 100);

    return () => stopTimer();
  }, [index, finished]);

  useEffect(() => {
    if (finished) return;
    if (timeLeft > 0) return;
    if (lockRef.current) return;

    // tiempo agotado
    lockRef.current = true;
    setStatus("bad");

    window.setTimeout(() => {
      resetRound(index); // repite el mismo ingrediente
    }, 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, finished]);

  const pick = (e: string) => {
    if (finished) return;
    if (lockRef.current) return;

    if (e === current.emoji) {
      lockRef.current = true;
      setStatus("ok");
      setPlaced((p) => [...p, current]);

      window.setTimeout(() => {
        const next = index + 1;
        if (next >= ITEMS.length) {
          setStatus("done");
          stopTimer();
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.35 },
          });
          onWin();
          return;
        }
        setIndex(next);
        resetRound(next);
      }, 520);
    } else {
      lockRef.current = true;
      setStatus("bad");
      window.setTimeout(() => {
        resetRound(index);
      }, 520);
    }
  };

  const resetAll = () => {
    stopTimer();
    setIndex(0);
    setPlaced([]);
    setStatus("idle");
    lockRef.current = false;
    setTimeLeft(2.0);
    resetRound(0);
  };

  return (
    <div className="mt-3">
      {/* HUD */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Plato:{" "}
          <span className="font-semibold">
            {placed.length}/{ITEMS.length}
          </span>
        </div>

        <button
          onClick={resetAll}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      {/* Prompt + Timer */}
      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 md:p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-zinc-600">Encuentra:</div>
            <div className="mt-1 text-xl md:text-2xl font-semibold tracking-tight text-zinc-900">
              {finished ? "¡LISTO!" : current?.label}
            </div>
          </div>

          {!finished && (
            <div className="text-right">
              <div className="text-[11px] text-zinc-600">Tiempo</div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {timeLeft.toFixed(1)}s
              </div>
            </div>
          )}
        </div>

        {/* feedback */}
        <AnimatePresence>
          {status === "bad" && !finished && (
            <motion.div
              className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
            >
              Uy 😅 ¡rápido! otra vez…
            </motion.div>
          )}

          {status === "ok" && !finished && (
            <motion.div
              className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
            >
              ¡Perfecto! al plato 🍽️
            </motion.div>
          )}

          {status === "done" && finished && (
            <motion.div
              className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
            >
              “Lo rico no es solo la receta… es con quién la compartes.” 🤍
            </motion.div>
          )}
        </AnimatePresence>

        {/* plate */}
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-3">
          <div className="text-[11px] text-zinc-600">Tu plato</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {placed.length === 0 ? (
              <div className="text-sm text-zinc-500">Vacío por ahora…</div>
            ) : (
              placed.map((it) => (
                <div
                  key={it.key}
                  className="px-3 py-2 rounded-2xl border border-zinc-200 bg-zinc-50 text-lg"
                  title={it.label}
                >
                  {it.emoji}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Emoji grid */}
      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3 md:p-4 shadow-soft">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {pool.map((e, i) => (
            <button
              key={`${e}-${i}`}
              type="button"
              onClick={() => pick(e)}
              className="rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-[0.98] transition px-0 py-3 text-xl sm:text-2xl"
              aria-label={`emoji ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-zinc-600">
        Tip: son solo <span className="font-semibold">2 segundos</span> 😈
      </div>
    </div>
  );
}
