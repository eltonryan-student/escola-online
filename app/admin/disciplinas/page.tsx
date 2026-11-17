'use client';

import { useState, useEffect } from 'react';
import { getStorageData, saveDisciplinas, saveMedias } from '../../services/storage';
import { Disciplina, Aluno, MediaEscolar } from '../../types';

export default function AdminDisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [medias, setMedias] = useState<MediaEscolar[]>([]);

  const [nome, setNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const data = getStorageData();
    setDisciplinas(data.disciplinas);
    setAlunos(data.alunos);
    setMedias(data.medias);
  }, []);

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !professor.trim()) {
      showFeedback('Preencha todos os campos.', 'error');
      return;
    }

    if (editingId) {
      const updated = disciplinas.map((d) =>
        d.id === editingId ? { ...d, nome, professor } : d
      );
      saveDisciplinas(updated);
      setDisciplinas(updated);
      showFeedback('Disciplina atualizada com sucesso!', 'success');
      setEditingId(null);
    } else {
      const newId = 'd' + Date.now();
      const novaDisc: Disciplina = { id: newId, nome, professor };
      const updatedDiscs = [...disciplinas, novaDisc];

      saveDisciplinas(updatedDiscs);
      setDisciplinas(updatedDiscs);

      // Cria automaticamente médias nulas para todos os alunos na nova disciplina
      const updatedMedias = [...medias];
      alunos.forEach((aluno) => {
        updatedMedias.push({
          id: `${aluno.id}-${newId}`,
          alunoId: aluno.id,
          disciplinaId: newId,
          valor: null,
        });
      });
      saveMedias(updatedMedias);
      setMedias(updatedMedias);

      showFeedback('Disciplina cadastrada com sucesso!', 'success');
    }

    setNome('');
    setProfessor('');
  };

  const handleEdit = (disc: Disciplina) => {
    setEditingId(disc.id);
    setNome(disc.nome);
    setProfessor(disc.professor);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta disciplina? As notas vinculadas também serão removidas.')) {
      const updatedDiscs = disciplinas.filter((d) => d.id !== id);
      const updatedMedias = medias.filter((m) => m.disciplinaId !== id);

      saveDisciplinas(updatedDiscs);
      saveMedias(updatedMedias);

      setDisciplinas(updatedDiscs);
      setMedias(updatedMedias);
      showFeedback('Disciplina excluída com sucesso!', 'success');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Gerenciamento de Disciplinas</h2>

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

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {editingId ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Disciplina</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Geografia"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Professor Responsável</label>
            <input
              type="text"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="Ex: Prof. Roberto"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition shadow"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNome('');
                  setProfessor('');
                }}
                className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-medium px-4 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Disciplinas Cadastradas ({disciplinas.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="py-3 px-6 font-semibold">Disciplina</th>
                <th className="py-3 px-6 font-semibold">Professor</th>
                <th className="py-3 px-6 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {disciplinas.map((disc) => (
                <tr key={disc.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-6 font-medium text-slate-900">{disc.nome}</td>
                  <td className="py-3 px-6">{disc.professor}</td>
                  <td className="py-3 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(disc)}
                      className="text-blue-900 hover:underline font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(disc.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}