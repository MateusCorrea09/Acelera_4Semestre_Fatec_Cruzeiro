import styled from "styled-components";

export const Card = styled.div`
  background-color: white;
  border-radius: 18px;
  padding: 20px;
  border: 1px solid #FDEEDC;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(255, 140, 66, 0.1);
    border-color: #FF8C42;
  }

/* Procure pela classe do ícone/círculo no seu styled-component do Card */
.icon-placeholder {
  width: 60px; /* ou o tamanho padrão do seu projeto */
  height: 60px;
  background-color: #fdf2e9;
  border-radius: 50%;
  
  /* Centraliza o texto/número perfeitamente */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Garante que o texto encolha um pouco se for o nome de um quiz grande */
  font-size: 0.9rem; 
  font-weight: bold;
  color: #ff7b00;
  text-align: center;
  padding: 5px;
}

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  .tag {
    background-color: #FDEEDC;
    color: #FF8C42;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .footer-box {
    background: linear-gradient(135deg, #FF8C42, #FFA45B);
    width: 100%;
    padding: 10px;
    border-radius: 12px;
    color: white;
    text-align: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;
export const CircleIcon = styled.div`
  width: 80px;  /* ou o tamanho que você definiu */
  height: 80px;
  background-color: #fdf2e9; /* cor bege do seu print */
  border-radius: 50%;
  
  /* Linhas cruciais para centralizar o texto/número perfeitamente no meio do círculo */
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-weight: bold;
  color: #ff7b00; /* Laranja correspondente à sua identidade */
  font-size: 1.2rem;
`;