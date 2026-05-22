import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import * as S from './style.js';

import {
  Button,
  BackButton
} from '../../components/Buttons/index.jsx';

import FormBase
  from '../../components/FormsBase/index.jsx';

function RegistroUsuario() {

  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [nome, setNome] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [senha, setSenha] =
    useState('');

  const [ra, setRa] =
    useState('');

  const [tipoUsuario] =
    useState(2);

  const [idTurma, setIdTurma] =
    useState('');

  const [turmas, setTurmas] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // CARREGAR TURMAS
  // =====================================================

  useEffect(() => {

    const carregarTurmas = async () => {

      try {

        const response =
          await fetch(
            'http://localhost:3001/turmas'
          );

        const data =
          await response.json();

        console.log(
          "📚 TURMAS:",
          data
        );

        setTurmas(data);

      } catch (error) {

        console.error(
          "❌ Erro carregar turmas:",
          error
        );
      }
    };

    carregarTurmas();

  }, []);

  // =====================================================
  // CADASTRO
  // =====================================================

  const handleCadastro = async (e) => {

    e.preventDefault();

    // =====================================================
    // VALIDAÇÕES
    // =====================================================

    if (!nome.trim()) {

      alert('Digite seu nome');

      return;
    }

    if (!email.trim()) {

      alert('Digite seu email');

      return;
    }

    if (!senha.trim()) {

      alert('Digite sua senha');

      return;
    }

    if (!ra.trim()) {

      alert('Digite seu RA');

      return;
    }

    if (!idTurma) {

      alert('Selecione uma turma');

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        'http://localhost:3001/registro',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({

            nome,
            email,
            senha,
            tipoUsuario,
            ra,
            idTurma
          })
        }
      );

      const data =
        await response.json();

      console.log(
        "📥 RESPOSTA:",
        data
      );

      if (data.success) {

        alert(
          'Cadastro realizado com sucesso!'
        );

        navigate('/');

      } else {

        alert(
          data.error ||
          'Erro ao cadastrar'
        );
      }

    } catch (error) {

      console.error(
        "❌ Erro cadastro:",
        error
      );

      alert(
        'Erro ao cadastrar usuário'
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <S.Container>

      <S.Content>

        <BackButton
          onClick={() => navigate('/')}
        >
          Voltar
        </BackButton>

        <FormBase
          title='Cadastro de aluno'
          onSubmit={handleCadastro}
        >

          <S.InfoText>
            Turmas encontradas:
            {' '}
            {turmas.length}
          </S.InfoText>

          <S.Input
            placeholder='Nome'
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <S.Input
            placeholder='Email'
            type='email'
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <S.Input
            placeholder='Senha'
            type='password'
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
          />

          <S.Input
            placeholder='RA'
            value={ra}
            onChange={(e) =>
              setRa(e.target.value)
            }
          />

          {/* SELECT TURMAS */}

          <S.Select
            value={idTurma}
            onChange={(e) =>
              setIdTurma(e.target.value)
            }
          >

            <option value="">
              Selecione sua turma
            </option>

            {
              turmas.map((turma) => (

                <option
                  key={turma.id}
                  value={turma.id}
                >
                  {turma.nome}
                </option>

              ))
            }

          </S.Select>

          <Button
            type='submit'
            disabled={loading}
          >

            {
              loading
                ? 'Cadastrando...'
                : 'Cadastrar'
            }

          </Button>

        </FormBase>

      </S.Content>

    </S.Container>
  );
}

export default RegistroUsuario;