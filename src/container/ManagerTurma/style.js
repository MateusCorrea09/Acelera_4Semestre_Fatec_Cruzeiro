import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h1 {
    color: #333;
    font-size: 1.8rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

export const ContentSection = styled.section`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

export const SectionTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: #444;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f9fa;
    color: #666;
  }

  button {
    background: none;
    border: 1px solid #ff9d00;
    color: #ff9d00;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background: #ff9d00;
      color: #fff;
    }
  }
`;

export const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white; 
  z-index: 9999; /* Garante que fique por cima de tudo */
`;
