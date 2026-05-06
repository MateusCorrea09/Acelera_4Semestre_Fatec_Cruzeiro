import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ffe8cc;
  padding-bottom: 15px;

  h1 {
    color: #333;
    font-size: 1.8rem;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

export const KPICard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid #fdeedc;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  span {
    color: #666;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  strong {
    color: #ff8c42;
    font-size: 2rem;
  }
`;

export const MainSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr; /* Coluna menor para gráficos, maior para lista */
  gap: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid #fdeedc;
  
  h3 {
    margin-bottom: 20px;
    color: #444;
  }
`;

export const ActivitiesSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid #fdeedc;

  h3 {
    margin-bottom: 20px;
    color: #444;
  }
`;

export const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 15px;
`;

export const ClassCard = styled.div`
  background: ${props => props.isSelected ? '#FF8C42' : '#FFF9F5'};
  border: 2px solid ${props => props.isSelected ? '#FF8C42' : '#FDEEDC'};
  padding: 18px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #FF8C42;
  }

  .class-info {
    strong {
      display: block;
      color: ${props => props.isSelected ? 'white' : '#4A4A4A'};
      font-size: 1rem;
    }
    span {
      font-size: 0.8rem;
      color: ${props => props.isSelected ? 'rgba(255,255,255,0.8)' : '#888'};
    }
  }

  .check-icon {
    color: white;
    font-weight: bold;
  }
`;

export const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #fff9f5;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #fff9f5;
  }

  .info {
    strong { display: block; color: #333; }
    small { color: #888; }
  }
`;