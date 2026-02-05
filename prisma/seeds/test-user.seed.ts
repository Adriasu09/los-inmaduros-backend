import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTestUser() {
  console.log("🌱 Creando usuario de prueba...");

  try {
    // Check if it already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: "test-clerk-id-123" },
    });

    if (existingUser) {
      console.log("✅ Usuario de prueba ya existe:", existingUser.id);
      return existingUser;
    }

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        clerkId: "test-clerk-id-123",
        email: "test@losinmaduros.com",
        name: "Usuario de Prueba",
        lastName: "Test",
        imageUrl: "https://i.pravatar.cc/150?img=12",
        role: "USER",
      },
    });

    console.log("✅ Usuario de prueba creado:", testUser.id);
    console.log("📝 Usa este ID en tus requests:", testUser.id);

    return testUser;
  } catch (error) {
    console.error("❌ Error al crear usuario de prueba:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedTestUser();
