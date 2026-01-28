"use client";

import { motion } from "framer-motion";

export default function Day01Giraffe() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
      {/* Fondo suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50" />

      {/* Corazoncitos flotando */}
      <motion.div
        className="absolute -top-2 left-4 text-xl"
        animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        💗
      </motion.div>
      <motion.div
        className="absolute top-6 right-8 text-lg"
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
      >
        ✨
      </motion.div>

      <div className="relative flex items-center gap-4">
        {/* Ilustración (si existe) */}
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
          {/* Si no existe la imagen, igual se ve bien */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/day01-jirafa.webp"
            alt="Jirafa"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 grid place-items-center text-3xl">
            🦒
          </div>
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold">Día 1: Jirafa</div>
          <div className="mt-1 text-xs text-zinc-600">
            Hoy empieza el reto… con algo alto, tierno y un poquito raro (en el
            mejor sentido).
          </div>
        </div>
      </div>
    </div>
  );
}
