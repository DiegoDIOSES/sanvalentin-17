// app/lib/sound.ts
import { Howl } from "howler";

let current: Howl | null = null;

export function playSound(src: string, muted: boolean, volume = 0.85) {
  if (muted) return;

  try {
    // corta el sonido anterior para que todo sea limpio
    if (current) {
      current.stop();
      current.unload();
      current = null;
    }

    current = new Howl({
      src: [src],
      volume,
      html5: true,
    });

    current.play();
  } catch (e) {
    // silencioso para no romper UX
    console.warn("Sound error:", e);
  }
}

export function stopSound() {
  if (!current) return;
  current.stop();
  current.unload();
  current = null;
}
