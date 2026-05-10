import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style.js';
import { Button, LinkButton } from '../../components/Buttons/index.jsx';
import FormBase from '../../components/FormsBase/index.jsx';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
       
        localStorage.setItem('userName', data.nome);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userType', data.tipo);

        if (data.tipo === 1) navigate('/home-professor');
        else navigate('/home-aluno');
      } else {
        alert("Usuário não encontrado!");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Não foi possível conectar ao servidor. Verifique se o Node está rodando na porta 3001.");
    }
  };

  return (
    <S.Container>
      <div>-Aqui vai ficar outra coisa!</div>
      <div>
        {/* Adicione o onSubmit no formulário */}
        <FormBase title='Bem-vindo' onSubmit={handleLogin}>
          <S.Input
            placeholder='Email'
            name='Email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <S.Input
            placeholder='Senha'
            name='Senha'
            type='password' 
            value={senha}
            onChange={(e) => setSenha(e.target.value)} 
          />
          <div>
            <S.ButtonContainer>
              <LinkButton type='button' style={{ alignSelf: 'flex-end', marginBottom: '19px' }}>
                Esqueci minha senha
              </LinkButton>
              <Button type='submit'>
                Entrar
              </Button>
            </S.ButtonContainer>
          </div>
        </FormBase>
      </div>
    </S.Container>
  );
}

export default Login;