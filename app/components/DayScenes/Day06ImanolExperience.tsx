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
    // ✅ Este wrapper asegura “pantalla grande” dentro del modal en móvil.
    //    72vh es cómodo; puedes subir a 78vh si quieres aún más grande.
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-soft">
        <div
          className={[
            "relative bg-gradient-to-br",
            gradient,
            // ✅ Alto GRANDE real en móvil/desktop
            "min-h-[72vh] md:min-h-[560px]",
          ].join(" ")}
        >
          {/* blobs suaves */}
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
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.45)_1px,transparent_0)] [background-size:14px_14px]" />

          {/* pills arriba (más compactas en móvil) */}
          <div className="absolute left-3 right-3 top-3 md:left-6 md:right-6 md:top-6 z-20">
            <div className="flex items-center justify-between gap-2">
              <div className="rounded-2xl bg-white/75 backdrop-blur border border-white/60 px-3 py-2 text-[11px] md:text-xs text-zinc-700 shadow-soft">
                Día 6 • <span className="font-semibold">Estar con Imanol</span>
              </div>

              <div className="rounded-2xl bg-white/75 backdrop-blur border border-white/60 px-3 py-2 text-[11px] md:text-xs text-zinc-700 shadow-soft">
                {step === 1 ? "Acto 1" : step === 2 ? "Acto 2" : "Acto 3"}
              </div>
            </div>
          </div>

          {/* ✅ Contenido ocupa TODO el alto. Sin overflow-y interno. */}
          <div className="absolute inset-0 z-10 flex flex-col">
            {/* espacio superior real, pequeño en móvil */}
            <div className="h-14 md:h-20" />

            {/* contenido central crece */}
            <div className="flex-1 min-h-0 px-3 md:px-8">
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    className="h-full flex items-center justify-center"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.55 }}
                  >
                    <div className="w-full max-w-2xl text-center">
                      <motion.div
                        className="mx-auto mb-4 h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-soft grid place-items-center text-2xl"
                        animate={{ rotate: [0, 2, 0, -2, 0] }}
                        transition={{
                          duration: 4.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        🤍
                      </motion.div>

                      <div className="text-xl md:text-4xl font-semibold tracking-tight text-zinc-900">
                        Hay momentos que se sienten seguros.
                      </div>

                      <div className="mt-2 text-sm md:text-base text-zinc-700">
                        No hacen ruido. Pero cambian el día.
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => setStep(2)}
                          className="rounded-2xl bg-zinc-900 text-white px-6 py-3 text-sm font-semibold shadow-soft"
                        >
                          Entrar al momento →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    className="h-full flex flex-col"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center pt-1 md:pt-2">
                      <div className="text-[11px] md:text-xs text-zinc-600">
                        Constelación de momentos
                      </div>
                      <div className="mt-1 text-lg md:text-2xl font-semibold text-zinc-900">
                        Enciende cada luz ✨
                      </div>
                      <div className="mt-1 text-sm text-zinc-700">
                        Toca los puntos. Cada uno es un “momento”.
                      </div>
                    </div>

                    {/* ✅ Área del juego MUCHO más grande */}
                    <div className="mt-3 flex-1 min-h-0">
                      <div className="h-full">
                        <Day06ConstellationCinematic
                          onComplete={() => {
                            if (!completed) {
                              setCompleted(true);
                              onWin();
                            }
                            setTimeout(() => setStep(3), 500);
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    className="h-full flex flex-col"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center pt-1 md:pt-2">
                      <div className="text-[11px] md:text-xs text-zinc-600">
                        Carta
                      </div>
                      <div className="mt-1 text-lg md:text-2xl font-semibold text-zinc-900">
                        Limpia todo el panel 🤍
                      </div>
                      <div className="mt-1 text-sm text-zinc-700">
                        Esta sí se descubre completa.
                      </div>
                    </div>

                    {/* ✅ Carta ocupa casi todo el alto */}
                    <div className="mt-3 flex-1 min-h-0">
                      <Day06CleanReveal
                        coverColor="#f4c5cf"
                        backgroundImageSrc="/images/day06-imanol.jpg"
                        message={`Me gusta cómo te ves cuando estás con Imanol.\n\nEs una versión tuya tranquila, real…\n\ny muy bonita.`}
                        subtitle="(Y sí, se nota.)"
                        onReveal={() => {}}
                      />
                    </div>

                    <div className="mt-3 mb-2 flex justify-center gap-2">
                      <button
                        onClick={() => setStep(2)}
                        className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 text-sm font-semibold"
                      >
                        Volver a mirar ✨
                      </button>
                      <button
                        onClick={() => {
                          // ✅ reset completo para que vuelva a “salir” la imagen secreta en reintentos
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

            {/* espacio inferior fijo para progreso */}
            <div className="h-20 md:h-24" />
          </div>

          {/* progreso abajo (siempre visible) */}
          <div className="absolute left-3 right-3 bottom-3 md:left-6 md:right-6 md:bottom-6 z-20">
            <div className="rounded-2xl bg-white/75 backdrop-blur border border-white/60 shadow-soft p-3">
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

      {/* nota opcional */}
      <div className="mt-2 text-center text-[11px] text-zinc-500">
        Sin sonidos • solo sensación.
      </div>
    </div>
  );
}