"use client"; // Indica que este archivo es un Client Component de React (necesario para hooks)
// Importa funciones para crear y consumir contextos en React
import { createContext, useContext } from "react";
// Importa el hook personalizado de sesión de Better Auth
import { useSession } from "@/lib/auth-client";
// Crea el contexto de autenticación, valor inicial undefined
const AuthContext = createContext(undefined);
// Componente proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  // Obtiene la sesión actual usando el hook de Better Auth
  const session = useSession();

  // Provee el valor de sesión a todos los componentes hijos
  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}
// Hook personalizado para consumir el contexto de autenticación
export function useAuth() {
  // Obtiene el valor del contexto
  const context = useContext(AuthContext);
  // Si el contexto no está disponible, lanza un error
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  // Devuelve el valor del contexto (la sesión)
  return context;
}

// "use client";

// import { createContext, useContext } from "react";
// import { useSession } from "@/lib/auth-client";

// const AuthContext = createContext(undefined);

// export function AuthProvider({ children }) {
//   const session = useSession();

//   return (
//     <AuthContext.Provider value={session}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth debe usarse dentro de AuthProvider");
//   }
//   return context;
// }
