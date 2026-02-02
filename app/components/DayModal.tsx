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
import Day06ConstellationCinematic from "./MicroGames/Day06ConstellationCinematic";

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

  // ✅ Mantén audio general si lo quieres; Día 6 “sin sonidos” lo controlas dentro de su experiencia.
  useEffect(() => {
    playSound(item.sound, muted, 0.85);
    return () => stopSound();
  }, [item.sound, muted]);

  // ✅ ESC cierra (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onWin = () => {
    setWins((w) => w + 1);
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.35 } });
    playSound("/sounds/unlock.mp3", muted, 0.8);
  };

  const DefaultGame = useMemo(() => {
    if (item.microGame === "tap") return <TapGame onWin={onWin} />;
    if (item.microGame === "hold") return <HoldGame onWin={onWin} />;
    return <DragGame onWin={onWin} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.microGame]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-3 py-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // ✅ onClick (no onMouseDown) evita cierres raros en móvil
      onClick={() => onClose()}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-2xl overflow-hidden rounded-[26px] bg-white shadow-soft
          flex flex-col
          h-[92svh] md:h-auto
          max-h-[92svh] md:max-h-[82vh]
        "
        initial={{ y: 40, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* ✅ HEADER sticky para que en móvil no “se pierda” y el botón no quede bloqueado */}
        <div className="sticky top-0 z-[60]">
          <div className={`relative p-4 md:p-6 bg-gradient-to-br ${item.accentGradient}`}>
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-700">
                  Día {item.day}
                </div>
                <h2 className="mt-1 text-2xl md:text-3xl font-semibold truncate">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-700 max-w-xl">
                  {item.description}
                </p>
                <div className="mt-3 text-xs text-zinc-700">
                  Victorias: <span className="font-semibold">{wins}</span>
                </div>
              </div>

              {/* ✅ SIEMPRE clickeable: z alto + pointer-events */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound("/sounds/pop.mp3", muted, 0.6);
                  onClose();
                }}
                className="
                  relative z-[70] pointer-events-auto
                  rounded-2xl bg-white/80 backdrop-blur px-3 py-2 text-sm
                  border border-white/60 shadow-soft
                  active:scale-[0.98]
                "
              >
                Cerrar ✕
              </button>
            </div>

            <motion.div
              className="mt-3 text-5xl md:text-6xl"
              initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
            >
              {item.emoji}
            </motion.div>
          </div>
        </div>

        {/* ✅ BODY: ahora sí es el área scroll real en móvil */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-7 md:py-6">
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
                  Decora la torta con ingredientes antes de que se acabe el tiempo ✨
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
                  Encuentra el tono vino perfecto. No es rapidez… es sensación 🍷
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
                  Rompecabezas de 15 piezas. Cada vez se mezcla distinto 🧩
                </p>
                <Day04TiniPuzzle onWin={onWin} muted={muted} imageSrc="/images/tini.jpg" />
              </div>
            </div>
          ) : item.day === 5 ? (
            <div className="space-y-4">
              <Day05BuenosAires />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Enciende la ciudad y desbloquea la canción 🌆✨
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
              <Day06ImanolExperience onWin={onWin} />
              {/* Si todavía usas la constelación suelta en el modal, déjala.
                  Si ya está adentro del Day06ImanolExperience, elimina este bloque. */}
              {/* <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">Constelación ✨</p>
                <Day06ConstellationCinematic onComplete={onWin} />
              </div> */}
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
              <p className="mt-1 text-xs text-zinc-600">Cada día se siente distinto 😉</p>
              {DefaultGame}
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
                    confetti({ particleCount: 120, spread: 80, origin: { y: 0.35 } });
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

        {/* ✅ Footer pegado abajo, no empuja el contenido */}
        <div className="shrink-0 border-t border-zinc-100 px-4 py-3 text-center text-[11px] text-zinc-600">
          Sin sonidos • solo sensación.
        </div>
      </motion.div>
    </motion.div>
  );
} 