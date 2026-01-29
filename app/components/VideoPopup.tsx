"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { playSound } from "../lib/sound";

export default function VideoPopup({
  open,
  onClose,
  muted,
  title,
  videoSrc,
  poster,
}: {
  open: boolean;
  onClose: () => void;
  muted: boolean;
  title: string;
  videoSrc: string; // ruta local: /videos/buenos-aires.mp4
  poster?: string; // opcional: /images/poster.jpg
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Cuando cierras: pausa y vuelve al inicio
  const close = () => {
    try {
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    } catch {}
    playSound("/sounds/pop.mp3", muted, 0.6);
    onClose();
  };

  // Si se abre, opcional: empieza en pausa (no autoplay para evitar bloqueos)
  useEffect(() => {
    if (!open) return;
    try {
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    } catch {}
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center bg-black/50 p-3 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-[26px] bg-white shadow-soft"
            initial={{ y: 26, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="flex items-center justify-between gap-3 p-4 md:p-5 border-b border-zinc-200 bg-gradient-to-br from-zinc-50 to-white">
              <div>
                <div className="text-xs text-zinc-600">VIDECLIP</div>
                <div className="mt-1 text-base md:text-lg font-semibold text-zinc-900">
                  {title}
                </div>
              </div>

              <button
                onClick={close}
                className="rounded-2xl bg-white border border-zinc-200 px-3 py-2 text-sm font-semibold"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="p-4 md:p-5">
              <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full"
                  src={videoSrc}
                  poster={poster}
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>

              <div className="mt-3 text-[11px] text-zinc-600">
                Puedes pausar, avanzar y poner fullscreen. Al cerrar se pausa
                automáticamente.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
