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
import Day06Constellation from "./MicroGames/Day06ConstellationCinematic";

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
    // si ya no quieres sonidos en días importantes, puedes comentar esto:
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
        bg-black/40
        flex items-stretch md:items-center justify-center
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // ✅ cierra SOLO si haces click en el fondo (no onMouseDown)
      onClick={() => {
        playSound("/sounds/pop.mp3", muted, 0.6);
        onClose();
      }}
    >
      <motion.div
        // ✅ evita que el click “suba” al backdrop
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          h-full md:h-auto
          md:max-w-2xl
          bg-white shadow-soft
          flex flex-col
          overflow-hidden
          rounded-none md:rounded-[26px]
        "
        // ✅ full screen en móvil (sin padding externo)
        // ✅ en desktop se verá como tarjeta
        initial={{ y: 30, scale: 0.995, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.995, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* HEADER (sticky) */}
        <div
          className={`
            relative
            bg-gradient-to-br ${item.accentGradient}
            px-4 py-4 md:px-6 md:py-6
            shrink-0
          `}
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

            {/* ✅ Cerrar siempre clickeable */}
            <button
              onClick={() => {
                playSound("/sounds/pop.mp3", muted, 0.6);
                onClose();
              }}
              className="
                relative z-[999]
                pointer-events-auto
                rounded-2xl bg-white/70 backdrop-blur
                px-3 py-2 text-sm
              "
            >
              Cerrar ✕
            </button>
          </div>

          <motion.div
            className="mt-3 md:mt-4 text-5xl md:text-6xl"
            initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            {item.emoji}
          </motion.div>
        </div>

        {/* BODY (ocupa todo el alto real en móvil) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-7 md:py-7">
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
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Decora la torta antes de que se acabe el tiempo ✨
                </p>
                <Day02DecorateCake onWin={onWin} />
              </div>
            </div>
          ) : item.day === 3 ? (
            <div className="space-y-4">
              <Day03WineTone />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Encuentra el tono vino perfecto 🍷
                </p>
                <Day03FindWineTone onWin={onWin} muted={muted} />
              </div>
            </div>
          ) : item.day === 4 ? (
            <div className="space-y-4">
              <Day04Tini />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Rompecabezas de 15 piezas 🧩
                </p>
                <Day04TiniPuzzle
                  onWin={onWin}
                  muted={muted}
                  imageSrc="/images/tini.jpg"
                />
              </div>
            </div>
          ) : item.day === 5 ? (
            <div className="space-y-4">
              <Day05BuenosAires />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Enciende la ciudad y luego te llevo a Spotify 🌆✨
                </p>
                <Day05LightCity
                  onWin={onWin}
                  muted={muted}
                  spotifyUrl={item.spotifyUrl ?? ""}
                />
              </div>
            </div>
          ) : item.day === 6 ? (
            <div className="space-y-4">
              {/* ✅ Día 6 “grande”: el componente ya trae su propio panel alto */}
              <Day06ImanolExperience onWin={onWin} />

              {/* Si aún quieres mantener este bloque viejo, bórralo.
                  Lo dejo comentado para que NO te duplique cosas:
              */}
              {/*
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Enciende las luces ✨
                </p>
                <Day06Constellation onComplete={onWin} />
              </div>
              */}
            </div>
          ) : item.day === 7 ? (
            <div className="space-y-4">
              <Day07Flowers />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  5 semillas, 5 gestos distintos. Haz florecer el jardín 🌸
                </p>
                <Day07GardenBloom onWin={onWin} muted={muted} />
              </div>
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
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
