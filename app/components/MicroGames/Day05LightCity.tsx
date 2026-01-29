"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "../../lib/sound";
import SpotifyLaunchModal from "../SpotifyLaunchModal";

type Light = {
  id: string;
  x: number;
  y: number;
  label: string;
};

const LIGHTS: Light[] = [
  {
    id: "l1",
    x: 18,
    y: 42,
    label: "Hay ciudades que abrazan aunque estés lejos.",
  },
  { id: "l2", x: 32, y: 28, label: "Una esquina, una risa… y listo." },
  {
    id: "l3",
    x: 46,
    y: 48,
    label: "Lo bonito: cuando algo te recuerda a alguien.",
  },
  { id: "l4", x: 61, y: 32, label: "La noche también tiene su calma." },
  { id: "l5", x: 74, y: 46, label: "Si suena, se queda." },
  { id: "l6", x: 26, y: 60, label: "Un “te vi” sin decirlo." },
  { id: "l7", x: 52, y: 66, label: "Y de pronto… la ciudad prende." },
  { id: "l8", x: 84, y: 60, label: "Buenos Aires, pero contigo." },
  { id: "l9", x: 40, y: 74, label: "Un ratito más 🌙" },
];

export default function Day05LightCity({
  onWin,
  muted,
  spotifyUrl,
}: {
  onWin: () => void;
  muted: boolean;
  spotifyUrl: string; // link spotify
}) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [activeText, setActiveText] = useState<string>(
    "Toca una luz para encender la ciudad ✨",
  );
  const [done, setDone] = useState(false);

  const [showLaunch, setShowLaunch] = useState(false);

  const progress = useMemo(() => {
    const count = LIGHTS.reduce((acc, l) => acc + (on[l.id] ? 1 : 0), 0);
    return { count, total: LIGHTS.length };
  }, [on]);

  useEffect(() => {
    if (done) return;
    if (progress.count !== progress.total) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(true);
    onWin();
    playSound("/sounds/unlock.mp3", muted, 0.8);

    // modal premium + luego abre spotify
    const t = window.setTimeout(() => setShowLaunch(true), 500);
    return () => window.clearTimeout(t);
  }, [done, progress, onWin, muted]);

  const toggle = (l: Light) => {
    if (done) return;
    setOn((prev) => {
      if (prev[l.id]) return prev;
      return { ...prev, [l.id]: true };
    });
    setActiveText(l.label);
    playSound("/sounds/pop.mp3", muted, 0.55);
  };

  const openSpotify = () => {
    // intenta abrir en nueva pestaña/Spotify app
    try {
      window.open(spotifyUrl, "_blank", "noopener,noreferrer");
    } catch {}
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700">
          Luces:{" "}
          <span className="font-semibold">
            {progress.count}/{progress.total}
          </span>
        </div>

        <button
          onClick={() => {
            setOn({});
            setDone(false);
            setShowLaunch(false);
            setActiveText("Toca una luz para encender la ciudad ✨");
            playSound("/sounds/pop.mp3", muted, 0.55);
          }}
          className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
        >
          Reiniciar 🔁
        </button>
      </div>

      <div className="mt-3 relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-[#060815] via-[#0b1230] to-[#1b0f20] p-4">
        {/* estrellas */}
        <div className="absolute inset-0 opacity-[0.55]">
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-[2px] w-[2px] rounded-full bg-white/70"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
              }}
            />
          ))}
        </div>

        {/* skyline */}
        <div className="relative h-[220px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="absolute left-0 right-0 bottom-0 h-[70px] bg-white/5" />
          <div className="absolute left-0 right-0 bottom-0 h-[70px] bg-gradient-to-t from-black/25 to-transparent" />

          <div className="absolute bottom-[60px] left-[6%] h-[85px] w-[80px] rounded-xl bg-white/10" />
          <div className="absolute bottom-[60px] left-[20%] h-[120px] w-[95px] rounded-2xl bg-white/10" />
          <div className="absolute bottom-[60px] left-[37%] h-[70px] w-[70px] rounded-xl bg-white/10" />
          <div className="absolute bottom-[60px] left-[50%] h-[135px] w-[120px] rounded-2xl bg-white/10" />
          <div className="absolute bottom-[60px] left-[70%] h-[95px] w-[100px] rounded-2xl bg-white/10" />

          {/* luces */}
          {LIGHTS.map((l) => {
            const isOn = !!on[l.id];
            return (
              <button
                key={l.id}
                onClick={() => toggle(l)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
                aria-label="encender luz"
              >
                <motion.div
                  className={[
                    "h-6 w-6 rounded-full border backdrop-blur grid place-items-center",
                    isOn
                      ? "bg-[#f6d365]/25 border-[#f6d365]/40"
                      : "bg-white/8 border-white/15",
                  ].join(" ")}
                  animate={
                    isOn
                      ? {
                          boxShadow: [
                            "0 0 0 rgba(246,211,101,0)",
                            "0 0 18px rgba(246,211,101,0.45)",
                            "0 0 0 rgba(246,211,101,0)",
                          ],
                        }
                      : { boxShadow: "0 0 0 rgba(0,0,0,0)" }
                  }
                  transition={{ duration: 1.6, repeat: isOn ? Infinity : 0 }}
                >
                  <span className={isOn ? "text-[#f6d365]" : "text-white/50"}>
                    ✦
                  </span>
                </motion.div>
              </button>
            );
          })}
        </div>

        <motion.div
          className="relative mt-3 rounded-2xl border border-white/10 bg-white/6 backdrop-blur p-4 text-white"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-[11px] text-white/70">Mensaje</div>
          <div className="mt-1 text-sm leading-relaxed">{activeText}</div>
        </motion.div>

        {done && (
          <motion.div
            className="mt-3 rounded-2xl border border-white/10 bg-white/6 backdrop-blur p-4 text-white"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
          >
            <div className="text-sm font-semibold">
              “Hay ciudades que no se visitan. Se extrañan.” 🌙
            </div>
            <div className="mt-1 text-xs text-white/75">
              Y ahora… te llevo a escuchar esta melodía.
            </div>

            <button
              onClick={() => {
                setShowLaunch(true);
                playSound("/sounds/secret.mp3", muted, 0.7);
              }}
              className="mt-3 w-full rounded-2xl bg-white text-zinc-900 px-4 py-3 text-sm font-semibold"
            >
              Abrir Spotify 🎧
            </button>
          </motion.div>
        )}
      </div>

      <SpotifyLaunchModal
        open={showLaunch}
        muted={muted}
        seconds={4}
        onCancel={() => setShowLaunch(false)}
        onDone={() => {
          setShowLaunch(false);
          openSpotify();
        }}
      />

      {/* fallback por si el navegador bloquea popups */}
      {showLaunch && (
        <div className="mt-3 text-[11px] text-zinc-600">
          Si no se abre solo, al terminar toca{" "}
          <button
            onClick={openSpotify}
            className="underline font-semibold"
            type="button"
          >
            abrir Spotify
          </button>
          .
        </div>
      )}
    </div>
  );
}
