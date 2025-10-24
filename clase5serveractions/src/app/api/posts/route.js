// Importamos NextResponse para crear respuestas HTTP en Next.js App Router
import { NextResponse } from "next/server";
// Importamos nuestro cliente de Prisma configurado para acceder a la base de datos
import prisma from "@/lib/prisma";

// FUNCIÓN GET: Obtiene TODOS los posts de la base de datos
export async function GET() {
  // Busca todos los posts en la tabla 'Post'
  const posts = await prisma.post.findMany({
    // INCLUDE: Trae datos relacionados junto con cada post
    include: { 
      user: true, // ✅ Incluye datos del autor del post (relación N:1)
      // ✅ Incluye los tags asociados al post (relación N:M)
      postTags: { 
        include: { 
          tag: true // Datos completos de cada tag
        } 
      } 
    },
  });
  // Convierte el resultado a JSON y lo envía como respuesta HTTP
  return NextResponse.json(posts);
}

// FUNCIÓN POST: Crea UN nuevo post
export async function POST(request) {
  // Extrae el cuerpo de la petición HTTP y lo convierte de JSON a objeto JavaScript
  // Esperamos recibir: { title: "Mi Post", userId: 1 }
  const body = await request.json(); // { title, userId }
  
  // Crea un nuevo post en la base de datos
  const post = await prisma.post.create({
    // DATA: Los datos que se van a insertar
    data: { 
      title: body.title,                    // ✅ Título del post
      userId: Number(body.userId)           // ✅ ID del usuario autor (convertido a número)
    },
    // INCLUDE: Qué datos relacionados devolver en la respuesta
    include: { 
      user: true // ✅ Incluye los datos del usuario que creó el post
    },
  });
  // Envía el post creado (con datos del autor) como respuesta JSON
  return NextResponse.json(post);
}
