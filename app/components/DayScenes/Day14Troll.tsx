"use client";

import { motion } from "framer-motion";

export default function Day14Troll() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-soft">
      <div className="relative">
        {/* cover image */}
        <div className="relative h-[220px] md:h-[260px] overflow-hidden">
          <img
            src="/images/troll.jpg"
            alt="Troll"
            className="h-full w-full object-cover"
          />
          {/* cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-white/0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
          <motion.div
            className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-200/25 blur-3xl"
            animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-sky-200/25 blur-3xl"
            animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* title */}
          <div className="absolute left-4 right-4 top-4 md:left-6 md:right-6 md:top-6">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/75 backdrop-blur border border-white/60 px-4 py-2 text-xs text-zinc-800 shadow-soft">
              <span className="text-sm">🪨</span>
              Día 14 • Troll (Netflix)
            </div>
          </div>

          <div className="absolute left-4 right-4 bottom-4 md:left-6 md:right-6 md:bottom-6">
            <div className="max-w-xl">
              <div className="text-2xl md:text-3xl font-semibold tracking-tight text-white drop-shadow">
                “Cuando todo tiembla… tú haces que se sienta seguro.”
              </div>
              <div className="mt-2 text-sm text-white/90 drop-shadow">
                Hoy no es un mini juego: es una misión.
              </div>
            </div>
          </div>
        </div>

        {/* editorial card */}
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-zinc-900">
                Misión: salvar el momento
              </div>
              <div className="mt-1 text-sm text-zinc-700 leading-relaxed">
                Tres actos: <span className="font-semibold">equiparte</span>,{" "}
                <span className="font-semibold">hacer el ritual</span> y{" "}
                <span className="font-semibold">escapar</span>.
              </div>
            </div>
            <div className="text-3xl">🧿</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs text-zinc-600">Acto 1</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Preparación
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs text-zinc-600">Acto 2</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Ritual
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs text-zinc-600">Acto 3</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Escape
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
