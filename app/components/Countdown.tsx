// app/components/Countdown.tsx
"use client";

import { useEffect, useState } from "react";
import { getCountdownToNextMidnight } from "../lib/time";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(t);
  }, []);

  const cd = getCountdownToNextMidnight(now);

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-soft text-sm">
      <div className="text-[11px] text-zinc-600">Próximo desbloqueo en</div>
      <div className="font-mono text-base">
        {pad(cd.hh)}:{pad(cd.mm)}:{pad(cd.ss)}
      </div>
    </div>
  );
}
