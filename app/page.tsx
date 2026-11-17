'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initLocalStorage, setLoggedUser, getLoggedUser, getStorageData } from './services/storage';
import { User } from './types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    initLocalStorage();
    const data = getStorageData();
    setUsers(data.users);

    const logged = getLoggedUser();
    if (logged) {
      if (logged.role === 'admin') router.push('/admin');
      else router.push('/aluno');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const foundUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!foundUser) {
      setError('E-mail não encontrado. Use um dos e-mails de teste abaixo.');
      return;
    }

    setLoggedUser(foundUser);

    if (foundUser.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/aluno');
    }
  };

  const handleQuickLogin = (testEmail: string) => {
    setEmail(testEmail);
  };

  // Evita renderizar até montar no cliente para prevenir erros de hidratação
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-4 border-blue-900">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Escola Online</h1>
          <p className="text-slate-600 mt-2 text-sm">Sistema de Gestão e Boletim Escolar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail de Acesso</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: admin@escola.com"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md"
          >
            Entrar no Sistema
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center mb-3">Atalhos rápidos para teste:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@escola.com')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded border border-slate-300 transition"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('aluno1@escola.com')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded border border-slate-300 transition"
            >
              Aluno 1 (Ana)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('aluno2@escola.com')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded border border-slate-300 transition"
            >
              Aluno 2 (José)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}