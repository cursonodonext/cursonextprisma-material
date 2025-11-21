// Importa NextResponse para responder desde rutas API en Next.js
import { NextResponse } from "next/server";
// Importa la instancia de autenticación configurada
import { auth } from "@/lib/auth";
/**
 * Protege rutas API verificando autenticación y roles
 * Uso: export const GET = withAuth(handler, { roles: ['admin'] })
 */
// Recibe un handler (función de ruta) y opciones (roles permitidos)
export function withAuth(handler, options = {}) {
  // Devuelve una función que envuelve el handler original
  return async (request, context) => {
    try {
      // Obtiene la sesión del usuario desde el servidor usando los headers de la request
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      // Si no hay sesión, responde con error 401 (no autenticado)
      if (!session) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      }
      // Si se especificaron roles, verifica que el usuario tenga uno permitido
      if (options.roles && options.roles.length > 0) {
        // Obtiene el rol del usuario, por defecto "user"
        const userRole = session.user.role || "user";
        // Si el rol del usuario no está en la lista de roles permitidos, responde 403
        if (!options.roles.includes(userRole)) {
          return NextResponse.json(
            { error: "No tienes permisos para acceder a este recurso" },
            { status: 403 }
          );
        }
      }
      // Agrega la sesión al request para que el handler pueda usarla
      request.session = session;
      // Llama al handler original pasando la request y el contexto
      return handler(request, context);
    } catch (error) {
      // Si ocurre un error inesperado, responde con error 500
      console.error("Error en withAuth:", error);
      return NextResponse.json(
        { error: "Error de autenticación" },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper para obtener sesión en route handlers
 */
export async function getSessionFromRequest(request) {
  try {
    // Intenta obtener la sesión usando los headers de la request
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return session; // Devuelve la sesión si existe
  } catch (error) {
    return null; // Si hay error, devuelve null
  }
}

/**
 * Helper para verificar si el usuario tiene un rol específico
 */
export function hasRole(session, allowedRoles) {
  // Si no hay usuario en la sesión, devuelve false
  if (!session?.user) return false;
  // Obtiene el rol del usuario, por defecto "user"
  const userRole = session.user.role || "user";
  // Devuelve true si el rol está en la lista de roles permitidos
  return allowedRoles.includes(userRole);
}

// Propósito: Provee funciones para proteger rutas y verificar permisos de usuario.
// Qué hace:
// Exporta withAuth, un wrapper para proteger rutas API, verificando si el usuario está autenticado
//  y si tiene el rol adecuado.
// Incluye helpers para obtener la sesión desde una request y para verificar si un usuario
//  tiene un rol específico.
// Dónde se usa: En rutas API o páginas protegidas para restringir el
//  acceso según autenticación y roles.
