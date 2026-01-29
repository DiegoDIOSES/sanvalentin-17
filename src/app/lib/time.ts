// app/lib/time.ts
import { TOTAL_DAYS } from "../data/days";

const MS_DAY = 24 * 60 * 60 * 1000;

export function getUnlockedDayCount(now = new Date()) {
  // Objetivo: 14 de febrero (si ya pasó, usa el siguiente año)
  const year = now.getFullYear();
  const target = new Date(year, 1, 14, 0, 0, 0, 0); // Feb = 1

  if (now.getTime() > target.getTime() + 6 * 60 * 60 * 1000) {
    target.setFullYear(year + 1);
  }

  // inicio = target - TOTAL_DAYS días
  const start = new Date(target.getTime() - TOTAL_DAYS * MS_DAY);
  start.setHours(0, 0, 0, 0);

  const elapsed = Math.floor((now.getTime() - start.getTime()) / MS_DAY);
  const unlocked = Math.max(0, Math.min(TOTAL_DAYS, elapsed + 1));

  return { unlocked, start, target };
}

export function getCountdownToNextMidnight(now = new Date()) {
  const next = new Date(now);
  next.setDate(now.getDate() + 1);
  next.setHours(0, 0, 0, 0);

  const diff = Math.max(0, next.getTime() - now.getTime());
  const hh = Math.floor(diff / (1000 * 60 * 60));
  const mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const ss = Math.floor((diff % (1000 * 60)) / 1000);

  return { hh, mm, ss, diff };
}