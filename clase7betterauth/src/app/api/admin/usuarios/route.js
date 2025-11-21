import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/stats
 * ✅ PROTEGIDO: Solo admins
 * Retorna estadísticas del sistema
 */
async function getUsersHandler() {
  try {
    const totalUsers = await prisma.user.findMany();

    return NextResponse.json({
      totalUsers,
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
export const GET = withAuth(getUsersHandler, {
  roles: ["admin"],
});
