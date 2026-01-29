"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { playSound } from "../lib/sound";

export default function SpotifyLaunchModal({
  open,
  muted,
  onCancel,
  onDone,
  seconds = 4,
}: {
  open: boolean;
  muted: boolean;
  onCancel: () => void;
  onDone: () => void;
  seconds?: number;
}) {
  const [t, setT] = useState(seconds);

  const lines = useMemo(
    () => [
      "Ok… ahora sí 🫶",
      "Ponte linda ✨",
      "Respira…",
      "Y canta conmigo 🎶",
      "Vámonos a escuchar esta melodía…",
    ],
    [],
  );

  const currentLine = useMemo(() => {
    const idx = Math.min(lines.length - 1, seconds - t);
    return lines[idx] ?? lines[0];
  }, [lines, seconds, t]);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setT(seconds);

    playSound("/sounds/secret.mp3", muted, 0.55);

    const id = window.setInterval(() => {
      setT((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [open, seconds, muted]);

  useEffect(() => {
    if (!open) return;
    if (t !== 0) return;
    // pequeña pausa para que se sienta cinematográfico
    const to = window.setTimeout(() => onDone(), 450);
    return () => window.clearTimeout(to);
  }, [open, t, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center bg-black/50 p-3 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onCancel}
        >
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-[26px] bg-white shadow-soft"
            initial={{ y: 26, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="p-5 border-b border-zinc-200 bg-gradient-to-br from-zinc-50 to-white">
              <div className="text-xs text-zinc-600">CARGANDO MOMENTO</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">
                Buenos Aires 🎶
              </div>
              <div className="mt-2 text-sm text-zinc-700 leading-relaxed">
                {currentLine}
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900">
                    Preparando Spotify…
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {t}s
                  </div>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                  <motion.div
                    className="h-full bg-zinc-900"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${((seconds - t) / seconds) * 100}%`,
                    }}
                    transition={{ ease: "easeOut", duration: 0.35 }}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    playSound("/sounds/pop.mp3", muted, 0.6);
                    onCancel();
                  }}
                  className="flex-1 rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
