"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import type { DayItem } from "../data/days";
import { playSound, stopSound } from "../lib/sound";
import { DragGame, HoldGame, TapGame } from "./MicroGames";

import Day01Giraffe from "./DayScenes/Day01Giraffe";
import Day01FeedGiraffe from "./MicroGames/Day01FeedGiraffe";

import Day02ChocolateCake from "./DayScenes/Day02ChocolateCake";
import Day02DecorateCake from "./MicroGames/Day02DecorateCake";

export default function DayModal({
  item,
  onClose,
  muted,
}: {
  item: DayItem;
  onClose: () => void;
  muted: boolean;
}) {
  const [wins, setWins] = useState(0);
  const isFinal = item.day === 17;

  useEffect(() => {
    // Sonido del día al abrir
    playSound(item.sound, muted, 0.85);
    return () => stopSound();
  }, [item.sound, muted]);

  const onWin = () => {
    setWins((w) => w + 1);
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.35 } });
    playSound("/sounds/unlock.mp3", muted, 0.8);
  };

  const Game = useMemo(() => {
    if (item.microGame === "tap") return <TapGame onWin={onWin} />;
    if (item.microGame === "hold") return <HoldGame onWin={onWin} />;
    return <DragGame onWin={onWin} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.microGame, muted]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 p-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={() => {
        playSound("/sounds/pop.mp3", muted, 0.6);
        onClose();
      }}
    >
      <motion.div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-[26px] bg-white shadow-soft max-h-[85vh] md:max-h-[80vh] flex flex-col"
        initial={{ y: 40, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <div
          className={`relative p-5 md:p-6 bg-gradient-to-br ${item.accentGradient}`}
        >
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-zinc-700">
                Día {item.day}
              </div>
              <h2 className="mt-1 text-2xl md:text-3xl font-semibold">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-700 max-w-xl">
                {item.description}
              </p>
              <div className="mt-3 text-xs text-zinc-700">
                Victorias: <span className="font-semibold">{wins}</span>
              </div>
            </div>

            <button
              onClick={() => {
                playSound("/sounds/pop.mp3", muted, 0.6);
                onClose();
              }}
              className="rounded-2xl bg-white/70 backdrop-blur px-3 py-2 text-sm"
            >
              Cerrar ✕
            </button>
          </div>

          <motion.div
            className="mt-4 text-5xl md:text-6xl"
            initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            {item.emoji}
          </motion.div>
        </div>

        <div className="p-5 md:p-7 overflow-y-auto">
          {/* ✅ Día 1 personalizado (Jirafa) */}
          {item.day === 1 ? (
            <div className="space-y-4">
              <Day01Giraffe />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Alimenta a la jirafa con hojitas 🌿
                </p>
                <Day01FeedGiraffe onWin={onWin} />
              </div>
            </div>
          ) : item.day === 2 ? (
            <div className="space-y-4">
                <Day02ChocolateCake />
                <Day02DecorateCake onWin={onWin} />
            </div>
            ) : !isFinal ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm font-semibold">Mini juego</div>
              <p className="mt-1 text-xs text-zinc-600">
                Cada día se siente distinto 😉
              </p>
              {Game}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">El sobre final 💌</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                “Esto es solo una de las cosas que te gustan.
                <br />
                Pero compartirlas contigo… empieza a gustarme más.”
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    confetti({
                      particleCount: 120,
                      spread: 80,
                      origin: { y: 0.35 },
                    });
                    playSound("/sounds/secret.mp3", muted, 0.8);
                  }}
                  className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
                >
                  Sí, conversemos ✨
                </button>

                <button
                  onClick={() => playSound("/sounds/pop.mp3", muted, 0.7)}
                  className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm font-semibold"
                >
                  Dame una pista 😄
                </button>
              </div>

              <div className="mt-4 text-xs text-zinc-600">
                (Bonus secreto: luego lo hacemos “cafetería cerámica” ☕🎨)
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}