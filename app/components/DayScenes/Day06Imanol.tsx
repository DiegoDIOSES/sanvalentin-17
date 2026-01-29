"use client";

import { motion } from "framer-motion";

export default function Day06Imanol() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-white" />
      <div className="absolute -top-20 -right-24 h-60 w-60 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-24 h-60 w-60 rounded-full bg-rose-200/35 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-zinc-700">Día 6</div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-zinc-900">
            Estar con Imanol 🤍
          </div>
          <div className="mt-1 text-xs md:text-sm text-zinc-700 max-w-md">
            Hoy no se corre, no se compite… hoy solo se siente. (Sin sonidos)
          </div>
        </div>

        <motion.div
          className="h-12 w-12 rounded-2xl bg-white/70 border border-white/70 backdrop-blur grid place-items-center text-2xl shadow-soft"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ☁️
        </motion.div>
      </div>

      <div className="relative mt-4 rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur p-4">
        <div className="text-[11px] text-zinc-600">Mood</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900">
          Risas que se contagian, aunque no suenen.
        </div>
      </div>
    </div>
  );
}
