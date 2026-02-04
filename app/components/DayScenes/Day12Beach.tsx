"use client";

import { motion } from "framer-motion";

export default function Day12Beach() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-600">Día 12</div>
          <div className="mt-1 text-base font-semibold text-zinc-900">
            Playa 🏖️
          </div>
          <div className="mt-2 text-sm text-zinc-700">
            Un día de sol, sal, y risa.
            <br />
            Hoy armamos una postal bonita.
          </div>
        </div>

        <motion.div
          className="text-3xl"
          animate={{ rotate: [0, 3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🌊
        </motion.div>
      </div>
    </div>
  );
}
