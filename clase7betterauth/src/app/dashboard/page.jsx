"use client";

import ProtectedRoute from "@/components/protected-route";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import RoleGate from "@/components/role-gate";

export default function DashboardPage() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button onClick={handleSignOut} variant="outline">
                Cerrar Sesión
              </Button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h2 className="text-xl font-semibold mb-2">Información del Usuario</h2>
                <p><strong>Nombre:</strong> {session?.user?.name}</p>
                <p><strong>Email:</strong> {session?.user?.email}</p>
                <p>
                  <strong>Rol:</strong>{" "}
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    session?.user?.role === "admin" ? "bg-red-100 text-red-800" :
                    session?.user?.role === "moderator" ? "bg-yellow-100 text-yellow-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {session?.user?.role}
                  </span>
                </p>
              </div>

              <RoleGate allowedRoles={["admin"]}>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <h2 className="text-xl font-semibold text-red-800 mb-2">
                    Panel de Administrador
                  </h2>
                  <p className="text-red-700">
                    Este contenido solo es visible para administradores.
                  </p>
                </div>
              </RoleGate>

              <RoleGate allowedRoles={["admin", "moderator"]}>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                    Panel de Moderador
                  </h2>
                  <p className="text-yellow-700">
                    Este contenido es visible para administradores y moderadores.
                  </p>
                </div>
              </RoleGate>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  Contenido General
                </h2>
                <p className="text-blue-700">
                  Este contenido es visible para todos los usuarios autenticados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
