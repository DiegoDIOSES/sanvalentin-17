"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import ScratchRevealPopup from "../ScratchRevealPopup";

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
  const [showPopup, setShowPopup] = useState(false);

  const inRange = useMemo(() => Math.abs(v - TARGET) <= TOL, [v]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // un “clink” sutil opcional (usa pop si no tienes clink)
    audioRef.current = new Audio("/sounds/pop.mp3");
    audioRef.current.volume = 0.35;
  }, []);

  const bg = useMemo(() => {
    // mezcla en 2 tramos para que sea más rico
    if (v < 0.5) return mix(C1, C2, v / 0.5);
    return mix(C2, C3, (v - 0.5) / 0.5);
  }, [v]);

  const glow = useMemo(
    () => (inRange ? "0 0 0 10px rgba(122,32,64,0.12)" : "none"),
    [inRange],
  );

  useEffect(() => {
    if (locked) return;
    if (!inRange) return;

    // gana una vez
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocked(true);
    setShowPopup(true);

    if (!muted) {
      try {
        audioRef.current?.currentTime && (audioRef.current.currentTime = 0);
        audioRef.current?.play();
      } catch {}
    }

    onWin();
  }, [inRange, locked, muted, onWin]);

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

      <div className="mt-2 text-[11px] text-zinc-600">
        Tip: si llegas al tono correcto, se siente “calmadito” 😌
      </div>

      {/* ✅ Popup “raspa y revela” */}
      <ScratchRevealPopup
        open={showPopup}
        color={bg}
        muted={muted}
        title="El tono perfecto 🍷"
        message={`“Hay colores que no se ven.
Se sienten.
Y tú siempre sabes cuándo uno es el correcto.”`}
        onClose={() => {
          setShowPopup(false);
          // NO reseteamos el juego automáticamente para que se sienta “logrado”
          // Si quieres reintento, mueve el slider fuera y vuelve a entrar.
        }}
      />
    </div>
  );
}
