"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DAYS, TOTAL_DAYS } from "./data/days";
import { getUnlockedDayCount } from "./lib/time";

import Countdown from "./components/Countdown";
import DayCard from "./components/DayCard";
import DayModal from "./components/DayModal";
import SoundToggle from "./components/SoundToggle";
import HeartsBackground from "./components/HeartsBackground";

export default function Page() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);

  const { unlocked, target } = useMemo(
    () => getUnlockedDayCount(new Date()),
    [],
  );

  const selected = selectedDay ? DAYS.find((d) => d.day === selectedDay) : null;

  return (
    <div className="min-h-screen bg-blobs relative overflow-hidden">
      {/* Fondo premium */}
      <HeartsBackground />

      <header className="mx-auto max-w-6xl px-4 pt-8 pb-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-semibold tracking-tight"
            >
              17 Días, 17 Latidos 💗
            </motion.h1>

            <p className="mt-2 text-sm md:text-base text-zinc-700 max-w-xl">
              Cada medianoche se desbloquea una cápsula con una cosita que te
              encanta. Al final… hay un sobre que quiero que abras.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Countdown />
              <div className="rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-soft text-sm">
                Desbloqueados:{" "}
                <span className="font-semibold text-zinc-900">{unlocked}</span>{" "}
                / {TOTAL_DAYS}
              </div>
              <div className="rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-soft text-sm">
                Objetivo:{" "}
                <span className="font-semibold">
                  {target.toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>

          <SoundToggle muted={muted} setMuted={setMuted} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {DAYS.map((item) => {
            const isUnlocked = item.day <= unlocked;

            return (
              <DayCard
                key={item.day}
                item={item}
                unlocked={isUnlocked}
                onOpen={() => {
                  if (!isUnlocked) return;
                  setSelectedDay(item.day);
                }}
              />
            );
          })}
        </div>
      </main>

      <footer className="pb-10 text-center text-xs text-zinc-600 relative z-10">
        Hecho con 💗 — pastel, limpio, divertido y con sorpresa.
      </footer>

      <AnimatePresence>
        {selected && (
          <DayModal
            item={selected}
            muted={muted}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
