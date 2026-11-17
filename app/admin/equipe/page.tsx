'use client';

import { useState, useEffect } from 'react';

interface Integrante {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
}

const EQUIPE_KEY = 'escola_online_equipe';

export default function EquipePage() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [matricula, setMatricula] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const saved = localStorage.getItem(EQUIPE_KEY);
    if (saved) {
      setIntegrantes(JSON.parse(saved));
    }
  }, []);

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (integrantes.length >= 5) {
      showFeedback('Limite máximo de 5 integrantes atingido.', 'error');
      return;
    }

    const novo: Integrante = {
      id: Date.now().toString(),
      nome,
      funcao,
      matricula,
    };

    const updated = [...integrantes, novo];
    setIntegrantes(updated);
    localStorage.setItem(EQUIPE_KEY, JSON.stringify(updated));
    showFeedback('Integrante adicionado com sucesso!', 'success');

    setNome('');
    setFuncao('');
    setMatricula('');
  };

  const handleRemove = (id: string) => {
    const updated = integrantes.filter((i) => i.id !== id);
    setIntegrantes(updated);
    localStorage.setItem(EQUIPE_KEY, JSON.stringify(updated));
    showFeedback('Integrante removido.', 'success');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Identificação da Equipe</h2>
      <p className="text-sm text-slate-600 mb-6">
        Cadastre os desenvolvedores responsáveis pelo projeto (máximo de 5 integrantes).
      </p>

      {feedback.message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium border ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {integrantes.length < 5 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Adicionar Integrante</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: Lucas Mendes"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula / RA</label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
                placeholder="Ex: 2026999"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Função no Projeto</label>
              <input
                type="text"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                required
                placeholder="Ex: Desenvolvedor Front-end"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition shadow"
              >
                Adicionar à Equipe ({integrantes.length}/5)
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrantes.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                {item.nome.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-slate-800">{item.nome}</h3>
              <p className="text-sm text-blue-900 font-medium">{item.funcao}</p>
              <p className="text-xs text-slate-500 mt-1">Matrícula: {item.matricula}</p>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="mt-4 text-xs text-red-600 hover:underline self-start font-medium"
            >
              Remover integrante
            </button>
          </div>
        ))}
        {integrantes.length === 0 && (
          <p className="text-slate-500 text-sm col-span-3">Nenhum integrante cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}