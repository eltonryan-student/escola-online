export type Role = 'admin' | 'aluno';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  alunoId?: string; // Vincula o login do aluno ao seu registro correspondente
}

export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  email: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  professor: string;
}

export interface MediaEscolar {
  id: string;
  alunoId: string;
  disciplinaId: string;
  valor: number | null; // Nulo inicialmente conforme os requisitos
}

export type SituacaoAcademica = 'Aprovado' | 'Recuperação' | 'Reprovado' | 'Pendente';