"use client";

import { motion } from "framer-motion";

export default function Day07Flowers() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-zinc-700">Día 7</div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-zinc-900">
            Todas las flores 🌸
          </div>
          <div className="mt-1 text-xs md:text-sm text-zinc-700 max-w-md">
            Cada flor aparece cuando la cuidas. (Este día sí tiene viento suave)
          </div>
        </div>

        <motion.div
          className="h-12 w-12 rounded-2xl bg-white/70 border border-white/70 backdrop-blur grid place-items-center text-2xl shadow-soft"
          animate={{ rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🌼
        </motion.div>
      </div>

      <div className="relative mt-4 rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur p-4">
        <div className="text-[11px] text-zinc-600">Regla</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900">
          5 semillas • 5 gestos • 1 jardín completo
        </div>
      </div>
    </div>
  );
}
