import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #FFF9F5; // Fundo Pastel
  color: #4A4A4A;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden; /* Evita barras de rolagem estranhas no layout principal */
`;

export const Sidebar = styled.aside`
  width: 240px;
  background-color: #FDEEDC; // Creme Pastel
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  border-right: 1px solid #FAD4AE;
  height: 100%;

  h2 {
    color: #FF8C42; // Laranja padrão do sistema
    padding: 0 25px;
    margin-bottom: 40px;
    font-size: 1.2rem;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  button {
    background: transparent;
    border: none;
    color: #6D6D6D;
    text-align: left;
    padding: 15px 25px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #FF8C42;
      color: white;
      padding-left: 35px;
    }
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Permite rolar apenas o conteúdo central */
`;

export const HeaderArea = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;

  span {
    font-weight: 600;
    color: #FF8C42;
  }

  .avatar-circle {
    width: 45px;
    height: 45px;
    background-color: #FFDAB9;
    border: 2px solid #FF8C42;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
`;