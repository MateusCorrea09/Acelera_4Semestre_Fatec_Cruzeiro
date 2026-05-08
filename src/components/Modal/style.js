import styled from "styled-components";
import { motion } from "framer-motion";

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(3px); 
`;

export const ModalContainer = styled(motion.div)`
  background-color: white;
  width: 90%;
  max-width: 700px; 
  border-radius: 24px;
  padding: 30px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #FDEEDC;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #FFF9F5;
    padding-bottom: 15px;

    h2 {
      color: #FF8C42;
      margin: 0;
      font-size: 1.6rem;
      font-weight: bold;
    }

    button {
      background: #FDEEDC;
      border: none;
      color: #FF8C42;
      font-size: 1.5rem;
      cursor: pointer;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;

      &:hover {
        background-color: #FF8C42;
        color: white;
      }
    }
  }
`;

export const Content = styled.div`
  color: #6D6D6D;
  line-height: 1.6;
  width: 100%;
`;

export const FormQuestion = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 600;
      color: #4A4A4A;
      font-size: 0.95rem;
    }

    textarea {
      width: 100%;
      min-height: 100px;
      padding: 15px;
      border: 1.5px solid #FDEEDC;
      border-radius: 12px;
      background: #FFFBFA;
      resize: none;
      font-family: inherit;
      transition: 0.2s;

      &:focus {
        outline: none;
        border-color: #FF8C42;
        background: white;
      }
    }
  }
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Duas colunas para as alternativas */
  gap: 15px;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr; 
  }
`;

export const OptionInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFF9F5;
  padding: 12px;
  border-radius: 12px;
  border: 1.5px solid #FDEEDC;
  transition: 0.2s;

  &.is-correct {
    border-color: #4CAF50;
    background: #F0FFF4;
  }

  input[type="radio"] {
    accent-color: #FF8C42;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  input[type="text"] {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    color: #4A4A4A;

    &:focus {
      outline: none;
    }
  }

  &:focus-within {
    border-color: #FF8C42;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #FFF9F5;
`;


export const Container = styled(motion.div)`
  position: absolute;
  top: 80px; 
  right: 30px;
  width: 320px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(255, 140, 66, 0.15);
  border: 1px solid #FDEEDC;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 15px 20px;
  background-color: #FDEEDC;
  color: #FF8C42;
  font-weight: bold;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
`;

export const List = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;
// Adicione/Substitua no seu arquivo de estilos

export const NotificationItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #FFF9F5;
  transition: background 0.2s;

  &:hover {
    background-color: #FFF9F5;
  }

  .content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .text-section {
    flex: 1;

    p {
      margin: 0;
      font-size: 0.85rem;
      color: #4A4A4A;
      line-height: 1.4;
    }

    span {
      font-size: 0.7rem;
      color: #FF8C42;
      font-weight: 500;
      display: block;
      margin-top: 4px;
    }
  }

  .action-button {
    background-color: #FF8C42;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
    white-space: nowrap;

    &:hover {
      background-color: #e67e35;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;