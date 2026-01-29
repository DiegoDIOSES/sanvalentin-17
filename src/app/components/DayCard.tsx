// app/components/DayCard.tsx
"use client";

import { motion } from "framer-motion";
import type { DayItem } from "../data/days";

export default function DayCard({
  item,
  unlocked,
  onOpen,
}: {
  item: DayItem;
  unlocked: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className={[
        "relative overflow-hidden rounded-[22px] p-4 md:p-5 shadow-soft text-left",
        "bg-white/70 backdrop-blur",
        unlocked ? "opacity-100" : "opacity-55 cursor-not-allowed",
      ].join(" ")}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.accentGradient} opacity-60`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-zinc-700">
            Día {item.day}
          </div>
          <div className="text-lg">{unlocked ? "💖" : "🔒"}</div>
        </div>

        <div className="mt-4 text-3xl">{item.emoji}</div>
        <div className="mt-3 font-semibold">{item.title}</div>
        <div className="mt-1 text-xs text-zinc-700">
          {unlocked ? item.description : "Aún no se desbloquea…"}
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-zinc-700 bg-white/60 rounded-full px-3 py-1">
          <span>✨</span>
          <span>{unlocked ? "Abrir" : "Bloqueado"}</span>
        </div>
      </div>
    </motion.button>
  );
}