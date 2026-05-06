import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between; /* Empurra o título para esquerda e o botão para direita */
  align-items: center;
  border-bottom: 2px solid #ffe8cc;
  padding-bottom: 15px;
  width: 100%; /* Garante que ocupe todo o espaço disponível */

  h1 {
    color: #333;
    font-size: 1.8rem;
    margin: 0; /* Remove margens que possam deslocar o texto */
  }
`;

/* Grid Inicial de Seleção de Modo */
export const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 40px;
`;

export const ModeCard = styled.div`
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  &:hover {
    border-color: #ff9d00;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 157, 0, 0.1);
  }

  h3 {
    color: #ff9d00;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

export const ContentSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 1.3rem;
    color: #444;
  }
`;

/* Listagem de Containers (Checkboxes) */
export const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background: #fffaf0;
  border-radius: 8px;
`;

export const ContainerItem = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Espalha o nome e a contagem */
  padding: 15px;
  background: white;
  border: 1px solid #eee;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;

  div {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &:hover {
    background: #fff9f0;
    border-color: #ff9d00;
  }
`;
/* Formulário de Perguntas no Modal */
export const FormQuestion = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* Garante que o formulário tente ocupar o espaço do modal */
  width: 100%; 
  min-width: 500px; /* Aumenta a base de largura do conteúdo */
  
  @media (max-width: 600px) {
    min-width: 100%;
  }
`;

export const OptionInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #eee;
  /* Impede que o grupo de input cresça para fora do grid */
  overflow: hidden; 

  input[type="text"] {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    width: 100%; /* Garante que o input de texto preencha o espaço */
    
    &:focus {
      outline: none;
    }
  }
`;
export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Mantém duas colunas */
  gap: 12px;
  width: 100%; /* Força o grid a respeitar o limite do formulário */
  box-sizing: border-box; /* Garante que padding/border não aumentem a largura */

  /* Se o texto das alternativas for muito longo, 
     podemos passar para 1 coluna em telas menores */
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  header {
    text-align: center;
    margin-bottom: 20px;

    h3 { color: #333; margin-bottom: 5px; }
    p { color: #888; font-size: 0.85rem; }
  }
`;
export const QuestionList = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px dashed #ff9d00;
  border-radius: 8px;
  min-height: 50px;
  text-align: center;
  color: #999;
`;
export const QuestionItem = styled.div`
  background: white;
  border: 1px solid #FDEEDC;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;

  &:hover {
    border-color: #FF8C42;
    background-color: #FFF9F5;
    transform: translateX(5px);
  }

  .info {
    display: flex;
    flex-direction: column;
    strong { color: #4A4A4A; font-size: 0.95rem; }
    span { color: #FF8C42; font-size: 0.75rem; font-weight: bold; }
  }

  .status-tag {
    background: #F0FFF4;
    color: #4CAF50;
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
  }
`;