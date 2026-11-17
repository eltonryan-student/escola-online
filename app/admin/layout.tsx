'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getLoggedUser, setLoggedUser } from '../services/storage';
import { User } from '../types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged || logged.role !== 'admin') {
      router.push('/');
      return;
    }
    setUser(logged);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    setLoggedUser(null);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Carregando painel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold tracking-wide">Escola Online</h2>
          <span className="text-xs text-blue-300">Painel do Administrador</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <a
            href="/admin"
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              pathname === '/admin' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            Alunos
          </a>
          <a
            href="/admin/disciplinas"
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              pathname === '/admin/disciplinas' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            Disciplinas
          </a>
          <a
            href="/admin/medias"
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              pathname === '/admin/medias' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            Notas e Médias
          </a>
          <a
            href="/admin/equipe"
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              pathname === '/admin/equipe' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            Identificação da Equipe
          </a>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition"
          >
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-800">Sistema de Gestão Escolar</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Olá, {user?.name}</span>
            <div className="w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}