"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeartsBackground from "../components/HeartsBackground";

const BOOK_PAGES = [
  {
    title: "Esencia",
    image: "/images/paula1.jpeg",
    lines: [
  "Feliz Día de la Mujer a la mujer cuya esencia ilumina los espacios sin siquiera proponérselo.",
  "Hay personas que destacan por lo que hacen, pero tú destacas por lo que eres: por tu sensibilidad, por tu manera de escuchar, por la calma que transmites incluso en medio del ruido del mundo.",
  "Tu presencia tiene algo especial, algo que no se explica fácilmente pero que se siente. Y quienes tienen la fortuna de conocerte saben que no es casualidad encontrarse con una persona así.",
  "Hoy se celebra a muchas mujeres, pero hoy también celebro tu forma única de ser, esa esencia que hace que el mundo sea un lugar un poco más bonito."
]
  },
  {
    title: "Fuerza interior",
    image: "/images/paula2.jpeg",
    lines: [
  "Ser mujer también es tener una fortaleza silenciosa que muchas veces pasa desapercibida.",
  "Es seguir adelante incluso cuando los días pesan, es cuidar, sostener, comprender y dar más de lo que muchas veces se recibe.",
  "Pero en medio de todo eso también está tu valentía: la valentía de ser auténtica, de mantener tu forma de ver el mundo y de no perder nunca esa sensibilidad que te hace especial.",
  "Tu fuerza no siempre se mide en grandes gestos; muchas veces vive en los pequeños momentos, en tu forma de persistir, de levantarte y de seguir siendo tú."
]
  },
  {
    title: "Tu luz",
    image: "/images/paula3.jpeg",
    lines: [
  "Hay personas que llevan una luz dentro, una luz que no depende de los días buenos ni de las circunstancias.",
  "La tuya nace de tu forma de sentir, de la manera en que miras a los demás y del cariño con el que tratas incluso las cosas más simples.",
  "Esa luz es la que hace que tu presencia sea tan especial, la que convierte momentos comunes en recuerdos valiosos.",
  "Y quizá no siempre seas consciente de ello, pero hay muchas personas que encuentran calma, alegría y esperanza simplemente al tenerte cerca."
]
  },
  {
    title: "Salida del Cielo",
    image: "/images/paula4.jpeg",
    lines: [
      "Creo encarecidamente que esa persona salió del mismo cielo,",
      "porque no puedo creer que su corazón",
      "tenga tanta bondad y a la vez tanta dulzura.",
      "",
      "A veces la miro y pienso",
      "que el mundo fue generoso",
      "el día que la puso en mi camino,",
      "como si hubiera querido compensar",
      "todo lo que antes no salió bien.",
      "",
      "No sé cómo alguien puede ser así,",
      "tan completa, tan real,",
      "tan difícil de merecer",
      "y tan fácil de amar.",
    ],
  },
];

function Sparkle({ style }: { style?: React.CSSProperties }) {
  return (
    <span
      className="pointer-events-none absolute text-pink-200/80 drop-shadow-sm"
      style={style}
    >
      ✦
    </span>
  );
}

