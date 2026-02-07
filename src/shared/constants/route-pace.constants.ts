export const ROUTE_PACE_INFO = {
  ROCA: {
    emoji: "🪨",
    label: "Roca",
    description:
      "Aún no te ves seguro sobre los patines y evitas las cuestas a toda costa. No sabes frenar.",
  },
  CARACOL: {
    emoji: "🐌",
    label: "Caracol",
    description:
      "Eres autónomo en rectas y cuesta arriba, pero necesitas ayuda todavía para frenar, aunque lo intentes solo, aunque lo intentes solo.",
  },
  GUSANO: {
    emoji: "🐛",
    label: "Gusano",
    description:
      "Eres autónomo 100% y te gusta ir a las caracoleras, pero te gusta salir por la calle, ritmo disfrutón.",
  },
  MARIPOSA: {
    emoji: "🦋",
    label: "Mariposa (Avanzado o Pro)",
    description:
      "Te gusta la calle, bajar cuestas infinitas sin frenar, pasar por túneles, ritmo avanzado.",
  },
  EXPERIMENTADO: {
    emoji: "🚀",
    label: "Experimentado",
    description: "rutas X, Galáctica, 7 picos...",
  },
  LOCURA_TOTAL: {
    emoji: "☠️",
    label: "Locura Total",
    description:
      "Te pasas los semáforos, esquivas coches, descensos a toda hostia y alcohol en las venas.",
  },
  MIAUCORNIA: {
    emoji: "🐈🦄",
    label: "Miaucornia",
    description:
      "Siempre cerveza en mano, nadie te gana a patinar pedo. Coges la ruta a mitad de camino para evitar las cuestas. Llegas tarde y persigues la ruta. Te quejas del cansancio y pides un descanso para ir al chino. Bomba de humo.",
  },
} as const;

export type RoutePaceKey = keyof typeof ROUTE_PACE_INFO;
