import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #FFF9F5; // Fundo Pastel
  color: #4A4A4A;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Panel = styled.div`
  background-color: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(255, 140, 66, 0.05);
  display: flex;
  flex-direction: column;
  gap: 25px;
  border: 1px solid #FDEEDC;
`;

export const SearchBar = styled.div`
  display: flex;
  justify-content: flex-end;
  
  input {
    padding: 12px 20px;
    border-radius: 12px;
    border: 2px solid #FDEEDC;
    background-color: white;
    width: 250px;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: #FF8C42;
    }
  }
`;

export const InteractionsArea = styled.div`
  background-color: #FFF9F5;
  border-radius: 20px;
  padding: 30px;
  border: 1px dashed #FAD4AE;
  position: relative;
  margin-top: 10px;

  .label-tab {
    position: absolute;
    top: -18px;
    left: 30px;
    background-color: #FF8C42;
    padding: 6px 20px;
    border-radius: 8px;
    font-weight: bold;
    color: white;
    font-size: 0.9rem;
    box-shadow: 0 4px 10px rgba(255, 140, 66, 0.2);
  }
`;

export const CarouselTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
`;

export const FooterPanel = styled.div`
  background-color: #FDEEDC;
  height: 80px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #FF8C42;
  font-weight: 500;
  border: 1px solid #FAD4AE;
`;