"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Day06CleanReveal({
  coverColor = "#f4c5cf",
  backgroundImageSrc,
  message,
  subtitle,
  onReveal,
}: {
  coverColor?: string;
  backgroundImageSrc: string; // /images/xxx.jpg
  message: string;
  subtitle?: string;
  onReveal?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  const threshold = 92; // % para considerar “limpiado”

  const brush = useMemo(
    () => ({
      rMobile: 26,
      rDesktop: 34,
      feather: 0.8,
    }),
    [],
  );

  function getLocalXY(e: PointerEvent) {
    const el = canvasRef.current!;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (el.width / rect.width);
    const y = (e.clientY - rect.top) * (el.height / rect.height);
    return { x, y };
  }

  function paintDot(x: number, y: number) {
    const ctx = ctxRef.current;
    const el = canvasRef.current;
    if (!ctx || !el) return;

    const isMobile = window.innerWidth < 768;
    const r = isMobile ? brush.rMobile : brush.rDesktop;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function paintLine(a: { x: number; y: number }, b: { x: number; y: number }) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const r = isMobile ? brush.rMobile : brush.rDesktop;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = r * 2;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function computePercent() {
    const ctx = ctxRef.current;
    const el = canvasRef.current;
    if (!ctx || !el) return;

    // MUY importante: medir solo de vez en cuando (performance)
    const img = ctx.getImageData(0, 0, el.width, el.height).data;
    let transparent = 0;
    const step = 8; // muestreo
    for (let i = 3; i < img.length; i += 4 * step) {
      if (img[i] === 0) transparent++;
    }
    const total = img.length / (4 * step);
    const percent = clamp(Math.round((transparent / total) * 100), 0, 100);

    setPct(percent);

    if (!done && percent >= threshold) {
      setDone(true);
      onReveal?.();
    }
  }

  function scheduleCompute() {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      computePercent();
    });
  }

  function resizeCanvas() {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    // pintar cover sólido
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // primera “raspadita” suave para que se sienta vivo
    paintDot(canvas.width * 0.5, canvas.height * 0.55);

    // reset estado
    setPct(0);
    setDone(false);
    lastRef.current = null;
    drawingRef.current = false;
  }

  useEffect(() => {
    resizeCanvas();
    const onR = () => resizeCanvas();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverColor, backgroundImageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // clave en móvil
    canvas.style.touchAction = "none";

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      drawingRef.current = true;
      canvas.setPointerCapture(e.pointerId);
      const p = getLocalXY(e);
      lastRef.current = p;
      paintDot(p.x, p.y);
      scheduleCompute();
    };

    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const p = getLocalXY(e);
      const last = lastRef.current;
      if (last) paintLine(last, p);
      lastRef.current = p;
      scheduleCompute();
    };

    const onUp = (e: PointerEvent) => {
      e.preventDefault();
      drawingRef.current = false;
      lastRef.current = null;
      scheduleCompute();
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp, { passive: false });
    canvas.addEventListener("pointercancel", onUp, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [done]);

  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-5 py-3 md:py-4 bg-white/70 backdrop-blur border-b border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-900">Carta</div>
          <div className="text-xs text-zinc-600 tabular-nums">{pct}%</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5">
        <div
          ref={wrapRef}
          className="relative w-full overflow-hidden rounded-3xl border border-zinc-200"
          style={{
            // alto amable en móvil (antes quedaba compacto)
            height: "min(420px, 56vh)",
          }}
        >
          {/* Imagen base NORMAL (se verá al final cuando se vaya el blur) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Capa BLUR que estará visible hasta terminar */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: done ? 0 : 1,
              filter: done ? "blur(0px)" : "blur(14px)",
            }}
            transition={{ duration: 0.6 }}
            style={{
              backgroundImage: `url(${backgroundImageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Fondo suave rosado encima de la imagen */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: done ? 0.15 : 0.35 }}
            transition={{ duration: 0.6 }}
            style={{ background: "rgba(244,197,207,0.55)" }}
          />

          {/* Texto centrado */}
          <div className="absolute inset-0 grid place-items-center px-5 text-center">
            <div className="max-w-[560px]">
              <div className="text-[16px] md:text-[18px] font-semibold text-zinc-900 leading-snug whitespace-pre-line">
                {message}
              </div>
              {subtitle && (
                <div className="mt-2 text-[12px] md:text-[13px] text-zinc-700">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Canvas scratch (DEBE estar arriba y recibir touch) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20"
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: done ? "none" : "auto",
              touchAction: "none",
            }}
          />

          {/* Sello “listo” */}
          <AnimatePresence>
            {done && (
              <motion.div
                className="absolute left-3 top-3 z-30 rounded-2xl bg-white/80 backdrop-blur border border-white/60 px-3 py-1.5 text-xs text-zinc-800 shadow-soft"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                Descubierto 🤍
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
