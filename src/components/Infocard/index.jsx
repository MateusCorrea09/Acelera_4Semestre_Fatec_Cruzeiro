import React from 'react';
import * as S from './style';

function InfoCard({ icon, title, tag, footerText, onClick }) {
  return (
    <S.Card onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="icon-placeholder">{icon}</div>
      <h3>{title}</h3>
      {tag && <div className="tag">{tag}</div>}
      <div className="footer-box">
        {footerText}
      </div>
    </S.Card>
  );
}

export default InfoCard;