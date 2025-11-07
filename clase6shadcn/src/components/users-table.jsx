// Importar componentes de tabla de shadcn/ui
// Estos componentes ya vienen estilizados y listos para usar
import {
  Table,        // Contenedor principal de la tabla
  TableBody,    // Cuerpo de la tabla (donde van las filas de datos)
  TableCell,    // Celda individual de la tabla
  TableHead,    // Encabezado de columna
  TableHeader,  // Contenedor de los encabezados
  TableRow,     // Fila de la tabla
} from "@/components/ui/table";

/**
 * ============================
 * COMPONENTE USERSTABLE
 * ============================
 * 
 * Server Component que muestra una tabla de usuarios con:
 * - Paginación (recibe página actual como prop)
 * - Búsqueda (recibe query como prop)
 * - Responsive (tabla en desktop, tarjetas en mobile)
 * - Fetch directo a la API
 * 
 * @param {string} query - Término de búsqueda (ej: "juan")
 * @param {number} currentPage - Página actual (ej: 1, 2, 3)
 */
export default async function UsersTable({ query, currentPage }) {
  // ============================
  // FETCH DE DATOS
  // ============================
  // Hacer request a la API de usuarios
  // Se ejecuta en el SERVIDOR (no en el navegador)
  const res = await fetch(
    // Template string que construye la URL con los parámetros
    // Ejemplo: /api/users?query=juan&page=2
    `http://localhost:3000/api/users?query=${query}&page=${currentPage}`,
    {
      cache: "no-store", // No cachear = siempre obtener datos frescos
    }
  );

  // Convertir la respuesta de JSON a objeto JavaScript
  // Ejemplo de data: { users: [...], totalPages: 3, currentPage: 1 }
  const data = await res.json();
  
  // Extraer el array de usuarios del objeto data
  // Si data.users no existe, usar array vacío []
  const users = data.users || [];

  // ============================
  // CASO: NO HAY USUARIOS
  // ============================
  // Si no hay usuarios (búsqueda sin resultados o DB vacía)
  if (!users || users.length === 0) {
    // Retornar mensaje centrado en gris
    return (
      <div className="mt-6 text-center text-gray-500">
        <p>No se encontraron usuarios</p>
      </div>
    );
  }

  // ============================
  // RENDER: HAY USUARIOS
  // ============================
  return (
    <>
      {/* ============================
          VISTA DESKTOP - TABLA
          ============================ */}
      {/* 
        hidden = oculto por default
        md:block = visible en pantallas medianas (≥768px)
        mt-6 = margin-top de 1.5rem
      */}
      <div className="mt-6 hidden md:block">
        <Table>
          {/* ENCABEZADOS DE LA TABLA */}
          <TableHeader>
            <TableRow>
              {/* Columna ID - ancho fijo de 5rem */}
              <TableHead className="w-20 font-medium">ID</TableHead>
              {/* Columna Usuario - ancho automático */}
              <TableHead>Usuario</TableHead>
              {/* Columna Email - ancho automático */}
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>

          {/* CUERPO DE LA TABLA */}
          <TableBody>
            {/* 
              Iterar sobre cada usuario del array
              .map() crea una fila por cada usuario
            */}
            {users.map((user) => (
              // Fila de la tabla (key único para React)
              <TableRow key={user.id}>
                {/* CELDA 1: ID */}
                <TableCell className="w-20 font-medium">
                  {user.id} {/* Mostrar el ID del usuario */}
                </TableCell>

                {/* CELDA 2: USUARIO (nombre + avatar) */}
                <TableCell>
                  {/* Contenedor flex con gap de 0.75rem */}
                  <div className="flex items-center gap-3">
                    {/* Avatar circular con inicial */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                      <span className="text-sm font-medium text-purple-600">
                        {/* 
                          Obtener primera letra del email en mayúscula
                          user.email.charAt(0) = primer caracter
                          .toUpperCase() = convertir a mayúscula
                        */}
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Nombre del usuario en negrita */}
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </TableCell>

                {/* CELDA 3: EMAIL */}
                <TableCell>
                  {/* Email en minúsculas */}
                  <span className="lowercase">{user.email}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ============================
          VISTA MOBILE - TARJETAS
          ============================ */}
      {/* 
        md:hidden = visible solo en pantallas pequeñas (<768px)
        En desktop esta sección está oculta
      */}
      <div className="md:hidden">
        {/* 
          Iterar sobre cada usuario
          Crear una tarjeta por cada uno
        */}
        {users.map((user) => (
          // Tarjeta individual con fondo blanco y padding
          <div key={user.id} className="mb-2 w-full rounded-md bg-white p-4">
            {/* SECCIÓN SUPERIOR: Avatar + Nombre + Email */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                {/* Avatar + Nombre */}
                <div className="mb-2 flex items-center">
                  {/* Avatar circular (igual que en desktop) */}
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <span className="text-sm font-medium text-purple-600">
                      {/* Primera letra del email en mayúscula */}
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Nombre del usuario */}
                  <p className="font-semibold">{user.name}</p>
                </div>
                {/* Email en gris y texto pequeño */}
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* SECCIÓN INFERIOR: ID */}
            {/* 
              pt-4 = padding-top después del borde
              flex justify-between = espacio entre elementos
            */}
            <div className="flex w-full items-center justify-between pt-4">
              {/* Mostrar ID del usuario */}
              <p className="text-sm font-medium">ID: {user.id}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
