"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Piece = {
  id: number; // id único
  correctIndex: number; // posición correcta (0..14)
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Day04TiniPuzzle({
  onWin,
  muted,
  imageSrc = "/images/tini.jpg",
}: {
  onWin: () => void;
  muted: boolean;
  imageSrc?: string;
}) {
  const COLS = 3;
  const ROWS = 5;
  const TOTAL = COLS * ROWS;

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selected, setSelected] = useState<number | null>(null); // index en grid
  const [won, setWon] = useState(false);

  const correctCount = useMemo(() => {
    return pieces.reduce(
      (acc, p, idx) => acc + (p.correctIndex === idx ? 1 : 0),
      0,
    );
  }, [pieces]);

  const solved = pieces.length === TOTAL && correctCount === TOTAL;

  const reset = () => {
    const base: Piece[] = Array.from({ length: TOTAL }, (_, i) => ({
      id: i,
      correctIndex: i,
    }));
    // Evitamos que inicie ya resuelto: si por casualidad queda igual, reshuffle.
    let s = shuffle(base);
    if (s.every((p, idx) => p.correctIndex === idx)) s = shuffle(base);
    setPieces(s);
    setSelected(null);
    setWon(false);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (won) return;
    if (!solved) return;
    setWon(true);
    onWin();
    if (!muted) {
      try {
        const a = new Audio("/sounds/unlock.mp3");
        a.volume = 0.6;
        a.play();
      } catch {}
    }
  }, [solved, won, onWin, muted]);

  const swap = (a: number, b: number) => {
    setPieces((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  };

  const onTapPiece = (idx: number) => {
    if (won) return;

    if (selected === null) {
      setSelected(idx);
      if (!muted) {
        try {
          const a = new Audio("/sounds/pop.mp3");
          a.volume = 0.4;
          a.play();
        } catch {}
      }
      return;
    }

    if (selected === idx) {
      setSelected(null);
      return;
    }

    swap(selected, idx);
    setSelected(null);

    if (!muted) {
      try {
        const a = new Audio("/sounds/tap.mp3");
        a.volume = 0.45;
        a.play();
      } catch {}
    }
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-600">
          Toca 2 piezas para intercambiarlas.{" "}
          <span className="font-semibold text-zinc-900">
            {correctCount}/{TOTAL}
          </span>
        </div>

        <button
          onClick={reset}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Mezclar 🔁
        </button>
      </div>

      {/* tablero */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {pieces.map((p, gridIndex) => {
          const isSelected = selected === gridIndex;
          const isCorrect = p.correctIndex === gridIndex;

          // Cálculo de recorte (background-position) por pieza (según su correctIndex)
          const correctRow = Math.floor(p.correctIndex / COLS);
          const correctCol = p.correctIndex % COLS;

          // background-size: 300% 500% para 3 cols x 5 rows
          const bgSize = `${COLS * 100}% ${ROWS * 100}%`;
          const bgPos = `${(correctCol * 100) / (COLS - 1)}% ${(correctRow * 100) / (ROWS - 1)}%`;

          return (
            <button
              key={p.id}
              onClick={() => onTapPiece(gridIndex)}
              className={[
                "relative aspect-square rounded-2xl overflow-hidden border transition",
                isSelected
                  ? "border-zinc-900 ring-2 ring-zinc-900/10"
                  : "border-zinc-200",
                won ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
              aria-label={`pieza ${gridIndex + 1}`}
            >
              {/* imagen recortada */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: bgSize,
                  backgroundPosition: bgPos,
                }}
              />

              {/* glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-black/10" />

              {/* micro feedback */}
              <motion.div
                className="absolute inset-0"
                animate={isSelected ? { scale: 0.98 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              />

              {/* check sutil cuando está en su sitio */}
              {isCorrect && (
                <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full bg-white/75 backdrop-blur border border-white/70">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal */}
      {won && (
        <motion.div
          className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4"
          initial={{ y: 10, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="text-xs text-zinc-600">Listo ✨</div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            Te salió perfecto 😌
          </div>
          <div className="mt-2 text-sm text-zinc-700 leading-relaxed">
            “Hay canciones que se escuchan… y otras que se quedan.
            <br />
            Así.”
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={reset}
              className="flex-1 rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
            >
              Jugar otra vez 🎧
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-2 text-[11px] text-zinc-600">
        Tip: si una pieza “te llama”, probablemente va cerca 😉
      </div>
    </div>
  );
}
