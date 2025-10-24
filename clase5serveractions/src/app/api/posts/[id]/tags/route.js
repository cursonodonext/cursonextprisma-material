// Importamos NextResponse para crear respuestas HTTP en Next.js App Router
import { NextResponse } from "next/server";
// Importamos nuestro cliente de Prisma configurado para acceder a la base de datos
import prisma from "@/lib/prisma";

// FUNCIÓN POST: ASOCIA un tag existente a un post específico
// Maneja la relación Many-to-Many (N:M) entre Posts y Tags
export async function POST(request, { params }) {
  // Extrae el ID del post de la URL (ej: /api/posts/3/tags → postId = 3)
  const { id } = await params;
  const postId = Number(id);
  // Extrae el ID del tag del cuerpo de la petición
  // Esperamos: { tagId: 5 }
  const { tagId } = await request.json(); // { tagId }

  // CREAR REGISTRO EN TABLA INTERMEDIA (PostTag)
  // Esto conecta el post con el tag sin duplicar datos
  const updated = await prisma.post.update({
    // WHERE: Encuentra el post al que queremos agregar el tag
    where: { id: postId },
    // DATA: Crea una nueva relación en la tabla PostTag
    data: { 
      postTags: { 
        create: { 
          tagId: Number(tagId) // ✅ Crea entrada: postId=3, tagId=5
        } 
      } 
    },
    // INCLUDE: Devuelve el post actualizado con todos sus tags
    include: { 
      postTags: { 
        include: { 
          tag: true // Datos completos de cada tag asociado
        } 
      } 
    },
  });

  // Devuelve el post actualizado con la nueva asociación
  return NextResponse.json(updated);
}

// FUNCIÓN DELETE: DESASOCIA un tag de un post específico
// NO elimina el tag, solo rompe la relación N:M
export async function DELETE(request, { params }) {
  // Extrae el ID del post de la URL
  const { id } = await params;
  const postId = Number(id);
  // Extrae el ID del tag del cuerpo de la petición
  // Esperamos: { tagId: 5 }
  const { tagId } = await request.json();

  // ELIMINAR REGISTRO EN TABLA INTERMEDIA (PostTag)
  // Usa la clave compuesta para identificar la relación exacta
  await prisma.postTag.delete({
    // WHERE: Busca por la combinación única postId + tagId
    where: { 
      postId_tagId: { 
        postId,                    // ✅ ID del post (ej: 3)
        tagId: Number(tagId)       // ✅ ID del tag (ej: 5)
        // Esto elimina SOLO la entrada: postId=3, tagId=5
      } 
    },
  });
  
  // Confirma que la desasociación fue exitosa
  return NextResponse.json({ message: "Tag desasociado" });
}
