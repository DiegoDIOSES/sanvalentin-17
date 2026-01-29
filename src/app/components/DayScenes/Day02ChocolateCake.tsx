"use client";

import { motion } from "framer-motion";

export default function Day02ChocolateCake() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50" />

      <div className="relative flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-zinc-200 bg-white/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/day02-chocolate.webp"
            alt="Torta de chocolate"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 grid place-items-center text-3xl">🍫🍰</div>
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold">Día 2: Torta de chocolate</div>
          <div className="mt-1 text-xs text-zinc-600">
            Dulce, intensa y peligrosa… porque siempre provoca “un poquito más”.
          </div>
        </div>

        <motion.div
          className="text-2xl"
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
      </div>

      <div className="relative mt-4 rounded-2xl border border-zinc-200 bg-white/60 p-4">
        <div className="text-xs text-zinc-600">Tip del día</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900">
          Arrastra ingredientes para decorar tu torta 🍓🍫
        </div>
      </div>
    </div>
  );
}