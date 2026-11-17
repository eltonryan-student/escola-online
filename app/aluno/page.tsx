'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedUser, setLoggedUser, getStorageData } from '../services/storage';
import { User, Aluno, Disciplina, MediaEscolar, SituacaoAcademica } from '../types';

export default function AlunoDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [alunoData, setAlunoData] = useState<Aluno | null>(null);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [medias, setMedias] = useState<MediaEscolar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged || logged.role !== 'aluno') {
      router.push('/');
      return;
    }
    setUser(logged);

    const data = getStorageData();
    const currentAluno = data.alunos.find((a) => a.id === logged.alunoId);
    setAlunoData(currentAluno || null);
    setDisciplinas(data.disciplinas);
    setMedias(data.medias);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    setLoggedUser(null);
    router.push('/');
  };

  const calcularSituacao = (valor: number | null): { situacao: SituacaoAcademica; cor: string } => {
    if (valor === null) return { situacao: 'Pendente', cor: 'bg-slate-100 text-slate-700 border-slate-300' };
    if (valor < 5) return { situacao: 'Reprovado', cor: 'bg-red-50 text-red-700 border-red-300' };
    if (valor >= 5 && valor < 6) return { situacao: 'Pendente', cor: 'bg-amber-50 text-amber-800 border-amber-300' };
    if (valor >= 6 && valor < 7) return { situacao: 'Recuperação', cor: 'bg-yellow-50 text-yellow-800 border-yellow-300' };
    return { situacao: 'Aprovado', cor: 'bg-green-50 text-green-800 border-green-300' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Carregando boletim...
      </div>
    );
  }

  // Filtrar médias do aluno logado
  const minhasMedias = medias.filter((m) => m.alunoId === alunoData?.id);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-blue-900 text-white shadow-md px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Escola Online - Portal do Aluno</h1>
          <p className="text-xs text-blue-200">Matrícula: {alunoData?.matricula}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Olá, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Meu Boletim Escolar</h2>
          <p className="text-sm text-slate-600">
            Acompanhe abaixo suas disciplinas, médias obtidas e situação acadêmica atualizada.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="py-3 px-6 font-semibold">Disciplina</th>
                  <th className="py-3 px-6 font-semibold">Professor</th>
                  <th className="py-3 px-6 font-semibold text-center">Média Final</th>
                  <th className="py-3 px-6 font-semibold text-center">Situação Acadêmica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {disciplinas.map((disc) => {
                  const mediaObj = minhasMedias.find((m) => m.disciplinaId === disc.id);
                  const valorMedia = mediaObj ? mediaObj.valor : null;
                  const { situacao, cor } = calcularSituacao(valorMedia);

                  return (
                    <tr key={disc.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-6 font-medium text-slate-900">{disc.nome}</td>
                      <td className="py-4 px-6 text-slate-600">{disc.professor}</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-800">
                        {valorMedia !== null ? valorMedia.toFixed(1) : '—'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cor}`}>
                          {situacao}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}