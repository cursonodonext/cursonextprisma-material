// auth.js: Configuración y lógica principal de autenticación (backend).
// auth-guard.js: Protección de rutas y verificación de roles (backend/API).
// auth-client.js: Funciones de autenticación para el frontend (React).
// Importa la función principal de Better Auth
import { betterAuth } from "better-auth";
// Importa el adaptador de Prisma para Better Auth
import { prismaAdapter } from "better-auth/adapters/prisma";
// Importa la instancia de Prisma Client personalizada
import prisma from "./prisma";
// Importa la función para enviar emails de recuperación de contraseña
import { sendPasswordResetEmail } from "./email";

// Crea y exporta la instancia de autenticación configurada
export const auth = betterAuth({
  // Configura la base de datos usando el adaptador de Prisma
  database: prismaAdapter(prisma, {
    provider: "postgresql", // Indica el tipo de base de datos
  }),
  // Configuración para autenticación por email y contraseña
  emailAndPassword: {
    enabled: true, // Habilita el login por email/contraseña
    requireEmailVerification: false, // No requiere verificación de email para login
    minPasswordLength: 6, // Longitud mínima de contraseña
    maxPasswordLength: 128, // Longitud máxima de contraseña

    // Función para enviar email de recuperación de contraseña
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(`📧 Better Auth enviando reset email a: ${user.email}`);
      await sendPasswordResetEmail(user.email, url); // Llama a tu función de email
    },

    // Callback que se ejecuta después de un reseteo exitoso de contraseña
    onPasswordReset: async ({ user }, request) => {
      console.log(`✅ Contraseña reseteada exitosamente para: ${user.email}`);
    },

    // Tiempo de expiración del token de recuperación (en segundos)
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hora
  },
  // Configuración de campos adicionales para el usuario
  user: {
    additionalFields: {
      role: {
        type: "string", // El campo es un string
        defaultValue: "user", // Valor por defecto
        input: false, // No permitir que el usuario lo defina al registrarse
      },
    },
  },
  // Configuración de la sesión
  session: {
    expiresIn: 60 * 60 * 24 * 7, // Duración de la sesión: 7 días
    updateAge: 60 * 60 * 24, // Cada cuánto se actualiza la sesión: 1 día
    cookieCache: {
      enabled: true, // Habilita caché de sesión en cookie
      maxAge: 5 * 60, // Duración de la caché: 5 minutos
    },
  },
  // Configuración para proveedores sociales (vacío por ahora)
  socialProviders: {
    // Aquí puedes agregar providers sociales como Google, GitHub, etc.
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Puedes agregar scopes u opciones adicionales si lo necesitas
    },
  },
  // Configuración avanzada
  advanced: {
    database: {
      // Generador de IDs personalizado usando crypto
      generateId: () => {
        return crypto.randomUUID();
      },
    },
  },
});

// Helper para obtener la sesión del usuario en el servidor
export const getSession = async (request) => {
  return await auth.api.getSession({
    headers: request.headers, // Pasa los headers de la request para extraer la cookie de sesión
  });
};

// Helper para verificar si el usuario tiene un rol permitido
export const checkRole = (session, allowedRoles) => {
  if (!session?.user) return false; // Si no hay usuario, no está autorizado
  return allowedRoles.includes(session.user.role); // Devuelve true si el rol está permitido
};

// Propósito: Configura y exporta la instancia principal de autenticación de tu app usando Better Auth.
// Qué hace:
// Define cómo se conecta a la base de datos (usando Prisma).
// Configura el login por email/contraseña y la recuperación de contraseña.
// Permite añadir campos extra al usuario (como el rol).
// Configura la duración de la sesión y el almacenamiento en cookies.
// Permite añadir proveedores sociales (como Google).
// Exporta helpers para obtener la sesión y verificar roles.
// Dónde se usa: En el backend (API routes, middlewares) para autenticar y autorizar usuarios.
