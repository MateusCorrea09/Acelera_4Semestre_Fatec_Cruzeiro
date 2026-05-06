import styled from 'styled-components';

export const CalendarContainer = styled.div`
  /* Container principal */
  .react-calendar {
    width: 100%;
    max-width: 400px;
    background-color: #fffaf0; /* Um creme leve para o fundo */
    border: 2px solid #ff9d00; /* Laranja Luzio */
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    padding: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  /* Cabeçalho (Mês e Ano) */
  .react-calendar__navigation {
    margin-bottom: 15px;
    
    button {
      color: #ff9d00;
      font-weight: bold;
      font-size: 1.1rem;
      background: none;
      
      &:enabled:hover, &:enabled:focus {
        background-color: #ffe8cc;
        border-radius: 8px;
      }
    }
  }

  /* Dias da semana */
  .react-calendar__month-view__weekdays {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8rem;
    color: #666;
  }

  /* Quadrados dos dias (Tiles) */
  .react-calendar__tile {
    height: 50px;
    border-radius: 8px;
    transition: 0.2s;

    &:enabled:hover, &:enabled:focus {
      background-color: #ff9d00;
      color: white;
    }
  }

  /* Dia selecionado */
  .react-calendar__tile--active {
    background: #ff7b00 !important;
    color: white;
    font-weight: bold;
  }

  /* CLASSE CUSTOMIZADA: Dias com Quiz Agendado */
  .highlight-quiz {
    background-color: #ffefd5;
    border: 2px solid #ff9d00 !important;
    color: #ff9d00;
    font-weight: 900;
    position: relative;

    &::after {
      content: '●';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
    }
  }
`;
