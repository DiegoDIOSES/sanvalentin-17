"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DragGame({ onWin }: { onWin: () => void }) {
  const [done, setDone] = useState(false);

  return (
    <div className="mt-4 relative h-44 rounded-2xl bg-white border border-zinc-200 overflow-hidden">
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-16 w-16 rounded-full bg-rose-100 border border-rose-200 grid place-items-center">
          🎯
        </div>
      </div>

      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={(_, info) => {
          // “cerca del centro”
          const dx = Math.abs(info.point.x - window.innerWidth / 2);
          const dy = Math.abs(info.point.y - window.innerHeight / 2);

          if (dx < 110 && dy < 160) {
            onWin();
            setDone(true);
            setTimeout(() => setDone(false), 800);
          }
        }}
        className="absolute left-4 top-4 h-12 w-12 rounded-full bg-rose-500 text-white grid place-items-center cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 0.95 }}
      >
        💗
      </motion.div>

      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute inset-0 grid place-items-center text-sm font-semibold text-zinc-900"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            ¡Perfecto! ✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
