import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// Inicializar cliente de Prisma para interactuar con la base de datos
const prisma = new PrismaClient();
// Definir cuántos usuarios mostrar por página
const ITEMS_PER_PAGE = 6;
/**
 * GET /api/users
 * Endpoint para obtener usuarios con paginación y búsqueda
 * Parámetros de URL:
 * - query: término de búsqueda (opcional)
 * - page: número de página (opcional, default: 1)
 */
export async function GET(request) {
  try {
    // Extraer parámetros de búsqueda desde la URL
    // Ejemplo: /api/users?query=juan&page=2
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || ""; // Término de búsqueda
    const page = Number(searchParams.get("page")) || 1; // Página actual
    // Calcular cuántos registros saltar para la paginación
    // Ejemplo: página 1 = skip 0, página 2 = skip 6, página 3 = skip 12
    const offset = (page - 1) * ITEMS_PER_PAGE;
    // Construir condición WHERE para filtrar usuarios
    // Si hay query, buscar en name O email (case insensitive)
    // Si no hay query, traer todos los usuarios
    const whereCondition = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } }, // Buscar en nombre
            { email: { contains: query, mode: "insensitive" } }, // Buscar en email
          ],
        }
      : {}; // Sin filtros = todos los usuarios
    // Ejecutar dos consultas en paralelo para optimizar:
    // 1. Obtener usuarios de la página actual
    // 2. Contar total de usuarios que coinciden con la búsqueda
    const [users, totalUsers] = await Promise.all([
      // Query 1: Obtener usuarios paginados
      prisma.users.findMany({
        where: whereCondition, // Aplicar filtros de búsqueda
        select: {
          // Solo seleccionar campos necesarios (optimización)
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          id: "asc", // Ordenar por ID ascendente
        },
        skip: offset, // Saltar registros de páginas anteriores
        take: ITEMS_PER_PAGE, // Tomar solo 6 registros
      }),
      // Query 2: Contar total de usuarios que coinciden
      prisma.users.count({
        where: whereCondition, // Mismos filtros de búsqueda
      }),
    ]);

    // Calcular cuántas páginas totales hay
    // Ejemplo: 10 usuarios / 6 por página = 1.67 -> redondeamos a 2 páginas
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

    // Retornar respuesta JSON con toda la información
    return NextResponse.json({
      users, // Array de usuarios de la página actual
      totalPages, // Número total de páginas
      currentPage: page, // Página actual
      totalUsers, // Total de usuarios encontrados
    });
  } catch (error) {
    // Si algo falla, registrar el error y retornar error 500
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
