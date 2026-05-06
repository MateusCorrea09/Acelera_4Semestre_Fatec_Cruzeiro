import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .label {
    font-size: 0.95rem;
    font-weight: 600;
    color: #4A4A4A;
  }

  .value {
    font-size: 1.1rem;
    font-weight: bold;
    color: #FF8C42; /* Laranja tema do Luzio */
  }
`;

export const BarContainer = styled.div`
  width: 100%;
  height: 16px;
  background-color: #FDEEDC; /* Fundo suave */
  border-radius: 50px;
  overflow: hidden;
  border: 1px solid #FFF9F5;
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background-color: ${props => props.color || '#4CAF50'}; /* Verde padrão ou cor via prop */
  border-radius: 50px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
`;