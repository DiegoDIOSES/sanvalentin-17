"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

type SeedType = "tap" | "hold" | "slide" | "blow" | "tilt";

type Seed = {
  id: string;
  type: SeedType;
  x: number; // %
  y: number; // %
  done: boolean;
  hue: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function vibrate(ms: number) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      // @ts-ignore
      navigator.vibrate(ms);
    }
  } catch {}
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function hueToPastel(h: number) {
  return `hsl(${Math.round(h)}, 75%, 78%)`;
}

function petalConfetti() {
  confetti({
    particleCount: 120,
    spread: 85,
    startVelocity: 26,
    gravity: 0.95,
    scalar: 0.95,
    origin: { y: 0.35 },
  });
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isMobile;
}

export default function Day07GardenBloom({
  onWin,
  muted, // (ya no lo usamos, pero lo dejamos por compatibilidad)
}: {
  onWin: () => void;
  muted: boolean;
}) {
  const isMobile = useIsMobile();

  const [seeds, setSeeds] = useState<Seed[]>(() => [
    // posiciones para desktop (base)
    { id: "s1", type: "tap", x: 18, y: 42, done: false, hue: rand(320, 360) },
    { id: "s2", type: "hold", x: 46, y: 28, done: false, hue: rand(0, 35) },
    { id: "s3", type: "slide", x: 74, y: 42, done: false, hue: rand(35, 70) },
    { id: "s4", type: "blow", x: 30, y: 72, done: false, hue: rand(90, 140) },
    { id: "s5", type: "tilt", x: 72, y: 72, done: false, hue: rand(190, 240) },
  ]);

  // posiciones mobile (más ordenadas, sin choque con header)
  const mobilePos = useMemo(() => {
    return {
      s1: { x: 22, y: 46 },
      s2: { x: 62, y: 46 },
      s3: { x: 22, y: 72 },
      s4: { x: 62, y: 72 },
      s5: { x: 42, y: 58 },
    };
  }, []);

  const doneCount = useMemo(() => seeds.filter((s) => s.done).length, [seeds]);
  const allDone = doneCount === seeds.length;

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeSeed = useMemo(
    () => seeds.find((s) => s.id === activeId) ?? null,
    [seeds, activeId],
  );

  useEffect(() => {
    if (!allDone) return;
    petalConfetti();
    onWin();
  }, [allDone, onWin]);

  const markDone = (id: string) => {
    setSeeds((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: true } : s)),
    );
    setActiveId(null);
  };

  const cycleFlowerColor = (id: string) => {
    setSeeds((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, hue: (s.hue + 28) % 360 };
      }),
    );
    vibrate(18);
  };

  const resetAll = () => {
    setActiveId(null);
    setSeeds((prev) =>
      prev.map((s) => ({
        ...s,
        done: false,
        hue: (s.hue + rand(30, 140)) % 360,
      })),
    );
  };

  const panelHeight = isMobile ? "h-[420px]" : "h-[360px] md:h-[420px]";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Jardín:{" "}
          <span className="font-semibold">
            {doneCount}/{seeds.length}
          </span>
        </div>

        <button
          onClick={resetAll}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 p-4">
        {/* blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div
          className={`relative ${panelHeight} rounded-2xl border border-white/70 bg-white/55 backdrop-blur overflow-hidden`}
        >
          {/* instrucción */}
          <div className="absolute left-3 right-3 top-3 z-10">
            <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur px-4 py-3">
              <div className="text-[11px] text-zinc-600">
                Cada flor aparece cuando la cuidas.
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Haz las 5 acciones distintas 🌱
              </div>
            </div>
          </div>

          {/* semillas/flores */}
          {seeds.map((s) => {
            const pos = isMobile
              ? mobilePos[s.id as keyof typeof mobilePos]
              : { x: s.x, y: s.y };
            return (
              <div
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {!s.done ? (
                  <SeedChip
                    type={s.type}
                    onClick={() => setActiveId(s.id)}
                    small={isMobile}
                  />
                ) : (
                  <Flower
                    color={hueToPastel(s.hue)}
                    onTap={() => cycleFlowerColor(s.id)}
                    type={s.type}
                    small={isMobile}
                  />
                )}
              </div>
            );
          })}

          {/* overlay de tarea (grande y cómodo en móvil) */}
          <AnimatePresence>
            {activeSeed && (
              <motion.div
                className="absolute inset-0 z-30 bg-black/20 backdrop-blur-[1px] p-3 md:p-4 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={() => setActiveId(null)}
              >
                <motion.div
                  className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white/92 backdrop-blur shadow-soft overflow-hidden"
                  initial={{ y: 10, scale: 0.98, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 10, scale: 0.98, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-600">Semilla</div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {labelFor(activeSeed.type)}
                      </div>
                    </div>
                    <button
                      className="rounded-2xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
                      onClick={() => setActiveId(null)}
                    >
                      Cerrar ✕
                    </button>
                  </div>

                  <div className="p-4">
                    <TaskPanel
                      type={activeSeed.type}
                      onDone={() => markDone(activeSeed.id)}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* final */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                className="absolute left-3 right-3 bottom-3 rounded-2xl border border-zinc-200 bg-white/88 backdrop-blur p-4 z-20"
                initial={{ y: 12, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 12, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <div className="text-xs text-zinc-600">Final 🌸</div>
                <div className="mt-1 text-sm font-semibold text-zinc-900">
                  “Hay personas que hacen florecer todo.”
                </div>
                <div className="mt-1 text-sm text-zinc-700">
                  “Tú eres una de ellas.”
                </div>
                <div className="mt-2 text-[11px] text-zinc-600">
                  Toca cualquier flor para cambiar su color (y vibra).
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-zinc-600">
        Tip: si el micrófono no está permitido, usa el fallback de soplar con{" "}
        <span className="font-semibold">swipe ↔</span>.
      </div>
    </div>
  );
}

function SeedChip({
  type,
  onClick,
  small,
}: {
  type: SeedType;
  onClick: () => void;
  small: boolean;
}) {
  const size = small ? "h-14 w-14" : "h-16 w-16";
  const label = chipLabel(type);

  return (
    <button
      type="button"
      onClick={() => {
        vibrate(10);
        onClick();
      }}
      className={`relative ${size} rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur shadow-soft overflow-hidden`}
      aria-label={`semilla ${type}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-zinc-50" />
      <div className="relative h-full w-full grid place-items-center">
        <div className="text-lg">🌱</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 whitespace-nowrap">
          {label}
        </div>
      </div>
    </button>
  );
}

function chipLabel(t: SeedType) {
  if (t === "tap") return "tap x18";
  if (t === "hold") return "hold";
  if (t === "slide") return "desliza →";
  if (t === "blow") return "sopla / swipe";
  return "inclina / barra";
}

function labelFor(t: SeedType) {
  if (t === "tap") return "Tap rápido";
  if (t === "hold") return "Mantén presionado";
  if (t === "slide") return "Desliza para “dar sol”";
  if (t === "blow") return "Sopla o haz swipe";
  return "Inclina el celular (o usa la barra)";
}

function Flower({
  color,
  onTap,
  type,
  small,
}: {
  color: string;
  onTap: () => void;
  type: SeedType;
  small: boolean;
}) {
  const size = small ? "h-14 w-14" : "h-16 w-16";

  const anim =
    type === "tap"
      ? { rotate: [0, 3, 0, -3, 0], y: [0, -2, 0] }
      : type === "hold"
        ? { scale: [1, 1.03, 1], y: [0, -3, 0] }
        : type === "slide"
          ? { y: [0, -4, 0], x: [0, 2, 0, -2, 0] }
          : type === "blow"
            ? { x: [0, 6, 0, -6, 0], rotate: [0, 4, 0, -4, 0] }
            : { rotate: [0, 2, 0, -2, 0], x: [0, 3, 0] };

  return (
    <motion.button
      type="button"
      onClick={() => {
        vibrate(16);
        onTap();
      }}
      className={`relative ${size} rounded-2xl border border-white/70 bg-white/55 backdrop-blur shadow-[0_18px_40px_rgba(0,0,0,0.06)]`}
      animate={anim}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      aria-label="flor"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-10 w-10">
          <div
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: color, filter: "saturate(1.05)" }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-3 w-3 rounded-full bg-white/80 border border-white/70" />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 w-1 rounded-full bg-emerald-300/60" />
    </motion.button>
  );
}

/* =========================
   PANEL GRANDE DE TAREAS
========================= */

function TaskPanel({ type, onDone }: { type: SeedType; onDone: () => void }) {
  if (type === "tap") return <TaskTap onDone={onDone} />;
  if (type === "hold") return <TaskHold onDone={onDone} />;
  if (type === "slide") return <TaskSlide onDone={onDone} />;
  if (type === "blow") return <TaskBlow onDone={onDone} />;
  return <TaskTilt onDone={onDone} />;
}

/** Tap rápido */
function TaskTap({ onDone }: { onDone: () => void }) {
  const goal = 18;
  const [n, setN] = useState(0);
  const [time, setTime] = useState(2600);
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    if (!ticking) return;
    const id = window.setInterval(
      () => setTime((v) => Math.max(0, v - 100)),
      100,
    );
    return () => window.clearInterval(id);
  }, [ticking]);

  useEffect(() => {
    if (!ticking) return;
    if (time > 0) return;
    setTicking(false);
    setN(0);
    setTime(2600);
  }, [time, ticking]);

  useEffect(() => {
    if (n >= goal) onDone();
  }, [n, goal, onDone]);

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-700">Toca rápido para crecer 🌱</div>

      <button
        type="button"
        onClick={() => {
          if (!ticking) setTicking(true);
          setN((v) => v + 1);
          vibrate(10);
        }}
        className="w-full rounded-2xl bg-zinc-900 text-white px-4 py-4 font-semibold"
      >
        TAP ✨ ({n}/{goal})
      </button>

      <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
        <div
          className="h-full bg-zinc-900"
          style={{ width: `${(n / goal) * 100}%` }}
        />
      </div>

      {ticking && (
        <div className="text-xs text-zinc-600">
          Tiempo:{" "}
          <span className="font-semibold">{Math.ceil(time / 1000)}s</span>
        </div>
      )}
    </div>
  );
}

/** Hold */
function TaskHold({ onDone }: { onDone: () => void }) {
  const need = 1400;
  const [ms, setMs] = useState(0);
  const downRef = useRef(false);

  useEffect(() => {
    if (ms >= need) onDone();
  }, [ms, need, onDone]);

  useEffect(() => {
    let id: number | null = null;
    if (downRef.current) {
      id = window.setInterval(() => setMs((v) => v + 40), 40);
    }
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [ms]);

  const pct = clamp(ms / need, 0, 1);

  const start = () => {
    downRef.current = true;
    vibrate(12);
    (start as any)._id = window.setInterval(() => setMs((v) => v + 40), 40);
  };
  const stop = () => {
    downRef.current = false;
    const id = (start as any)._id as number | undefined;
    if (id) window.clearInterval(id);
    if (ms < need) setMs(0);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-700">
        Mantén presionado hasta completar 🤍
      </div>

      <button
        type="button"
        onPointerDown={start}
        onPointerUp={stop}
        onPointerCancel={stop}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-5 font-semibold"
      >
        Mantener…
      </button>

      <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
        <div
          className="h-full bg-zinc-900"
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      <div className="text-xs text-zinc-600">{Math.round(pct * 100)}%</div>
    </div>
  );
}

/** Nueva actividad (reemplaza drag): SLIDE */
function TaskSlide({ onDone }: { onDone: () => void }) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (v >= 100) onDone();
  }, [v, onDone]);

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-700">Desliza hasta el sol ☀️</div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>Progreso</span>
          <span className="font-semibold">{v}%</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={v}
          onChange={(e) => {
            setV(Number(e.target.value));
            vibrate(8);
          }}
          className="mt-3 w-full"
        />

        <div className="mt-3 text-center text-lg">☀️</div>
      </div>
    </div>
  );
}

/** Blow + fallback swipe */
function TaskBlow({ onDone }: { onDone: () => void }) {
  const [mic, setMic] = useState<"idle" | "ok" | "denied">("idle");
  const [level, setLevel] = useState(0);
  const [swipes, setSwipes] = useState(0);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (cancelled) return;

        const Ctx = (window.AudioContext ||
          (window as any).webkitAudioContext) as any;
        const ctx = new Ctx();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);

        setMic("ok");

        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          const mapped = clamp(rms * 2.2, 0, 1);
          setLevel(mapped);

          if (mapped > 0.55) {
            cleanup();
            onDone();
            return;
          }

          rafRef.current = requestAnimationFrame(loop);
        };

        const cleanup = () => {
          try {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
          } catch {}
          try {
            stream.getTracks().forEach((t) => t.stop());
          } catch {}
          try {
            ctx.close();
          } catch {}
        };

        rafRef.current = requestAnimationFrame(loop);
        (init as any)._cleanup = cleanup;
      } catch {
        setMic("denied");
      }
    }

    init();

    return () => {
      cancelled = true;
      try {
        (init as any)._cleanup?.();
      } catch {}
    };
  }, [onDone]);

  useEffect(() => {
    if (swipes >= 6) onDone();
  }, [swipes, onDone]);

  const startX = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 42) {
      setSwipes((v) => v + 1);
      vibrate(10);
    }
  };

  const pct = mic === "ok" ? level : swipes / 6;

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-700">
        {mic === "ok"
          ? "Sopla fuerte 🌬️"
          : "Mic bloqueado: haz swipe ↔ 6 veces"}
      </div>

      <div
        className="rounded-2xl border border-zinc-200 bg-white p-4 select-none"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (startX.current = null)}
      >
        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>Progreso</span>
          <span className="font-semibold">{Math.round(pct * 100)}%</span>
        </div>

        <div className="mt-3 h-2 rounded-full bg-zinc-200 overflow-hidden">
          <div
            className="h-full bg-zinc-900"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

        <div className="mt-4 text-center text-2xl">🌬️</div>
      </div>
    </div>
  );
}

/** Tilt + fallback slider */
function TaskTilt({ onDone }: { onDone: () => void }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [val, setVal] = useState(0);
  const [slider, setSlider] = useState(0);

  useEffect(() => {
    let active = true;

    const handler = (e: DeviceOrientationEvent) => {
      if (!active) return;
      const g = typeof e.gamma === "number" ? e.gamma : 0;
      const mapped = clamp((g + 35) / 70, 0, 1);
      setVal(mapped);
      if (mapped > 0.92) onDone();
    };

    async function init() {
      try {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission ===
            "function"
        ) {
          setSupported(false);
          return;
        }
        if (
          typeof window === "undefined" ||
          !("DeviceOrientationEvent" in window)
        ) {
          setSupported(false);
          return;
        }
        setSupported(true);
        window.addEventListener("deviceorientation", handler);
      } catch {
        setSupported(false);
      }
    }

    init();

    return () => {
      active = false;
      try {
        window.removeEventListener("deviceorientation", handler);
      } catch {}
    };
  }, [onDone]);

  useEffect(() => {
    if (slider > 0.92) onDone();
  }, [slider, onDone]);

  const pct = supported ? val : slider;

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-700">
        {supported
          ? "Inclina el celular 📱"
          : "Tu móvil no permite inclinación: usa la barra"}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>Progreso</span>
          <span className="font-semibold">{Math.round(pct * 100)}%</span>
        </div>

        <div className="mt-3 h-2 rounded-full bg-zinc-200 overflow-hidden">
          <div
            className="h-full bg-zinc-900"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

        {!supported && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={slider}
            onChange={(e) => {
              setSlider(Number(e.target.value));
              vibrate(8);
            }}
            className="mt-4 w-full"
          />
        )}

        <div className="mt-3 text-center text-xl">💫</div>
      </div>
    </div>
  );
}
