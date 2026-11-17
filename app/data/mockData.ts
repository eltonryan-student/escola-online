import { User, Aluno, Disciplina, MediaEscolar } from '../types';

// Usuários para teste de login (Admin e Alunos)
export const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@escola.com', name: 'Administrador Geral', role: 'admin' },
  { id: '2', email: 'aluno1@escola.com', name: 'Ana Silva', role: 'aluno', alunoId: 'a1' },
  { id: '3', email: 'aluno2@escola.com', name: 'José Santos', role: 'aluno', alunoId: 'a2' },
];

// 10 Alunos fictícios exigidos pelo requisito
export const MOCK_ALUNOS: Aluno[] = [
  { id: 'a1', nome: 'Ana Silva', matricula: '2026001', email: 'aluno1@escola.com' },
  { id: 'a2', nome: 'José Santos', matricula: '2026002', email: 'aluno2@escola.com' },
  { id: 'a3', nome: 'Carla Souza', matricula: '2026003', email: 'carla@escola.com' },
  { id: 'a4', nome: 'Daniel Oliveira', matricula: '2026004', email: 'daniel@escola.com' },
  { id: 'a5', nome: 'Eduarda Lima', matricula: '2026005', email: 'eduarda@escola.com' },
  { id: 'a6', nome: 'Felipe Costa', matricula: '2026006', email: 'felipe@escola.com' },
  { id: 'a7', nome: 'Gabriela Rocha', matricula: '2026007', email: 'gabriela@escola.com' },
  { id: 'a8', nome: 'Henrique Almeida', matricula: '2026008', email: 'henrique@escola.com' },
  { id: 'a9', nome: 'Isabela Martins', matricula: '2026009', email: 'isabela@escola.com' },
  { id: 'a10', nome: 'João Pedro Mendes', matricula: '2026010', email: 'joao@escola.com' },
];

// Disciplinas padrão da escola
export const MOCK_DISCIPLINAS: Disciplina[] = [
  { id: 'd1', nome: 'Matemática', professor: 'Carlos Silva' },
  { id: 'd2', nome: 'Português', professor: 'Maria Oliveira' },
  { id: 'd3', nome: 'História', professor: 'João Souza' },
  { id: 'd4', nome: 'Ciências', professor: 'Ana Paula' },
];

// Médias inicializadas como nulas para todos os alunos em todas as disciplinas
export const MOCK_MEDIAS: MediaEscolar[] = [];

// Gerando automaticamente as médias nulas (10 alunos x 4 disciplinas = 40 registros nulos)
MOCK_ALUNOS.forEach((aluno) => {
  MOCK_DISCIPLINAS.forEach((disc) => {
    MOCK_MEDIAS.push({
      id: `${aluno.id}-${disc.id}`,
      alunoId: aluno.id,
      disciplinaId: disc.id,
      valor: null, // Valor inicial nulo conforme exigido
    });
  });
});