"use client";

import { motion } from "framer-motion";

export default function Day05BuenosAires() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#060815] via-[#0b1230] to-[#1b0f20]" />
      <div className="absolute -top-28 -right-28 h-72 w-72 rounded-full bg-[#f6d365]/15 blur-3xl" />
      <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[#fda085]/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-white/80 drop-shadow">
            Día 5
          </div>
          <div className="mt-1 text-lg md:text-xl font-semibold text-white drop-shadow">
            Buenos Aires 🌙
          </div>
          <div className="mt-1 text-xs md:text-sm text-white/80 max-w-md drop-shadow">
            Hoy no es un mapa. Es una ciudad que se enciende con recuerdos.
          </div>
        </div>

        <motion.div
          className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur grid place-items-center text-2xl shadow-soft"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
      </div>

      {/* mini skyline decorativo */}
      <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 overflow-hidden">
        <svg
          viewBox="0 0 800 160"
          className="w-full h-[90px] opacity-95"
          aria-hidden="true"
        >
          {/* luna */}
          <circle cx="650" cy="35" r="18" fill="rgba(246,211,101,0.55)" />
          <circle cx="660" cy="32" r="18" fill="rgba(11,18,48,1)" />

          {/* edificios */}
          <g fill="rgba(255,255,255,0.12)">
            <rect x="35" y="70" width="70" height="70" rx="8" />
            <rect x="120" y="55" width="85" height="85" rx="10" />
            <rect x="220" y="82" width="60" height="58" rx="8" />
            <rect x="295" y="45" width="110" height="95" rx="12" />
            <rect x="420" y="78" width="75" height="62" rx="10" />
            <rect x="510" y="60" width="95" height="80" rx="12" />
            <rect x="620" y="85" width="55" height="55" rx="10" />
          </g>

          {/* “rio” */}
          <path
            d="M0 145 C 160 120, 240 160, 400 140 C 560 120, 640 170, 800 140 L 800 160 L0 160 Z"
            fill="rgba(255,255,255,0.06)"
          />
        </svg>

        <div className="mt-2 text-[11px] text-white/75">
          Enciende las luces para completar la ciudad.
        </div>
      </div>
    </div>
  );
}
