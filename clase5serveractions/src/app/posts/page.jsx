"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createPost, deletePost } from "../../lib/actions";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", userId: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  async function handlepostCreate(e) {
    e.preventDefault();
    setErrors([]);
    setSuccess("");
    try {
      const result = await createPost({
        title: form.title,
        userId: Number(form.userId),
      });
      //  validacion de zod
      if (!result.success) {
        setErrors(result.errors || [result.message]);
        return;
      }
      setSuccess(result.message || "Post creado exitosamente");
      setForm({ title: "", userId: "" });
    } catch (error) {
      console.error("Error creando post:", error);
      setErrors(["Error creando post"]);
    }
  }

  async function load() {
    const [r1, r2] = await Promise.all([
      fetch("/api/posts"),
      fetch("/api/users"),
    ]);
    setPosts(await r1.json());
    setUsers(await r2.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e) {
    e.preventDefault();
    if (!form.title || !form.userId) return alert("Título y autor requeridos");
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", userId: "" });
    await load();
  }

  // async function deletePost(postId, postTitle) {
  //   if (!confirm(`¿Seguro que deseas eliminar el post "${postTitle}"?`)) return;

  //   try {
  //     const response = await fetch(`/api/posts/${postId}`, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       await load(); // Recargar la lista
  //     } else {
  //       alert("Error al eliminar el post");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Error de conexión al eliminar el post");
  //   }
  // }

  
  async function handledeletePost(postId) {

    try {
      const result = await deletePost(postId);

      if (!result.success) {
        alert(result.message || "Error al eliminar el post");
        return;
      }
      await load(); // Recargar la lista
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al eliminar el post");
    }
  }
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📝 Gestión de Posts
        </h1>
        <p className="text-gray-600">
          Crea y administra publicaciones de los usuarios
        </p>
      </div>

      {/* Formulario de Creación */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ➕ Crear Nuevo Post
        </h2>
        <form onSubmit={handlepostCreate} className="space-y-4">
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
                Título *
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Título del post"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor *
              </label>
              <select
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona un autor</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Crear Post
          </button>
        </form>
      </div>

      {/* Lista de Posts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Lista de Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay posts publicados
          </p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>👤 {post.user.email}</span>
                      <span>🆔 ID: {post.id}</span>
                      <span>🏷️ {post.postTags?.length || 0} tags</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handledeletePost(post.id)}
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
