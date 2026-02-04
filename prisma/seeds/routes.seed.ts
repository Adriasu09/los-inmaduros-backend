import { PrismaClient, RouteLevel } from "@prisma/client";

const prisma = new PrismaClient();

// Función para mapear niveles antiguos a nuevos
function mapLevel(oldLevel: string): RouteLevel {
  const levelMap: Record<string, RouteLevel> = {
    Básico: "BEGINNER",
    Medio: "INTERMEDIATE",
    Avanzado: "ADVANCED",
    Experto: "EXPERT",
  };

  return levelMap[oldLevel] || "INTERMEDIATE";
}

// Función para generar slug desde el nombre
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-"); // Múltiples guiones a uno
}

const routesData = [
  {
    name: "Héroes",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725625559/heroes_v7ek75.webp",
    approximateDistance: "18 km",
    description:
      "Ruta muy disfrutable, con muchos kilómetros de suave bajada, hasta llegar a cuesta de la vega, donde la cosa se pone interesante.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1KPK-bbn08C-m3Mb62pWiDUomDCSl7mE&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Súper héroes",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725643834/superHeroe_hgjpdi.jpg",
    approximateDistance: "20 km",
    description:
      "Ideal para patinadores con experiencia, ya que requiere buen control de los patines y habilidad para frenar en zonas de tráfico. Disfruta de una mezcla de paisajes urbanos mientras desafías tu técnica.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1YcrpGJz5BLutYewAFdGDoGC7MueexYw&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Clásica",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725641914/clasica_oa3z5r.jpg",
    approximateDistance: "16 km",
    description:
      "La ruta discurre por asfalto, se recomiendan protecciones y luces. Cada uno es responsable de su seguridad.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1h_BwKj1VDwFl8l3sZkBzq4JIiFI_Sds&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Queen",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725641936/queen_ukc44v.webp",
    approximateDistance: "12 km",
    description:
      "Esta ruta mezcla tramos de carril bici y carretera, diseñada para patinadores con experiencia intermedia. Es ideal para pasar un buen rato, combinando la tranquilidad del carril bici con la emoción de la carretera, requiriendo cierta autonomía y habilidad para mantener el control en diferentes entornos.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1qptdLKd01l_wmlA9B4R9XjG_SbEXQBY&ehbc=2E312F&noprof=1",
    level: ["Básico", "Medio"],
  },
  {
    name: "El calamar",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725643085/calamar_mtjdnd.png",
    approximateDistance: "14 km",
    description:
      "Explora las calles de Madrid en una ruta que combina el placer de callejear con una parada deliciosa en el Palacio Real para disfrutar de un bocadillo de calamares. Una experiencia completa para patinadores con autonomía, antes de continuar el recorrido.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1vQ_lOqqvR1UjxjejpSHmbaeyoRrmQiU&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "Arcade",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725641900/arcade_tatihp.webp",
    approximateDistance: "18 km",
    description:
      "Una ruta de mayor distancia diseñada para patinadores con autonomía y confianza en carretera. Toda la ruta transcurre por asfalto, lo que permite un patinaje fluido y sostenido. Recomendado para quienes buscan velocidad y adrenalina en un entorno urbano.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1jn_UxYOYkPzZAjzy4bRJSZTOrlUtG6w&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Anillo ciclista",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725643995/anillo_vupoov.jpg",
    approximateDistance: "55 km",
    description:
      "Ruta de larga distancia por carril bici, para los patinadores con más fondo. Vuelta completa al anillo ciclista de Madrid.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1y31XfqHU-xc3t5w-gbgZH-Zzuuee8lE&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "La leyenda",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725644041/leyenda_ytlabu.png",
    approximateDistance: "25 km",
    description:
      "Una emocionante ruta por carretera que incluye los mejores túneles de la ciudad. Perfecta para patinadores con control en bajadas y búsqueda de adrenalina. Disfruta de la velocidad en un entorno único, ideal para quienes tienen autonomía total sobre sus patines.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1U-Fy08xRQySKsx0BIOwK99AmFgponNU&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "Vladi",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725806831/vladi2_y288jd.jpg",
    approximateDistance: "24 km",
    description:
      "Una ruta de mayor distancia diseñada para patinadores con autonomía y confianza en carretera. Toda la ruta transcurre por asfalto, lo que permite un patinaje fluido y sostenido. Recomendado para quienes buscan velocidad y adrenalina en un entorno urbano.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1yvRmTC9RW0hfR5fenaVmxXCe-FYWCew&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "4 Torres",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725644277/4torres_jfxqwc.jpg",
    approximateDistance: "29 km",
    description:
      "Ideal para patinadores con resistencia y control. Subidas largas y bajadas emocionantes, se requiere autonomía y capacidad para manejar terrenos inclinados.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1eTZzWhQz93cWZL2jYHt7MNDn68hRwxs&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "Dora",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725644322/dora_dzorr6.png",
    approximateDistance: "18 km",
    description:
      "Diseñada para patinadores con fondo y resistencia, esta ruta por carretera desafía con buenas subidas y premia con emocionantes bajadas. Requiere autonomía completa para disfrutar al máximo de este recorrido exigente.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1TNnJJTb_ATRn8OQzpMCKMI4ZEkFz7ro&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "Caracolera",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725461058/caracolera_nflj2d.jpg",
    approximateDistance: "12 km",
    description:
      "Ruta apta para niños y todo aquel que tenga ganas de divertirse. Se hace a ritmo tranquilo y se ayudará a quien lo necesite en las bajadas. Se hacen paradas para reagrupar y beber agua. Recomendamos llevar protecciones, casco y agua.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1cBsMyC0Dp-fURJvEatHCKnvI17KfiHw&ehbc=2E312F&noprof=1",
    level: ["Básico", "Medio"],
  },
  {
    name: "Madrid central",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1736343788/madrid_central_regg2d.jpg",
    approximateDistance: "10 km",
    description:
      "Una ruta ideal para niños y cualquier persona con ganas de divertirse, recorriendo el centro de Madrid a un ritmo tranquilo. Se ofrecen paradas para reagrupamiento y beber agua, con apoyo en las bajadas para quienes lo necesiten. Es recomendable llevar protecciones, casco y agua para disfrutar con seguridad.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1Bi8uD7pZsmez4wXMzhS4PXlOr4XJuXc&ehbc=2E312F&noprof=1",
    level: ["Básico", "Medio"],
  },
  {
    name: "Los 40",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725644447/los40_i6dgi7.jpg",
    approximateDistance: "14 km",
    description:
      "Esta ruta de distancia media combina carril bici y tramos de carretera. Ideal para patinadores con experiencia, ya que requiere buen control de los patines y habilidad para frenar en zonas de tráfico. Disfruta de una mezcla de paisajes urbanos mientras desafías tu técnica.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1cKrGgyzWyhQv2W8Ds_H5Wmljcs_O1fE&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "Los poblados",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725641929/poblados_frlyhg.jpg",
    approximateDistance: "14 km",
    description:
      "Esta ruta sigue exclusivamente el carril bici, perfecta para un patinaje relajado pero continuo. Ideal para disfrutar del entorno mientras mantienes un buen ritmo, sin preocuparte por el tráfico vehicular.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1pN616xk2ZJZePv6VsT4YeipbyxAX-KE&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "La horchata",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725643078/horchata_pchz6v.png",
    approximateDistance: "15 km",
    description:
      "Una ruta urbana por carretera pensada para disfrutar del entorno mientras callejeas. Perfecta para explorar la ciudad a un ritmo relajado, con una parada estratégica para saborear una refrescante horchata antes de continuar la aventura sobre ruedas.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1MWmEtXzG07A1CVSBTSFXhikEikFmMOc&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "The prince",
    image:
      "https://res.cloudinary.com/dj4j3uoia/image/upload/v1725643070/prince_u1kicp.png",
    approximateDistance: "20 km",
    description:
      "Nivel medio-avanzado, perfecta para quienes dominan cuestas y frenado. Recorrido urbano con cuestas moderadas, ideal para perfeccionar técnica y disfrutar del entorno.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1_l0RTgRwkPvM-xv8xKOy0QqJOnrK4C0&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
];

async function seedRoutes() {
  console.log("🌱 Iniciando seed de rutas...");

  try {
    // Borrar rutas existentes (opcional, solo para desarrollo)
    await prisma.route.deleteMany();
    console.log("🗑️  Rutas anteriores eliminadas");

    // Insertar las 17 rutas
    for (const route of routesData) {
      const slug = generateSlug(route.name);
      const levels = route.level.map(mapLevel);

      await prisma.route.create({
        data: {
          name: route.name,
          slug,
          image: route.image,
          approximateDistance: route.approximateDistance,
          description: route.description,
          mapEmbedUrl: route.mapEmbedUrl,
          level: levels,
        },
      });

      console.log(`✅ Ruta creada: ${route.name} (${slug})`);
    }

    console.log(`\n🎉 ${routesData.length} rutas insertadas exitosamente!`);
  } catch (error) {
    console.error("❌ Error al insertar rutas:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed
seedRoutes();
