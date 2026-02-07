"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, Reorder } from "framer-motion";

type Msg = { id: string; text: string; side: "me" | "you" };

const CORRECT: Msg[] = [
  { id: "m1", text: "Oye 😌", side: "me" },
  { id: "m2", text: "¿Te digo algo bonito?", side: "me" },
  { id: "m3", text: "Me encanta cómo te ríes.", side: "you" },
  { id: "m4", text: "Y cómo haces que todo se sienta fácil.", side: "you" },
  { id: "m5", text: "Listo. Ya lo dije 🙈", side: "me" },
];

// ✅ Cambia esto:
const PHONE_E164 = "51937328128"; // ejemplo: 51987654321 (sin +)

// ✅ Mensaje que quedará listo en el chat real
const REAL_CHAT_MESSAGE =
  "Oye 😌 ¿Te digo algo bonito? Me encanta cómo te ríes. Y cómo haces que todo se sienta fácil. Listo. Ya lo dije 🙈";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function vibe(ms = 12) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      (navigator as any).vibrate(ms);
    }
  } catch {}
}

function fakeTime(i: number) {
  const m = 1 + i; // 19:01, 19:02...
  return `19:0${m}`;
}

function openWhatsAppChat(phoneE164: string, message: string) {
  const text = encodeURIComponent(message);

  // En móvil normalmente abre la app. En desktop abre WhatsApp Web.
  // wa.me es el formato más compatible.
  const url = `https://wa.me/${phoneE164}?text=${text}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

export default function Day15OrderChat({ onWin }: { onWin: () => void }) {
  const [items, setItems] = useState<Msg[]>(() => shuffle(CORRECT));
  const [won, setWon] = useState(false);

  // feedback “revisar”
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const onWinRef = useRef(false);

  const ok = useMemo(() => {
    if (items.length !== CORRECT.length) return false;
    return items.every((x, i) => x.id === CORRECT[i].id);
  }, [items]);

  useEffect(() => {
    if (!ok || won) return;
    setWon(true);
    setChecked(false);
    vibe(25);

    if (!onWinRef.current) {
      onWinRef.current = true;
      onWin();
    }
  }, [ok, won, onWin]);

  const reset = () => {
    setItems(shuffle(CORRECT));
    setWon(false);
    setChecked(false);
    setScore(0);
    onWinRef.current = false;
  };

  const checkNow = () => {
    const s = items.reduce(
      (acc, it, i) => acc + (it.id === CORRECT[i].id ? 1 : 0),
      0,
    );
    setScore(s);
    setChecked(true);
    vibe(10);
  };

  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white shadow-soft overflow-hidden">
      {/* Header tipo WhatsApp */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 bg-gradient-to-br from-emerald-50 via-white to-white">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-900 text-white grid place-items-center text-sm shadow-soft">
            💬
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900">WhatsApp</div>
            <div className="text-[11px] text-zinc-600">
              Ordena el chat para que “fluya”
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={checkNow}
            disabled={won}
            className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold disabled:opacity-60"
          >
            Revisar ✅
          </button>
          <button
            onClick={reset}
            className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold"
          >
            Repetir 🔁
          </button>
        </div>
      </div>

      {/* Área de chat */}
      <div className="p-4 bg-zinc-50">
        <div className="rounded-2xl border border-zinc-200 bg-white p-3">
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={(v) => {
              setItems(v);
              if (checked) setChecked(false);
            }}
            className="space-y-2"
          >
            {items.map((m, idx) => {
              const isMe = m.side === "me";
              return (
                <Reorder.Item
                  key={m.id}
                  value={m}
                  onDragEnd={() => vibe(8)}
                  className="select-none"
                >
                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm border shadow-soft ${
                        isMe
                          ? "bg-emerald-50 border-emerald-200 text-zinc-900"
                          : "bg-white border-zinc-200 text-zinc-900"
                      }`}
                    >
                      <div>{m.text}</div>
                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-zinc-500">
                        <span>{fakeTime(idx)}</span>
                        {won && isMe && idx === items.length - 1 && (
                          <span className="text-sky-600 font-semibold">✔✔</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>

        {/* Feedback / Resultado */}
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4">
          {won ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-sm font-semibold text-zinc-900">
                Mensaje enviado ✔✔
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                Ahora te llevaré a un chat real 😌
              </div>

              <button
                onClick={() => openWhatsAppChat(PHONE_E164, REAL_CHAT_MESSAGE)}
                className="mt-3 w-full rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold"
              >
                Ir al chat real →
              </button>

              <div className="mt-2 text-[11px] text-zinc-600">
                *Se abrirá WhatsApp con el mensaje listo. Solo toca “Enviar”.*
              </div>
            </motion.div>
          ) : checked ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-sm font-semibold text-zinc-900">
                Vas {score}/{CORRECT.length} ✅
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                Ajusta el orden hasta que suene como conversación real.
              </div>
            </motion.div>
          ) : (
            <div className="text-sm text-zinc-700">
              Tip: si dudas, pulsa <span className="font-semibold">Revisar ✅</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}