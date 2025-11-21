// Importa la función para crear un cliente de autenticación de Better Auth para React
import { createAuthClient } from "better-auth/react";
// Crea una instancia del cliente de autenticación configurando la URL base de la API
export const authClient = createAuthClient({
  // Usa la variable de entorno NEXT_PUBLIC_APP_URL si existe, si no, usa localhost
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
// Desestructura y exporta los métodos principales del cliente de autenticación:
// - signIn: para iniciar sesión
// - signUp: para registrar usuarios
// - signOut: para cerrar sesión
// - useSession: hook de React para obtener la sesión actual
// - getSession: obtiene la sesión actual (promesa)
// - getCsrfToken: obtiene el token CSRF para formularios protegidos
// export async function signInWithEmail({ email, password, onError, onSuccess }) {
//   try {
//     await signIn.email({
//       email,
//       password,
//       onError: (ctx) => {
//         // Llama a tu callback de error si lo pasaste
//         if (onError) onError(ctx);
//       },
//       onSuccess: (ctx) => {
//         // Llama a tu callback de éxito si lo pasaste
//         if (onSuccess) onSuccess(ctx);
//       },
//     });
//   } catch (err) {
//     // Manejo de error global
//     if (onError) onError({ error: err });
//   }
// }
export const { signIn, signUp, signOut, useSession, getSession, getCsrfToken } =
  authClient;


// auth-client.js
// Propósito: Expone funciones de autenticación para usarlas en el frontend (React).
// Qué hace:
// Crea un cliente de autenticación configurado para tu app.
// Exporta funciones como signIn, signUp, signOut, useSession, etc., 
// que puedes usar en tus componentes React para iniciar sesión, cerrar sesión,
//  obtener la sesión actual, etc.
// Dónde se usa: En componentes React, especialmente en formularios de login, registro, y
//  para mostrar información del usuario autenticado.