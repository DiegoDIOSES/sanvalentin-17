"use client";

import { motion } from "framer-motion";

export default function Day04Tini() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-violet-50" />
      <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-pink-200/35 blur-2xl" />
      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-violet-200/35 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-zinc-700">Día 4</div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-zinc-900">
            Tini 🎶
          </div>
          <div className="mt-1 text-xs md:text-sm text-zinc-700 max-w-md">
            Hoy armamos un recuerdo pieza por pieza.
          </div>
        </div>

        <motion.div
          className="h-12 w-12 rounded-2xl bg-white/70 border border-white/70 backdrop-blur grid place-items-center text-2xl shadow-soft"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          🧩
        </motion.div>
      </div>
    </div>
  );
}
