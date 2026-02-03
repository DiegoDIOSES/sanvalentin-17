"use client";

import { motion } from "framer-motion";

export default function Day08Bicycle() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 via-rose-50 to-white p-5">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-200/35 blur-3xl" />

      <div className="relative">
        <div className="text-xs font-semibold text-zinc-700">Día 8</div>
        <div className="mt-1 text-xl md:text-2xl font-semibold text-zinc-900">
          Manejar bicicleta 🚲
        </div>
        <p className="mt-2 text-sm text-zinc-700 max-w-xl">
          No importa tanto a dónde vamos… sino con quién se siente el camino.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatPill label="Ritmo" value="suave" />
          <StatPill label="Ruta" value="bonita" />
          <StatPill label="Sensación" value="segura" />
        </div>

        <motion.div
          className="mt-5 rounded-2xl border border-white/70 bg-white/60 backdrop-blur p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <div className="text-[11px] text-zinc-600">Idea</div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            Mantén el equilibrio un ratito.
          </div>
          <div className="mt-1 text-xs text-zinc-700">
            Inclina el celular (o usa el slider) para mantenerte en el carril.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 backdrop-blur px-3 py-2">
      <div className="text-[10px] text-zinc-600">{label}</div>
      <div className="text-xs font-semibold text-zinc-900">{value}</div>
    </div>
  );
}
