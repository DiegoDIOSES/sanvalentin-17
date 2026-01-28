// app/components/DayModal.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { DayItem } from "../data/days";

export default function DayModal({
  item,
  onClose,
  muted,
}: {
  item: DayItem;
  onClose: () => void;
  muted: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 p-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-[26px] bg-white shadow-soft"
        initial={{ y: 40, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <div
          className={`relative p-6 md:p-8 bg-gradient-to-br ${item.accentGradient}`}
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
            </div>
            <button
              onClick={onClose}
              className="rounded-2xl bg-white/70 backdrop-blur px-3 py-2 text-sm"
            >
              Cerrar ✕
            </button>
          </div>

          <motion.div
            className="mt-6 text-6xl md:text-7xl"
            initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            {item.emoji}
          </motion.div>
        </div>

        <div className="p-6 md:p-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold">
              Modo premium (próximo paso)
            </div>
            <p className="mt-1 text-xs text-zinc-600">
              Aquí conectaremos: sonido por día, microjuego y animación
              especial. (Muted: {muted ? "Sí" : "No"})
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
