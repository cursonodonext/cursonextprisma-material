import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";

/**
 * GET /api/profile
 * ✅ PROTEGIDO: Cualquier usuario autenticado
 * Retorna información del perfil del usuario actual
 */
async function getProfileHandler(request) {
  // request.session está disponible gracias a withAuth
  const { user } = request.session;

  return NextResponse.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    }
  });
}

// ✅ Proteger: cualquier usuario autenticado (sin especificar roles)
export const GET = withAuth(getProfileHandler);
