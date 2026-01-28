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

      {/* “Cuello” animado asomándose */}
      <div className="relative mt-4 h-20 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-rose-50">
        <motion.div
          className="absolute -bottom-10 left-6 h-40 w-10 rounded-full border border-amber-200 bg-amber-100"
          animate={{ y: [18, 0, 18] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Manchitas */}
        <motion.div
          className="absolute bottom-3 left-7 h-3 w-3 rounded-full bg-amber-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-8 left-10 h-4 w-4 rounded-full bg-amber-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.9, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-12 left-7 h-2.5 w-2.5 rounded-full bg-amber-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />

        <div className="absolute right-4 top-4 text-xs text-zinc-600">
          (mira cómo asoma 👀)
        </div>
      </div>
    </div>
  );
}
