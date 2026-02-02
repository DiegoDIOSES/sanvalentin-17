"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Day06CleanReveal({
  coverColor,
  message,
  subtitle,
  onReveal,
}: {
  coverColor: string;
  message: string;
  subtitle?: string;
  onReveal?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [revealedPct, setRevealedPct] = useState(0);
  const [done, setDone] = useState(false);

  const size = useMemo(() => ({ w: 980, h: 520 }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      // paint cover
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, w, h);

      // glossy overlay
      const grd = ctx.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, "rgba(255,255,255,0.35)");
      grd.addColorStop(0.55, "rgba(255,255,255,0.12)");
      grd.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [coverColor]);

  const scratchAt = (clientX: number, clientY: number) => {
    if (done) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = wrap.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // estimate revealed %
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    const img = ctx.getImageData(0, 0, w, h).data;

    let transparent = 0;
    // sample grid (fast)
    const step = 12;
    for (let yy = 0; yy < h; yy += step) {
      for (let xx = 0; xx < w; xx += step) {
        const idx = (yy * w + xx) * 4 + 3;
        if (img[idx] < 40) transparent++;
      }
    }
    const total = Math.floor(w / step) * Math.floor(h / step);
    const pct = clamp(transparent / total, 0, 1);
    setRevealedPct(pct);

    if (pct > 0.56 && !done) {
      setDone(true);
      onReveal?.();
    }
  };

  const [drag, setDrag] = useState(false);

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-soft"
        style={{ aspectRatio: "16 / 10" }}
        onPointerDown={(e) => {
          setDrag(true);
          scratchAt(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!drag) return;
          scratchAt(e.clientX, e.clientY);
        }}
        onPointerUp={() => setDrag(false)}
        onPointerCancel={() => setDrag(false)}
      >
        {/* content under */}
        <div className="absolute inset-0 p-6 md:p-10 bg-gradient-to-br from-white via-rose-50/45 to-amber-50/40">
          <div className="text-xs text-zinc-600">Mensaje</div>
          <div className="mt-2 text-xl md:text-2xl font-semibold text-zinc-900">
            Para ti 🤍
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/75 backdrop-blur p-5 md:p-6">
            <div className="whitespace-pre-line text-sm md:text-base text-zinc-800 leading-relaxed">
              {message}
            </div>
            {subtitle && (
              <div className="mt-3 text-xs text-zinc-600">{subtitle}</div>
            )}
          </div>

          <div className="mt-6 text-[11px] text-zinc-600">
            (Puedes volver a limpiar para verlo otra vez.)
          </div>
        </div>

        {/* scratch layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          aria-label="capa para limpiar"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-700">
        <span>Limpiado</span>
        <span className="font-semibold">{Math.round(revealedPct * 100)}%</span>
      </div>

      {done && (
        <motion.div
          className="mt-3 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur p-4 text-center"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="text-xs text-zinc-600">Revelado</div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            Lo encontraste 🤍
          </div>
        </motion.div>
      )}
    </div>
  );
}