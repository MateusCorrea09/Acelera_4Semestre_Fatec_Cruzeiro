import React from 'react';
import { AnimatePresence } from 'framer-motion';
import * as S from './style';
import { MyButton } from '../Buttons';

// 1. Modal Geral (Uso padrão)
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

// 2. Modal de Notificações

export function NotificationModal({
  isOpen,
  notifications = [],
  onDecidir
}) {

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '55px',
        right: '0',
        width: '350px',
        maxHeight: '400px',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: '12px',
        padding: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 999
      }}
    >
      <h3
        style={{
          marginBottom: '15px',
          color: '#333'
        }}
      >
        Notificações
      </h3>

      {notifications.length === 0 ? (

        <p
          style={{
            color: '#777'
          }}
        >
          Nenhuma solicitação pendente.
        </p>

      ) : (

        notifications.map((notif, index) => (

          <div
            key={`${notif.idAluno}-${notif.idTurma}-${index}`}
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '12px',
              marginBottom: '12px'
            }}
          >
            <p
              style={{
                marginBottom: '10px',
                color: '#444',
                fontSize: '14px',
                lineHeight: '20px'
              }}
            >
              {notif.mensagem}
            </p>

            <div
              style={{
                display: 'flex',
                gap: '10px'
              }}
            >
              <button
                onClick={() =>
                  onDecidir(
                    notif.idTurma,
                    notif.idAluno,
                    'APROVAR'
                  )
                }
                style={{
                  flex: 1,
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Aprovar
              </button>

              <button
                onClick={() =>
                  onDecidir(
                    notif.idTurma,
                    notif.idAluno,
                    'RECUSAR'
                  )
                }
                style={{
                  flex: 1,
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Recusar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 3. Modal de Perguntas
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



// 5. Modal de Revisão Pedagógica (Recuperado para a página ManagerTurma)
export function ReviewModal({ isOpen, onClose, quizTitle, children }) {
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
            style={{ maxWidth: '700px', width: '90%' }}
          >
            <header>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#ff7b00', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                  Análise de Desempenho
                </span>
                <h2>{quizTitle || "Revisão do Quiz"}</h2>
              </div>
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

// 6. VARIANT: Modal Especializado com o Formulário de Pergunta
export function FormQuestionModal({
  isOpen,
  onClose,
  title,
  enunciado,
  setEnunciado,
  options,
  handleOptionChange,
  correctOption,
  setCorrectOption,
  onSubmit
}) {
  return (
    <QuestionModal title={title} isOpen={isOpen} onClose={onClose}>
      {/* Nota: Se o S.FormQuestion depender estritamente do style da página CreateQuiz, 
        podemos usar uma tag form padrão estilizada aqui para manter o componente auto-suficiente.
      */}
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: '500' }}>Enunciado da Questão</label>
          <textarea
            value={enunciado}
            onChange={(e) => setEnunciado(e.target.value)}
            placeholder="Escreva o enunciado aqui..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px' }}
            required
          />
        </div>

        {options.map((option, index) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }} key={index}>
            <label style={{ fontWeight: '500' }}>Alternativa {String.fromCharCode(65 + index)}</label>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Texto da alternativa ${String.fromCharCode(65 + index)}`}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: '500' }}>Alternativa Correta</label>
          <select 
            value={correctOption} 
            onChange={(e) => setCorrectOption(Number(e.target.value))}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff' }}
          >
            {options.map((_, index) => (
              <option key={index} value={index}>
                Alternativa {String.fromCharCode(65 + index)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <MyButton type="submit" style={{ backgroundColor: '#4CAF50' }}>Salvar</MyButton>
          <MyButton type="button" onClick={onClose} style={{ backgroundColor: '#f44336' }}>Cancelar</MyButton>
        </div>
      </form>
    </QuestionModal>
  );
}

// 7. VARIANT: Modal Especializado para Agendamento e Seleção de Turma
export function ScheduleQuizModal({
  isOpen,
  onClose,
  classes,
  selectedTurmaId,
  setSelectedTurmaId,
  dateRange,
  setDateRange,
  onConfirm,
  isSaving
}) {
  return (
    <Modal title="Agendar e Selecionar Turma" isOpen={isOpen} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Selecione a Turma:</label>
          <select 
            value={selectedTurmaId} 
            onChange={(e) => setSelectedTurmaId(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff' }}
          >
            {classes && classes.length > 0 ? (
              classes.map((c) => (
                <option key={c.IDTURMA || c.id} value={c.IDTURMA || c.id}>
                  {c.NOMETURMA || c.nome || `Turma ${c.IDTURMA || c.id}`}
                </option>
              ))
            ) : (
              <option value="">Nenhuma turma carregada</option>
            )}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Data de Liberação (Calendário):</label>
          <input 
            type="date" 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <MyButton type="button" onClick={onConfirm} disabled={isSaving} style={{ backgroundColor: '#4CAF50', flex: 1 }}>
            {isSaving ? "Salvando..." : "Confirmar e Enviar para o Banco"}
          </MyButton>
          <MyButton type="button" onClick={onClose} style={{ backgroundColor: '#f44336' }}>
            Cancelar
          </MyButton>
        </div>
      </div>
    </Modal>
  );
}