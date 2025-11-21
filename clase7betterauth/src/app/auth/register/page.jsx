"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  // Estados para los campos del formulario y control de errores/carga
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Maneja el envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const result = await signUp.email({ email, password, name, callbackURL: "/dashboard" });
      if (result.error) {
        setError(result.error.message || "Error al registrarse");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Error al registrarse. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Crear Cuenta</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>
          )}
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre"
            className=""
          />
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
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            className=""
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
          <div className="text-center text-sm mt-2">
            <a href="/auth/login" className="text-blue-600 hover:underline">
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
