'use client';
import Link from "next/link";
import { getAllUsers,getUserById } from "../lib/actions";
import { useEffect } from "react";

export default function Home() {
  
useEffect(() => {
    async function fetchUsers() {
      const users = await getUserById(1);
      console.log("Usuarios cargados en Home page:", users);
    }

    fetchUsers();
  }, []);

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Mi App
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Aplicación Next.js con Prisma ORM - Relaciones 1:1, 1:N y N:M
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">👤 Usuarios</h3>
            <p className="text-blue-700 mb-4">Gestiona usuarios y sus perfiles</p>
            <Link 
              href="/users" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Ver Usuarios
            </Link>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">📝 Posts</h3>
            <p className="text-green-700 mb-4">Crea y administra posts</p>
            <Link 
              href="/posts" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Ver Posts
            </Link>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">🏷️ Tags</h3>
            <p className="text-purple-700 mb-4">Organiza con etiquetas</p>
            <Link 
              href="/tags" 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Ver Tags
            </Link>
          </div>
        </div>
      </div>
      
      {/* Database Relations Info */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Relaciones de Base de Datos</h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900">1:1 - Usuario → Perfil</h4>
            <p className="text-gray-600 text-sm">Un usuario tiene máximo un perfil</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900">1:N - Usuario → Posts</h4>
            <p className="text-gray-600 text-sm">Un usuario puede tener muchos posts</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900">N:M - Posts ↔ Tags</h4>
            <p className="text-gray-600 text-sm">Posts y tags se relacionan mutuamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}