"use client";

import { motion } from "framer-motion";

export default function Day11Winter() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-600">Día 11</div>

          <div className="mt-1 text-base font-semibold text-zinc-900">
            Invierno ❄️
          </div>

          <div className="mt-2 text-sm text-zinc-700">
            Si hace frío, yo te pongo capas.
            <br />
            Poquito a poquito… hasta que vuelva el calor.
          </div>
        </div>

        <motion.div
          className="text-3xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          🧣
        </motion.div>
      </div>
    </div>
  );
}
