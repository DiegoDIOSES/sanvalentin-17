// app/components/HeartsBackground.tsx
"use client";

import { useEffect, useRef } from "react";

export default function HeartsBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const hearts = Array.from({ length: 28 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 10 + Math.random() * 18,
      v: 0.3 + Math.random() * 0.8,
      a: 0.1 + Math.random() * 0.18,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of hearts) {
        p.y -= p.v;
        if (p.y < -40) {
          p.y = h + 40;
          p.x = Math.random() * w;
        }

        ctx.globalAlpha = p.a;
        ctx.font = `${p.s}px system-ui, Apple Color Emoji, Segoe UI Emoji`;
        ctx.fillText("💗", p.x, p.y);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}