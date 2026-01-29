"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

import { DAYS, TOTAL_DAYS } from "./data/days";
import { getUnlockedDayCount } from "./lib/time";

import Countdown from "./components/Countdown";
import DayCard from "./components/DayCard";
import DayModal from "./components/DayModal";
import SoundToggle from "./components/SoundToggle";
import HeartsBackground from "./components/HeartsBackground";

export default function Page() {
  const sp = useSearchParams();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);

  // Base real
  const base = useMemo(() => getUnlockedDayCount(new Date()), []);

  // DEMO overrides por URL
  const demo = sp.get("demo") === "1";
  const unlockedOverride = sp.get("unlocked");
  const openOverride = sp.get("open");

  const unlocked = useMemo(() => {
    if (demo) return TOTAL_DAYS;
    if (unlockedOverride) {
      const n = Number(unlockedOverride);
      if (Number.isFinite(n)) return Math.max(0, Math.min(TOTAL_DAYS, n));
    }
    return base.unlocked;
  }, [demo, unlockedOverride, base.unlocked]);

  // Auto-open de día
  useEffect(() => {
    if (!openOverride) return;
    const n = Number(openOverride);
    if (!Number.isFinite(n)) return;
    if (n < 1 || n > TOTAL_DAYS) return;

    // Si está bloqueado, pero demo está activo o unlocked alcanza, abrir igual
    if (demo || n <= unlocked) setSelectedDay(n);
  }, [openOverride, demo, unlocked]);

  const selected = selectedDay ? DAYS.find((d) => d.day === selectedDay) : null;

  return (
    <div className="min-h-screen bg-blobs relative overflow-hidden">
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
              Cada medianoche se desbloquea una cápsula con una cosita que te encanta.
              Al final… hay un sobre que quiero que abras.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Countdown />

              <div className="rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-soft text-sm">
                Desbloqueados:{" "}
                <span className="font-semibold text-zinc-900">{unlocked}</span> / {TOTAL_DAYS}
                {demo && <span className="ml-2 text-xs text-rose-600 font-semibold">DEMO</span>}
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-soft text-sm">
                Objetivo:{" "}
                <span className="font-semibold">
                  {base.target.toLocaleDateString("es-PE", { day: "2-digit", month: "long" })}
                </span>
              </div>
            </div>

            {/* Panel demo (solo aparece si demo=1) */}
            {demo && (
              <div className="mt-3 rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-soft text-xs text-zinc-700 inline-flex flex-wrap gap-2 items-center">
                <span className="font-semibold">Atajos:</span>
                <a className="underline" href="?demo=1&open=1">Abrir Día 1</a>
                <a className="underline" href="?demo=1&open=2">Abrir Día 2</a>
                <a className="underline" href="?demo=1&open=17">Abrir Día 17</a>
              </div>
            )}
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

      <AnimatePresence>
        {selected && (
          <DayModal item={selected} muted={muted} onClose={() => setSelectedDay(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}