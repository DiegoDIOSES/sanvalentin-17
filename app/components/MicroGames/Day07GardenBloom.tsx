"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

type SeedType = "tap" | "hold" | "circle" | "blow" | "tilt";

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
  return `hsl(${Math.round(h)}, 75%, 78%)`;
}

function petalConfetti() {
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 22,
    gravity: 0.9,
    scalar: 0.9,
    origin: { y: 0.4 },
  });
}

/** 🌸 lluvia de emojis */
function FlowerEmojiRain({ show }: { show: boolean }) {
  const items = useMemo(() => {
    if (!show) return [];
    const emojis = ["🌸", "🌼", "🌷", "💐", "🌺", "🪷"];
    return Array.from({ length: 58 }).map((_, i) => ({
      id: `rain-${i}-${Math.random().toString(16).slice(2)}`,
      x: rand(0, 100),
      delay: rand(0, 0.85),
      dur: rand(2.6, 4.2),
      size: rand(18, 34),
      rot: rand(-35, 35),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {items.map((it) => (
            <motion.div
              key={it.id}
              className="absolute top-[-12%]"
              style={{ left: `${it.x}%`, fontSize: `${it.size}px` }}
              initial={{ y: "-10vh", rotate: it.rot, opacity: 0 }}
              animate={{ y: "115vh", rotate: it.rot * 3, opacity: 1 }}
              transition={{
                delay: it.delay,
                duration: it.dur,
                ease: "easeInOut",
              }}
            >
              {it.emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Evalúa si un trazo se parece a un círculo */
function scoreCircle(points: { x: number; y: number }[]) {
  if (points.length < 18) return { ok: false, score: 0 };

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  const w = maxX - minX;
  const h = maxY - minY;
  if (w < 60 || h < 60) return { ok: false, score: 0 };

  const aspect = w / h;
  const aspectScore = 1 - Math.min(Math.abs(aspect - 1), 1);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const radii = points.map((p) => Math.hypot(p.x - cx, p.y - cy));
  const rAvg = radii.reduce((a, b) => a + b, 0) / radii.length;

  const rVar =
    radii.reduce((acc, r) => acc + Math.pow(r - rAvg, 2), 0) / radii.length;
  const rStd = Math.sqrt(rVar);
  const radiusScore = 1 - clamp(rStd / (rAvg * 0.35), 0, 1);

  const first = points[0];
  const last = points[points.length - 1];
  const closeDist = Math.hypot(last.x - first.x, last.y - first.y);
  const closeScore = 1 - clamp(closeDist / (rAvg * 0.9), 0, 1);

  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
  }
  const lengthScore = clamp(length / (2 * Math.PI * rAvg), 0, 1);

  const score =
    0.35 * aspectScore +
    0.35 * radiusScore +
    0.2 * closeScore +
    0.1 * lengthScore;

  return { ok: score > 0.68, score: clamp(score, 0, 1) };
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
    // ✅ antes era "drag", ahora "circle"
    { id: "s3", type: "circle", x: 72, y: 38, done: false, hue: rand(35, 70) },
    { id: "s4", type: "blow", x: 28, y: 68, done: false, hue: rand(90, 140) },
    { id: "s5", type: "tilt", x: 70, y: 70, done: false, hue: rand(190, 240) },
  ]);

  const doneCount = useMemo(() => seeds.filter((s) => s.done).length, [seeds]);
  const allDone = doneCount === seeds.length;

  const [emojiRain, setEmojiRain] = useState(false);

  // 🌬️ viento suave (opcional)
  const windRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    try {
      const a = new Audio("/sounds/wind.mp3");
      a.loop = true;
      a.volume = 0.2;
      windRef.current = a;
      if (!muted) a.play().catch(() => {});
    } catch {}

    return () => {
      try {
        windRef.current?.pause();
        windRef.current = null;
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const a = windRef.current;
    if (!a) return;
    if (muted) a.pause();
    else a.play().catch(() => {});
  }, [muted]);

  useEffect(() => {
    if (!allDone) return;
    petalConfetti();
    setEmojiRain(true);
    onWin();

    const t = window.setTimeout(() => setEmojiRain(false), 2600);
    return () => window.clearTimeout(t);
  }, [allDone, onWin]);

  const markDone = (id: string) => {
    setSeeds((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: true } : s)),
    );
  };

  const cycleFlowerColor = (id: string) => {
    setSeeds((prev) =>
      prev.map((s) => (s.id !== id ? s : { ...s, hue: (s.hue + 28) % 360 })),
    );
    vibrate(18);
  };

  return (
    <div className="mt-3 relative">
      <FlowerEmojiRain show={emojiRain} />

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
          {/* instrucción */}
          <div className="absolute left-3 right-3 top-3 z-20">
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
                className="absolute left-3 right-3 bottom-3 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur p-4 z-20"
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
  const anim =
    type === "tap"
      ? { rotate: [0, 3, 0, -3, 0], y: [0, -2, 0] }
      : type === "hold"
        ? { scale: [1, 1.03, 1], y: [0, -3, 0] }
        : type === "circle"
          ? { y: [0, -4, 0], rotate: [0, 3, 0, -3, 0] }
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
  if (seed.type === "circle") return <SeedDrawCircle onDone={onDone} />;
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
    if (ms >= need) onDone();
  }, [ms, need, onDone]);

  const start = () => {
    downRef.current = true;
    vibrate(12);
    const id = window.setInterval(() => setMs((v) => v + 40), 40);
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

/** 🌱 3: Dibuja un círculo (reemplaza drag) */
function SeedDrawCircle({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const pts = useRef<{ x: number; y: number }[]>([]);

  const setup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(24,24,27,0.55)";
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.current = [];
    setScore(0);
  };

  useEffect(() => {
    if (!open) return;
    setup();
    clear();
    const onResize = () => {
      setup();
      clear();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const addPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    pts.current.push({ x, y });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (pts.current.length === 1) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    const res = scoreCircle(pts.current);
    setScore(res.score);

    if (res.ok) {
      setOpen(false);
      onDone();
      vibrate(18);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          setOpen(true);
          vibrate(10);
        }}
        className="relative h-16 w-16 rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        aria-label="semilla circle"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/70 via-white to-amber-50" />
        <div className="relative h-full w-full grid place-items-center">
          <div className="text-lg">🌱</div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600">
            dibuja ⭕
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 z-[50] bg-black/25 backdrop-blur-sm flex items-center justify-center p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-[420px] rounded-3xl bg-white border border-zinc-200 shadow-soft overflow-hidden"
              initial={{ y: 10, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.98, opacity: 0 }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-zinc-200">
                <div className="text-sm font-semibold text-zinc-900">
                  Semilla — Dibuja un círculo ⭕
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                  Hazlo grande y cierra el círculo. Cuando esté bien, florece
                  sola.
                </div>
              </div>

              <div className="p-4">
                <div className="relative rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="h-[230px] w-full touch-none"
                    onPointerDown={(e) => {
                      drawing.current = true;
                      const ctx = canvasRef.current?.getContext("2d");
                      ctx?.beginPath();
                      addPoint(e.clientX, e.clientY);
                    }}
                    onPointerMove={(e) => {
                      if (!drawing.current) return;
                      addPoint(e.clientX, e.clientY);
                    }}
                    onPointerUp={() => {
                      drawing.current = false;
                    }}
                    onPointerCancel={() => {
                      drawing.current = false;
                    }}
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-white/80 border border-zinc-200 px-3 py-1 text-[11px] text-zinc-700">
                    {Math.round(score * 100)}%
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={clear}
                    className="flex-1 rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm font-semibold"
                  >
                    Borrar
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** 🌱 4: Blow (mic opcional) + fallback swipe */
function SeedBlow({ onDone }: { onDone: () => void; muted: boolean }) {
  const [level, setLevel] = useState(0);
  const [mic, setMic] = useState<"idle" | "ok" | "denied">("idle");
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
  const [val, setVal] = useState(0);
  const [slider, setSlider] = useState(0.0);

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
