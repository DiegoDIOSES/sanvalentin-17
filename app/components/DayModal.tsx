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
// import Day06Constellation from "./MicroGames/Day06ConstellationCinematic";

import Day07Flowers from "./DayScenes/Day07Flowers";
import Day07GardenBloom from "./MicroGames/Day07GardenBloom";

import Day08Bicycle from "./DayScenes/Day08Bicycle";
import Day08BicycleBalance from "./MicroGames/Day08BicycleBalance";

import Day09AjiDeGallina from "./DayScenes/Day09AjiDeGallina";
import Day09FindIngredients from "./MicroGames/Day09FindIngredients";

import Day10Lays from "./DayScenes/Day10Lays";
import Day10CrunchHunt from "./MicroGames/Day10CrunchHunt";

import Day11Winter from "./DayScenes/Day11Winter";
import Day11WarmUp from "./MicroGames/Day11WarmUp";

import Day12Beach from "./DayScenes/Day12Beach";
import Day12BuildPostcard from "./MicroGames/Day12BuildPostcard";

import Day13VisAVis from "./DayScenes/Day13VisAVis";
import Day13EscapeCode from "./MicroGames/Day13EscapeCode";

import Day14Troll from "./DayScenes/Day14Troll";
import Day14FogTremor from "./MicroGames/Day14FogTremor";

import Day15WhatsApp from "./DayScenes/Day15WhatsApp";
import Day15OrderChat from "./MicroGames/Day15OrderChat";

import Day16Coquita from "./DayScenes/Day16Coquita";
import Day16PourCoke from "./MicroGames/Day16PourCoke";

import Day17ChocoMenta from "./DayScenes/Day17ChocoMenta";
import Day17SwirlMix from "./MicroGames/Day17SwirlMix";

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

  // ✅ helper: confetti solo si quieres (y día 7 NO)
  const celebrate = (opts?: { particleCount?: number; spread?: number }) => {
    confetti({
      particleCount: opts?.particleCount ?? 70,
      spread: opts?.spread ?? 65,
      origin: { y: 0.35 },
    });
  };

  // ✅ onWin ahora NO hace lluvia en día 7
  const onWin = () => {
    setWins((w) => w + 1);

    // ❌ Día 7 sin confetti (sin lluvia)
    if (item.day !== 7) {
      celebrate();
    }

    // sonido OK para todos (si quieres también puedes excluir día 7)
    playSound("/sounds/unlock.mp3", muted, 0.8);
  };

  const Game = useMemo(() => {
    if (item.microGame === "tap") return <TapGame onWin={onWin} />;
    if (item.microGame === "hold") return <HoldGame onWin={onWin} />;
    return <DragGame onWin={onWin} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.microGame, muted, item.day]);

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
      onClick={() => {
        playSound("/sounds/pop.mp3", muted, 0.6);
        onClose();
      }}
    >
      <motion.div
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

        {/* BODY */}
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
              <Day06ImanolExperience onWin={onWin} />
            </div>
          ) : item.day === 7 ? (
            <div className="space-y-4">
              <Day07Flowers />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  5 semillas, 5 gestos distintos. Haz florecer el jardín 🌸
                </p>
                {/* ✅ seguirá llamando onWin, pero ya NO habrá confetti por el check */}
                <Day07GardenBloom onWin={onWin} muted={muted} />
              </div>
            </div>
          ) : item.day === 8 ? (
            <div className="space-y-4">
              <Day08Bicycle />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Mantén el equilibrio en el carril 🚲
                </p>
                <Day08BicycleBalance onWin={onWin} />
              </div>
            </div>
          ) : item.day === 9 ? (
            <div className="space-y-4">
              <Day09AjiDeGallina />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Tienes 2 segundos para encontrar el emoji correcto y ponerlo
                  en el plato 🍽️
                </p>
                <Day09FindIngredients onWin={onWin} />
              </div>
            </div>
          ) : item.day === 10 ? (
            <div className="space-y-4">
              <Day10Lays />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Solo una bolsita vibra distinto. Tienes 3 intentos 😉
                </p>
                <Day10CrunchHunt onWin={onWin} />
              </div>
            </div>
          ) : item.day === 11 ? (
            <div className="space-y-4">
              <Day11Winter />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Agrega capas hasta llegar a 100% ❄️
                </p>
                <Day11WarmUp onWin={onWin} />
              </div>
            </div>
          ) : item.day === 12 ? (
            <div className="space-y-4">
              <Day12Beach />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Toca los stickers para colocarlos en su sombra 🏖️
                </p>
                <Day12BuildPostcard onWin={onWin} />
              </div>
            </div>
          ) : item.day === 13 ? (
            <div className="space-y-4">
              <Day13VisAVis />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  4 pistas → 1 código 🔐
                </p>
                <Day13EscapeCode onWin={onWin} />
              </div>
            </div>
          ) : item.day === 14 ? (
            <div className="space-y-4">
              <Day14Troll />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Una zona “tiembla” un poquito. Encuéntrala 🌫️
                </p>
                <Day14FogTremor onWin={onWin} />
              </div>
            </div>
          ) : item.day === 15 ? (
            <div className="space-y-4">
              <Day15WhatsApp />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Arrastra para ordenar el chat. Cuando encaje… ✔✔
                </p>
                <Day15OrderChat onWin={onWin} />
              </div>
            </div>
          ) : item.day === 16 ? (
            <div className="space-y-4">
              <Day16Coquita />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Destapa → sirve (sin pasarte) → limón 🍋
                </p>
                <Day16PourCoke onWin={onWin} />
              </div>
            </div>
          ) : item.day === 17 ? (
            <div className="space-y-4">
              <Day17ChocoMenta />
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold">Mini juego</div>
                <p className="mt-1 text-xs text-zinc-600">
                  Mezcla el swirl hasta que “se sienta” correcto 🍦
                </p>
                <Day17SwirlMix onWin={onWin} />
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
                    // ✅ aquí sí confetti
                    celebrate({ particleCount: 120, spread: 80 });
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
