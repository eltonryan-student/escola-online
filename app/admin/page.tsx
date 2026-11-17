'use client';

import { useState, useEffect } from 'react';
import { getStorageData, saveAlunos, saveMedias } from '../services/storage';
import { Aluno, MediaEscolar, Disciplina } from '../types';

export default function AdminAlunosPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [medias, setMedias] = useState<MediaEscolar[]>([]);
  
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Declaramos a função antes do useEffect para evitar o erro
  const loadData = () => {
    const data = getStorageData();
    setAlunos(data.alunos);
    setDisciplinas(data.disciplinas);
    setMedias(data.medias);
  };

  useEffect(() => {
    setIsMounted(true);
    loadData();
  }, []);

  if (!isMounted) return null;

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !matricula || !email) {
      showFeedback('Preencha todos os campos.', 'error');
      return;
    }

    if (editingId) {
      // Edição
      const updated = alunos.map((a) => (a.id === editingId ? { ...a, nome, matricula, email } : a));
      saveAlunos(updated);
      setAlunos(updated);
      showFeedback('Aluno atualizado com sucesso!', 'success');
      setEditingId(null);
    } else {
      // Cadastro de novo aluno
      const newId = 'a' + Date.now();
      const newAluno: Aluno = { id: newId, nome, matricula, email };
      const updatedAlunos = [...alunos, newAluno];
      
      saveAlunos(updatedAlunos);
      setAlunos(updatedAlunos);

      // Cria automaticamente as médias nulas para o novo aluno em todas as disciplinas
      const newMedias = [...medias];
      disciplinas.forEach((disc) => {
        newMedias.push({
          id: `${newId}-${disc.id}`,
          alunoId: newId,
          disciplinaId: disc.id,
          valor: null,
        });
      });
      saveMedias(newMedias);
      setMedias(newMedias);

      showFeedback('Aluno cadastrado com sucesso!', 'success');
    }

    setNome('');
    setMatricula('');
    setEmail('');
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingId(aluno.id);
    setNome(aluno.nome);
    setMatricula(aluno.matricula);
    setEmail(aluno.email);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      const updatedAlunos = alunos.filter((a) => a.id !== id);
      const updatedMedias = medias.filter((m) => m.alunoId !== id);
      
      saveAlunos(updatedAlunos);
      saveMedias(updatedMedias);
      
      setAlunos(updatedAlunos);
      setMedias(updatedMedias);
      showFeedback('Aluno excluído com sucesso!', 'success');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Gerenciamento de Alunos</h2>

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

      {/* Formulário de Cadastro / Edição */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {editingId ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria da Silva"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula</label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Ex: 2026100"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: maria@escola.com"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
            />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition shadow"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Aluno'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNome('');
                  setMatricula('');
                  setEmail('');
                }}
                className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-medium px-4 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Lista de Alunos ({alunos.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="py-3 px-6 font-semibold">Nome</th>
                <th className="py-3 px-6 font-semibold">Matrícula</th>
                <th className="py-3 px-6 font-semibold">E-mail</th>
                <th className="py-3 px-6 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {alunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-6 font-medium text-slate-900">{aluno.nome}</td>
                  <td className="py-3 px-6">{aluno.matricula}</td>
                  <td className="py-3 px-6">{aluno.email}</td>
                  <td className="py-3 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(aluno)}
                      className="text-blue-900 hover:underline font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(aluno.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {alunos.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    Nenhum aluno cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}