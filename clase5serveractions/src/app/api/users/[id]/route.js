// Importamos NextResponse para crear respuestas HTTP en Next.js App Router
import { NextResponse } from "next/server";
// Importamos nuestro cliente de Prisma configurado para acceder a la base de datos
import prisma from "@/lib/prisma";

// FUNCIÓN GET: Obtiene UN usuario específico por su ID
export async function GET(request, { params }) {
  // Extrae el ID de la URL (ej: /api/users/123 → id = 123)
  // Number() convierte el string a número para usar en Prisma
  const { id } = await params;
  const userId = Number(id);
  
  // Busca UN usuario específico por su ID único
  const user = await prisma.user.findUnique({
    // WHERE: Condición de búsqueda - encuentra usuario con este ID
    where: { id: userId },
    // INCLUDE: Trae datos relacionados con estructura anidada
    include: {
      profile: true, // ✅ Incluye el perfil del usuario (relación 1:1)
      // ✅ Incluye posts con sus tags (relación 1:N → N:M)
      posts: { 
        include: { 
          postTags: { // Tabla intermedia Post-Tag
            include: { 
              tag: true // Datos del tag real
            } 
          } 
        } 
      },
    },
  });
  // Envía el usuario encontrado (o null si no existe) como JSON
  return NextResponse.json(user);
}

// FUNCIÓN PUT: Actualiza UN usuario específico por su ID
export async function PUT(request, { params }) {
  // Extrae el ID del usuario a actualizar de la URL
  const { id } = await params;
  const userId = Number(id);
  // Extrae los nuevos datos del cuerpo de la petición
  // Esperamos: { email: "nuevo@email.com", bio: "Nueva bio" }
  const body = await request.json(); // { email, bio }

  // Actualiza el usuario existente en la base de datos
  const updated = await prisma.user.update({
    // WHERE: Encuentra el usuario a actualizar por ID
    where: { id: userId },
    // DATA: Los nuevos datos a guardar
    data: {
      // ACTUALIZACIÓN SIMPLE: Siempre actualiza el email
      email: body.email,
      // ACTUALIZACIÓN CONDICIONAL: Solo si bio está definido
      profile:
        body.bio !== undefined // ¿Se envió el campo bio?
          ? {
              // UPSERT: UPDATE si existe, CREATE si no existe
              upsert: {
                create: { bio: body.bio }, // Si no tiene perfil → créalo
                update: { bio: body.bio }, // Si ya tiene perfil → actualízalo
              },
            }
          : undefined, // Si no se envió bio → no tocar el perfil
    },
    // INCLUDE: Devuelve el usuario actualizado con su perfil
    include: { profile: true },
  });

  // Envía el usuario actualizado como respuesta JSON
  return NextResponse.json(updated);
}

// FUNCIÓN DELETE: Elimina UN usuario específico por su ID
export async function DELETE(request, { params }) {
  // Extrae el ID del usuario a eliminar de la URL
  const { id } = await params;
  const userId = Number(id);
  
  // Elimina el usuario de la base de datos
  // NOTA: Esto también eliminará automáticamente:
  // - Su perfil (por CASCADE en la base de datos)
  // - Sus posts (por CASCADE en la base de datos)
  await prisma.user.delete({ where: { id: userId } });
  
  // Envía un mensaje de confirmación
  return NextResponse.json({ message: "Usuario eliminado" });
}
