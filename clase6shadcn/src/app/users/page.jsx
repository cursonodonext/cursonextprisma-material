import UsersTable from "@/components/users-table";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Función helper para obtener el total de páginas
 * Se ejecuta en el servidor antes de renderizar la página
 * Hace una llamada a la API para saber cuántas páginas hay
 * 
 * @param {string} query - Término de búsqueda actual
 * @returns {number} - Número total de páginas
 */
async function getTotalPages(query) {
  try {
    // Hacer request a la API para obtener info de paginación
    const res = await fetch(
      `http://localhost:3000/api/users?query=${query}&page=1`,
      {
        cache: "no-store", // No cachear para obtener datos actualizados
      }
    );
    const data = await res.json();
    return data.totalPages || 1; // Retornar totalPages o 1 por default
  } catch (error) {
    console.error("Error:", error);
    return 1; // Si falla, asumir 1 página
  }
}

/**
 * Página principal (Server Component)
 * Esta es una página dinámica que lee parámetros de la URL
 * Next.js la re-renderiza automáticamente cuando cambian los searchParams
 * 
 * @param {Object} searchParams - Parámetros de la URL (?query=juan&page=2)
 */
export default async function Home({ searchParams }) {
  // Esperar a que los searchParams estén disponibles (Next.js 15)
  const params = await searchParams;
  // Extraer parámetros de la URL o usar valores por default
  const query = params?.query || ""; // Término de búsqueda (default: "")
  const currentPage = Number(params?.page) || 1; // Página actual (default: 1)
  // Obtener total de páginas según la búsqueda actual
  const totalPages = await getTotalPages(query);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="w-full max-w-5xl">
        {/* ============================
            HEADER - Título y descripción
        ============================ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">
            Gestiona y busca usuarios del sistema
          </p>
        </div>

        {/* ============================
            SEARCH BAR
            Actualiza automáticamente la URL al escribir
        ============================ */}
        <div className="mb-6">
          <Search placeholder="Buscar por nombre o email..." />
        </div>

        {/* ============================
            TABLA DE USUARIOS
            Suspense permite mostrar loading mientras se cargan los datos
            key={query + currentPage} fuerza a React a re-renderizar cuando cambian
        ============================ */}
        <Suspense
          key={query + currentPage} // Re-renderizar cuando cambian query o página
          fallback={
            // Mostrar skeletons mientras carga
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          }
        >
          {/* UsersTable hace fetch de datos en el servidor */}
          <UsersTable query={query} currentPage={currentPage} />
        </Suspense>

        {/* ============================
            PAGINACIÓN
            Solo mostrar si hay más de 1 página
        ============================ */}
        {totalPages > 1 && (
          <div className="mt-6 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </main>
    </div>
  );
}