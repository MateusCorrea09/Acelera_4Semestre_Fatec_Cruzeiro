import React from 'react';
import * as S from './style';

function InfoCard({ icon, title, tag, footerText, onClick, value }) {
  // Verificamos se o 'value' é um texto longo (mais de 5 caracteres)
  const isTextLong = typeof value === 'string' && value.length > 5;

  return (
    <S.Card onClick={onClick} style={{ cursor: 'pointer' }}>
      
      {/* Círculo do topo */}
      <div className="icon-placeholder">
        {/* Se o texto for longo, colocamos um ponto de exclamação decorativo na bolinha. 
            Se for curto (número), renderiza dentro da bolinha normalmente */}
        {icon ? icon : (isTextLong ? "⚠️" : value)}
      </div>
      
      <h3>{title}</h3>

      {/* 🌟 NOVIDADE: Se o texto for longo (ex: nome do quiz), ele ganha um destaque lindo aqui embaixo */}
      {isTextLong && (
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: '#e67e3a',
          margin: '10px 0',
          textAlign: 'center',
          lineHeight: '1.3'
        }}>
          {value}
        </div>
      )}
      
      {tag && <div className="tag">{tag}</div>}
      
      <div className="footer-box">
        {footerText}
      </div>
    </S.Card>
  );
}

export default InfoCard;