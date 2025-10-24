// Importamos NextResponse para crear respuestas HTTP en Next.js App Router
import { NextResponse } from "next/server";
// Importamos nuestro cliente de Prisma configurado para acceder a la base de datos
import prisma from "@/lib/prisma";

// FUNCIÓN GET: Obtiene UN post específico por su ID
export async function GET(request, { params }) {
  // Extrae el ID de la URL (ej: /api/posts/456 → id = 456)
  // Number() convierte el string a número para usar en Prisma
  const { id } = await params;
  const postId = Number(id);
  
  // Busca UN post específico por su ID único
  const post = await prisma.post.findUnique({
    // WHERE: Condición de búsqueda - encuentra post con este ID
    where: { id: postId },
    // INCLUDE: Trae datos relacionados
    include: { 
      user: true, // ✅ Incluye datos del autor del post (relación N:1)
      // ✅ Incluye todos los tags del post (relación N:M vía PostTag)
      postTags: { 
        include: { 
          tag: true // Datos completos de cada tag asociado
        } 
      } 
    },
  });
  // Envía el post encontrado (o null si no existe) como JSON
  return NextResponse.json(post);
}

// FUNCIÓN PUT: Actualiza UN post específico por su ID
export async function PUT(request, { params }) {
  // Extrae el ID del post a actualizar de la URL
  const { id } = await params;
  const postId = Number(id);
  // Extrae los nuevos datos del cuerpo de la petición
  // Esperamos: { title: "Nuevo título del post" }
  const body = await request.json();
  
  // Actualiza el post existente en la base de datos
  const updated = await prisma.post.update({
    // WHERE: Encuentra el post a actualizar por ID
    where: { id: postId },
    // DATA: Los nuevos datos a guardar
    data: { 
      title: body.title // ✅ Actualiza solo el título del post
    },
  });
  // Envía el post actualizado como respuesta JSON
  return NextResponse.json(updated);
}

// FUNCIÓN DELETE: Elimina UN post específico por su ID
export async function DELETE(request, { params }) {
  // Extrae el ID del post a eliminar de la URL
  const { id } = await params;
  const postId = Number(id);
  
  // Elimina el post de la base de datos
  // NOTA: Esto también eliminará automáticamente:
  // - Todas las relaciones PostTag asociadas (por CASCADE)
  await prisma.post.delete({ where: { id: postId } });
  
  // Envía un mensaje de confirmación
  return NextResponse.json({ message: "Post eliminado" });
}
