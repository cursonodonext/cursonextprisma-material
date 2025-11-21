// Este archivo define la lógica de la ruta API para autenticación en Next.js
//  (probablemente en /api/auth/[...all]).
// Redirige todas las solicitudes GET y POST a un manejador centralizado (auth.handler),
//  que se encarga de procesar la autenticación (login, logout, callbacks, etc.) usando
//  la lógica definida en tu archivo lib/auth.js.
// Es un patrón común en Next.js para integrar soluciones de autenticación como Auth.js,
//  NextAuth o implementaciones personalizadas.
// Importa el objeto 'auth' desde la librería de autenticación personalizada ubicada en 'lib/auth'
import { auth } from "@/lib/auth";

// Exporta los métodos HTTP GET y POST utilizando el manejador de autenticación
// Esto permite que todas las solicitudes GET y POST a esta ruta sean 
//  por el middleware de autenticación de Better Auth
export const GET = auth.handler;
export const POST = auth.handler;

// En resumen: este archivo conecta las rutas 
// de autenticación de tu API con la lógica de autenticación centralizada de tu proyecto.