"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900">
          Bienvenido a Better Auth
        </h1>
        <p className="text-xl text-gray-600">
          Sistema de autenticación con roles usando Better Auth, Next.js y Prisma
        </p>

        {session?.user ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <p className="text-lg mb-2">
                ¡Hola, <strong>{session.user.name}</strong>!
              </p>
              <p className="text-gray-600">
                Tu rol: <span className="font-semibold text-blue-600">{session.user.role}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
              >
                Ir al Dashboard
              </Button>
              {session.user.role === "admin" && (
                <Button
                  onClick={() => router.push("/admin")}
                  variant="outline"
                  size="lg"
                >
                  Panel Admin
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Características</h2>
              <ul className="text-left space-y-2 text-gray-700">
                <li>✅ Autenticación con email y contraseña</li>
                <li>✅ Sistema de roles (admin, moderator, user)</li>
                <li>✅ Protección de rutas en cliente y servidor</li>
                <li>✅ Middleware de Next.js</li>
                <li>✅ Componentes reutilizables</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push("/auth/login")}
                size="lg"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => router.push("/auth/register")}
                variant="outline"
                size="lg"
              >
                Registrarse
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>Construido con Next.js 16, Better Auth, Prisma y Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}