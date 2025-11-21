"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  // Estados para los campos del formulario y control de errores/carga
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Maneja el envío del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({ email, password, callbackURL: "/dashboard" });
      if (result.error) {
        setError(result.error.message || "Error al iniciar sesión");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>
          )}
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className=""
          />
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            className=""
          />
          <div className="text-right text-xs">
            <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>
          <Button
            type="button"
            onClick={() => signIn.google({ callbackURL: "/dashboard" })}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Iniciar sesión con Google
          </Button>
          <div className="text-center text-sm mt-2">
            <a href="/auth/register" className="text-blue-600 hover:underline">
              ¿No tienes cuenta? Regístrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
