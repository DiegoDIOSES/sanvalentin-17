"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type DigitState = {
  d1: string | null;
  d2: string | null;
  d3: string | null;
  d4: string | null;
};

const CODE = "2304";
const TOTAL_MS = 15000;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/* =========================
   SCRATCH CARD (CANVAS)
========================= */
function ScratchCard({
  width,
  height,
  coverColor,
  children,
  onRevealed,
  disabled,
}: {
  width: number;
  height: number;
  coverColor?: string;
  children: React.ReactNode;
  onRevealed: () => void;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const ctx = c.getContext("2d");
    if (!ctx) return;

    // fill cover
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = coverColor ?? "#111827";
    ctx.fillRect(0, 0, width, height);

    // light noise for texture
    const img = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() * 18 - 9) | 0;
      img.data[i] = clamp(img.data[i] + n, 0, 255);
      img.data[i + 1] = clamp(img.data[i + 1] + n, 0, 255);
      img.data[i + 2] = clamp(img.data[i + 2] + n, 0, 255);
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    ctx.globalCompositeOperation = "destination-out";
  }, [width, height, coverColor]);

  const eraseAt = (x: number, y: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  };

  const getClearedRatio = () => {
    const c = canvasRef.current;
    if (!c) return 0;
    const ctx = c.getContext("2d");
    if (!ctx) return 0;

    const img = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    const step = 16;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4 + 3;
        if (img[idx] < 16) transparent++;
      }
    }
    const total = Math.ceil(height / step) * Math.ceil(width / step);
    return transparent / total;
  };

  const maybeReveal = () => {
    if (revealedRef.current) return;
    const ratio = getClearedRatio();
    if (ratio >= 0.48) {
      revealedRef.current = true;
      onRevealed();
      const c = canvasRef.current;
      const ctx = c?.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, width, height);
    }
  };

  const toLocal = (e: React.PointerEvent) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    return {
      x: clamp(e.clientX - rect.left, 0, rect.width) * (width / rect.width),
      y: clamp(e.clientY - rect.top, 0, rect.height) * (height / rect.height),
    };
  };

  return (
    <div
      className={`relative rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-soft ${
        disabled ? "opacity-70" : ""
      }`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 grid place-items-center">{children}</div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`absolute inset-0 touch-none ${disabled ? "pointer-events-none" : "cursor-pointer"}`}
        onPointerDown={(e) => {
          if (disabled) return;
          drawingRef.current = true;
          (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
          const p = toLocal(e);
          eraseAt(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (disabled) return;
          if (!drawingRef.current) return;
          const p = toLocal(e);
          eraseAt(p.x, p.y);
        }}
        onPointerUp={() => {
          if (disabled) return;
          drawingRef.current = false;
          maybeReveal();
        }}
        onPointerCancel={() => {
          if (disabled) return;
          drawingRef.current = false;
          maybeReveal();
        }}
      />
    </div>
  );
}

/* =========================
   DAY 13 (6s TOTAL)
========================= */
export default function Day13EscapeCode({ onWin }: { onWin: () => void }) {
  const [digits, setDigits] = useState<DigitState>({
    d1: null,
    d2: null,
    d3: null,
    d4: null,
  });

  const [won, setWon] = useState(false);

  // ⏱ timer control
  const [started, setStarted] = useState(false);
  const [msLeft, setMsLeft] = useState(TOTAL_MS);
  const [expired, setExpired] = useState(false);

  // Step 2 (math) -> answer must be 3
  const math = useMemo(() => {
    const b = 3 + Math.floor(Math.random() * 5); // 3..7
    const a = b + 3; // ensures a-b=3
    return { a, b, ans: 3 };
  }, []);

  const [mathInput, setMathInput] = useState("");

  // Step 3 (lock alignment) -> unlock 0
  const [dial, setDial] = useState(0.55); // 0..1
  const LOCK_TARGET = 0.12;
  const LOCK_TOL = 0.035;

  // Step 4 (key) -> unlock 4
  const [pickedKey, setPickedKey] = useState<string | null>(null);
  const keys = useMemo(() => {
    const pool = [
      { id: "k1", emoji: "🗝️" },
      { id: "k2", emoji: "🔑" },
      { id: "k3", emoji: "🗝️" },
      { id: "k4", emoji: "🔑" },
      { id: "k5", emoji: "🗝️" },
      { id: "k6", emoji: "🔑" },
    ];

    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const correctIndex = Math.floor(Math.random() * arr.length);
    return { list: arr, correctId: arr[correctIndex].id };
  }, []);

  const lockedUI = !started || expired || won;

  const codeSoFar = useMemo(() => {
    const a = digits.d1 ?? "•";
    const b = digits.d2 ?? "•";
    const c = digits.d3 ?? "•";
    const d = digits.d4 ?? "•";
    return `${a}${b}${c}${d}`;
  }, [digits]);

  const allReady = useMemo(
    () => digits.d1 && digits.d2 && digits.d3 && digits.d4,
    [digits],
  );

  // ⏱ Countdown
  useEffect(() => {
    if (!started) return;
    if (expired || won) return;

    const t0 = performance.now();
    const startLeft = msLeft;

    const id = window.setInterval(() => {
      const dt = performance.now() - t0;
      const next = Math.max(0, Math.round(startLeft - dt));
      setMsLeft(next);
      if (next <= 0) {
        setExpired(true);
        window.clearInterval(id);
      }
    }, 50);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Win check
  useEffect(() => {
    if (!allReady) return;
    if (won) return;
    if (codeSoFar === CODE) {
      setWon(true);
      onWin();
    }
  }, [allReady, won, codeSoFar, onWin]);

  // auto-unlock lock (0)
  useEffect(() => {
    if (lockedUI) return;
    if (digits.d3) return;
    const ok = Math.abs(dial - LOCK_TARGET) <= LOCK_TOL;
    if (ok) setDigits((p) => ({ ...p, d3: "0" }));
  }, [dial, digits.d3, lockedUI]);

  const reset = () => {
    setDigits({ d1: null, d2: null, d3: null, d4: null });
    setWon(false);
    setMathInput("");
    setDial(0.55);
    setPickedKey(null);
    setStarted(false);
    setExpired(false);
    setMsLeft(TOTAL_MS);
  };

  const start = () => {
    if (started) return;
    setStarted(true);
    setExpired(false);
    setWon(false);
    setMsLeft(TOTAL_MS);
  };

  const doMath = () => {
    if (lockedUI) return;
    if (digits.d2) return;
    const val = Number(mathInput);
    if (val === math.ans) setDigits((p) => ({ ...p, d2: "3" }));
  };

  const pickKey = (id: string) => {
    if (lockedUI) return;
    if (digits.d4) return;
    setPickedKey(id);
    if (id === keys.correctId) setDigits((p) => ({ ...p, d4: "4" }));
  };

  const timerLabel = useMemo(() => {
    const s = Math.ceil(msLeft / 1000);
    return `${s}s`;
  }, [msLeft]);

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">
            Vis a Vis — Candado (4 dígitos)
          </div>
          <div className="mt-1 text-sm text-zinc-700">
            4 retos. 15 segundos. Código final:{" "}
            <span className="font-semibold">{CODE}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`text-xs px-3 py-2 rounded-2xl border ${
              expired
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : won
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : started
                    ? "bg-white border-zinc-200 text-zinc-700"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600"
            }`}
          >
            ⏱ {timerLabel}
          </div>

          <button
            onClick={reset}
            className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
          >
            Reiniciar 🔁
          </button>
        </div>
      </div>

      {/* Start gate */}
      {!started && !won && (
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 flex items-center justify-between gap-3">
          <div className="text-sm text-zinc-700">
            Pulsa <span className="font-semibold">Empezar</span> y tienes 6s.
          </div>
          <button
            onClick={start}
            className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
          >
            Empezar →
          </button>
        </div>
      )}

      {/* Code display */}
      <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 flex items-center justify-between">
        <div className="text-xs text-zinc-600">Código</div>
        <div className="font-semibold tracking-[0.35em] text-lg text-zinc-900">
          {codeSoFar}
        </div>
      </div>

      {/* Expired */}
      <AnimatePresence>
        {expired && !won && (
          <motion.div
            className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
          >
            <div className="text-sm font-semibold text-rose-800">
              Se acabó el tiempo 😅
            </div>
            <div className="mt-1 text-sm text-rose-700">
              Reintenta: ahora ya sabes dónde está cada cosa.
            </div>
            <div className="mt-3">
              <button
                onClick={reset}
                className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
              >
                Reintentar →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenges */}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {/* 1) Scratch -> 2 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">
              Reto 1: Raspa
            </div>
            <Pill ok={!!digits.d1} text={digits.d1 ? "Listo" : "Pendiente"} />
          </div>

          <div className="mt-2 text-xs text-zinc-600">
            Raspa para revelar el primer dígito.
          </div>

          <div className="mt-3 flex justify-center">
            <ScratchCard
              width={260}
              height={140}
              coverColor="#111827"
              disabled={lockedUI || !!digits.d1}
              onRevealed={() => setDigits((p) => ({ ...p, d1: "2" }))}
            >
              <div className="text-center">
                <div className="text-xs text-zinc-600">Primer dígito</div>
                <div className="mt-1 text-5xl font-semibold text-zinc-900">
                  2
                </div>
              </div>
            </ScratchCard>
          </div>
        </div>

        {/* 2) Math -> 3 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">
              Reto 2: Operación
            </div>
            <Pill ok={!!digits.d2} text={digits.d2 ? "Listo" : "Pendiente"} />
          </div>

          <div className="mt-2 text-xs text-zinc-600">
            Resuelve la resta para el segundo dígito.
          </div>

          <div
            className={`mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 ${lockedUI ? "opacity-70" : ""}`}
          >
            <div className="text-sm font-semibold text-zinc-900">
              {math.a} − {math.b} = ?
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={mathInput}
                onChange={(e) =>
                  setMathInput(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="__"
                className="w-20 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-center"
                disabled={lockedUI || !!digits.d2}
              />

              <button
                onClick={doMath}
                className="flex-1 rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold disabled:opacity-60"
                disabled={lockedUI || !!digits.d2}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>

        {/* 3) Lock alignment -> 0 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">
              Reto 3: Alinear cerradura
            </div>
            <Pill ok={!!digits.d3} text={digits.d3 ? "Listo" : "Pendiente"} />
          </div>

          <div className="mt-2 text-xs text-zinc-600">
            Mueve el dial hasta que “encaje”.
          </div>

          <div
            className={`mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 ${lockedUI ? "opacity-70" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-900">🔒</div>
              <div className="text-[11px] text-zinc-600">
                {digits.d3 ? (
                  <>
                    Guardado: <span className="font-semibold">0</span>
                  </>
                ) : (
                  "buscando…"
                )}
              </div>
            </div>

            <div className="mt-3">
              <div className="relative h-10 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 rounded-xl bg-emerald-200/50"
                  style={{
                    left: `${(LOCK_TARGET - LOCK_TOL) * 100}%`,
                    width: `${LOCK_TOL * 2 * 100}%`,
                  }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-2xl bg-zinc-900 shadow-soft"
                  animate={{ left: `calc(${dial * 100}% - 14px)` }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                />
              </div>

              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={dial}
                onChange={(e) => setDial(Number(e.target.value))}
                disabled={lockedUI || !!digits.d3}
                className="mt-3 w-full"
              />
            </div>
          </div>
        </div>

        {/* 4) Correct key -> 4 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">
              Reto 4: Llave correcta
            </div>
            <Pill ok={!!digits.d4} text={digits.d4 ? "Listo" : "Pendiente"} />
          </div>

          <div className="mt-2 text-xs text-zinc-600">
            Elige la llave que abre.
          </div>

          <div
            className={`mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 ${lockedUI ? "opacity-70" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-900">
                🧷 Candado
              </div>
              <div className="text-[11px] text-zinc-600">
                {digits.d4 ? (
                  <>
                    Guardado: <span className="font-semibold">4</span>
                  </>
                ) : pickedKey ? (
                  pickedKey === keys.correctId ? (
                    <span className="text-emerald-700 font-semibold">
                      Abre ✔
                    </span>
                  ) : (
                    <span className="text-rose-700 font-semibold">
                      No es 😅
                    </span>
                  )
                ) : (
                  "elige una…"
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {keys.list.map((k) => {
                const picked = pickedKey === k.id;
                const disabled = lockedUI || !!digits.d4;

                return (
                  <button
                    key={k.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => pickKey(k.id)}
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold bg-white hover:bg-zinc-50 transition ${
                      picked
                        ? k.id === keys.correctId
                          ? "border-emerald-300 ring-2 ring-emerald-200"
                          : "border-rose-300 ring-2 ring-rose-200"
                        : "border-zinc-200"
                    } ${disabled ? "opacity-70" : ""}`}
                  >
                    <div className="text-2xl">{k.emoji}</div>
                    <div className="mt-1 text-[10px] text-zinc-600">
                      {picked ? (k.id === keys.correctId ? "✔" : "✖") : "—"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {won && (
          <motion.div
            className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
          >
            <div className="text-sm font-semibold text-emerald-800">
              ¡Abierto! ✔
            </div>
            <div className="mt-1 text-sm text-emerald-700">
              “Siempre encuentras la salida… y eso me encanta.”
            </div>
            <div className="mt-2 text-[11px] text-emerald-700">
              Código final: <span className="font-semibold">{CODE}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pill({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={`text-[11px] px-3 py-1 rounded-full border ${
        ok
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-white border-zinc-200 text-zinc-600"
      }`}
    >
      {text}
    </div>
  );
}
