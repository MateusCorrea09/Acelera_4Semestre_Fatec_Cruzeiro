import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as S from './style.js';

import {
  Button,
  LinkButton
} from '../../components/Buttons/index.jsx';

import FormBase from '../../components/FormsBase/index.jsx';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    // =====================================================
    // VALIDAÇÕES
    // =====================================================

    if (!email.trim()) {

      alert("Digite seu email.");

      return;
    }

    if (!senha.trim()) {

      alert("Digite sua senha.");

      return;
    }

    try {

      setLoading(true);

      console.log("📩 Enviando login...");

      const response = await fetch(
        'http://localhost:3001/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: email.trim(),
            senha: senha.trim()
          })
        }
      );

      // =====================================================
      // VERIFICA ERRO HTTP
      // =====================================================

      if (!response.ok) {

        const errorText = await response.text();

        console.error(
          "❌ Resposta inválida:",
          errorText
        );

        throw new Error(
          `Erro ${response.status} ao realizar login`
        );
      }

      const data = await response.json();

      console.log(
        "📥 RESPOSTA LOGIN:",
        data
      );

      // =====================================================
      // LOGIN SUCESSO
      // =====================================================

      if (data.success) {

        // =====================================================
        // LIMPA STORAGE ANTIGO
        // =====================================================

        localStorage.clear();

        // =====================================================
        // SALVA DADOS GERAIS
        // =====================================================

        localStorage.setItem(
          'idUsuario',
          String(data.id)
        );

        localStorage.setItem(
          'userName',
          data.nome
        );

        localStorage.setItem(
          'userType',
          String(data.tipo)
        );

        // =====================================================
        // SALVA ID PROFESSOR
        // ESSA ERA A PARTE QUE FALTAVA
        // =====================================================

        if (Number(data.tipo) === 1) {

          localStorage.setItem(
            'idProfessor',
            String(data.id)
          );

          console.log(
            "👨‍🏫 ID PROFESSOR SALVO:",
            localStorage.getItem('idProfessor')
          );
        }

        // =====================================================
        // SALVA ID ALUNO (OPCIONAL)
        // =====================================================

        if (Number(data.tipo) === 2) {

          localStorage.setItem(
            'idAluno',
            String(data.id)
          );

          console.log(
            "👨‍🎓 ID ALUNO SALVO:",
            localStorage.getItem('idAluno')
          );
        }

        // =====================================================
        // DEBUG STORAGE
        // =====================================================

        console.log("✅ DADOS SALVOS");

        console.log(
          "idUsuario:",
          localStorage.getItem('idUsuario')
        );

        console.log(
          "idProfessor:",
          localStorage.getItem('idProfessor')
        );

        console.log(
          "userName:",
          localStorage.getItem('userName')
        );

        console.log(
          "userType:",
          localStorage.getItem('userType')
        );

        // =====================================================
        // REDIRECIONAMENTO
        // =====================================================

        const tipoUsuario =
          parseInt(data.tipo, 10);

        if (tipoUsuario === 1) {

          console.log(
            "👨‍🏫 Redirecionando professor"
          );

          navigate('/home-professor');

        } else {

          console.log(
            "👨‍🎓 Redirecionando aluno"
          );

          navigate('/home-aluno');
        }

      } else {

        alert(
          data.message ||
          "Usuário não encontrado."
        );
      }

    } catch (error) {

      console.error(
        "❌ Erro completo:",
        error
      );

      alert(
        "Não foi possível conectar ao servidor.\n\n" +
        "Verifique:\n" +
        "- Se o backend está rodando\n" +
        "- Porta 3001\n" +
        "- Erros no terminal do Node"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <S.Container>

      <div>
        -Aqui vai ficar outra coisa!
      </div>

      <div>

        <FormBase
          title='Bem-vindo'
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <S.Input
            placeholder='Email'
            name='email'
            type='email'
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* SENHA */}

          <S.Input
            placeholder='Senha'
            name='senha'
            type='password'
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
          />

          <div>

            <S.ButtonContainer>

              <LinkButton
                type='button'
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: '19px'
                }}
              >
                Esqueci minha senha
              </LinkButton>

              <Button
                type='submit'
                disabled={loading}
              >

                {
                  loading
                    ? 'Entrando...'
                    : 'Entrar'
                }

              </Button>

            </S.ButtonContainer>

            {/* ÁREA CADASTRO */}

            <S.RegisterContainer>

              <span>
                Não possui conta?
              </span>

              <S.RegisterLink
                onClick={() => navigate('/cadastro')}
              >
                Criar conta
              </S.RegisterLink>

            </S.RegisterContainer>

          </div>

        </FormBase>

      </div>

    </S.Container>
  );
}

export default Login;