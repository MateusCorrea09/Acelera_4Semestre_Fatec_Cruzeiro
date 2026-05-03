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
  max-width: 500px;
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
    padding-bottom: 10px;

    h2 {
      color: #FF8C42;
      margin: 0;
      font-size: 1.4rem;
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
`;
export const Container = styled(motion.div)`
  position: absolute;
  top: 80px; /* Ajuste conforme a altura da sua Topbar */
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

export const NotificationItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #FFF9F5;
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #FFF9F5;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: #4A4A4A;
  }

  span {
    font-size: 0.75rem;
    color: #FF8C42;
    font-weight: 500;
  }
`;