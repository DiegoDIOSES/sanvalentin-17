"use client";

import { motion } from "framer-motion";

export default function Day10Lays() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-600">Día 10</div>
          <div className="mt-1 text-base font-semibold text-zinc-900">
            Papitas Lays 🤍
          </div>
          <div className="mt-2 text-sm text-zinc-700">
            Hay antojos que se sienten como un abrazo rápido.
            <br />
            Hoy es uno de esos.
          </div>
        </div>

        <motion.div
          className="text-3xl"
          animate={{ rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🥔
        </motion.div>
      </div>

      <div className="mt-3 text-xs text-zinc-600">
        Mini reto: encuentra el “crunch perfecto”.
      </div>
    </div>
  );
}
