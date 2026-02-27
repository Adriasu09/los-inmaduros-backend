import { PrismaClient, RouteLevel } from "@prisma/client";

const prisma = new PrismaClient();

// Function to map old levels to new ones
function mapLevel(oldLevel: string): RouteLevel {
  const levelMap: Record<string, RouteLevel> = {
    Básico: "BEGINNER",
    Medio: "INTERMEDIATE",
    Avanzado: "ADVANCED",
    Experto: "EXPERT",
  };

  return levelMap[oldLevel] || "INTERMEDIATE";
}

// Function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const routesData = [
  {
    name: "Héroes",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/heroes.webp",
    approximateDistance: "18 km",
    description:
      "Callejea por Madrid como solo los que dominan sus patines saben hacerlo. La ruta Héroes te lleva por las calles de la ciudad en una travesía fluida y adrenalínica, con largos tramos de suave bajada que te permiten coger velocidad y sentirte dueño del asfalto. Todo culmina en la mítica Cuesta de la Vega: una bajada pronunciada junto al Palacio Real donde la velocidad se dispara y el pulso se acelera. Esta es la ruta de los que patina sin miedo.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1KPK-bbn08C-m3Mb62pWiDUomDCSl7mE&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Súper héroes",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/superheroe.jpg",
    approximateDistance: "20 km",
    description:
      "La versión extendida de la ruta Héroes, para los que quieren más. Arranca en Arganzuela y se adentra en el corazón de Madrid, trazando un recorrido épico que te lleva por el centro histórico, bordea la majestuosa Puerta de Alcalá, roza el Retiro y atraviesa Chamberí antes de volver al punto de partida. Más kilómetros, más ciudad, más adrenalina. Una ruta que exige control, buen frenado en zonas de tráfico y ganas de comerte Madrid sobre ruedas.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1YcrpGJz5BLutYewAFdGDoGC7MueexYw&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Clásica",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/clasica.webp",
    approximateDistance: "16 km",
    description:
      "La ruta que lo tiene todo. Arranca en el centro de Madrid, asciende por Chamberí hasta alcanzar la Dehesa de la Villa — donde llega el momento que todos esperan: una bajada larga, pronunciada y vertiginosa entre pinos que te pone a prueba de verdad. Después el recorrido continúa bordeando el mítico Templo de Debod y el Parque del Oeste antes de cerrar el bucle de vuelta al centro. No es una ruta para calentarse las piernas — es una ruta para quienes ya saben lo que hacen sobre el asfalto. Lleva luces, lleva protecciones y lleva ganas de volarla.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1h_BwKj1VDwFl8l3sZkBzq4JIiFI_Sds&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Queen",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/queen.webp",
    approximateDistance: "12 km",
    description:
      "Una ruta para saborear Madrid sin prisa. Arranca en la majestuosa Puerta de Alcalá y se adentra por los barrios de Salamanca y El Viso, zonas de las más elegantes de la ciudad, hasta alcanzar Cuatro Caminos antes de volver al punto de partida. Combina tramos de carril bici con carretera en una mezcla perfecta para patinadores de nivel medio que buscan disfrutar del recorrido tanto como de la compañía. Aquí no se viene a correr — se viene a patinar con estilo.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1qptdLKd01l_wmlA9B4R9XjG_SbEXQBY&ehbc=2E312F&noprof=1",
    level: ["Básico", "Medio"],
  },
  {
    name: "El calamar",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/calamar.jpg",
    approximateDistance: "14 km",
    description:
      "Madrid sabe mejor sobre ruedas. Esta ruta de nivel medio arranca en Arganzuela y te lleva a callejear por el corazón de la ciudad, pasando por la Puerta de Alcalá, Salamanca y el Museo del Prado antes de descender hacia el centro histórico. Pero el momento cumbre llega cuando el grupo para en la Plaza Mayor para hacerse con el bocadillo de calamares de rigor, y lo devora sentado frente a la Catedral de la Almudena con el Palacio Real de fondo. Cultura, asfalto y rebozado — la combinación perfecta.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1vQ_lOqqvR1UjxjejpSHmbaeyoRrmQiU&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "Arcade",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/arcade.webp",
    approximateDistance: "18 km",
    description:
      "Una ruta con historia y con kilómetros de sobra. La Arcade nació con un final legendario: una cerveza en el bar Arcade del centro de Madrid. Hoy el destino ha cambiado, pero la ruta sigue siendo igual de cañera. Arranca en la Puerta de Alcalá y traza un largo recorrido por el norte de Madrid — Salamanca, la Movistar Arena, El Viso, el Bernabéu, Chamartín y Tetuán — antes de volver al punto de inicio. Todo asfalto, todo fluidez, todo velocidad. Para patinadores de nivel medio-avanzado que quieren sentir Madrid bajo las ruedas durante mucho tiempo.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1jn_UxYOYkPzZAjzy4bRJSZTOrlUtG6w&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "Anillo ciclista",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/anillo.webp",
    approximateDistance: "55 km",
    description:
      "No es una ruta. Es una prueba de fuego. El Anillo Ciclista es la hazaña que separa a los patinadores de los leyendas — 55 kilómetros rodeando Madrid casi por completo, arrancando desde la Explanada del Matadero, nuestra casa. Hortaleza, Fuencarral, Moncloa, el sur... kilómetro tras kilómetro de carril bici con cuestas que suben y bajan sin piedad. Y por si fuera poco, cada vez que se convoca puede ser en sentido horario o antihorario — porque aquí ni el camino es siempre el mismo. Pocos en el grupo pueden decir que la han completado. ¿Tú te atreves?",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1y31XfqHU-xc3t5w-gbgZH-Zzuuee8lE&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "La leyenda",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/leyenda.webp",
    approximateDistance: "25 km",
    description:
      "Hay rutas y hay leyendas. Esta es de las segundas. Arranca en el Matadero, se adentra en el corazón de Madrid y lo que viene después es pura oscuridad, velocidad y adrenalina: una sucesión de túneles urbanos donde el sonido de las ruedas retumba en las paredes y la velocidad se dispara. Cada túnel es un momento único — la luz al fondo, el rugido del asfalto, el pulso a tope. Una ruta solo para patinadores con autonomía total y control absoluto sobre sus patines. No apta para corazones débiles.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1U-Fy08xRQySKsx0BIOwK99AmFgponNU&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "Vladi",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/vladi.webp",
    approximateDistance: "24 km",
    description:
      "La Vladi tiene trampa — y todo el grupo lo sabe. Un recorrido fluido que bordea el Retiro, se estira hacia el este hasta el Estadio Metropolitano y regresa cerrando el bucle. Suena tranquila, ¿verdad? Hasta que llegas al Parque Roma y toca hacer lo impensable: subir la cuesta por el césped, con los patines puestos. Ese momento define la ruta. A ritmo suave es una aventura divertida, a ritmo fuerte es un reto de verdad. No es para principiantes — es para los que ya no le tienen miedo a nada.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1yvRmTC9RW0hfR5fenaVmxXCe-FYWCew&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
  {
    name: "4 Torres",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/4torres.webp",
    approximateDistance: "29 km",
    description:
      "Madrid tiene un skyline y esta ruta te lleva hasta él. Las 4 Torres se ven desde lejos pero llegar hasta ellas hay que ganárselo — el recorrido sube hacia la Puerta de Alcalá y desde allí se lanza por el imponente Paseo de la Castellana, uno de los ejes más icónicos de Madrid, hasta plantarte frente a los cuatro rascacielos más altos de la ciudad. Un momento épico que recompensa cada kilómetro de esfuerzo. Y lo que sube, baja — las bajadas de vuelta son pura adrenalina. Con casi 30km en las piernas, esta ruta no perdona, pero tampoco se olvida.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1eTZzWhQz93cWZL2jYHt7MNDn68hRwxs&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "Dora",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/dora.jpg",
    approximateDistance: "18 km",
    description:
      "Dora explora — y tú con ella. Esta ruta te lleva por el Madrid más accidentado, con cuestas que aparecen cuando menos te lo esperas y bajadas que te recompensan con velocidad pura. El recorrido atraviesa el centro histórico, bordea la Puerta de Alcalá, el Parque del Oeste y el mítico Templo de Debod en una vuelta cargada de subidas y bajadas que ponen a prueba las piernas y el control. No hay tramos para descansar — aquí o dominas los patines o los patines te dominan a ti. Solo para avanzados.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1TNnJJTb_ATRn8OQzpMCKMI4ZEkFz7ro&ehbc=2E312F&noprof=1",
    level: ["Avanzado"],
  },
  {
    name: "Caracolera",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/caracolera.jpeg",
    approximateDistance: "12 km",
    description:
      "La cita de los domingos. La Caracolera es la ruta sagrada del grupo — la que nunca falla, la que siempre convoca, la que une a los que llevan años patinando con los que se calzan los patines por primera vez. El recorrido fluye tranquilamente por el Madrid Río, uno de los espacios más bonitos y seguros de la ciudad, sin tráfico y rodeado de naturaleza urbana. Se va despacio, se hacen paradas para reagruparse y beber agua, y los más experimentados siempre están ahí para echar una mano en las bajadas. Aquí no importa tu nivel — importa que vengas. Para niños, familias, principiantes y veteranos con ganas de disfrutar sin prisa. Lleva casco, protecciones, agua y buen humor.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1cBsMyC0Dp-fURJvEatHCKnvI17KfiHw&ehbc=2E312F&noprof=1",
    level: ["Básico", "Medio"],
  },
  {
    name: "Madrid central",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/madrid_central.webp",
    approximateDistance: "10 km",
    description:
      "Los miércoles por la noche, Madrid es nuestra. La Madrid Central es la ruta perfecta para dar el salto de los carriles del río a las calles de la ciudad — sin prisas, sin tráfico y con todo el grupo acompañándote. El recorrido te lleva por el corazón de Madrid, desde la Puerta de Alcalá por Salamanca y El Viso hasta Cuatro Caminos, descubriendo la ciudad de noche sobre ruedas. Los más avanzados marcan el ritmo, los más básicos aprenden el camino, y nadie se queda atrás. Para familias, niños, principiantes y veteranos que simplemente quieren disfrutar. Lleva casco, protecciones y agua — y muchas ganas de pasarlo bien.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1Bi8uD7pZsmez4wXMzhS4PXlOr4XJuXc&ehbc=2E312F&noprof=1",
    level: ["Básico", "Medio"],
  },
  {
    name: "Los 40",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/los40.webp",
    approximateDistance: "14 km",
    description:
      "Una ruta con historia y con actitud. Los 40 nació cuando todos los que la crearon tenían más de 40 años — y eso dice mucho de su espíritu: gente con experiencia, con ganas de disfrutar y sin necesidad de demostrar nada. El recorrido de unos 14km mezcla el carril bici del Madrid Río con tramos por las calles de la ciudad, pasando por el Templo de Debod y el Parque del Oeste. Ni demasiado fácil ni demasiado exigente — la ruta perfecta para patinadores con experiencia que quieren pasarlo bien sin matarse. La edad es solo un número, pero el estilo es para siempre.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1cKrGgyzWyhQv2W8Ds_H5Wmljcs_O1fE&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "Los poblados",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/poblados.webp",
    approximateDistance: "14 km",
    description:
      "El Madrid que no siempre ves desde el centro. La ruta Los Poblados se escapa hacia el sur, recorriendo los barrios más auténticos y con más carácter de la ciudad — Usera, Arganzuela, los parques del sur — todo por carril bici, sin tráfico y a un ritmo que invita a mirar alrededor. Un recorrido fluido y continuo para patinadores con autonomía que quieren descubrir otra cara de Madrid sobre ruedas. Sin prisa, sin estrés — solo patines, asfalto y los barrios de verdad.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1pN616xk2ZJZePv6VsT4YeipbyxAX-KE&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "La horchata",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/horchata.webp",
    approximateDistance: "15 km",
    description:
      "Hay rutas que alimentan el cuerpo y el alma. La Horchata te lleva callejeando por Madrid, subiendo desde el Matadero hacia el Parque del Oeste y el mítico Templo de Debod, hasta llegar a Moncloa — donde el grupo hace una parada obligatoria para tomarse una horchata bien fría antes de continuar. Porque sí, hay que ganársela. El regreso baja por Chamberí y la Puerta de Alcalá completando un recorrido de nivel medio que combina paisajes icónicos de Madrid con ese momento de descanso compartido que lo convierte en algo más que una ruta. Es una experiencia.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1MWmEtXzG07A1CVSBTSFXhikEikFmMOc&ehbc=2E312F&noprof=1",
    level: ["Medio"],
  },
  {
    name: "The prince",
    image:
      "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/prince.webp",
    approximateDistance: "20 km",
    description:
      "Si la Queen es la ruta para disfrutar, The Prince es la ruta para demostrar. Comparten espíritu pero The Prince sube la apuesta con un recorrido más amplio y más exigente. Desde el Matadero sube hacia la Puerta de Alcalá, asciende a Cuatro Caminos, y regresa bordeando el Parque del Oeste antes de cerrar el bucle. A ritmo suave es una ruta divertida y fluida; a ritmo fuerte es un auténtico reto técnico. Tú decides cómo la quieres vivir — pero aquí el asfalto no perdona a los que no saben frenar.",
    mapEmbedUrl:
      "https://www.google.com/maps/d/u/3/embed?mid=1_l0RTgRwkPvM-xv8xKOy0QqJOnrK4C0&ehbc=2E312F&noprof=1",
    level: ["Medio", "Avanzado"],
  },
];

async function seedRoutes() {
  console.log("🌱 Iniciando seed de rutas...");

  try {
    // Delete existing routes (optional, for development only)
    await prisma.route.deleteMany();
    console.log("🗑️  Rutas anteriores eliminadas");

    // Insert the 17 routes
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

seedRoutes();
