// Importamos NextResponse para crear respuestas HTTP en Next.js App Router
import { NextResponse } from "next/server";
// Importamos nuestro cliente de Prisma configurado para acceder a la base de datos
import prisma from "@/lib/prisma";

// FUNCIÓN GET: Obtiene UN tag específico por su ID
export async function GET(request, { params }) {
  // Extrae el ID de la URL de forma asíncrona (Next.js 15 requirement)
  // ej: /api/tags/7 → id = "7"
  const { id } = await params;

  // TRY-CATCH: Manejo de errores para la consulta
  try {
    // Busca UN tag específico por su ID único
    const tag = await prisma.tag.findUnique({
      // WHERE: Condición de búsqueda - encuentra tag con este ID
      // parseInt() convierte el string "7" a número 7
      where: { id: parseInt(id) },
      // INCLUDE: Estructura anidada para traer datos relacionados
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

    // VALIDACIÓN: Verifica si el tag existe
    if (!tag) {
      // Devuelve error HTTP 404 (Not Found) si no existe
      return NextResponse.json({ error: "Tag no encontrado" }, { status: 404 });
    }

    // Si existe, devuelve el tag con toda su información relacionada
    return NextResponse.json(tag);
  } catch (error) {
    // MANEJO DE ERRORES: Si algo falla en la consulta
    console.error("Error fetching tag:", error); // Log del error para debugging
    // Devuelve error HTTP 500 (Internal Server Error)
    return NextResponse.json(
      { error: "Error al obtener el tag" },
      { status: 500 }
    );
  }
}

// FUNCIÓN DELETE: Elimina UN tag específico por su ID COMPLETAMENTE
export async function DELETE(request, { params }) {
  // Extrae el ID del tag a eliminar de la URL
  const { id } = await params;

  // TRY-CATCH: Manejo de errores para la eliminación
  try {
    // PASO 1: Verificar si el tag existe antes de eliminarlo
    const existingTag = await prisma.tag.findUnique({
      // WHERE: Busca el tag por ID
      where: { id: parseInt(id) },
      // INCLUDE: Incluye las relaciones para saber cuántos posts lo usan
      include: { postTags: true },
    });

    // VALIDACIÓN: Si el tag no existe
    if (!existingTag) {
      // Devuelve error HTTP 404 (Not Found)
      return NextResponse.json({ error: "Tag no encontrado" }, { status: 404 });
    }

    // PASO 2: Eliminar el tag de la base de datos
    // IMPORTANTE: Las relaciones PostTag se eliminan automáticamente por CASCADE
    // Esto significa que si el tag "JavaScript" se elimina, todas las conexiones
    // Post-JavaScript también se eliminan, pero los Posts quedan intactos
    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });

    // Confirma que la eliminación fue exitosa
    return NextResponse.json({ message: "Tag eliminado correctamente" });
  } catch (error) {
    // MANEJO DE ERRORES: Si algo falla en la eliminación
    console.error("Error deleting tag:", error); // Log del error para debugging
    // Devuelve error HTTP 500 (Internal Server Error)
    return NextResponse.json(
      { error: "Error al eliminar el tag" },
      { status: 500 }
    );
  }
}
