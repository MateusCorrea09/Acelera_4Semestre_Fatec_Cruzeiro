import styled from "styled-components";
import { motion } from "framer-motion";

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
`;

export const SearchBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;

  input {
    flex: 1;
    padding: 12px 20px;
    border-radius: 15px;
    border: 1px solid #FDEEDC;
    background-color: #FFF9F5;
    outline: none;
    color: #6D6D6D;
    transition: 0.3s;

    &:focus {
      border-color: #FF8C42;
      box-shadow: 0 0 0 2px rgba(255, 140, 66, 0.1);
    }
  }
`;

export const InteractionsArea = styled.div`
  background: white;
  border-radius: 24px;
  padding: 20px;
  border: 1px solid #FDEEDC;

  .label-tab {
    font-weight: bold;
    color: #FF8C42;
    margin-bottom: 20px;
    font-size: 1.1rem;
    padding-left: 5px;
  }
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 15px;
  
  /* Esconder scrollbar mas manter funcionalidade */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const FooterPanel = styled.footer`
  margin-top: 10px;
  padding: 20px;
  background-color: #FFF9F5;
  border-radius: 18px;
  color: #FF8C42;
  font-weight: 500;
  text-align: center;
  border: 1px dashed #FF8C42;
`;