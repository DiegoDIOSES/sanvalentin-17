"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const b2 = Math.round(A.b + (B.b - A.b) * t);
  return `rgb(${r}, ${g}, ${b2})`;
}

export default function Day03FindWineTone({
  onWin,
  muted,
}: {
  onWin: () => void;
  muted: boolean;
}) {
  // rango “perfecto”
  const TARGET = 0.52;
  const TOL = 0.03;

  // paleta vino → rosa empolvado
  const C1 = "#240913"; // vino profundo
  const C2 = "#7a2040"; // borgoña
  const C3 = "#f1d7de"; // rosa suave

  const [v, setV] = useState(0.15);
  const [locked, setLocked] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const inRange = useMemo(() => Math.abs(v - TARGET) <= TOL, [v]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // un “clink” sutil opcional (usa pop si no tienes clink)
    audioRef.current = new Audio("/sounds/pop.mp3");
    audioRef.current.volume = 0.35;
  }, []);

  useEffect(() => {
    if (locked) return;
    if (!inRange) return;

    // gana una vez
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocked(true);
    setShowCard(true);

    if (!muted) {
      try {
        audioRef.current?.play();
      } catch {}
    }

    onWin();
  }, [inRange, locked, muted, onWin]);

  const bg = useMemo(() => {
    // mezcla en 2 tramos para que sea más rico
    if (v < 0.5) return mix(C1, C2, v / 0.5);
    return mix(C2, C3, (v - 0.5) / 0.5);
  }, [v]);

  const glow = useMemo(
    () => (inRange ? "0 0 0 10px rgba(122,32,64,0.12)" : "none"),
    [inRange],
  );

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-600">
          Encuentra el{" "}
          <span className="font-semibold text-zinc-900">
            tono vino perfecto
          </span>
          .
        </div>
        <div
          className={`text-[11px] px-3 py-1 rounded-full border ${
            inRange
              ? "bg-[#7a2040]/10 border-[#7a2040]/25 text-[#7a2040]"
              : "bg-white border-zinc-200 text-zinc-600"
          }`}
        >
          {inRange ? "Sí. Ese." : "Ajusta…"}
        </div>
      </div>

      <div
        className="mt-3 rounded-2xl border border-zinc-200 overflow-hidden"
        style={{ boxShadow: glow }}
      >
        <div className="p-4 md:p-5" style={{ background: bg }}>
          <div className="flex items-center justify-between">
            <div className="text-white/90 text-[11px] drop-shadow">
              Desliza suave
            </div>
            <motion.div
              className="text-white/90 text-xl drop-shadow"
              animate={inRange ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.9, repeat: inRange ? Infinity : 0 }}
            >
              🍷
            </motion.div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/15 border border-white/20 backdrop-blur p-4">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={v}
              disabled={locked}
              onChange={(e) => setV(clamp(Number(e.target.value), 0, 1))}
              className="w-full accent-white"
            />

            <div className="mt-3 flex items-center justify-between text-[11px] text-white/90">
              <span>vino profundo</span>
              <span>rosa empolvado</span>
            </div>

            <div className="mt-3 text-[12px] text-white/95 leading-relaxed">
              No es cualquier color… es{" "}
              <span className="font-semibold">ese</span> que te queda.
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCard && (
          <motion.div
            className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4"
            initial={{ y: 8, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="text-xs text-zinc-600">Tarjeta editorial</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900">
              Guardemos este tono 💗
            </div>
            <div className="mt-2 text-sm text-zinc-700 leading-relaxed">
              “Hay colores que no se ven.
              <br />
              Se sienten.
              <br />Y tú siempre sabes cuándo uno es el correcto.”
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  try {
                    localStorage.setItem("wineTone", String(v));
                  } catch {}
                }}
                className="flex-1 rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
              >
                Guardar tono ✨
              </button>
              <button
                onClick={() => {
                  setLocked(false);
                  setShowCard(false);
                  setV(0.15);
                }}
                className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm font-semibold"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-[11px] text-zinc-600">
        Tip: si llegas al tono correcto, se siente “calmadito” 😌
      </div>
    </div>
  );
}
