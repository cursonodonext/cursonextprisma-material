import UsersTable from "@/components/users-table";  // Tabla de usuarios
import Search from "@/components/search";            // Buscador
import Pagination from "@/components/pagination";    // Paginación
// Componentes de React
import { Suspense } from "react";  // Para mostrar loading mientras carga
// Componentes de shadcn/ui
import { Skeleton } from "@/components/ui/skeleton";  // Placeholders animados

/**
 * ============================
 * FUNCIÓN HELPER: GET TOTAL PAGES
 * ============================
 * 
 * Esta función auxiliar se ejecuta en el SERVIDOR
 * Su propósito es obtener cuántas páginas totales hay
 * para poder mostrar la paginación correctamente
 * 
 * ¿Por qué una función separada?
 * - Se ejecuta antes de renderizar la página
 * - Permite saber si mostrar paginación o no (if totalPages > 1)
 * - Se ejecuta cada vez que cambia el query
 * 
 * @param {string} query - Término de búsqueda actual (ej: "juan")
 * @returns {Promise<number>} - Número total de páginas disponibles
 */
async function getTotalPages(query) {
  try {
    // ============================
    // FETCH A LA API
    // ============================
    // Hacer request HTTP a nuestro propio servidor
    // Solo pedimos página 1 porque solo necesitamos el totalPages
    const res = await fetch(
      // Template string construye URL: /api/users?query=juan&page=1
      `http://localhost:3000/api/users?query=${query}&page=1`,
      {
        // cache: "no-store" = no cachear
        // Siempre obtener datos frescos (importante para búsquedas)
        cache: "no-store",
      }
    );
    
    // Convertir respuesta JSON a objeto JavaScript
    // Estructura esperada: { users: [...], totalPages: 5, currentPage: 1 }
    const data = await res.json();
    
    // Retornar totalPages del objeto
    // || 1 = si no existe, usar 1 por default
    return data.totalPages || 1;
    
  } catch (error) {
    // ============================
    // MANEJO DE ERRORES
    // ============================
    // Si falla el fetch (servidor caído, error de red, etc)
    console.error("Error:", error);
    // Retornar 1 para evitar que la app explote
    return 1;
  }
}

/**
 * ============================
 * COMPONENTE PRINCIPAL: HOME
 * ============================
 * 
 * Server Component (NO tiene "use client")
 * Se ejecuta en el SERVIDOR cada vez que:
 * - El usuario entra a la página
 * - Cambian los searchParams (query o page)
 * 
 * ¿Cómo funciona el flujo?
 * 1. Usuario visita /users?query=juan&page=2
 * 2. Next.js ejecuta esta función en el servidor
 * 3. Lee los searchParams (query=juan, page=2)
 * 4. Obtiene totalPages con getTotalPages()
 * 5. Renderiza el HTML completo en el servidor
 * 6. Envía HTML al navegador
 * 7. React hidrata los componentes cliente (Search, Pagination)
 * 
 * @param {Object} props - Props del componente
 * @param {Promise<Object>} props.searchParams - Parámetros de la URL (Next.js 15 los pasa como Promise)
 */
