"use client";

import { motion } from "framer-motion";

export default function Day03WineTone() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a0b18] via-[#6b1b3a] to-[#f0d7df]" />
      <div className="absolute inset-0 opacity-[0.35]">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-white/90 drop-shadow">
            Día 3
          </div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-white drop-shadow">
            Color vino 🍷
          </div>
          <div className="mt-1 text-xs md:text-sm text-white/90 max-w-md drop-shadow">
            Hay colores que no se ven… se sienten. Hoy, encontremos el tono
            exacto.
          </div>
        </div>

        <motion.div
          className="h-12 w-12 rounded-2xl bg-white/20 border border-white/25 backdrop-blur grid place-items-center text-2xl"
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🍷
        </motion.div>
      </div>

      <div className="relative mt-4 rounded-2xl bg-white/18 border border-white/20 backdrop-blur p-4">
        <div className="text-[11px] text-white/85">Mood</div>
        <div className="mt-1 text-sm font-semibold text-white">
          Elegante, suave, profundo.
        </div>
      </div>
    </div>
  );
}
