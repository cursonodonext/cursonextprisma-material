import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
            Mi App
          </Link>
          
          <div className="flex space-x-6">
            <Link 
              href="/users" 
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Usuarios
            </Link>
            <Link 
              href="/posts" 
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Posts
            </Link>
            <Link 
              href="/tags" 
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Tags
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}