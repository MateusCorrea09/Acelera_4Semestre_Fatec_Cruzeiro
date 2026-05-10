import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Modal, QuestionModal } from "../../components/Modal";
import { MyButton } from '../../components/Buttons';
import LCalendar from '../../components/LCalendar';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function CreateQuiz2() {
  const navigate = useNavigate();
  // Estados de Fluxo
  const [creationMode, setCreationMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

 
  const [questions, setQuestions] = useState([]);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [dateRange, setDateRange] = useState(new Date());

 const [enunciado, setEnunciado] = useState("");
  const [correctOption, setCorrectOption] = useState(0);
  const [options, setOptions] = useState(["", "", "", ""]);

 const availableContainers = [
    { id: 1, name: "Soma", count: 15 },
    { id: 2, name: "multiplicação", count: 10 },
    { id: 3, name: "divisão", count: 20 },
  ];

  
  const handleOpenCreate = () => {
    setEditingIndex(null);
    setEnunciado("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
    setIsModalOpen(true);
  };

  
  const handleOpenEdit = (index) => {
    const q = questions[index];
    setEditingIndex(index);
    setEnunciado(q.enunciado);
    setOptions(q.alternativas);
    setCorrectOption(q.correta);
    setIsModalOpen(true);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();

    const questionData = {
      enunciado: enunciado,
      alternativas: options,
      correta: correctOption
    };

    if (editingIndex !== null) {
      
      const updated = [...questions];
      updated[editingIndex] = questionData;
      setQuestions(updated);
    } else {
      
      setQuestions([...questions, questionData]);
    }

    setIsModalOpen(false);
  };
  
  const menuConfig = [
    { label: "Dashboard", onClick: () => navigate('/home-professor') }, 
    { label: "Atividade", onClick: () => navigate('/criar-quiz') },
    { label: "Minhas Salas", onClick: () => navigate('/gerenciar-turmas') },
    { label: "Relatórios", onClick: () => navigate('/relatorios') },
    { label: "Sair", onClick: () => {
        localStorage.clear(); 
        navigate('/'); 
      } 
    },
  ];

  return (
    <DashboardLayout sidebarTitle="Professor"
      menuItems={menuConfig}
      userName="Prof. Nome_professor">
      <S.Container>
        <S.Header>
          <h1>Criar Nova Atividade</h1>
          {creationMode && (
            <MyButton onClick={() => setCreationMode(null)}>Voltar</MyButton>
          )}
        </S.Header>

        {!creationMode ? (
          <S.SelectionGrid>
            <S.ModeCard onClick={() => setCreationMode('auto')}>
              <h3>Gerar Quiz Automático</h3>
              <p>Selecione containers de perguntas e a aplicação montará o quiz para você.</p>
            </S.ModeCard>

            <S.ModeCard onClick={() => setCreationMode('manual')}>
              <h3>Criar Quiz Manual</h3>
              <p>Escreva suas próprias perguntas e respostas para um quiz específico.</p>
            </S.ModeCard>
          </S.SelectionGrid>
        ) : (
          <S.ContentSection>
            {creationMode === 'auto' ? (
              <S.StepContainer>
                <h2>Passo 1: Selecione os Containers</h2>
                <S.ContainerList>
                  {availableContainers.map(c => (
                    <S.ContainerItem key={c.id}>
                      <div>
                        <input
                          type="checkbox"
                          onChange={() => setSelectedContainers([...selectedContainers, c.id])}
                        />
                        <span>{c.name}</span>
                      </div>
                      <small>{c.count} questões</small>
                    </S.ContainerItem>
                  ))}
                </S.ContainerList>
                <MyButton onClick={() => setShowScheduleModal(true)}>Gerar e Agendar</MyButton>
              </S.StepContainer>
            ) : (
              <S.StepContainer>
                <h2>Passo 1: Construir Perguntas</h2>
                <MyButton onClick={handleOpenCreate}>+ Adicionar Pergunta</MyButton>

                <S.QuestionList>
                  {questions.length === 0 ? (
                    <p>Nenhuma pergunta adicionada ainda.</p>
                  ) : (
                    questions.map((q, i) => (
                      <S.QuestionItem key={i} onClick={() => handleOpenEdit(i)}>
                        <div className="info">
                          <strong>{i + 1}. {q.enunciado}</strong>
                          <span>Clique para editar</span>
                        </div>
                        <div className="status-tag">Salva</div>
                      </S.QuestionItem>
                    ))
                  )}
                </S.QuestionList>

                <MyButton
                  onClick={() => setShowScheduleModal(true)}
                  disabled={questions.length === 0}
                >
                  Finalizar e Agendar
                </MyButton>
              </S.StepContainer>
            )}
          </S.ContentSection>
        )}

        {/* Modal de Criação/Edição de Pergunta */}
        {isModalOpen && (
          <QuestionModal
            title={editingIndex !== null ? "Editar Pergunta" : "Nova Pergunta"}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <S.FormQuestion onSubmit={handleSaveQuestion}>
              <div className="input-group">
                <label>Enunciado da Questão</label>
                <textarea
                  name="enunciado"
                  value={enunciado}
                  onChange={(e) => setEnunciado(e.target.value)}
                  placeholder="escreva uma pergunta!"
                  required
                />
              </div>

              <div className="input-group">
                <label>Alternativas (Selecione a correta)</label>
                <S.OptionsGrid>
                  {options.map((opt, index) => (
                    <S.OptionInputGroup
                      key={index}
                      className={correctOption === index ? 'is-correct' : ''}
                    >
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={correctOption === index}
                        onChange={() => setCorrectOption(index)}
                      />
                      <input
                        type="text"
                        placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required
                      />
                    </S.OptionInputGroup>
                  ))}
                </S.OptionsGrid>
              </div>

              <S.ModalFooter>
                <MyButton type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#ccc' }}>
                  Cancelar
                </MyButton>
                <MyButton type="submit">
                  {editingIndex !== null ? "Salvar Alterações" : "Salvar Pergunta"}
                </MyButton>
              </S.ModalFooter>
            </S.FormQuestion>
          </QuestionModal>
        )}

        {/* Modal de Agendamento */}
        {showScheduleModal && (
          <Modal title="Finalizar e Agendar" isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)}>
            <S.CalendarWrapper>
              <header>
                <h3>Data de Liberação</h3>
                <p>O quiz aparecerá para os alunos na data selecionada abaixo.</p>
              </header>
              <LCalendar onDateChange={setDateRange} />
              <S.ModalFooter style={{ width: '100%', marginTop: '20px' }}>
                <MyButton onClick={() => {
                  alert("Quiz registrado com sucesso!");
                  setCreationMode(null);
                  setShowScheduleModal(false);
                }} style={{ width: '100%' }}>
                  Confirmar e Salvar no Banco
                </MyButton>
              </S.ModalFooter>
            </S.CalendarWrapper>
          </Modal>
        )}
      </S.Container>
    </DashboardLayout>
  );
}

export default CreateQuiz2;