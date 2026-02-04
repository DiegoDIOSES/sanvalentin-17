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
    title: "Manejar bicicleta",
    description: "A veces el equilibrio no es ir recto, sino ir juntos.",
    emoji: "🚲",
    accentGradient: "from-amber-100 via-rose-100 to-white",
    microGame: "custom",
    sound: "",
  },
  {
    day: 9,
    title: "Ají de Gallina",
    description:
      "Hay comidas que no solo llenan el estómago, también el corazón.",
    emoji: "🍽️",
    accentGradient: "from-yellow-100 via-orange-100 to-white",
    microGame: "custom",
    sound: "",
  },
  {
    day: 10,
    title: "Papitas Lays",
    description:
      "Encuentra el crunch perfecto. Solo una bolsita vibra distinto 😉",
    emoji: "🥔",
    accentGradient: "from-yellow-100 via-amber-50 to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
  {
    day: 11,
    title: "Invierno",
    description: "Abriga el corazón. Capas pequeñas, calor grande.",
    emoji: "❄️",
    accentGradient: "from-sky-100 via-slate-50 to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
  {
    day: 12,
    title: "Playa",
    description: "Arma tu postal: cielo, mar y arena… y que se vea perfecta.",
    emoji: "🏖️",
    accentGradient: "from-cyan-100 via-amber-50 to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
  {
    day: 13,
    title: "Vis a Vis",
    description: "Mini escape: resuelve el candado con pistas rápidas.",
    emoji: "🔐",
    accentGradient: "from-fuchsia-100 via-zinc-50 to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
  {
    day: 14,
    title: "Troll",
    description:
      "Niebla… y algo enorme escondido. Encuéntralo sin asustarte 😅",
    emoji: "🌫️",
    accentGradient: "from-zinc-200 via-zinc-50 to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
  {
    day: 15,
    title: "WhatsApp",
    description: "Ordena el chat. Cuando encaje… ✔✔",
    emoji: "💬",
    accentGradient: "from-emerald-100 via-white to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
  {
    day: 16,
    title: "Coquita",
    description: "Destapa, sirve, y deja la coquita perfecta ✨",
    emoji: "🥤",
    accentGradient: "from-rose-100 via-white to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
  {
    day: 17,
    title: "Chocolate • Menta",
    description: "Mezcla el swirl perfecto… dos sabores raros que funcionan.",
    emoji: "🍦",
    accentGradient: "from-emerald-100 via-amber-50 to-white",
    microGame: "custom",
    sound: "/sounds/pop.mp3",
  },
];
