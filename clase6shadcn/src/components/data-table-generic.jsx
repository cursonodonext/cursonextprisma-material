import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Componente DataTable Genérico y Reutilizable
 * Funciona con cualquier entidad (users, posts, products, etc)
 * 
 * @param {string} apiEndpoint - Endpoint de la API (ej: "/api/users")
 * @param {string} query - Término de búsqueda
 * @param {number} currentPage - Página actual
 * @param {Array} columns - Definición de columnas [{key, label, render?}]
 * @param {string} emptyMessage - Mensaje cuando no hay datos
 * @param {Function} renderMobileCard - Función para renderizar vista móvil
 * @param {string} dataKey - Key del array en la respuesta (ej: "users", "posts")
 */
export default async function DataTable({
  apiEndpoint,
  query = "",
  currentPage = 1,
  columns = [],
  emptyMessage = "No se encontraron resultados",
  renderMobileCard,
  dataKey = null, // Si no se especifica, intentar detectar automáticamente
}) {
  // Fetch data desde la API
  const res = await fetch(
    `http://localhost:3000${apiEndpoint}?query=${query}&page=${currentPage}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  
  // Intentar obtener el array de items de la respuesta
  // Si dataKey está especificado, usarlo, sino intentar keys comunes
  let items = [];
  if (dataKey) {
    items = data[dataKey] || [];
  } else {
    // Intentar detectar automáticamente
    items = data.users || data.posts || data.products || data.items || data.customers || [];
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-md border p-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Vista móvil - Custom render */}
          {renderMobileCard && (
            <div className="md:hidden">
              {items.map((item) => renderMobileCard(item))}
            </div>
          )}

          {/* Vista desktop - Tabla genérica */}
          <div className="hidden rounded-md border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={column.className || ""}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={`${item.id}-${column.key}`}>
                        {column.render
                          ? column.render(item)
                          : item[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
