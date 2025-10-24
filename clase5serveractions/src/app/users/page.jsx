"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createUser, getAllUsers } from "../../lib/actions";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  async function handleCreateUser(e) {
    e.preventDefault();
    setErrors([]);
    setSuccess("");
    try {
      const result = await createUser({
        email: form.email,
        bio: form.bio || undefined,
      });
      //  validacion de zod
      if (!result.success) {
        setErrors(result.errors || [result.message]);
        return;
      }
      setSuccess(result.message || "Usuario creado exitosamente");
      setForm({ email: "", bio: "" });
    } catch (error) {
      console.error("Error creando usuario:", error);
      setErrors(["Error creando usuario"]);
    }
  }
  async function handleLoadUsers() {
    setLoading(true);
    try {
      // server action que trae todos los usuarios
      const users = await getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      alert("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }
  // async function load() {
  //   setLoading(true);
  //   const res = await fetch("/api/users");
  //   setUsers(await res.json());
  //   setLoading(false);
  // }

  // async function createUser(e) {
  //   e.preventDefault();
  //   if (!form.email) return alert("Email requerido");
  //   await fetch("/api/users", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email: form.email, bio: form.bio }),
  //   });
  //   setForm({ email: "", bio: "" });
  //   await load();
  // }

  async function deleteUser(userId, userEmail) {
    if (!confirm(`¿Seguro que deseas eliminar el usuario "${userEmail}"?`))
      return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await load(); // Recargar la lista
      } else {
        alert("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al eliminar el usuario");
    }
  }

  useEffect(() => {
    handleLoadUsers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👤 Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Crea y administra usuarios con sus perfiles
        </p>
      </div>

      {/* Formulario de Creación */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ➕ Crear Nuevo Usuario
        </h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-green-500 text-xl">✅</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-green-800">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}
          {errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-red-500 text-xl">⚠️</span>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Errores de validación:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="usuario@email.com"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (opcional)
              </label>
              <input
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Descripción del usuario"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Crear Usuario
          </button>
        </form>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Lista de Usuarios
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando...</span>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay usuarios registrados
          </p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {user.email}
                    </h3>
                    {user.profile && (
                      <p className="text-gray-600 mt-1">{user.profile.bio}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {/* <span>📝 {user.posts.length} posts</span> */}
                      <span>🆔 ID: {user.id}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/users/${user.id}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => deleteUser(user.id, user.email)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
