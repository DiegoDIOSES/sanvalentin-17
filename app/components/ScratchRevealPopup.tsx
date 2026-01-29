"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  color: string; // rgb(...) o hex
  title?: string;
  message: string;
  onClose: () => void;
  muted: boolean;
};

export default function ScratchRevealPopup({
  open,
  color,
  title = "El tono perfecto 🍷",
  message,
  onClose,
  muted,
}: Props) {
  const size = 320; // cuadrado premium
  const brush = 26; // grosor del “borrador”
  const threshold = 0.45; // 45% raspado para revelar

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDownRef = useRef(false);

  const [reveal, setReveal] = useState(false);

  // sonido sutil al revelar (usa pop si no tienes uno específico)
  const revealSound = useMemo(() => {
    const a = new Audio("/sounds/unlock.mp3");
    a.volume = 0.35;
    return a;
  }, []);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReveal(false);

    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // Pintar capa sólida del color
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    // textura sutil (nota: muy suave, premium)
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 2.0;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // set modo raspado
    ctx.globalCompositeOperation = "destination-out";
  }, [open, color]);

  const getXY = (e: PointerEvent, rect: DOMRect) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const scratch = (x: number, y: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, brush, 0, Math.PI * 2);
    ctx.fill();

    // check progress (no lo hacemos cada pixel para rendimiento)
  };

  const computeScratchedRatio = () => {
    const c = canvasRef.current;
    if (!c) return 0;
    const ctx = c.getContext("2d", { willReadFrequently: true } as unknown);
    if (!ctx) return 0;

    // Assert ctx as CanvasRenderingContext2D to access getImageData
    const ctx2d = ctx as CanvasRenderingContext2D;
    const img = ctx2d.getImageData(0, 0, size, size).data;
    // alfa 0 => borrado (destination-out)
    let cleared = 0;
    const total = size * size;

    // sampleo cada 4px para que sea rápido
    const step = 4;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const idx = (y * size + x) * 4 + 3;
        if (img[idx] === 0) cleared++;
      }
    }
    const sampledTotal = Math.ceil(size / step) * Math.ceil(size / step);
    return cleared / sampledTotal;
  };

  useEffect(() => {
    if (!open) return;

    const c = canvasRef.current;
    if (!c) return;

    const onPointerDown = (e: PointerEvent) => {
      isDownRef.current = true;
      c.setPointerCapture(e.pointerId);
      const rect = c.getBoundingClientRect();
      const { x, y } = getXY(e, rect);
      scratch(x, y);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDownRef.current) return;
      const rect = c.getBoundingClientRect();
      const { x, y } = getXY(e, rect);
      scratch(x, y);
    };

    const onPointerUp = () => {
      isDownRef.current = false;

      // al soltar, evaluamos avance
      const ratio = computeScratchedRatio();
      if (!reveal && ratio >= threshold) {
        setReveal(true);
        if (!muted) {
          try {
            revealSound.currentTime = 0;
            revealSound.play();
          } catch {}
        }
      }
    };

    c.addEventListener("pointerdown", onPointerDown);
    c.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      c.removeEventListener("pointerdown", onPointerDown);
      c.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [open, reveal, muted, revealSound]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-black/40 flex items-end md:items-center justify-center p-3 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[26px] bg-white shadow-soft overflow-hidden"
            initial={{ y: 26, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="p-5 border-b border-zinc-200 bg-gradient-to-br from-zinc-50 to-white">
              <div className="text-xs text-zinc-600">REVELA EL MENSAJE</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">
                {title}
              </div>
              <div className="mt-2 text-xs text-zinc-600">
                Limpia el cuadro con tu dedo (o mouse) ✨
              </div>
            </div>

            <div className="p-5">
              <div
                className="mx-auto relative"
                style={{ width: size, height: size }}
              >
                {/* Mensaje debajo */}
                <div className="absolute inset-0 rounded-2xl border border-zinc-200 bg-white grid place-items-center p-6">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-zinc-900">
                      {reveal ? "Ahí está 💗" : "…"}
                    </div>
                    <div className="mt-3 text-sm text-zinc-700 leading-relaxed">
                      {message}
                    </div>
                  </div>
                </div>

                {/* Capa raspable */}
                <canvas
                  ref={canvasRef}
                  width={size}
                  height={size}
                  className="absolute inset-0 rounded-2xl border border-zinc-200 touch-none"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
                >
                  Cerrar ✨
                </button>
              </div>

              <div className="mt-3 text-[11px] text-zinc-500">
                Tip: si no se revela, limpia un poco más la zona central.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
