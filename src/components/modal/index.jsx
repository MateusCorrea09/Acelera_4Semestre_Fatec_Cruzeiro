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
                  <p>{notif.text}</p>
                  <span>{notif.time}</span>
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