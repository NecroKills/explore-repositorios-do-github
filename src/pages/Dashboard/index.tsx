import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

// FC = Function Component
const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repostories',
    );

    // JSON.parse Desconverter o storagedRepositories em array
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  // Salvar os repositories no localStorage, sempre que repositories for alterado
  // o JSON.stringify transforma o array
  // em um objeto json.
  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repostories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  // adição de um novo repositorio
  async function hadleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    // Faz com que o form não atualiza a pagina ao dar submit
    event.preventDefault();
    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (Err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      {/* Se houver erros, então o inputError é true */}
      <Form hasError={!!inputError} onSubmit={hadleAddRepository}>
        {/* onChange pega o e de evento e chama o setNewRepo
        armazenando o valor do imput */}
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {/* Condição que se houver erro então mostra o erro  */}
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
