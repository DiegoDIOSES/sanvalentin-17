"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

type SeedType = "tap" | "hold" | "drag" | "blow" | "tilt";

type Seed = {
  id: string;
  type: SeedType;
  x: number; // %
  y: number; // %
  done: boolean;
  hue: number; // para flor
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
  // pastel suave
  return `hsl(${Math.round(h)}, 75%, 78%)`;
}

function petalConfetti() {
  // confetti con vibe "pétalos": partículas pequeñas, caída suave
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 22,
    gravity: 0.9,
    scalar: 0.9,
    origin: { y: 0.4 },
  });
}

export default function Day07GardenBloom({
  onWin,
  muted,
}: {
  onWin: () => void;
  muted: boolean;
}) {
  const [seeds, setSeeds] = useState<Seed[]>(() => [
    { id: "s1", type: "tap", x: 18, y: 38, done: false, hue: rand(320, 360) },
    { id: "s2", type: "hold", x: 44, y: 26, done: false, hue: rand(0, 35) },
    { id: "s3", type: "drag", x: 72, y: 38, done: false, hue: rand(35, 70) },
    { id: "s4", type: "blow", x: 28, y: 68, done: false, hue: rand(90, 140) },
    { id: "s5", type: "tilt", x: 70, y: 70, done: false, hue: rand(190, 240) },
  ]);

  const doneCount = useMemo(() => seeds.filter((s) => s.done).length, [seeds]);
  const allDone = doneCount === seeds.length;

  // 🌬️ viento suave (opcional)
  const windRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // si no tienes el archivo, no pasa nada
    try {
      const a = new Audio("/sounds/wind.mp3");
      a.loop = true;
      a.volume = 0.2;
      windRef.current = a;
      if (!muted) {
        // en algunos navegadores, el usuario debe interactuar antes. ok.
        a.play().catch(() => {});
      }
    } catch {}

    return () => {
      try {
        windRef.current?.pause();
        windRef.current = null;
      } catch {}
    };
  }, []);

  useEffect(() => {
    // mute/unmute
    const a = windRef.current;
    if (!a) return;
    if (muted) {
      a.pause();
    } else {
      a.play().catch(() => {});
    }
  }, [muted]);

  useEffect(() => {
    if (!allDone) return;
    petalConfetti();
    onWin();
  }, [allDone, onWin]);

  const markDone = (id: string) => {
    setSeeds((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: true } : s)),
    );
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
          onClick={() => {
            setSeeds((prev) =>
              prev.map((s) => ({
                ...s,
                done: false,
                hue: (s.hue + rand(30, 140)) % 360,
              })),
            );
          }}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Repetir 🔁
        </button>
      </div>

      <div className="mt-3 relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 p-4">
        {/* blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative h-[320px] md:h-[360px] rounded-2xl border border-white/70 bg-white/55 backdrop-blur overflow-hidden">
          {/* sol target (para drag) */}
          <SunTarget />

          {/* instrucción */}
          <div className="absolute left-3 right-3 top-3">
            <div className="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur px-4 py-3">
              <div className="text-[11px] text-zinc-600">
                Cada flor aparece cuando la cuidas.
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Haz las 5 acciones distintas 🌱
              </div>
            </div>
          </div>

          {/* semillas/flores */}
          {seeds.map((s) => (
            <SeedOrFlower
              key={s.id}
              seed={s}
              muted={muted}
              color={hueToPastel(s.hue)}
              onDone={() => markDone(s.id)}
              onFlowerTap={() => cycleFlowerColor(s.id)}
            />
          ))}

          {/* final */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                className="absolute left-3 right-3 bottom-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-4"
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
        Tip: si el micrófono no está permitido, usa el fallback de soplar con
        <span className="font-semibold"> swipe ↔</span>.
      </div>
    </div>
  );
}

function SunTarget() {
  return (
    <div className="absolute right-4 top-[82px] md:top-[92px] select-none">
      <div className="relative">
        <div className="h-14 w-14 rounded-full bg-amber-200/70 border border-amber-300/60 shadow-[0_16px_35px_rgba(0,0,0,0.10)]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 to-transparent" />
        <div className="absolute -left-3 -top-3 h-20 w-20 rounded-full border border-amber-300/25" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
          ☀️
        </div>
        <div className="mt-2 text-[11px] text-zinc-600 text-center">
          arrastra aquí
        </div>
      </div>
    </div>
  );
}

