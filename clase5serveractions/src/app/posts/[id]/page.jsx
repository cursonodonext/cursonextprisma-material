"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { updatePost } from "../../../lib/actions";
import { set } from "zod";

export default function PostPage({ params }) {
  const { id } = use(params);
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagId, setTagId] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/posts/${id}`),
        fetch("/api/tags"),
      ]);
      const postData = await r1.json();
      setPost(postData);
      setTitle(postData?.title ?? "");
      setTags(await r2.json());
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function saveTitle(e) {
    e.preventDefault();
    setErrors([]);
    setSuccess("");
    try {
      const result = await updatePost(id, { title });
      if (!result.success) {
        setErrors(result.errors || [result.message]);
        return;
      }
      setSuccess("Título actualizado exitosamente");
      await load();
    } catch (error) {
      console.error("Error actualizando título:", error);
    }
  }

  async function removePost() {
    if (!confirm("¿Eliminar post?")) return;
    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      window.location.href = "/posts";
    } catch (error) {
      alert("Error al eliminar el post");
    }
  }

  async function addTag(e) {
    e.preventDefault();
    if (!tagId) return;
    await fetch(`/api/posts/${id}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId: Number(tagId) }),
    });
    setTagId("");
    await load();
  }

  async function removeTag(tid) {
    await fetch(`/api/posts/${id}/tags`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId: Number(tid) }),
    });
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Cargando post...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Post no encontrado
        </h2>
        <p className="text-red-600 mb-4">El post que buscas no existe.</p>
        <Link
          href="/posts"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Volver a Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">
          Inicio
        </Link>
        <span className="mx-2">›</span>
        <Link href="/posts" className="hover:text-gray-900">
          Posts
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Post #{post.id}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📝 {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👤 Autor: {post.user?.email}</span>
              <span>🆔 ID: {post.id}</span>
              <span>🏷️ {post.postTags?.length || 0} tags</span>
            </div>
          </div>
          <Link
            href="/posts"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors font-medium"
          >
            ← Volver a Posts
          </Link>
        </div>
      </div>

      {/* Editar Título */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ✏️ Editar Título
        </h2>
        <form onSubmit={saveTitle} className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del Post
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Título del post"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-medium"
            >
              💾 Guardar Título
            </button>
            <button
              type="button"
              onClick={removePost}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium"
            >
              🗑️ Eliminar Post
            </button>
          </div>
        </form>
      </div>

      {/* Tags del Post */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🏷️ Tags del Post
        </h2>

        {/* Tags actuales */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Tags Asignados
          </h3>
          {post.postTags && post.postTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.postTags.map((pt) => (
                <div
                  key={`${pt.postId}-${pt.tagId}`}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                >
                  <span>{pt.tag?.name}</span>
                  <button
                    onClick={() => removeTag(pt.tagId)}
                    className="text-green-600 hover:text-green-800 font-bold"
                    title="Remover tag"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay tags asignados</p>
          )}
        </div>

        {/* Agregar nuevo tag */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Agregar Tag
          </h3>
          <form onSubmit={addTag} className="flex space-x-3">
            <select
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecciona un tag</option>
              {tags
                .filter((t) => !post.postTags?.some((pt) => pt.tagId === t.id))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
            <button
              type="submit"
              disabled={!tagId}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ➕ Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
