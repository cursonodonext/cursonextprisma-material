"use client";

import ProtectedRoute from "@/components/protected-route";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-red-800">Panel de Administración</h1>
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                Volver al Dashboard
              </Button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  Bienvenido, {session?.user?.name}
                </h2>
                <p className="text-red-700">
                  Eres administrador del sistema. Aquí puedes gestionar usuarios, configuraciones y más.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Gestión de Usuarios</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Administra roles y permisos de usuarios
                  </p>
                  <Button size="sm">Ver Usuarios</Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Configuración</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ajusta la configuración del sistema
                  </p>
                  <Button size="sm" variant="outline">Configurar</Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Estadísticas</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ver estadísticas y análisis
                  </p>
                  <Button size="sm" variant="outline">Ver Stats</Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Logs del Sistema</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Revisar logs y actividad
                  </p>
                  <Button size="sm" variant="outline">Ver Logs</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
