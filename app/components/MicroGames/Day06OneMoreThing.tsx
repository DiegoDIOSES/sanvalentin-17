"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

type Props = {
  open: boolean;
  onClose: () => void;      // cerrar el popup (NO el daymodal)
  onDone: () => void;       // cuando termina de limpiar, permitir cerrar
  imageSrc: string;         // /images/xxxx.jpg
};

export default function Day06OneMoreThing({ open, onClose, onDone, imageSrc }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [w, setW] = useState(800);
  const [h, setH] = useState(520);
  const [progress, setProgress] = useState(0); // 0..1
  const [done, setDone] = useState(false);

  const prompts = useMemo(
    () => [
      { t: 0.02, text: "Espera… aún falta descubrir algo más 👀" },
      { t: 0.18, text: "Ya casi… ya casi ✨" },
      { t: 0.35, text: "Solo un poquito más…" },
      { t: 0.55, text: "Falta un poquitito 😌" },
      { t: 0.74, text: "Eso… así…" },
      { t: 0.88, text: "Último toque 🤍" },
    ],
    [],
  );

  const currentPrompt = useMemo(() => {
    const p = prompts
      .slice()
      .reverse()
      .find((x) => progress >= x.t);
    return p?.text ?? prompts[0].text;
  }, [progress, prompts]);

  // Resize observer
  useEffect(() => {
    if (!open) return;
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setW(Math.max(320, Math.round(rect.width)));
      setH(Math.max(360, Math.round(rect.height)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Init canvas cover
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // cover pastel
    ctx.fillStyle = "rgba(244,197,207,1)"; // rosa suave
    ctx.fillRect(0, 0, w, h);

    // un poquito de textura
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#000";
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 1 + Math.random() * 2.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // reset state
    setProgress(0);
    setDone(false);
  }, [open, w, h]);

  // scratch draw
  const scratching = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const draw = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 44;

    ctx.beginPath();
    const lp = lastPoint.current;
    if (!lp) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.01, y + 0.01);
    } else {
      ctx.moveTo(lp.x, lp.y);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    lastPoint.current = { x, y };
  };

  const sampleProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // muestreo rápido (no leer TODO)
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = img.data;

    let cleared = 0;
    const step = 16; // más grande = más rápido
    for (let i = 3; i < data.length; i += 4 * step) {
      // alpha
      if (data[i] === 0) cleared++;
    }
    const total = Math.floor(data.length / (4 * step));
    const p = clamp(cleared / total, 0, 1);
    setProgress(p);

    if (!done && p >= 0.78) {
      setDone(true);
      onDone();
    }
  };

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      if (scratching.current) sampleProgress();
    }, 160);
    return () => window.clearInterval(id);
  }, [open, done]);

  const onPointerDown = (e: React.PointerEvent) => {
    scratching.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    lastPoint.current = null;
    draw(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!scratching.current) return;
    draw(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    scratching.current = false;
    lastPoint.current = null;
    sampleProgress();
  };

  // blur: borrosa al inicio, nítida al final
  const blurPx = useMemo(() => {
    const max = 18;
    const p = clamp(progress, 0, 1);
    // mantiene más blur hasta avanzada la limpieza, y al final baja rápido
    const eased = p < 0.75 ? p * 0.4 : 0.3 + (p - 0.75) * 2.8;
    return Math.round(max * (1 - clamp(eased, 0, 1)));
  }, [progress]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-[28px] bg-white shadow-soft overflow-hidden"
            initial={{ y: 22, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="p-4 md:p-5 border-b border-zinc-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-600">Un último secreto</div>
                  <div className="mt-1 text-lg md:text-xl font-semibold text-zinc-900">
                    {currentPrompt}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-2xl bg-zinc-900 text-white px-4 py-2 text-sm font-semibold"
                >
                  {done ? "Cerrar" : "Ok"}
                </button>
              </div>

              <div className="mt-3 h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-zinc-900"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>

              <div className="mt-2 text-[11px] text-zinc-600">
                Limpia hasta que la foto se vea clarita 🤍
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div
                ref={wrapRef}
                className="relative w-full rounded-[24px] border border-zinc-200 overflow-hidden bg-zinc-50"
                style={{ height: "520px" }}
              >
                {/* imagen */}
                <img
                  src={imageSrc}
                  alt="Recuerdo"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: `blur(${blurPx}px)` }}
                />

                {/* mensaje debajo (se ve cuando raspas) */}
                <div className="absolute inset-0 grid place-items-center p-6">
                  <div className="rounded-[22px] bg-white/75 backdrop-blur border border-white/70 shadow-soft p-6 text-center max-w-xl">
                    <div className="text-xs text-zinc-600">Debajo de esto…</div>
                    <div className="mt-2 text-xl md:text-2xl font-semibold text-zinc-900">
                      “Hay un cariño que se nota sin decirse.”
                    </div>
                    <div className="mt-3 text-sm text-zinc-700 leading-relaxed">
                      Y contigo, se nota.
                      <br />
                      (Ahora sí… ya puedes cerrar 🤍)
                    </div>
                  </div>
                </div>

                {/* capa raspable */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 touch-none"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}