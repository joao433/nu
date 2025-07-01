// Este é um serviço de simulação para buscar dados do usuário.
// Em uma aplicação real, isso faria uma chamada de API para um backend.

export interface UserData {
  cpf: string;
  nomeCompleto: string;
  dataNascimento: string;
  nomeMae: string;
}

// Simula um banco de dados com alguns CPFs de exemplo.
const mockDatabase: Record<string, Omit<UserData, 'cpf'>> = {
  "11111111111": {
    nomeCompleto: "João da Silva",
    dataNascimento: "10/01/1990",
    nomeMae: "Maria da Silva",
  },
  "22222222222": {
    nomeCompleto: "Maria Oliveira",
    dataNascimento: "25/08/1988",
    nomeMae: "Ana Oliveira",
  },
};

// Dados padrão para qualquer outro CPF.
const defaultUser = {
    nomeCompleto: "Maria Aparecida da Silva",
    dataNascimento: "15/05/1985",
    nomeMae: "Joana Pereira da Silva",
}

export async function getUserDataByCpf(cpf: string): Promise<UserData> {
  // Simula um atraso de rede.
  await new Promise(resolve => setTimeout(resolve, 500));

  const userData = mockDatabase[cpf] || defaultUser;
  
  return {
    cpf,
    ...userData,
  };
}
