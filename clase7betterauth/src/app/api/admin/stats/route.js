import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/stats
 * ✅ PROTEGIDO: Solo admins
 * Retorna estadísticas del sistema
 */
async function getStatsHandler(request) {
  try {
    const [totalUsers, usersByRole, recentUsers] = await Promise.all([
      // Total de usuarios
      prisma.user.count(),
      
      // Usuarios por rol
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      }),
      
      // Últimos 5 usuarios registrados
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      })
    ]);

    // Formatear conteo por rol
    const roleStats = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {});

    return NextResponse.json({
      totalUsers,
      roleStats,
      recentUsers
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}

// ✅ Solo admins pueden ver estadísticas
export const GET = withAuth(getStatsHandler, { 
  roles: ["admin"] 
});
