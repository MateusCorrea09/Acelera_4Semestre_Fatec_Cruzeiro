import styled, { keyframes } from 'styled-components';

// --- ANIMAÇÕES ---

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.6; }
`;

const popIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

// --- ESTILOS DA TELA IMERSIVA (QUIZ) ---

export const ImmersiveWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #FFF9F5; 
  display: flex;
  flex-direction: column;
  z-index: 9999;
  padding: 40px;
`;

export const QuizHeader = styled.header`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  .top-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    span { color: #888; font-weight: 500; text-transform: uppercase; font-size: 0.9rem; }
    strong { color: #FF8C42; font-size: 1.4rem; }
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #FDEEDC;
  border-radius: 20px;
  overflow: hidden;

  .fill {
    height: 100%;
    background: #FF8C42;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const QuestionText = styled.h1`
  font-size: 3.5rem;
  color: #333;
  max-width: 950px;
  margin-bottom: 40px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const HardwareStatus = styled.div`
  background: white;
  padding: 15px 35px;
  border-radius: 50px;
  box-shadow: 0 10px 25px rgba(255, 140, 66, 0.12);
  display: flex;
  align-items: center;
  gap: 15px;
  color: #FF8C42;
  font-weight: 600;

  .pulse-dot {
    width: 12px;
    height: 12px;
    background: #FF8C42;
    border-radius: 50%;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

// --- ESTILOS DA TELA DE FINALIZAÇÃO (RESULTADOS) ---

export const FinishContainer = styled.div`
  background: white;
  padding: 50px;
  border-radius: 40px;
  border: 1px solid #FDEEDC;
  text-align: center;
  max-width: 550px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);

  .rank-icon {
    font-size: 7rem;
    margin-bottom: 20px;
    animation: ${popIn} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: block;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  p {
    color: #777;
    font-size: 1.1rem;
    margin-bottom: 10px;
    strong { color: #333; }
  }
`;

export const StatsInfo = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  margin-top: 15px;

  div {
    flex: 1;
    background: #FFF9F5;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid #FDEEDC;
    
    strong { font-size: 2rem; color: #333; display: block; margin-bottom: 5px; }
    span { font-size: 0.8rem; color: #999; text-transform: uppercase; font-weight: bold; }
  }
`;

// --- SIMULADOR PARA DESENVOLVIMENTO ---

export const FooterSim = styled.footer`
  padding: 30px;
  text-align: center;
  border-top: 2px dashed #FDEEDC;

  p { font-size: 0.85rem; color: #BBB; margin-bottom: 20px; }
  
  .btn-group {
    display: flex;
    justify-content: center;
    gap: 20px;

    button {
      width: 70px;
      height: 70px;
      border-radius: 20px;
      border: 2px solid #FF8C42;
      background: white;
      color: #FF8C42;
      font-size: 1.8rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #FF8C42;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(255, 140, 66, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
`;