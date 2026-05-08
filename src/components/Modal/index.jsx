import React from 'react';
import { AnimatePresence } from 'framer-motion';
import * as S from './style';

export function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <S.Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <S.ModalContainer
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <h2>{title}</h2>
              <button onClick={onClose}>&times;</button>
            </header>

            <S.Content>
              {children}
            </S.Content>
          </S.ModalContainer>
        </S.Overlay>
      )}
    </AnimatePresence>
  );
}


export function NotificationModal({ isOpen, notifications = [] }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <S.Container
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <S.Header>
            Notificações
            <span>{notifications.length}</span>
          </S.Header>
          <S.List>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <S.NotificationItem key={notif.id}>
                  <div className="content-wrapper">
                    <div className="text-section">
                      <p>{notif.text}</p>
                      <span>{notif.time}</span>
                    </div>
                    
                    {notif.isQuiz && (
                      <button 
                        className="action-button"
                        onClick={() => {
                          console.log("Redirecionando para o quiz:", notif.quizId);
                          // Aqui você usaria o useNavigate() do react-router-dom futuramente
                          // navigate(`/quiz/${notif.quizId}`);
                        }}
                      >
                        Fazer
                      </button>
                    )}
                  </div>
                </S.NotificationItem>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
                Nenhuma notificação nova.
              </div>
            )}
          </S.List>
        </S.Container>
      )}
    </AnimatePresence>
  );
}

export function QuestionModal({ title, isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <S.Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <S.ModalContainer
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <h2>{title}</h2>
              <button onClick={onClose}>&times;</button>
            </header>

            <S.Content>
              {children}
            </S.Content>
          </S.ModalContainer>
        </S.Overlay>
      )}
    </AnimatePresence>
  );
}

export function ReviewModal({ isOpen, onClose, quizTitle, children }) {
  if (!isOpen) return null;
  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer 
        style={{ maxWidth: '800px', width: '95%' }} // Um pouco mais largo para tabelas/listas
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <div>
            <span style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Revisão de Desempenho</span>
            <h2 style={{ marginTop: '5px' }}>{quizTitle}</h2>
          </div>
          <button onClick={onClose}>&times;</button>
        </header>
        <S.Content>{children}</S.Content>
      </S.ModalContainer>
    </S.Overlay>
  );
}