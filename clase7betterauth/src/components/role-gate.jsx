"use client";

// Importa el hook para obtener la sesión del usuario autenticado
import { useSession } from "@/lib/auth-client";

// Componente que restringe el acceso a sus hijos según el rol del usuario
export default function RoleGate({ children, allowedRoles = [] }) {
  // Obtiene la sesión actual del usuario
  const { data: session } = useSession();

  // Si no hay usuario autenticado, no muestra nada
  if (!session?.user) {
    return null;
  }

  // Si se especifican roles permitidos y el usuario no tiene uno de ellos, no muestra nada
  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return null;
  }

  // Si pasa las validaciones, renderiza los hijos
  return <>{children}</>;
}