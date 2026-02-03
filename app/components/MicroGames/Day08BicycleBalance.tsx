"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function vibrate(ms: number) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      // @ts-ignore
      navigator.vibrate(ms);
    }
  } catch {}
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

export default function Day08BicycleBalance({ onWin }: { onWin: () => void }) {
  const isMobile = useIsMobile();

  // progreso: suma mientras está dentro del carril
  const [progress, setProgress] = useState(0); // 0..1
  const [won, setWon] = useState(false);

  // posición del “bike” -1..1
  const xRef = useRef(0);
  const targetRef = useRef(0); // -1..1
  const rafRef = useRef<number | null>(null);

  const [supported, setSupported] = useState<boolean | null>(null);
  const [slider, setSlider] = useState(0); // 0..1 -> map -1..1

  const laneHalf = 0.42; // carril: -0.42..0.42 (más fácil en móvil)
  const needSeconds = 5.8;
  const speed = isMobile ? 0.08 : 0.075;

  // DeviceOrientation (gamma)
  useEffect(() => {
    let active = true;

    const handler = (e: DeviceOrientationEvent) => {
      if (!active) return;
      const g = typeof e.gamma === "number" ? e.gamma : 0; // -45..45 aprox
      const mapped = clamp(g / 25, -1, 1); // más sensible
      targetRef.current = mapped;
    };

    async function init() {
      try {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission ===
            "function"
        ) {
          // iOS requiere permiso explícito; usamos fallback slider
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
  }, []);

  // fallback slider controla target
  useEffect(() => {
    if (supported) return;
    targetRef.current = clamp(slider * 2 - 1, -1, 1);
  }, [slider, supported]);

  // loop de juego
  useEffect(() => {
    if (won) return;

    let last = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(0.035, (t - last) / 1000);
      last = t;

      // mover hacia target suavemente
      const x = xRef.current;
      const target = targetRef.current;
      const nextX = x + (target - x) * (1 - Math.pow(1 - speed, dt * 60));
      xRef.current = clamp(nextX, -1, 1);

      // dentro del carril -> suma; fuera -> baja suave
      const inside = Math.abs(xRef.current) <= laneHalf;
      setProgress((p) => {
        const gain = (dt / needSeconds) * (inside ? 1 : -1.25);
        const next = clamp(p + gain, 0, 1);
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [won, laneHalf, needSeconds, speed]);

  // win
  useEffect(() => {
    if (won) return;
    if (progress >= 1) {
      setWon(true);
      vibrate(40);
      onWin();
    }
  }, [progress, won, onWin]);

  const bikeXPercent = useMemo(() => {
    // -1..1 => 15..85 (deja margen)
    const x = xRef.current;
    return 50 + x * 32;
  }, [progress]); // re-render con progress (suave y suficiente)

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Equilibrio:{" "}
          <span className="font-semibold">{Math.round(progress * 100)}%</span>
        </div>

        <div className="text-[11px] text-zinc-600">
          {supported ? "Inclina 📱" : "Usa slider ↔"}
        </div>
      </div>

      <div className="mt-3 relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-rose-50 via-amber-50 to-white p-4">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="relative rounded-2xl border border-white/70 bg-white/60 backdrop-blur overflow-hidden h-[340px] md:h-[380px]">
          {/* HUD */}
          <div className="absolute left-3 right-3 top-3 z-10">
            <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur px-4 py-3">
              <div className="text-[11px] text-zinc-600">Mini juego</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                Mantén la bici en el carril 🚲
              </div>

              <div className="mt-2 h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-zinc-900"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ROAD */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] [background-size:14px_14px] opacity-[0.55]" />

            {/* carril */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[72%] h-full rounded-3xl border border-white/60 bg-white/35" />

            {/* líneas centrales */}
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full opacity-60"
              initial={false}
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_0,transparent_18px,rgba(0,0,0,0.12)_18px,rgba(0,0,0,0.12)_36px)] [background-size:100%_44px]" />
            </motion.div>
          </div>

          {/* BIKE */}
          <motion.div
            className="absolute bottom-10 md:bottom-12 -translate-x-1/2"
            style={{ left: `${bikeXPercent}%` }}
            animate={
              won
                ? { y: [0, -6, 0], rotate: [0, 1.5, 0, -1.5, 0] }
                : { rotate: [-1.2, 1.2, -1.2] }
            }
            transition={{
              duration: won ? 1.6 : 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl border border-white/70 bg-white/65 backdrop-blur shadow-[0_18px_40px_rgba(0,0,0,0.07)] grid place-items-center">
                <div className="text-2xl">🚲</div>
              </div>

              {/* warning cuando sale del carril */}
              {!won && Math.abs(xRef.current) > laneHalf && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-full bg-white/90 border border-zinc-200 text-zinc-700">
                  vuelve al centro
                </div>
              )}
            </div>
          </motion.div>

          {/* fallback slider */}
          {!supported && (
            <div className="absolute left-3 right-3 bottom-3 z-10">
              <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur px-4 py-3">
                <div className="text-[11px] text-zinc-600">Control</div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={slider}
                  onChange={(e) => {
                    setSlider(Number(e.target.value));
                    vibrate(6);
                  }}
                  className="mt-2 w-full"
                />
              </div>
            </div>
          )}

          {/* WIN overlay */}
          {won && (
            <div className="absolute inset-0 grid place-items-center z-20">
              <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur px-5 py-4 shadow-soft text-center">
                <div className="text-sm font-semibold text-zinc-900">
                  Así se siente el camino…
                </div>
                <div className="mt-1 text-xs text-zinc-700">
                  cuando alguien lo hace más ligero contigo.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-zinc-600">
        Tip: si tu celular no permite inclinación, usa el slider.
      </div>
    </div>
  );
}
