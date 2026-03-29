import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// Mapping: GPX filename → route slug in the database
const GPX_TO_SLUG: Record<string, string> = {
  "heroes.gpx": "heroes",
  "superhéroes .gpx": "super-heroes",
  "clasica.gpx": "clasica",
  "queen.gpx": "queen",
  "calamar.gpx": "el-calamar",
  "arcade.gpx": "arcade",
  "anilloCiclista.gpx": "anillo-ciclista",
  "leyenda.gpx": "la-leyenda",
  "vladi.gpx": "vladi",
  "4torres.gpx": "4-torres",
  "dora.gpx": "dora",
  "caracolera.gpx": "caracolera",
  "caracoleraCentral.gpx": "madrid-central",
  "los40.gpx": "los-40",
  "poblados.gpx": "los-poblados",
  "horchata.gpx": "la-horchata",
  "prince.gpx": "the-prince",
};

const GPX_DIR = path.join(__dirname, "gpx");
const BUCKET = "gpx-files";
const FOLDER = "routes";

async function uploadGpxFiles() {
  console.log("📍 Subiendo archivos GPX a Supabase...\n");

  const files = fs.readdirSync(GPX_DIR);
  let uploaded = 0;
  let errors = 0;

  for (const filename of files) {
    if (!filename.endsWith(".gpx")) continue;

    const slug = GPX_TO_SLUG[filename];
    if (!slug) {
      console.log(`⚠️  Sin mapeo para: ${filename} — saltando`);
      errors++;
      continue;
    }

    // Check route exists in DB
    const route = await prisma.route.findUnique({ where: { slug } });
    if (!route) {
      console.log(`❌ Ruta no encontrada en DB: ${slug} — saltando`);
      errors++;
      continue;
    }

    // Read GPX file
    const filePath = path.join(GPX_DIR, filename);
    const buffer = fs.readFileSync(filePath);

    // Upload to Supabase Storage with the slug as filename for consistency
    const storagePath = `${FOLDER}/${slug}.gpx`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: "application/xml",
        upsert: true,
      });

    if (error) {
      console.log(`❌ Error subiendo ${filename}: ${error.message}`);
      errors++;
      continue;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

    // Update route in database
    await prisma.route.update({
      where: { slug },
      data: { gpxFileUrl: publicUrl },
    });

    console.log(`✅ ${filename} → ${slug} → ${publicUrl}`);
    uploaded++;
  }

  console.log(`\n🎉 Resultado: ${uploaded} subidos, ${errors} errores`);
}

uploadGpxFiles()
  .catch((err) => {
    console.error("❌ Error fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
