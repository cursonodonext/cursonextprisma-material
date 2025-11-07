// ============================
// DIRECTIVA "use client"
// ============================
// Este componente necesita ejecutarse en el cliente porque:
// - Usa hooks de Next.js (usePathname, useSearchParams)
// - Link tiene interactividad (navegación sin recargar)
"use client";

// Importar hooks de Next.js para leer URL
import { 
  usePathname,      // Obtiene ruta actual (/users)
  useSearchParams   // Lee parámetros URL (?query=juan&page=2)
} from "next/navigation";

// Importar componente Link de Next.js (navegación optimizada)
import Link from "next/link";

// Importar componente Button de shadcn/ui (botón estilizado)
import { Button } from "@/components/ui/button";

// Importar íconos de lucide-react (flechas izquierda y derecha)
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ============================
 * COMPONENTE PAGINATION
 * ============================
 * 
 * Client Component que muestra controles de paginación
 * - Botones Previous/Next
 * - Números de página clickeables
 * - Mantiene TODOS los parámetros URL al cambiar de página
 * - Desactiva botones cuando no se puede avanzar/retroceder
 * - Muestra "..." cuando hay muchas páginas
 * 
 * @param {number} totalPages - Número total de páginas disponibles
 */
export default function Pagination({ totalPages }) {
  // ============================
  // HOOKS DE NEXT.JS
  // ============================
  
  // Obtener la ruta actual sin parámetros
  // Ejemplo: /users
  const pathname = usePathname();
  
  // Obtener todos los parámetros actuales de la URL
  // Ejemplo: query=juan&page=2
  const searchParams = useSearchParams();
  
  // Obtener página actual de la URL
  // Number() convierte string a número
  // Si no existe "page" en URL, usar 1 por default
  // Ejemplo: si URL es /users?page=3 → currentPage = 3
  const currentPage = Number(searchParams.get("page")) || 1;

  // ============================
  // FUNCIÓN HELPER: CREAR URL DE PÁGINA
  // ============================
  
  /**
   * Crea una URL completa para una página específica
   * IMPORTANTE: Mantiene TODOS los parámetros existentes (query, filtros, etc)
   * Solo cambia el parámetro "page"
   * 
   * @param {number} pageNumber - Número de página a crear URL
   * @returns {string} - URL completa con todos los parámetros
   * 
   * Ejemplo:
   * URL actual: /users?query=juan&page=2
   * createPageURL(3) retorna: /users?query=juan&page=3
   */
  const createPageURL = (pageNumber) => {
    // Crear copia de todos los parámetros actuales
    // Esto preserva query, filtros, ordenamiento, etc.
    const params = new URLSearchParams(searchParams);
    
    // Actualizar solo el parámetro "page"
    // .toString() convierte número a string
    params.set("page", pageNumber.toString());
    
    // Construir URL completa
    // pathname = /users
    // params.toString() = query=juan&page=3
    // Resultado: /users?query=juan&page=3
    return `${pathname}?${params.toString()}`;
  };

  // ============================
  // RENDER
  // ============================
  return (
    // Contenedor flex en línea con gap de 0.5rem
    <div className="inline-flex items-center gap-2">
      
      {/* ============================
          BOTÓN PREVIOUS (ANTERIOR)
          ============================ */}
      <Button
        asChild        // Button envuelve otro componente (Link)
        variant="outline"  // Estilo con borde
        size="sm"      // Tamaño pequeño
        disabled={currentPage <= 1}  // Desactivar si estamos en página 1
      >
        {/* Link a página anterior */}
        <Link href={createPageURL(currentPage - 1)}>
          {/* Ícono de flecha izquierda */}
          <ChevronLeft className="h-4 w-4" />
          {/* Texto "Previous" con margin-left */}
          <span className="ml-2">Previous</span>
        </Link>
      </Button>

      {/* ============================
          NÚMEROS DE PÁGINA
          ============================ */}
      <div className="flex items-center gap-2">
        {/* 
          Array.from() crea array de números [1, 2, 3, 4, 5]
          { length: totalPages } = tamaño del array
          (_, i) => i + 1 = función que genera cada número
          Si totalPages=5 → [1, 2, 3, 4, 5]
        */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // ============================
          // LÓGICA DE VISIBILIDAD
          // ============================
          // Decidir si mostrar este número de página o "..."
          
          // Mostrar si es:
          // - Primera página (1)
          // - Última página (totalPages)
          // - Página actual ± 1 (ejemplo: si current=3, mostrar 2,3,4)
          if (
            page === 1 ||                              // Primera página
            page === totalPages ||                     // Última página
            (page >= currentPage - 1 && page <= currentPage + 1)  // Cercanas
          ) {
            // MOSTRAR BOTÓN DE NÚMERO
            return (
              <Button
                key={page}  // Key único para React
                asChild     // Button envuelve Link
                // variant cambia según si es la página actual
                // Si es página actual: fondo sólido (default)
                // Si no: solo borde (outline)
                variant={currentPage === page ? "default" : "outline"}
                size="sm"       // Tamaño pequeño
                className="w-10"  // Ancho fijo de 2.5rem
              >
                {/* Link a esta página específica */}
                <Link href={createPageURL(page)}>
                  {page}  {/* Mostrar número de página */}
                </Link>
              </Button>
            );
          } 
          // ============================
          // MOSTRAR "..." (ELLIPSIS)
          // ============================
          // Si es la página justo antes o después del rango visible
          // Ejemplo: si current=5, mostrar ... en posición 3 y 7
          else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="text-gray-500">
                ...
              </span>
            );
          }
          
          // ============================
          // NO MOSTRAR NADA
          // ============================
          // Para todas las demás páginas (muy lejos de la actual)
          return null;
        })}
      </div>

      {/* ============================
          BOTÓN NEXT (SIGUIENTE)
          ============================ */}
      <Button
        asChild        // Button envuelve Link
        variant="outline"  // Estilo con borde
        size="sm"      // Tamaño pequeño
        disabled={currentPage >= totalPages}  // Desactivar si estamos en última página
      >
        {/* Link a página siguiente */}
        <Link href={createPageURL(currentPage + 1)}>
          {/* Texto "Next" con margin-right */}
          <span className="mr-2">Next</span>
          {/* Ícono de flecha derecha */}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
