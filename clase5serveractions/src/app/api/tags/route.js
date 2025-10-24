// Importamos NextResponse para crear respuestas HTTP en Next.js App RouterA
import { NextResponse } from "next/server";
// Importamos nuestro cliente de Prisma configurado para acceder a la base de datos
import prisma from "@/lib/prisma";

// FUNCIÓN GET: Obtiene TODOS los tags de la base de datos
export async function GET() {
  // TRY-CATCH: Manejo de errores para operaciones de base de datos
  try {
    // Busca todos los tags en la tabla 'Tag'
    const tags = await prisma.tag.findMany({
      // INCLUDE: Estructura anidada compleja para traer datos relacionados
      include: {
        // ✅ Incluye todas las relaciones PostTag de este tag
        postTags: {
          include: {
            // ✅ Para cada PostTag, incluye el Post completo
            post: {
              include: { 
                user: true // ✅ Y el usuario autor de cada post
              },
            },
          },
        },
      },
    });
    // Si todo sale bien, devuelve los tags con toda su información relacionada
    return NextResponse.json(tags);
  } catch (error) {
    // MANEJO DE ERRORES: Si algo falla en la consulta
    console.error("Error fetching tags:", error); // Log del error para debugging
    // Devuelve error HTTP 500 (Internal Server Error)
    return NextResponse.json(
      { error: "Error al obtener tags" },
      { status: 500 }
    );
  }
}

// FUNCIÓN POST: Crea UN nuevo tag
export async function POST(request) {
  // TRY-CATCH: Manejo de errores para la creación
  try {
    // Extrae el nombre del tag del cuerpo de la petición
    // Esperamos: { name: "JavaScript" }
    const { name } = await request.json();

    // VALIDACIÓN: Verifica que el nombre existe y no esté vacío
    if (!name || !name.trim()) {
      // Devuelve error HTTP 400 (Bad Request) si no hay nombre
      return NextResponse.json(
        { error: "Nombre es requerido" },
        { status: 400 }
      );
    }

    // Crea el nuevo tag en la base de datos
    const tag = await prisma.tag.create({
      // DATA: Los datos a insertar
      data: { 
        name: name.trim() // ✅ Guarda el nombre sin espacios al inicio/final
      },
      // INCLUDE: Devuelve el tag creado con sus relaciones
      include: { 
        postTags: true // ✅ Incluye relaciones PostTag (será array vacío para tag nuevo)
      },
    });

    // Devuelve el tag creado exitosamente
    return NextResponse.json(tag);
  } catch (error) {
    // MANEJO DE ERRORES: Si algo falla en la creación
    console.error("Error creating tag:", error); // Log del error para debugging

    // MANEJO ESPECÍFICO: Error de duplicado (unique constraint)
    // P2002 es el código de Prisma para violación de unique constraint
    if (error.code === "P2002") {
      // Devuelve error HTTP 400 si el tag ya existe
      return NextResponse.json({ error: "Tag ya existe" }, { status: 400 });
    }

    // Para cualquier otro error, devuelve error HTTP 500
    return NextResponse.json({ error: "Error al crear tag" }, { status: 500 });
  }
}
