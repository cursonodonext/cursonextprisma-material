"use client";

// Importa hooks de React y Next.js para navegación y sesión
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// Componente que protege rutas, redirigiendo si el usuario no cumple requisitos
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  // Obtiene la sesión y el estado de carga
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Efecto que verifica autenticación y rol, y redirige si no cumple
  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        // Si no está autenticado, redirige a login
        router.push("/auth/login");
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
        // Si no tiene el rol adecuado, redirige a "no autorizado"
        router.push("/auth/unauthorized");
      }
    }
  }, [session, isPending, router, allowedRoles]);

  // Mientras se verifica la sesión, muestra un loader
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no tiene el rol, no muestra nada (por si el efecto aún no redirigió)
  if (!session?.user) {
    return null;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return null;
  }

  // Si pasa las validaciones, renderiza los hijos
  return <>{children}</>;
}