function SeedOrFlower({
  seed,
  muted,
  color,
  onDone,
  onFlowerTap,
}: {
  seed: Seed;
  muted: boolean;
  color: string;
  onDone: () => void;
  onFlowerTap: () => void;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${seed.x}%`, top: `${seed.y}%` }}
    >
      {!seed.done ? (
        <SeedTask seed={seed} muted={muted} onDone={onDone} />
      ) : (
        <Flower color={color} onTap={onFlowerTap} type={seed.type} />
      )}
    </div>
  );
}

function Flower({
  color,
  onTap,
  type,
}: {
  color: string;
  onTap: () => void;
  type: SeedType;
}) {
  // cada tipo con animación distinta
  const anim =
    type === "tap"
      ? { rotate: [0, 3, 0, -3, 0], y: [0, -2, 0] }
      : type === "hold"
        ? { scale: [1, 1.03, 1], y: [0, -3, 0] }
        : type === "drag"
          ? { y: [0, -4, 0], x: [0, 2, 0, -2, 0] }
          : type === "blow"
            ? { x: [0, 6, 0, -6, 0], rotate: [0, 4, 0, -4, 0] }
            : { rotate: [0, 2, 0, -2, 0], x: [0, 3, 0] };

  return (
    <motion.button
      type="button"
      onClick={onTap}
      className="relative h-16 w-16 rounded-2xl border border-white/70 bg-white/55 backdrop-blur shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
      animate={anim}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      aria-label="flor"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-10 w-10">
          {/* pétalos */}
          <div
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: color,
              filter: "saturate(1.05)",
            }}
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

function SeedTask({
  seed,
  muted,
  onDone,
}: {
  seed: Seed;
  muted: boolean;
  onDone: () => void;
}) {
  if (seed.type === "tap") return <SeedTap onDone={onDone} />;
  if (seed.type === "hold") return <SeedHold onDone={onDone} />;
  if (seed.type === "drag") return <SeedDragToSun onDone={onDone} />;
  if (seed.type === "blow") return <SeedBlow onDone={onDone} muted={muted} />;
  return <SeedTilt onDone={onDone} />;
}

/** 🌱 1: Tap rápido */
function SeedTap({ onDone }: { onDone: () => void }) {
  const goal = 18;
  const [n, setN] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [time, setTime] = useState(2200);

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
    // se acabó
    setTicking(false);
    setN(0);
    setTime(2200);
  }, [time, ticking]);

  useEffect(() => {
    if (n >= goal) onDone();
  }, [n, goal, onDone]);

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (!ticking) setTicking(true);
        setN((v) => v + 1);
        vibrate(10);
      }}
      className="relative h-16 w-16 rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      aria-label="semilla tap"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 via-white to-rose-50" />
      <div className="relative h-full w-full grid place-items-center">
        <div className="text-lg">🌱</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600">
          tap x{goal}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-1 bg-zinc-200">
        <div
          className="h-full bg-zinc-900"
          style={{ width: `${(n / goal) * 100}%` }}
        />
      </div>

      {ticking && (
        <div className="absolute top-1 right-1 text-[10px] px-2 py-1 rounded-full bg-white/80 border border-zinc-200">
          {Math.ceil(time / 1000)}s
        </div>
      )}
    </motion.button>
  );
}

/** 🌱 2: Hold */
function SeedHold({ onDone }: { onDone: () => void }) {
  const need = 1200;
  const [ms, setMs] = useState(0);
  const downRef = useRef(false);

  useEffect(() => {
    if (!downRef.current) return;
  }, []);

  useEffect(() => {
    if (ms >= need) onDone();
  }, [ms, need, onDone]);

  useEffect(() => {
    let id: number | null = null;
    if (downRef.current) {
      id = window.setInterval(() => {
        setMs((v) => v + 40);
      }, 40);
    }
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [ms]);

  const start = () => {
    downRef.current = true;
    vibrate(12);
    // arranca loop
    const id = window.setInterval(() => {
      setMs((v) => v + 40);
    }, 40);
    (start as any)._id = id;
  };

  const stop = () => {
    downRef.current = false;
    const id = (start as any)._id as number | undefined;
    if (id) window.clearInterval(id);
    if (ms < need) setMs(0);
  };

  const pct = clamp(ms / need, 0, 1);

  return (
    <motion.button
      type="button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerCancel={stop}
      className="relative h-16 w-16 rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      aria-label="semilla hold"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/70 via-white to-rose-50" />
      <div className="relative h-full w-full grid place-items-center">
        <div className="text-lg">🌱</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600">
          hold
        </div>
      </div>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="h-12 w-12 rounded-full border border-zinc-200 bg-white/55">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `conic-gradient(#111827 ${pct * 360}deg, rgba(0,0,0,0.08) 0deg)`,
            }}
          />
        </div>
      </div>
    </motion.button>
  );
}

