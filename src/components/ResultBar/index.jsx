import React from 'react';
import * as S from './style';

/**
 * @param {number} percentage - Valor de 0 a 100
 * @param {string} label - Texto descritivo (ex: "Média de Acertos")
 * @param {string} color - Cor da barra (opcional, padrão é o verde do Luzio)
 */
const ResultBar = ({ percentage, label, color }) => {
  // Garante que o valor não escape do intervalo 0-100
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <S.Wrapper>
      <S.Info>
        <span className="label">{label}</span>
        <span className="value">{safePercentage}%</span>
      </S.Info>
      
      <S.BarContainer>
        <S.ProgressFill 
          percentage={safePercentage} 
          color={color}
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </S.BarContainer>
    </S.Wrapper>
  );
};

export default ResultBar;