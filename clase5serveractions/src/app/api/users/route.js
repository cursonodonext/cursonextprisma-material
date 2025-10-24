// Importamos NextResponse para crear respuestas HTTP en Next.js App Router
import { NextResponse } from "next/server";
// Importamos nuestro cliente de Prisma configurado para acceder a la base de datos
import prisma from "@/lib/prisma";

// FUNCIÓN GET: Obtiene TODOS los usuarios de la base de datos
export async function GET() {
  // Busca todos los usuarios en la tabla 'User'
  const users = await prisma.user.findMany({
    // INCLUDE: Trae datos relacionados junto con cada usuario
    include: { 
      profile: true, // ✅ Incluye el perfil del usuario (relación 1:1)
      posts: true    // ✅ Incluye todos los posts del usuario (relación 1:N)
    },
  });
  // Convierte el resultado a JSON y lo envía como respuesta HTTP
  return NextResponse.json(users);
}

// FUNCIÓN POST: Crea UN nuevo usuario (y opcionalmente su perfil)
export async function POST(request) {
  // Extrae el cuerpo de la petición HTTP y lo convierte de JSON a objeto JavaScript
  // Esperamos recibir: { email: "usuario@email.com", bio: "Mi biografía" }
  const body = await request.json(); // { email, bio }
  
  // Crea un nuevo usuario en la base de datos
  const user = await prisma.user.create({
    // DATA: Los datos que se van a insertar
    data: {
      // CAMPO OBLIGATORIO: Siempre se crea con el email recibido
      email: body.email,
      // CAMPO CONDICIONAL: Solo crea perfil si existe 'bio'
      // Si body.bio tiene contenido → { create: { bio: body.bio } }
      // Si body.bio está vacío/undefined → undefined (no crea perfil)
      profile: body.bio ? { create: { bio: body.bio } } : undefined,
    },
    // INCLUDE: Qué datos relacionados devolver en la respuesta
    include: { 
      profile: true, // ✅ Devuelve el perfil creado (o null si no se creó)
      posts: true    // ✅ Devuelve los posts (será array vacío para usuario nuevo)
    },
  });
  // Envía el usuario creado (con perfil y posts) como respuesta JSON
  return NextResponse.json(user);
}
