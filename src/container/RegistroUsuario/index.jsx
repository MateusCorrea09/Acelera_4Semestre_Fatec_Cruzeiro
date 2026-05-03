import React, { useState } from 'react'; // Removido 'Children'
import * as S from './style.js';
import Lixo from '../../assets/Icons/icons8-lixo.svg';
import {Button, BackButton} from '../../components/Buttons/index.jsx';
import FormBase from '../../components/FormsBase/index.jsx';
import { MyButton } from '../../components/Buttons/style.js';


function RegistroUsuario() {
  const voltarParaLogin = () => {
    console.log("Voltando...");
  };

  return (
    <S.Container>
      <BackButton onClick={voltarParaLogin}>Voltar</BackButton>
      <FormBase title='Cadastro de usuários'>
        <S.Input placeholder='Nome' name='Nome' type='text' />
        <S.Input placeholder='Idade' name='Idade' type='number' />
        <S.Input placeholder='Email' name='Email' type='email' />
        <S.Input placeholder='Senha' name='Senha' type='text' />
        <Button type='submit'>Cadastrar</Button>
      </FormBase>

    </S.Container>
  )
}
export default RegistroUsuario;