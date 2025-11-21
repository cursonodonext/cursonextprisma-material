"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <p className="mt-4 text-xl text-gray-600">
          No tienes permisos para acceder a esta página
        </p>
        <p className="mt-2 text-gray-500">
          Tu rol actual no tiene acceso a este recurso.
        </p>
        <div className="mt-6 space-x-4">
          <Button onClick={() => router.back()}>
            Volver
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
