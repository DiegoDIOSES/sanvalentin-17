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

import Day03WineTone from "./DayScenes/Day03WineTone";
import Day03FindWineTone from "./MicroGames/Day03FindWineTone";

import Day04Tini from "./DayScenes/Day04Tini";
import Day04TiniPuzzle from "./MicroGames/Day04TiniPuzzle";

import Day05BuenosAires from "./DayScenes/Day05BuenosAires";
import Day05LightCity from "./MicroGames/Day05LightCity";

import Day06ImanolExperience from "./DayScenes/Day06ImanolExperience";

import Day07Flowers from "./DayScenes/Day07Flowers";
import Day07GardenBloom from "./MicroGames/Day07GardenBloom";

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
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/30
        p-2 sm:p-3 md:p-6
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // ✅ click fuera SIEMPRE cierra (no bloqueos)
      onMouseDown={() => {
        playSound("/sounds/pop.mp3", muted, 0.6);
        onClose();
      }}
    >
      <motion.div
        onMouseDown={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-[96vw] sm:max-w-2xl
          overflow-hidden
          rounded-[24px] sm:rounded-[26px]
          bg-white shadow-soft
          max-h-[92vh] md:max-h-[86vh]
          flex flex-col
        "
        initial={{ y: 26, scale: 0.985, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 22, scale: 0.985, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* Header */}
        <div
          className={`relative bg-gradient-to-br ${item.accentGradient}
            px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-6
          `}
        >
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-zinc-700">
                Día {item.day}
              </div>

              <h2 className="mt-1 text-[22px] sm:text-2xl md:text-3xl font-semibold leading-tight">
                {item.title}
              </h2>

              <p className="mt-2 text-[13px] sm:text-sm text-zinc-700 max-w-xl leading-relaxed">
                {item.description}
              </p>

              <div className="mt-3 text-xs text-zinc-700">
                Victorias: <span className="font-semibold">{wins}</span>
              </div>
            </div>

            {/* ✅ botón cerrar principal NO bloqueado */}
            <button
              onClick={() => {
                playSound("/sounds/pop.mp3", muted, 0.6);
                onClose();
              }}
              className="
                rounded-2xl
                bg-white/70 backdrop-blur
                px-3 py-2
                text-sm
              "
            >
              Cerrar ✕
            </button>
          </div>

          <motion.div
            className="mt-4 text-5xl sm:text-6xl md:text-6xl"
            initial={{ scale: 0.82, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            {item.emoji}
          </motion.div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-6">
          {item.day === 1 ? (
            <div className="space-y-5">
              <Day01Giraffe />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Alimenta a la jirafa con hojitas 🌿
                </p>
                <div className="mt-3">
                  <Day01FeedGiraffe onWin={onWin} />
                </div>
              </div>
            </div>
          ) : item.day === 2 ? (
            <div className="space-y-5">
              <Day02ChocolateCake />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Decora la torta con ingredientes antes de que se acabe el
                  tiempo ✨
                </p>
                <div className="mt-3">
                  <Day02DecorateCake onWin={onWin} />
                </div>
              </div>
            </div>
          ) : item.day === 3 ? (
            <div className="space-y-5">
              <Day03WineTone />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Encuentra el tono vino perfecto 🍷
                </p>
                <div className="mt-3">
                  <Day03FindWineTone onWin={onWin} muted={muted} />
                </div>
              </div>
            </div>
          ) : item.day === 4 ? (
            <div className="space-y-5">
              <Day04Tini />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Rompecabezas de 15 piezas. Cada vez se mezcla distinto 🧩
                </p>
                <div className="mt-3">
                  <Day04TiniPuzzle
                    onWin={onWin}
                    muted={muted}
                    imageSrc="/images/tini.jpg"
                  />
                </div>
              </div>
            </div>
          ) : item.day === 5 ? (
            <div className="space-y-5">
              <Day05BuenosAires />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Enciende la ciudad y abre Spotify 🌆✨
                </p>
                <div className="mt-3">
                  <Day05LightCity
                    onWin={onWin}
                    muted={muted}
                    spotifyUrl={item.spotifyUrl ?? ""}
                  />
                </div>
              </div>
            </div>
          ) : item.day === 6 ? (
            <div className="space-y-4">
              {/* ✅ Más “cómodo” en celular: altura mayor y con límites sanos */}
              <div className="h-[74vh] sm:h-[68vh] md:h-[62vh] min-h-[520px] sm:min-h-[560px] md:min-h-[520px] max-h-[860px]">
                <Day06ImanolExperience onWin={onWin} />
              </div>

              <div className="pt-1 text-[11px] text-zinc-600 text-center">
                Sin sonidos • solo sensación.
              </div>
            </div>
          ) : item.day === 7 ? (
            <div className="space-y-5">
              <Day07Flowers />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  5 semillas, 5 gestos distintos. Haz florecer el jardín 🌸
                </p>
                <div className="mt-3">
                  <Day07GardenBloom onWin={onWin} muted={muted} />
                </div>
              </div>
            </div>
          ) : !isFinal ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Mini juego</div>
              <p className="mt-1 text-xs text-zinc-600">
                Cada día se siente distinto 😉
              </p>
              <div className="mt-3">{Game}</div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold">El sobre final 💌</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                “Esto es solo una de las cosas que te gustan.
                <br />
                Pero compartirlas contigo… empieza a gustarme más.”
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
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