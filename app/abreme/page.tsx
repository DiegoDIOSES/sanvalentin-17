"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeartsBackground from "../components/HeartsBackground";

const BOOK_PAGES = [
  {
    title: "Página 1",
    image: "/images/tini.jpg",
    lines: [
      "Cada página de este libro está tejida con gratitud.",
      "Tu sonrisa es una luz que transforma lo cotidiano.",
    ],
  },
  {
    title: "Página 2",
    image: "/images/jirafa-removebg-preview.png",
    lines: [
      "Tu coraje escribe historias que el mundo necesita leer.",
      "Gracias por ser esa calma que acoge y el fuego que impulsa.",
    ],
  },
  {
    title: "Página 3",
    image: "/images/hoja.png",
    lines: [
      "En cada gesto hay un poema que hace vibrar a quien lo recibe.",
      "Que estas palabras te abracen con la suavidad que mereces.",
    ],
  },
  {
    title: "Página 4",
    image: "/images/troll.jpg",
    lines: [
      "Eres arte, presencia y música. Gracias por compartir tu pulso.",
      "Flores, viento y luz: hoy la celebración es tuya.",
    ],
  },
];

function Sparkle({ style }: { style?: React.CSSProperties }) {
  return (
    <span
      className="absolute text-pink-200 opacity-80"
      style={style}
    >
      ✨
    </span>
  );
}

export default function AbremePage() {
  const [open, setOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);

  const totalSpreads = BOOK_PAGES.length;
  const getCurrentPage = () => BOOK_PAGES[currentSpread];

  return (
    <div className="min-h-screen bg-blobs relative overflow-hidden">
      <HeartsBackground />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-20">
        <section className="relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900"
          >
            Una galería para celebrar tu esencia
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-zinc-700"
          >
            Aquí verás palabras que te abrazan, imágenes que susurran calma y un
            pequeño regalo escondido. Gracias por cada latido que compartes.
          </motion.p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                setCurrentSpread(0);
                setOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-full bg-pink-500 px-8 py-3 text-sm font-semibold text-white shadow-soft hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Descubre tu sorpresa
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/70 px-8 py-3 text-sm font-semibold text-zinc-900 shadow-soft backdrop-blur hover:bg-white"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="pointer-events-none">
            <Sparkle style={{ top: 64, left: "12%", fontSize: 24 }} />
            <Sparkle style={{ top: 68, right: "18%", fontSize: 18 }} />
            <Sparkle style={{ bottom: 52, left: "15%", fontSize: 22 }} />
            <Sparkle style={{ bottom: 44, right: "20%", fontSize: 20 }} />
          </div>
        </section>

      </main>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
            onClick={() => {
              setOpen(false);
              setCurrentSpread(0);
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-6xl h-[82vh] max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mt-10 flex h-full flex-col items-center gap-6 px-6 pb-8">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentSpread === 0}
                      onClick={() => setCurrentSpread((s) => Math.max(s - 1, 0))}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-zinc-100"
                    >
                      ← Anterior
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setCurrentSpread(0);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-200"
                    >
                      ✨ Cerrar
                    </button>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur">
                    <span>Libro</span>
                    <span className="h-2 w-2 rounded-full bg-pink-400" />
                    <span>
                      {currentSpread + 1}/{totalSpreads}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={currentSpread === totalSpreads - 1}
                    onClick={() => setCurrentSpread((s) => Math.min(s + 1, totalSpreads - 1))}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-zinc-100"
                  >
                    Siguiente →
                  </button>
                </div>

                <div className="relative flex h-full w-full gap-6 overflow-hidden" style={{ perspective: 1100 }}>
                  <div className="absolute left-1/2 top-0 h-full w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-pink-300/90 via-transparent to-pink-300/20" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSpread}
                      initial={{ opacity: 0, rotateY: -35, x: 60 }}
                      animate={{ opacity: 1, rotateY: 0, x: 0 }}
                      exit={{ opacity: 0, rotateY: 35, x: -60 }}
                      transition={{ duration: 0.45 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="relative grid w-full h-full grid-cols-1 gap-6 md:grid-cols-2"
                    >
                      {(() => {
                        const page = getCurrentPage();
                        return (
                          <>
                            <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/60 shadow-inner">
                              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-transparent to-violet-50 opacity-80" />
                              <div className="relative h-80 w-full md:h-[28rem]">
                                {page.image ? (
                                  <img
                                    src={page.image}
                                    alt={page.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-zinc-100" />
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-5 py-4">
                                  <p className="text-sm font-semibold text-white">
                                    {page.title}
                                  </p>
                                </div>
                              </div>
                              <div className="absolute -right-3 top-8 h-40 w-6 rounded-tr-2xl rounded-br-2xl bg-white/30 shadow-inner" />
                            </div>

                            <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/70 shadow-inner">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-pink-50 opacity-80" />
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-zinc-900">
                                  Mensajes especiales
                                </h3>
                                <div className="mt-4 space-y-4">
                                  {page.lines.map((line) => (
                                    <p
                                      key={line}
                                      className="text-sm leading-relaxed text-zinc-700"
                                    >
                                      {line}
                                    </p>
                                  ))}
                                </div>

                                <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-zinc-500">
                                  <span className="inline-flex h-2 w-2 rounded-full bg-pink-300" />
                                  <span>Cada palabra es un latido compartido</span>
                                </div>
                              </div>
                              <div className="absolute -left-3 top-8 h-40 w-6 rounded-tl-2xl rounded-bl-2xl bg-white/30 shadow-inner" />
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
