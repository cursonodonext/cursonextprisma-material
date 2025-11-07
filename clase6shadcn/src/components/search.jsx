// ============================
// DIRECTIVA "use client"
// ============================
// Este componente DEBE ejecutarse en el navegador (cliente)
// porque usa hooks de React que requieren interactividad:
// - onChange (detectar cuando el usuario escribe)
// - useRouter (navegar sin recargar la página)
"use client";

// Importar componente Input de shadcn/ui (campo de texto estilizado)
import { Input } from "@/components/ui/input";

// Importar hooks de Next.js para navegación y URL
import { 
  useSearchParams, // Lee parámetros de la URL (?query=juan)
  usePathname,     // Obtiene la ruta actual (/users)
  useRouter        // Permite cambiar la URL sin recargar
} from "next/navigation";

// Importar hook para debounce (retrasar ejecución de función)
import { useDebouncedCallback } from "use-debounce";

/**
 * ============================
 * COMPONENTE SEARCH
 * ============================
 * 
 * Client Component que permite buscar en tiempo real
 * - Actualiza la URL cuando el usuario escribe
 * - Usa debounce para no hacer búsquedas en cada tecla
 * - Resetea a página 1 cuando se busca algo nuevo
 * - Mantiene el valor del input sincronizado con la URL
 * 
 * @param {string} placeholder - Texto que se muestra cuando el input está vacío
 */
export default function Search({ placeholder }) {
  // ============================
  // HOOKS DE NEXT.JS
  // ============================
  
  // Obtener los parámetros actuales de la URL
  // Ejemplo: si URL es /users?query=juan&page=2
  // searchParams.get("query") retorna "juan"
  const searchParams = useSearchParams();
  
  // Obtener la ruta actual (sin parámetros)
  // Ejemplo: /users
  const pathname = usePathname();
  
  // Obtener función para cambiar la URL
  // replace() cambia la URL sin agregar a historial
  const { replace } = useRouter();

  // ============================
  // FUNCIÓN DE BÚSQUEDA CON DEBOUNCE
  // ============================
  
  // useDebouncedCallback retrasa la ejecución 300ms
  // Si el usuario sigue escribiendo, reinicia el timer
  // Solo ejecuta cuando el usuario DEJA de escribir por 300ms
  const handleSearch = useDebouncedCallback((term) => {
    // Crear nuevo objeto URLSearchParams con los parámetros actuales
    // Esto copia todos los parámetros existentes (query, page, etc)
    const params = new URLSearchParams(searchParams);
    
    // SIEMPRE resetear a página 1 cuando se busca algo nuevo
    // Porque los resultados cambian, la página 2 de "juan" 
    // no tiene sentido al buscar "maría"
    params.set("page", "1");
    
    // Si hay texto en el input (term tiene valor)
    if (term) {
      // Agregar o actualizar el parámetro "query"
      // Ejemplo: params ahora tiene query=juan&page=1
      params.set("query", term);
    } else {
      // Si el input está vacío, eliminar el parámetro "query"
      // Volver a mostrar todos los usuarios
      params.delete("query");
    }
    
    // Actualizar la URL sin recargar la página
    // pathname = ruta actual (/users)
    // params.toString() = convierte a string (query=juan&page=1)
    // Resultado: /users?query=juan&page=1
    replace(`${pathname}?${params.toString()}`);
  }, 300); // 300ms = tiempo de espera antes de ejecutar

  // ============================
  // RENDER
  // ============================
  return (
    // Contenedor relativo (para posicionar el ícono absoluto)
    // flex-1 = ocupa todo el espacio disponible
    // shrink-0 = no se encoge si no hay espacio
    <div className="relative flex flex-1 shrink-0">
      {/* CAMPO DE TEXTO */}
      <Input
        // Texto que se muestra cuando está vacío
        placeholder={placeholder}
        
        // Ejecutar handleSearch cada vez que cambia el input
        // e.target.value = texto que escribió el usuario
        onChange={(e) => handleSearch(e.target.value)}
        
        // Valor inicial del input (sincronizado con URL)
        // Si URL tiene ?query=juan, el input mostrará "juan"
        // .toString() convierte a string (por si es null)
        defaultValue={searchParams.get("query")?.toString()}
        
        // Clases de Tailwind para estilos
        // peer = marca este elemento para referenciarlo en otros
        // pl-10 = padding-left de 2.5rem (espacio para el ícono)
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
      />
      
      {/* ÍCONO DE BÚSQUEDA (LUPA) */}
      <svg
        // absolute = posición absoluta (sobre el input)
        // left-3 = 0.75rem desde la izquierda
        // top-1/2 = 50% desde arriba
        // -translate-y-1/2 = centrar verticalmente
        // peer-focus:text-gray-900 = cuando Input tiene focus, cambiar color
        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        {/* Path del ícono de lupa (círculo + línea) */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </div>
  );
}
