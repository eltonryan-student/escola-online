import { User, Aluno, Disciplina, MediaEscolar } from '../types';
import { MOCK_USERS, MOCK_ALUNOS, MOCK_DISCIPLINAS, MOCK_MEDIAS } from '../data/mockData';

const USERS_KEY = 'escola_online_users';
const ALUNOS_KEY = 'escola_online_alunos';
const DISCIPLINAS_KEY = 'escola_online_disciplinas';
const MEDIAS_KEY = 'escola_online_medias';
const LOGGED_USER_KEY = 'escola_online_logged_user';

// Inicializa o LocalStorage com os dados mockados caso esteja vazio
export const initLocalStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(ALUNOS_KEY)) {
    localStorage.setItem(ALUNOS_KEY, JSON.stringify(MOCK_ALUNOS));
  }
  if (!localStorage.getItem(DISCIPLINAS_KEY)) {
    localStorage.setItem(DISCIPLINAS_KEY, JSON.stringify(MOCK_DISCIPLINAS));
  }
  if (!localStorage.getItem(MEDIAS_KEY)) {
    localStorage.setItem(MEDIAS_KEY, JSON.stringify(MOCK_MEDIAS));
  }
};

// Funções de Leitura
export const getStorageData = () => {
  if (typeof window === 'undefined') {
    return { users: MOCK_USERS, alunos: MOCK_ALUNOS, disciplinas: MOCK_DISCIPLINAS, medias: MOCK_MEDIAS };
  }
  initLocalStorage();
  return {
    users: JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[],
    alunos: JSON.parse(localStorage.getItem(ALUNOS_KEY) || '[]') as Aluno[],
    disciplinas: JSON.parse(localStorage.getItem(DISCIPLINAS_KEY) || '[]') as Disciplina[],
    medias: JSON.parse(localStorage.getItem(MEDIAS_KEY) || '[]') as MediaEscolar[],
  };
};

// Funções de Salvamento
export const saveAlunos = (alunos: Aluno[]) => {
  localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
};

export const saveDisciplinas = (disciplinas: Disciplina[]) => {
  localStorage.setItem(DISCIPLINAS_KEY, JSON.stringify(disciplinas));
};

export const saveMedias = (medias: MediaEscolar[]) => {
  localStorage.setItem(MEDIAS_KEY, JSON.stringify(medias));
};

// Controle de Sessão do Usuário Logado
export const getLoggedUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(LOGGED_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setLoggedUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOGGED_USER_KEY);
  }
};