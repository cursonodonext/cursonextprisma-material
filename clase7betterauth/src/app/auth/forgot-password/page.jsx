"use client";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      // ✅ Usar el método nativo de Better Auth
      const result = await authClient.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`, // URL base, Better Auth agrega ?token=xxx
      });

      if (result.error) {
        setError(result.error.message || "Error al enviar el correo");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-2">Recuperar Contraseña</h2>
        <p className="text-center text-gray-600 mb-4 text-sm">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña</p>
        {success ? (
          <div className="bg-green-100 text-green-800 rounded p-4 text-center mb-2">
            ¡Correo enviado! Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
            <div className="mt-4">
              <Link href="/auth/login" className="text-blue-600 hover:underline">Volver al inicio de sesión</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-100 text-red-800 rounded p-2 text-center">{error}</div>}
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo electrónico"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
            <div className="text-center text-sm mt-2">
              <Link href="/auth/login" className="text-blue-600 hover:underline">Volver al inicio de sesión</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