export default function AbremePage() {
  const [open, setOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);

  const totalSpreads = BOOK_PAGES.length;
  const page = BOOK_PAGES[currentSpread];

  const handleClose = () => {
    setOpen(false);
    setCurrentSpread(0);
  };

  const handlePrev = () => {
    setCurrentSpread((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentSpread((prev) => Math.min(prev + 1, totalSpreads - 1));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,228,236,0.9),_rgba(255,255,255,0.75)_28%,_rgba(253,244,255,0.68)_55%,_rgba(248,250,252,0.92)_100%)]">
      <HeartsBackground />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-14 sm:px-6 lg:px-8">
        <section className="relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-pink-200/70 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 shadow-[0_10px_40px_rgba(244,114,182,0.08)] backdrop-blur">
              Para alguien especial
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Un espacio para celebrar la esencia de una mujer extraordinaria
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8">
              Hoy no es solo una fecha más.
Es un momento para recordar la fuerza, la sensibilidad y la belleza que vive en las mujeres que hacen del mundo un lugar mejor.

Este pequeño espacio fue creado para celebrar tu esencia, tu forma de ser y todo lo que aportas simplemente siendo tú.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentSpread(0);
                  setOpen(true);
                }}
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-7 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(236,72,153,0.28)] transition hover:scale-[1.01] hover:shadow-[0_22px_50px_rgba(236,72,153,0.32)] focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Descubrir sorpresa
              </button>

              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 bg-white/75 px-7 text-sm font-semibold text-zinc-800 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur transition hover:bg-white"
              >
                Volver al inicio
              </Link>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <Sparkle style={{ top: "8%", left: "10%", fontSize: 22 }} />
            <Sparkle style={{ top: "16%", right: "13%", fontSize: 18 }} />
            <Sparkle style={{ bottom: "16%", left: "14%", fontSize: 20 }} />
            <Sparkle style={{ bottom: "10%", right: "16%", fontSize: 24 }} />
          </div>
        </section>
      </main>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 px-3 py-3 backdrop-blur-[2px] sm:px-5 sm:py-5"
            onClick={handleClose}
          >
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ scale: 0.97, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0, y: 16 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex h-full max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,247,251,0.82),rgba(255,255,255,0.76))] shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              >
                <div className="border-b border-white/50 bg-white/45 px-3 py-3 sm:px-5 sm:py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentSpread === 0}
                        onClick={handlePrev}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-white/70 bg-white/80 px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ← <span className="ml-1 hidden sm:inline">Anterior</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-white/70 bg-white/80 px-4 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-white"
                      >
                        Cerrar
                      </button>
                    </div>

                    <div className="order-first flex justify-center sm:order-none">
                      <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-pink-400" />
                        <span>
                          {currentSpread + 1}/{totalSpreads}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={currentSpread === totalSpreads - 1}
                        onClick={handleNext}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-white/70 bg-white/80 px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="hidden sm:inline">Siguiente</span> <span className="sm:ml-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                  <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-pink-200/70 to-transparent md:block" />
                  <div className="pointer-events-none absolute bottom-10 left-1/2 top-10 hidden w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-pink-300/70 via-pink-100/40 to-pink-300/20 blur-[1px] md:block" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSpread}
                      initial={{ opacity: 0, rotateY: -10, y: 18 }}
                      animate={{ opacity: 1, rotateY: 0, y: 0 }}
                      exit={{ opacity: 0, rotateY: 10, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="grid min-h-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <article className="group relative overflow-hidden rounded-[26px] border border-white/50 bg-white/70 shadow-[0_16px_50px_rgba(244,114,182,0.08)] backdrop-blur">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(216,180,254,0.16),transparent_28%)]" />

                        <div className="relative p-3 sm:p-4">
                          <div className="relative overflow-hidden rounded-[22px] bg-zinc-100 shadow-inner">
                            <div className="aspect-[4/5] w-full sm:aspect-[5/6] md:aspect-[4/5]">
                              <img
                                src={page.image}
                                alt={page.title}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                              />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent px-4 py-4 sm:px-5">
                              <p className="text-sm font-semibold tracking-wide text-white sm:text-base">
                                {page.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>

                      <article className="relative overflow-hidden rounded-[26px] border border-white/50 bg-white/72 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,247,251,0.74),rgba(253,242,248,0.55))]" />

                        <div className="relative flex h-full flex-col p-5 sm:p-6 lg:p-8">
                          <div>
                            <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-500">
                              Mensaje especial
                            </span>

                            <h3
                            className={`mt-4 text-xl sm:text-2xl tracking-tight ${
                                page.title === "Salida del Cielo"
                                ? "font-serif text-rose-600"
                                : "font-semibold text-zinc-900"
                            }`}
                            >
                            {page.title}
                            </h3>

                            <div className="mt-5 space-y-4 sm:space-y-5">
                              {page.lines.map((line, index) => (
                                <p
                                    key={index}
                                    className={`text-sm leading-relaxed text-zinc-700 ${
                                    line === "" ? "h-3" : ""
                                    }`}
                                >
                                    {line}
                                </p>
                                ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}