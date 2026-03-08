// app/lib/time.ts
import { TOTAL_DAYS } from "../data/days";

const MS_DAY = 24 * 60 * 60 * 1000;

export function getUnlockedDayCount(now = new Date()) {
  const year = now.getFullYear();
  const thisYearTarget = new Date(year, 1, 14, 0, 0, 0, 0); // Feb = 1
  const thisYearStart = new Date(thisYearTarget.getTime() - TOTAL_DAYS * MS_DAY);
  thisYearStart.setHours(0, 0, 0, 0);

  // Si ya está en la fecha final o pasada, todo debe estar desbloqueado permanentemente
  if (now.getTime() > thisYearTarget.getTime()) {
    return { 
      unlocked: TOTAL_DAYS, 
      start: thisYearStart, 
      target: thisYearTarget 
    };
  }

  // Si aún no alcanzamos el target de este año, calcula progresivamente
  const elapsed = Math.floor((now.getTime() - thisYearStart.getTime()) / MS_DAY);
  const unlocked = Math.max(0, Math.min(TOTAL_DAYS, elapsed + 1));

  return { unlocked, start: thisYearStart, target: thisYearTarget };
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