export default async function Home({ searchParams }) {
  // ============================
  // EXTRAER PARÁMETROS DE LA URL
  // ============================
  
  // IMPORTANTE: En Next.js 15, searchParams es una Promise
  // Debemos hacer await para obtener el objeto real
  const params = await searchParams;
  
  // Extraer "query" de la URL
  // params?.query = optional chaining (evita error si params es null)
  // || "" = si no existe, usar string vacío
  // Ejemplo: si URL es /users?query=juan → query = "juan"
  // Ejemplo: si URL es /users → query = ""
  const query = params?.query || "";
  
  // Extraer "page" de la URL y convertir a número
  // Number() convierte string "2" a número 2
  // || 1 = si no existe o es NaN, usar 1
  // Ejemplo: si URL es /users?page=3 → currentPage = 3
  // Ejemplo: si URL es /users → currentPage = 1
  const currentPage = Number(params?.page) || 1;
  
  // ============================
  // OBTENER TOTAL DE PÁGINAS
  // ============================
  
  // Ejecutar función getTotalPages con el query actual
  // await porque es async (hace fetch)
  // Esto se ejecuta EN EL SERVIDOR antes de renderizar
  // Ejemplo: si hay 50 usuarios y mostramos 6 por página
  // totalPages = Math.ceil(50/6) = 9
  const totalPages = await getTotalPages(query);

  // ============================
  // RENDER (JSX)
  // ============================
  return (
    // Contenedor principal
    // flex min-h-screen = altura mínima de pantalla completa
    // items-start = alinear al inicio verticalmente
    // justify-center = centrar horizontalmente
    // bg-zinc-50 = fondo gris claro
    // dark:bg-black = fondo negro en modo oscuro
    // p-8 = padding de 2rem
    <div className="flex min-h-screen items-start justify-center  font-sans dark:bg-black">
      {/* Contenedor de contenido con ancho máximo */}
      <main className="w-full max-w-5xl">
        
        {/* ============================
            HEADER
            ============================ */}
        {/* Título y descripción de la página */}
        <div className="mb-8">
          {/* Título principal */}
          {/* text-3xl = tamaño de fuente 1.875rem */}
          {/* font-bold = negrita */}
          {/* mb-2 = margin-bottom 0.5rem */}
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          
          {/* Descripción */}
          {/* text-muted-foreground = color gris de shadcn */}
          <p className="text-muted-foreground">
            Gestiona y busca usuarios del sistema
          </p>
        </div>

        {/* ============================
            SEARCH BAR
            ============================ */}
        {/* Barra de búsqueda */}
        {/* mb-6 = margin-bottom 1.5rem */}
        <div className="mb-6">
          {/* 
            Componente Search (Client Component)
            - Detecta cuando el usuario escribe
            - Actualiza la URL con debounce de 300ms
            - Resetea a página 1 cuando busca
          */}
          <Search placeholder="Buscar por nombre o email..." />
        </div>

        {/* ============================
            TABLA DE USUARIOS CON SUSPENSE
            ============================ */}
        {/* 
          SUSPENSE - Concepto clave de React 18+
          
          ¿Qué hace?
          - Mientras UsersTable hace fetch (async), muestra el fallback
          - Cuando termina el fetch, muestra UsersTable
          - Es como un loading state automático
          
          KEY = Truco muy importante
          - key={query + currentPage} crea un string único
          - Ejemplo: query="juan" + currentPage=2 → key="juan2"
          - Cuando cambia el key, React DESTRUYE el componente viejo
          - Y crea uno NUEVO (fuerza re-fetch de datos)
          - Sin esto, React reutilizaría el componente y no actualizaría
        */}
        <Suspense
          key={query + currentPage}  // Forzar re-render cuando cambian
          fallback={
            // FALLBACK - Lo que se muestra mientras carga
            // Skeletons = placeholders animados que simulan el contenido
            <div className="space-y-3">  {/* gap vertical de 0.75rem */}
              {/* 3 skeletons que simulan filas de la tabla */}
              <Skeleton className="h-12 w-full" />  {/* altura 3rem, ancho completo */}
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          }
        >
          {/* 
            USERSTABLE (Server Component)
            - Hace fetch a /api/users
            - Renderiza la tabla con los datos
            - Se ejecuta en el servidor
            - Recibe query y currentPage como props
          */}
          <UsersTable query={query} currentPage={currentPage} />
        </Suspense>

        {/* ============================
            PAGINACIÓN CONDICIONAL
            ============================ */}
        {/* 
          RENDERIZADO CONDICIONAL
          {totalPages > 1 && <Pagination />}
          
          Explicación:
          - Si totalPages es 1 → solo 1 página → no mostrar paginación
          - Si totalPages > 1 → hay varias páginas → mostrar paginación
          - && = operador AND de cortocircuito
          - Si la izquierda es false, no evalúa la derecha
          
          Ejemplo:
          - 5 usuarios, 6 por página → totalPages = 1 → NO mostrar
          - 20 usuarios, 6 por página → totalPages = 4 → SÍ mostrar
        */}
        {totalPages > 1 && (
          // Contenedor centrado para la paginación
          <div className="mt-6 flex w-full justify-center">
            {/* 
              PAGINATION (Client Component)
              - Muestra botones Previous/Next
              - Muestra números de página
              - Mantiene query al cambiar de página
              - Recibe totalPages para saber cuántos botones crear
            */}
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </main>
    </div>
  );
}