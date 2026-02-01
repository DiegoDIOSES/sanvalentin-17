"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Day06ConstellationCinematic from "../MicroGames/Day06ConstellationCinematic";
import Day06CleanReveal from "../MicroGames/Day06CleanReveal";

type Step = 1 | 2 | 3;

export default function Day06ImanolExperience({ onWin }: { onWin: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [completed, setCompleted] = useState(false);

  const gradient = useMemo(() => "from-amber-50 via-rose-50 to-white", []);

  return (
    <div className="w-full">
      {/* CONTENEDOR PRINCIPAL (NO depende de h-full del modal) */}
      <div className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-soft">
        {/* Fondo / Hero con altura real */}
        <div
          className={[
            "relative w-full",
            "bg-gradient-to-br",
            gradient,
            // altura amigable para móvil: nunca 0
            "min-h-[560px] md:min-h-[620px]",
          ].join(" ")}
        >
          {/* blobs */}
          <motion.div
            className="absolute -top-32 -right-28 h-96 w-96 rounded-full bg-amber-200/45 blur-3xl"
            animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full bg-rose-200/45 blur-3xl"
            animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* grain */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.45)_1px,transparent_0)] [background-size:14px_14px]" />

          {/* top pills */}
          <div className="relative z-20 px-4 pt-4 md:px-6 md:pt-6">
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-2 text-xs text-zinc-700 shadow-soft">
                Día 6 • <span className="font-semibold">Estar con Imanol</span>
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-2 text-xs text-zinc-700 shadow-soft">
                {step === 1 ? "Acto 1" : step === 2 ? "Acto 2" : "Acto 3"}
              </div>
            </div>
          </div>

          {/* CONTENIDO (flow normal, no absolute) */}
          <div className="relative z-10 px-4 pb-28 pt-6 md:px-6 md:pb-28 md:pt-8">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto max-w-2xl text-center"
                >
                  <motion.div
                    className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-soft grid place-items-center text-2xl"
                    animate={{ rotate: [0, 2, 0, -2, 0] }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🤍
                  </motion.div>

                  <div className="text-2xl md:text-4xl font-semibold tracking-tight text-zinc-900">
                    Hay momentos que se sienten seguros.
                  </div>

                  <div className="mt-3 text-sm md:text-base text-zinc-700">
                    No hacen ruido. Pero cambian el día.
                  </div>

                  <div className="mt-7 flex justify-center">
                    <button
                      onClick={() => setStep(2)}
                      className="rounded-2xl bg-zinc-900 text-white px-6 py-3 text-sm font-semibold shadow-soft"
                    >
                      Entrar al momento →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto max-w-5xl"
                >
                  <div className="text-center">
                    <div className="text-xs text-zinc-600">
                      Constelación de momentos
                    </div>
                    <div className="mt-1 text-lg md:text-2xl font-semibold text-zinc-900">
                      Enciende cada luz ✨
                    </div>
                    <div className="mt-2 text-sm text-zinc-700">
                      Toca los puntos. Cada uno es un “momento”.
                    </div>
                  </div>

                  <div className="mt-5">
                    <Day06ConstellationCinematic
                      onComplete={() => {
                        if (!completed) {
                          setCompleted(true);
                          onWin();
                        }
                        setTimeout(() => setStep(3), 450);
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto max-w-4xl"
                >
                  <div className="text-center">
                    <div className="text-xs text-zinc-600">Carta</div>
                    <div className="mt-1 text-lg md:text-2xl font-semibold text-zinc-900">
                      Limpia todo el panel 🤍
                    </div>
                    <div className="mt-2 text-sm text-zinc-700">
                      Esta sí se descubre completa.
                    </div>
                  </div>

                  <div className="mt-5">
                    <Day06CleanReveal
                      coverColor="#f4c5cf"
                      backgroundImageSrc="/images/day06-imanol.jpg"
                      message={`Me gusta cómo te ves cuando estás con Imanol.\n\nEs una versión tuya tranquila, real…\n\ny muy bonita.`}
                      subtitle="(Y sí, se nota.)"
                    />
                  </div>

                  <div className="mt-6 flex justify-center gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm font-semibold"
                    >
                      Volver a mirar ✨
                    </button>
                    <button
                      onClick={() => {
                        setCompleted(false);
                        setStep(1);
                      }}
                      className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
                    >
                      Repetir
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* bottom progress */}
          <div className="absolute left-4 right-4 bottom-4 md:left-6 md:right-6 md:bottom-6 z-20">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-soft p-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-700">
                <span>Progreso</span>
                <span className="font-semibold">{step}/3</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-zinc-900"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
