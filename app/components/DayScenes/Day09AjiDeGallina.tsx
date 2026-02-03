"use client";

import { motion } from "framer-motion";

export default function Day09AjiDeGallina() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-5 shadow-soft overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-600">Día 9</div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-zinc-900">
            Ají de Gallina 🍽️
          </div>
          <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
            Hay comidas que no solo llenan el estómago… también el corazón.
          </p>
        </div>

        <motion.div
          className="text-3xl md:text-4xl"
          initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        >
          🌶️
        </motion.div>
      </div>

      <div className="mt-3 text-[11px] text-zinc-600">
        Tip: cuando salga una palabra… piensa en su emoji 😄
      </div>
    </div>
  );
}
