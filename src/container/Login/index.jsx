import React, { useState } from 'react';
import * as S from './style.js';
import { Button, BackButton, LinkButton } from '../../components/Buttons/index.jsx';
import FormBase from '../../components/FormsBase/index.jsx';
import { MyButton } from '../../components/Buttons/style.js';


function Login() {
  return (
    <S.Container >
      <div >
        -Aqui vai ficar outra coisa!
      </div>
      <div>
        <FormBase title='Bem-vindo'>
          <S.Input placeholder='Email' name='Email' type='text' />
          <S.Input placeholder='Senha' name='Senha' type='text' />
          <div>
            <S.ButtonContainer>
              <LinkButton type='button'
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: '19px'
                }}>
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
  )
}
export default Login;