/** 🌱 3: Drag to sun (target fijo arriba derecha) */
function SeedDragToSun({ onDone }: { onDone: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const elRef = useRef<HTMLButtonElement | null>(null);

  const checkHit = () => {
    const btn = elRef.current;
    if (!btn) return false;
    const rect = btn.getBoundingClientRect();
    // target "sol" aprox: esquina superior derecha del área (de la tarjeta)
    // Como esta semilla está dentro del jardín, haremos hit aproximado por posición del botón:
    // Si lo moviste hacia arriba/derecha suficiente, cuenta.
    return (
      rect.left > window.innerWidth * 0.58 &&
      rect.top < window.innerHeight * 0.45
    );
  };

  const onDown = (e: React.PointerEvent) => {
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    vibrate(12);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging || !startRef.current) return;
    setPos({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
    });
  };

  const onUp = () => {
    setDragging(false);
    if (checkHit()) {
      onDone();
      return;
    }
    // vuelve
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={elRef}
      type="button"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative h-16 w-16 rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden touch-none"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      aria-label="semilla drag"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/70 via-white to-amber-50" />
      <div className="relative h-full w-full grid place-items-center">
        <div className="text-lg">🌱</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600">
          drag ☀️
        </div>
      </div>
    </motion.button>
  );
}

/** 🌱 4: Blow (mic opcional) + fallback swipe */
function SeedBlow({ onDone, muted }: { onDone: () => void; muted: boolean }) {
  const [level, setLevel] = useState(0); // 0..1
  const [mic, setMic] = useState<"idle" | "ok" | "denied">("idle");
  const [swipes, setSwipes] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // intento de mic al primer render del componente
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

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        setMic("ok");

        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
          analyser.getByteTimeDomainData(data);
          // estimar volumen RMS simple
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length); // 0..~0.5
          const mapped = clamp(rms * 2.2, 0, 1);
          setLevel(mapped);

          // si sopla fuerte, gana
          if (mapped > 0.55) {
            cleanup();
            onDone();
            return;
          }

          rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

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

        // guardamos cleanup como "propiedad"
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

  // fallback swipe: 6 swipes
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

  return (
    <motion.button
      type="button"
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => (startX.current = null)}
      className="relative h-16 w-16 rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      aria-label="semilla blow"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/65 via-white to-teal-50" />
      <div className="relative h-full w-full grid place-items-center">
        <div className="text-lg">🌱</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600">
          {mic === "ok" ? "sopla" : "swipe ↔"}
        </div>
      </div>

      {/* medidor */}
      <div className="absolute left-2 right-2 top-2 h-1.5 rounded-full bg-zinc-200 overflow-hidden">
        <div
          className="h-full bg-zinc-900"
          style={{
            width: `${mic === "ok" ? level * 100 : (swipes / 6) * 100}%`,
          }}
        />
      </div>

      {mic === "denied" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] px-2 py-1 rounded-full bg-white/80 border border-zinc-200 text-zinc-600">
          mic bloqueado
        </div>
      )}
    </motion.button>
  );
}

/** 🌱 5: Tilt (DeviceOrientation) + fallback slider */
function SeedTilt({ onDone }: { onDone: () => void }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [val, setVal] = useState(0); // 0..1
  const [slider, setSlider] = useState(0.0);

  useEffect(() => {
    let active = true;

    const handler = (e: DeviceOrientationEvent) => {
      if (!active) return;
      // gamma: left/right ~ -45..45
      const g = typeof e.gamma === "number" ? e.gamma : 0;
      const mapped = clamp((g + 35) / 70, 0, 1);
      setVal(mapped);
      if (mapped > 0.92) onDone();
    };

    // iOS requiere permiso explícito
    async function init() {
      try {
        // @ts-ignore
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission ===
            "function"
        ) {
          // no pedimos automáticamente para no ser agresivos: usamos fallback slider si no dan permiso
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

  // fallback slider
  useEffect(() => {
    if (slider > 0.92) onDone();
  }, [slider, onDone]);

  const pct = supported ? val : slider;

  return (
    <motion.div
      className="relative h-16 w-16 rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      aria-label="semilla tilt"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-white to-indigo-50" />
      <div className="relative h-full w-full grid place-items-center">
        <div className="text-lg">🌱</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600">
          {supported ? "inclina" : "slider"}
        </div>
      </div>

      <div className="absolute left-2 right-2 top-2 h-1.5 rounded-full bg-zinc-200 overflow-hidden">
        <div
          className="h-full bg-zinc-900"
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      {!supported && (
        <div className="absolute left-2 right-2 bottom-2">
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
            className="w-full"
          />
        </div>
      )}
    </motion.div>
  );
}
