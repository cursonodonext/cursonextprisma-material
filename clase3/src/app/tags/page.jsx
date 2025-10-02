"use client";
import { useEffect, useState } from "react";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch("/api/tags");
    setTags(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    if (!name) return alert("Nombre requerido");
    
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        return alert(errorData.error || 'Error al crear tag');
      }
      
      const data = await res.json();
      setName("");
      await load();
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  }

  async function deleteTag(tagId, tagName) {
    if (!confirm(`¿Seguro que deseas eliminar el tag "${tagName}"?`)) return;
    
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        await load(); // Recargar la lista
      } else {
        alert("Error al eliminar el tag");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al eliminar el tag");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏷️ Gestión de Tags</h1>
        <p className="text-gray-600">Crea y administra etiquetas para organizar los posts</p>
      </div>

      {/* Formulario de Creación */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Crear Nuevo Tag</h2>
        <form onSubmit={create} className="space-y-4">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nombre del tag" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <button 
            type="submit" 
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Crear Tag
          </button>
        </form>
      </div>

      {/* Lista de Tags */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Lista de Tags</h2>
        {tags.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay tags creados</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <div key={tag.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{tag.name}</h3>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                      <span>🆔 ID: {tag.id}</span>
                      <span>📝 {tag.postTags?.length || 0} posts</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTag(tag.id, tag.name)}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors text-xs font-medium"
                    title="Eliminar tag"
                  >
                    🗑️
                  </button>
                </div>
                
                {/* Lista de posts que usan este tag */}
                {tag.postTags && tag.postTags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-2">Posts relacionados:</p>
                    <div className="space-y-1">
                      {tag.postTags.slice(0, 3).map((postTag) => (
                        <div key={postTag.postId} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {postTag.post.title} - por {postTag.post.user?.email}
                        </div>
                      ))}
                      {tag.postTags.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{tag.postTags.length - 3} más...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}