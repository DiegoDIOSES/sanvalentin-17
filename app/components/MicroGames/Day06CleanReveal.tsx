"use client";

import { useRef, useState } from "react";

export default function Day06CleanReveal({
  coverColor,
  backgroundImageSrc,
  message,
  subtitle,
  onReveal,
}: {
  coverColor: string;
  backgroundImageSrc: string;
  message: string;
  subtitle?: string;
  onReveal?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const handleScratch = () => {
    if (revealed) return;

    const next = Math.min(progress + 4, 100);
    setProgress(next);

    if (next >= 100) {
      setRevealed(true);
      onReveal?.();
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-zinc-200">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImageSrc})`,
          filter: revealed ? "none" : "blur(10px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 bg-pink-100/90">
        <div className="flex items-center justify-between text-xs text-zinc-600 mb-4">
          <span>Carta</span>
          <span>{progress}%</span>
        </div>

        <div className="text-center">
          <div className="text-sm sm:text-base font-semibold text-zinc-900 leading-relaxed whitespace-pre-line">
            {message}
          </div>

          {subtitle && (
            <div className="mt-2 text-[11px] sm:text-xs text-zinc-600">
              {subtitle}
            </div>
          )}
        </div>

        {!revealed && (
          <button
            onClick={handleScratch}
            className="
              mt-6
              mx-auto
              block
              rounded-2xl
              bg-white
              border border-zinc-200
              px-5 py-3
              text-sm
              font-semibold
            "
          >
            Limpiar 🤍
          </button>
        )}
      </div>
    </div>
  );
}