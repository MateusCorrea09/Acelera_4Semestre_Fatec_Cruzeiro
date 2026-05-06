import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import * as S from './style';

// Note o ", ...props" adicionado abaixo dentro das chaves { }
const LCalendar = ({ onDateChange, quizzesAgendados = [], ...props }) => {
  const [date, setDate] = useState(new Date());

  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    if (onDateChange) onDateChange(selectedDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dataFormatada = date.toISOString().split('T')[0];
      if (quizzesAgendados.includes(dataFormatada)) {
        return 'highlight-quiz'; 
      }
    }
    return null;
  };

  return (
    <S.CalendarContainer>
      <Calendar
        {...props} // Agora o sistema sabe o que é 'props'
        onChange={handleChange}
        value={date}
        locale="pt-BR"
        tileClassName={tileClassName}
      />
    </S.CalendarContainer>
  );
};

export default LCalendar;