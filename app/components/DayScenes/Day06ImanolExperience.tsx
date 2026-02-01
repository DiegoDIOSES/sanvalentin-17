"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Day06Constellation from "../MicroGames/Day06Constellation";
import ScratchRevealPopup from "../ScratchRevealPopup";

export default function Day06ImanolExperience({
  onWin,
}: {
  onWin: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showLetter, setShowLetter] = useState(false);

  return (
    <div className="relative min-h-[70vh] rounded-3xl overflow-hidden border border-zinc-200 bg-gradient-to-br from-amber-50 via-rose-50 to-white p-6 md:p-10">
      {/* blobs */}
      <div className="absolute -top-24 -right-32 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />

      {/* ACTO 1 */}
      {step === 1 && (
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-2xl md:text-3xl font-semibold text-zinc-900"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Hay días que se sienten seguros.
          </motion.div>

          <button
            onClick={() => setStep(2)}
            className="mt-8 rounded-2xl bg-zinc-900 text-white px-6 py-3 text-sm font-semibold"
          >
            Siguiente →
          </button>
        </motion.div>
      )}

      {/* ACTO 2 */}
      {step === 2 && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-4">
            <div className="text-sm text-zinc-600">
              Constelación de momentos
            </div>
            <div className="text-lg font-semibold text-zinc-900">
              Toca cada luz ✨
            </div>
          </div>

          <Day06Constellation
            onComplete={() => {
              onWin();
              setTimeout(() => setStep(3), 600);
            }}
          />
        </motion.div>
      )}

      {/* ACTO 3 */}
      {step === 3 && (
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-sm text-zinc-600 mb-2">
            Carta escondida 🤍
          </div>

          <button
            onClick={() => setShowLetter(true)}
            className="rounded-2xl bg-white border border-zinc-200 px-6 py-4 text-sm font-semibold shadow-soft"
          >
            Descubrir mensaje
          </button>

          {showLetter && (
            <ScratchRevealPopup
              onClose={() => setShowLetter(false)}
              message={"Me gusta cómo te ves cuando estás con Imanol.\nEs una versión tuya tranquila, real… y muy bonita."} open={false} color={""} muted={false}            />
          )}
        </motion.div>
      )}
    </div>
  );
}