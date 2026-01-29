// app/components/SoundToggle.tsx
"use client";

export default function SoundToggle({
  muted,
  setMuted,
}: {
  muted: boolean;
  setMuted: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => setMuted(!muted)}
      className="rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-soft text-sm"
    >
      {muted ? "🔇 Sonido" : "🔊 Sonido"}
    </button>
  );
}