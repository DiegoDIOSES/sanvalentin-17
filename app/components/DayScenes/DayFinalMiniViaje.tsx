"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Memory = {
  day: number;
  emoji: string;
  saved: boolean;
};

const MEMORIES: Omit<Memory, "saved">[] = [
  { day: 1, emoji: "🦒" },
  { day: 2, emoji: "🎂" },
  { day: 3, emoji: "🍷" },
  { day: 4, emoji: "🧩" },
  { day: 5, emoji: "🇦🇷" },
  { day: 6, emoji: "💌" },
  { day: 7, emoji: "🎧" },
  { day: 8, emoji: "🎥" },
  { day: 9, emoji: "🧠" },
  { day: 10, emoji: "✨" },
  { day: 11, emoji: "⛄️" },
  { day: 12, emoji: "🎁" },
  { day: 13, emoji: "🔐" },
  { day: 14, emoji: "🏃‍♀️" },
  { day: 15, emoji: "💬" },
  { day: 16, emoji: "🥤" },
  { day: 17, emoji: "🍨" },
];

const MIN_REQUIRED = 17; // cambia a 10 si lo quieres más fácil

export default function DayFinalMiniViaje() {
  const [memories, setMemories] = useState<Memory[]>(
    MEMORIES.map((m) => ({ ...m, saved: false })),
  );

  const savedCount = useMemo(
    () => memories.filter((m) => m.saved).length,
    [memories],
  );

  const completed = savedCount >= MIN_REQUIRED;

  const toggleMemory = (day: number) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.day === day ? { ...m, saved: true } : m,
      ),
    );
  };

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      {/* Header */}
      <div className="text-center">
        <div className="text-sm font-semibold text-zinc-900">
          Nuestro mini viaje
        </div>
        <div className="mt-1 text-sm text-zinc-700">
          Toca cada recuerdo para guardarlo 🤍
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3 text-xs text-zinc-600 text-center">
        Recuerdos guardados:{" "}
        <span className="font-semibold">{savedCount}/17</span>
      </div>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {memories.map((m) => (
          <button
            key={m.day}
            onClick={() => toggleMemory(m.day)}
            disabled={m.saved}
            className={`relative rounded-2xl border p-4 text-center transition ${
              m.saved
                ? "bg-emerald-50 border-emerald-200"
                : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
            }`}
          >
            <div className="text-xs text-zinc-500 mb-1">
              Día {m.day}
            </div>
            <div className="text-2xl">{m.emoji}</div>

            {m.saved && (
              <motion.div
                className="absolute inset-0 grid place-items-center text-emerald-600 text-xl"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                ✔
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Final message */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-center"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
          >
            <div className="text-sm font-semibold text-zinc-900">
              Ok… llegamos al final.
            </div>

            <div className="mt-2 text-sm text-zinc-700 leading-relaxed">
              La espera valdrá la pena.  
              <br />
              ¿Te invito a una cita tranquila y bonita?  
              <br />
              Quiero verte y hacer un recuerdo más contigo.
            </div>

            <div className="mt-4 text-sm font-semibold text-zinc-900">
              ¿Sí? 🤍
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}