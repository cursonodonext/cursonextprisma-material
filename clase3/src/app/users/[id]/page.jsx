"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

export default function UserPage({ params }) {
  const { id } = use(params);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: "", bio: "" });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      setUser(data);
      setForm({ email: data?.email ?? "", bio: data?.profile?.bio ?? "" });
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function save(e) {
    e.preventDefault();
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, bio: form.bio }),
    });
    await load();
  }

  async function remove() {
    if (!confirm("¿Seguro que querés eliminar este usuario?")) return;
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      window.location.href = "/users";
    } catch (error) {
      alert('Error al eliminar el usuario');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando usuario...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Usuario no encontrado</h2>
        <p className="text-red-600 mb-4">El usuario que buscas no existe.</p>
        <Link href="/users" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">Inicio</Link>
        <span className="mx-2">›</span>
        <Link href="/users" className="hover:text-gray-900">Usuarios</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{user.email}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 {user.email}</h1>
            {user.profile && (
              <p className="text-gray-600 text-lg mb-2">{user.profile.bio}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>🆔 ID: {user.id}</span>
              <span>📝 {user.posts?.length || 0} posts</span>
              <span>📋 {user.profile ? 'Con perfil' : 'Sin perfil'}</span>
            </div>
          </div>
          <Link 
            href="/users"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors font-medium"
          >
            ← Volver a Usuarios
          </Link>
        </div>
      </div>

      {/* Editar Usuario */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">✏️ Editar Usuario</h2>
        <form onSubmit={save} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <input 
                value={form.bio} 
                onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción del usuario"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
            >
              💾 Guardar Cambios
            </button>
            <button 
              type="button"
              onClick={remove}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium"
            >
              🗑️ Eliminar Usuario
            </button>
          </div>
        </form>
      </div>

      {/* Posts del Usuario */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Posts del Usuario</h2>
        {user.posts && user.posts.length > 0 ? (
          <div className="space-y-3">
            {user.posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                      <span>🆔 ID: {post.id}</span>
                      <span>🏷️ {post.postTags?.length || 0} tags</span>
                    </div>
                  </div>
                  <Link 
                    href={`/posts/${post.id}`}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    Ver Post
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">Este usuario no ha creado ningún post</p>
            <Link 
              href="/posts"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ir a crear un post →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
