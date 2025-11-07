import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Crear usuarios de ejemplo
    const usersToCreate = [
      { name: "Juan Pérez", email: "juan@example.com", password: "password123" },
      { name: "María García", email: "maria@example.com", password: "password123" },
      { name: "Carlos López", email: "carlos@example.com", password: "password123" },
      { name: "Ana Martínez", email: "ana@example.com", password: "password123" },
      { name: "Luis Rodríguez", email: "luis@example.com", password: "password123" },
      { name: "Sofia Torres", email: "sofia@example.com", password: "password123" },
      { name: "Pedro Sánchez", email: "pedro@example.com", password: "password123" },
      { name: "Laura Ramírez", email: "laura@example.com", password: "password123" },
      { name: "Diego Flores", email: "diego@example.com", password: "password123" },
      { name: "Carmen Castro", email: "carmen@example.com", password: "password123" },
    ];

    const createdUsers = [];
    
    for (const userData of usersToCreate) {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.users.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await prisma.users.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
          },
        });
        createdUsers.push(user);
      }
    }

    return NextResponse.json({
      message: "Seed completed successfully",
      created: createdUsers.length,
      users: createdUsers,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
