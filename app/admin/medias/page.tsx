'use client';

import { useState, useEffect } from 'react';
import { getStorageData, saveMedias } from '../../services/storage';
import { Aluno, Disciplina, MediaEscolar, SituacaoAcademica } from '../../types';

export default function AdminMediasPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [medias, setMedias] = useState<MediaEscolar[]>([]);

  const [selectedAluno, setSelectedAluno] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [notaInput, setNotaInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    setIsMounted(true);
    const data = getStorageData();
    setAlunos(data.alunos);
    setDisciplinas(data.disciplinas);
    setMedias(data.medias);
  }, []);

  if (!isMounted) return null;

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const calcularSituacao = (valor: number | null): { situacao: SituacaoAcademica; cor: string } => {
    if (valor === null) return { situacao: 'Pendente', cor: 'bg-slate-100 text-slate-700 border-slate-300' };
    if (valor < 5) return { situacao: 'Reprovado', cor: 'bg-red-50 text-red-700 border-red-300' };
    if (valor >= 5 && valor < 6) return { situacao: 'Pendente', cor: 'bg-amber-50 text-amber-800 border-amber-300' };
    if (valor >= 6 && valor < 7) return { situacao: 'Recuperação', cor: 'bg-yellow-50 text-yellow-800 border-yellow-300' };
    return { situacao: 'Aprovado', cor: 'bg-green-50 text-green-800 border-green-300' };
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAluno || !selectedDisciplina) {
      showFeedback('Selecione um aluno e uma disciplina.', 'error');
      return;
    }

    const valorNumerico = notaInput === '' ? null : parseFloat(notaInput);

    if (valorNumerico !== null && (isNaN(valorNumerico) || valorNumerico < 0 || valorNumerico > 10)) {
      showFeedback('A média deve ser um valor entre 0 e 10.', 'error');
      return;
    }

    const existe = medias.find(
      (m) => m.alunoId === selectedAluno && m.disciplinaId === selectedDisciplina
    );

    let updatedMedias: MediaEscolar[];

    if (existe) {
      updatedMedias = medias.map((m) =>
        m.id === existe.id ? { ...m, valor: valorNumerico } : m
      );
    } else {
      updatedMedias = [
        ...medias,
        {
          id: `${selectedAluno}-${selectedDisciplina}`,
          alunoId: selectedAluno,
          disciplinaId: selectedDisciplina,
          valor: valorNumerico,
        },
      ];
    }

    saveMedias(updatedMedias);
    setMedias(updatedMedias);
    showFeedback('Média salva com sucesso!', 'success');
    setNotaInput('');
  };

  const handleLimparMedia = (id: string) => {
    const updated = medias.map((m) => (m.id === id ? { ...m, valor: null } : m));
    saveMedias(updated);
    setMedias(updated);
    showFeedback('Média redefinida para nula.', 'success');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Lançamento de Notas e Médias</h2>

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

      {/* Formulário de Lançamento */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Lançar / Atualizar Média</h3>
        <form onSubmit={handleSaveMedia} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Aluno</label>
            <select
              value={selectedAluno}
              onChange={(e) => setSelectedAluno(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 bg-white"
            >
              <option value="">Selecione um aluno...</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} ({a.matricula})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Disciplina</label>
            <select
              value={selectedDisciplina}
              onChange={(e) => setSelectedDisciplina(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 bg-white"
            >
              <option value="">Selecione uma disciplina...</option>
              {disciplinas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Média (0 a 10)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={notaInput}
              onChange={(e) => setNotaInput(e.target.value)}
              placeholder="Deixe vazio para nulo"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition shadow"
            >
              Salvar Média
            </button>
          </div>
        </form>
      </div>

      {/* Tabela Geral de Médias */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Quadro Geral de Médias</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="py-3 px-6 font-semibold">Aluno</th>
                <th className="py-3 px-6 font-semibold">Disciplina</th>
                <th className="py-3 px-6 font-semibold text-center">Média</th>
                <th className="py-3 px-6 font-semibold text-center">Situação</th>
                <th className="py-3 px-6 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {medias.map((m) => {
                const aluno = alunos.find((a) => a.id === m.alunoId);
                const disc = disciplinas.find((d) => d.id === m.disciplinaId);
                if (!aluno || !disc) return null;

                const { situacao, cor } = calcularSituacao(m.valor);

                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-6 font-medium text-slate-900">{aluno.nome}</td>
                    <td className="py-3 px-6">{disc.nome}</td>
                    <td className="py-3 px-6 text-center font-bold">
                      {m.valor !== null ? m.valor.toFixed(1) : 'Nula'}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cor}`}>
                        {situacao}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {m.valor !== null && (
                        <button
                          onClick={() => handleLimparMedia(m.id)}
                          className="text-red-600 hover:underline font-medium text-xs"
                        >
                          Zerar / Nular
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}