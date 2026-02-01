// app/data/days.ts

export type MicroGameType = "tap" | "hold" | "drag" | "custom";

export interface DayItem {
  day: number;
  title: string;
  description: string;
  emoji: string;
  image?: string;
  sound: string;
  accentGradient: string;
  microGame: MicroGameType;
  videoSrc?: string;
  spotifyUrl?: string;
}

/**
 * Total de días del reto
 * (San Valentín – cuenta regresiva)
 */
export const TOTAL_DAYS = 17;

/**
 * Contenido principal:
 * 17 días, 17 cosas que te gustan
 */
export const DAYS: DayItem[] = [
  {
    day: 1,
    title: "Jirafa",
    description:
      "Porque incluso lo diferente se vuelve adorable cuando se mira con cariño.",
    emoji: "🦒",
    image: "/images/day01-jirafa.webp",
    sound: "/sounds/day01.mp3",
    accentGradient: "from-rose-200 to-pink-100",
    microGame: "tap",
  },
  {
    day: 2,
    title: "Torta de chocolate",
    description: "Un clásico infalible. Dulce, intensa… imposible resistirse.",
    emoji: "🍫🍰",
    image: "/images/day02-chocolate.webp",
    sound: "/sounds/day02.mp3",
    accentGradient: "from-pink-200 to-rose-100",
    microGame: "hold",
  },
  {
    day: 3,
    title: "Color vino",
    description: "Elegante, suave, profundo. Hoy encontramos el tono exacto.",
    emoji: "🍷",
    accentGradient: "from-[#2a0b18] via-[#6b1b3a] to-[#f0d7df]",
    sound: "/sounds/day3.mp3",
    microGame: "hold",
  },
  {
    day: 4,
    title: "Tini",
    description: "Un rompecabezas de 15 piezas para armar un recuerdo.",
    emoji: "🎶",
    accentGradient: "from-pink-50 via-rose-50 to-violet-50",
    sound: "/sounds/day4.mp3",
    microGame: "tap",
  },
  {
    day: 5,
    title: "Buenos Aires",
    description: "Una canción, una ciudad, una vibra que se queda.",
    emoji: "🌆",
    image: "/images/day05-buenosaires.webp",
    sound: "/sounds/day05.mp3",
    accentGradient: "from-rose-300 to-pink-100",
    microGame: "drag",
    spotifyUrl:
      "https://open.spotify.com/track/3eNenN5eoBwMRNPkmoyk81?si=75FDVLABRwqCHOszvmQmrw",
  },
  {
    day: 6,
    title: "Estar con Imanol",
    description: "Una experiencia que se siente, sin hacer ruido.",
    emoji: "🤍",
    accentGradient: "from-amber-50 via-rose-50 to-white",
    sound: "", // no se usa
    microGame: "custom",
  },
  {
    day: 7,
    title: "Todas las flores",
    description: "Un jardín que florece con 5 acciones distintas.",
    emoji: "🌸",
    accentGradient: "from-pink-50 via-rose-50 to-amber-50",
    sound: "/sounds/wind.mp3", // opcional (este día tiene viento)
    microGame: "tap", // override en DayModal
  },
  {
    day: 8,
    title: "Manejar bici",
    description: "Libertad, aire fresco y una sonrisa sin darse cuenta.",
    emoji: "🚲",
    image: "/images/day08-bici.webp",
    sound: "/sounds/day08.mp3",
    accentGradient: "from-pink-200 to-rose-100",
    microGame: "drag",
  },
  {
    day: 9,
    title: "Ají de gallina",
    description: "Sabor que abraza y reconforta.",
    emoji: "🍛",
    image: "/images/day09-ajidegallina.webp",
    sound: "/sounds/day09.mp3",
    accentGradient: "from-amber-200 to-rose-100",
    microGame: "tap",
  },
  {
    day: 10,
    title: "Papitas Lays",
    description: "Solo una… mentira, otra más.",
    emoji: "🥔",
    image: "/images/day10-lays.webp",
    sound: "/sounds/day10.mp3",
    accentGradient: "from-yellow-200 to-pink-100",
    microGame: "hold",
  },
  {
    day: 11,
    title: "Invierno",
    description: "Frío afuera, calorcito adentro.",
    emoji: "❄️",
    image: "/images/day11-invierno.webp",
    sound: "/sounds/day11.mp3",
    accentGradient: "from-sky-200 to-rose-100",
    microGame: "drag",
  },
  {
    day: 12,
    title: "Playa",
    description: "Sal, sol y tranquilidad.",
    emoji: "🏖️",
    image: "/images/day12-playa.webp",
    sound: "/sounds/day12.mp3",
    accentGradient: "from-cyan-200 to-pink-100",
    microGame: "tap",
  },
  {
    day: 13,
    title: "Vis a Vis",
    description: "Drama, intensidad y capítulos que no se sueltan.",
    emoji: "📺",
    image: "/images/day13-visavis.webp",
    sound: "/sounds/day13.mp3",
    accentGradient: "from-zinc-300 to-rose-100",
    microGame: "hold",
  },
  {
    day: 14,
    title: "Troll",
    description: "Un poco de miedo, pero mejor acompañada.",
    emoji: "🧌",
    image: "/images/day14-troll.webp",
    sound: "/sounds/day14.mp3",
    accentGradient: "from-emerald-200 to-rose-100",
    microGame: "drag",
  },
  {
    day: 15,
    title: "WhatsApp",
    description: "Donde viven los mensajes importantes.",
    emoji: "💬",
    image: "/images/day15-whatsapp.webp",
    sound: "/sounds/day15.mp3",
    accentGradient: "from-green-200 to-rose-100",
    microGame: "tap",
  },
  {
    day: 16,
    title: "Coquita",
    description: "Pequeña, fría y perfecta.",
    emoji: "🥤",
    image: "/images/day16-coquita.webp",
    sound: "/sounds/day16.mp3",
    accentGradient: "from-red-200 to-pink-100",
    microGame: "hold",
  },
  {
    day: 17,
    title: "Chocolate con menta",
    description: "Diferente. Como las mejores cosas.",
    emoji: "🍦",
    image: "/images/day17-helado.webp",
    sound: "/sounds/day17.mp3",
    accentGradient: "from-emerald-200 to-fuchsia-100",
    microGame: "tap",
  },
];
