import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Modal, QuestionModal } from "../../components/Modal";
import { MyButton } from '../../components/Buttons';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function CreateQuiz2() {

  const navigate = useNavigate();

  const idProfessorLogado = Number(
    localStorage.getItem('idProfessor')
  );

  // =========================================================
  // STATES
  // =========================================================

  const [creationMode, setCreationMode] = useState(null);

  const [quizTitle, setQuizTitle] = useState('');

  const [questions, setQuestions] = useState([]);

  const [selectedContainers, setSelectedContainers] = useState([]);

  const [containersDoBanco, setContainersDoBanco] = useState([]);

  const [loadingContainers, setLoadingContainers] = useState(false);

  const [quizzesProfessor, setQuizzesProfessor] = useState([]);

  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const [selectedContainerData, setSelectedContainerData] = useState(null);

  const [novoNomeContainer, setNovoNomeContainer] = useState('');

  const [containerDescription, setContainerDescription] = useState('');

  const [questionsInContainer, setQuestionsInContainer] = useState([]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isContainerModalOpen, setIsContainerModalOpen] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [enunciado, setEnunciado] = useState('');

  const [options, setOptions] = useState(['', '', '', '']);

  const [correctOption, setCorrectOption] = useState(0);

  const [qtdPerguntas, setQtdPerguntas] = useState(5);

  const [classes, setClasses] = useState([]);

  const [selectedTurmaId, setSelectedTurmaId] = useState('');

  const [dateRange, setDateRange] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [isSaving, setIsSaving] = useState(false);

  // =========================================================
  // HELPERS
  // =========================================================

  const getContainerId = (container) =>
    container?.id ||
    container?.IDCONTAINER;

  const getContainerNome = (container) =>
    container?.nome ||
    container?.NOME ||
    'Container';

  const getContainerDescricao = (container) =>
    container?.descricao ||
    container?.DESCRICAO ||
    'Sem descrição';

  // =========================================================
  // FETCH QUIZZES
  // =========================================================

  const fetchQuizzesProfessor = useCallback(async () => {

    try {

      setLoadingQuizzes(true);

      const response = await fetch(
        `http://localhost:3001/quizzes-professor/${idProfessorLogado}`,
        {
          headers: {
            'x-professor-id': idProfessorLogado
          }
        }
      );

      const data = await response.json();

      setQuizzesProfessor(data || []);

    } catch (err) {

      console.error(err);

      setQuizzesProfessor([]);

    } finally {

      setLoadingQuizzes(false);
    }

  }, [idProfessorLogado]);

  // =========================================================
  // FETCH CONTAINERS
  // =========================================================

  const fetchContainers = useCallback(async () => {

    try {

      setLoadingContainers(true);

      const response = await fetch(
        `http://localhost:3001/containers/professor/${idProfessorLogado}`,
        {
          headers: {
            'x-professor-id': idProfessorLogado
          }
        }
      );

      const data = await response.json();

      setContainersDoBanco(data || []);

    } catch (err) {

      console.error(err);

      setContainersDoBanco([]);

    } finally {

      setLoadingContainers(false);
    }

  }, [idProfessorLogado]);

  // =========================================================
  // FETCH TURMAS
  // =========================================================

  useEffect(() => {

    fetch(
      `http://localhost:3001/turmas-professor/${idProfessorLogado}`,
      {
        headers: {
          'x-professor-id': idProfessorLogado
        }
      }
    )
      .then(res => res.json())
      .then(data => {

        setClasses(data || []);

        if (data?.length > 0) {

          setSelectedTurmaId(
            data[0].id
          );
        }

      })
      .catch(console.error);

  }, [idProfessorLogado]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchContainers();

    fetchQuizzesProfessor();

  }, [fetchContainers, fetchQuizzesProfessor]);

  // =========================================================
  // MODAL HELPERS
  // =========================================================

  const resetQuestionModal = () => {

    setEnunciado('');

    setOptions(['', '', '', '']);

    setCorrectOption(0);

    setEditingIndex(null);

    setEditingQuestionId(null);
  };

  const handleCloseQuestionModal = () => {

    setIsModalOpen(false);

    resetQuestionModal();

    // Se estava editando pergunta de container,
    // reabre o modal do container
    if (selectedContainerData) {

      setTimeout(() => {
        setIsContainerModalOpen(true);
      }, 150);
    }
  };

  // =========================================================
  // MANUAL QUIZ
  // =========================================================

  const handleOpenCreateQuestion = () => {

    resetQuestionModal();

    setIsModalOpen(true);
  };

  const handleSaveManualQuestion = async (e) => {

    e.preventDefault();

    try {

      // =====================================================
      // EDITANDO PERGUNTA EXISTENTE
      // =====================================================

      if (editingQuestionId) {

        const response = await fetch(
          `http://localhost:3001/perguntas/${editingQuestionId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-professor-id': idProfessorLogado
            },
            body: JSON.stringify({
              enunciado,
              alternativas: options,
              correta: correctOption
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {

          alert(data.error || 'Erro ao atualizar');

          return;
        }

        // ============================================
        // ATUALIZA LISTA LOCAL
        // ============================================

        setQuestionsInContainer(prev =>
          prev.map(q => {

            if (q.id !== editingQuestionId) {
              return q;
            }

            return {
              ...q,
              enunciado,
              A: options[0],
              B: options[1],
              C: options[2],
              D: options[3],
              correta:
                ['A', 'B', 'C', 'D'][correctOption]
            };
          })
        );

        handleCloseQuestionModal();

        return;
      }

      // =====================================================
      // CRIAÇÃO MANUAL
      // =====================================================

      const questionData = {

        enunciado,

        alternativas: options,

        correta: correctOption
      };

      if (editingIndex !== null) {

        const updated = [...questions];

        updated[editingIndex] = questionData;

        setQuestions(updated);

      } else {

        setQuestions(prev => [
          ...prev,
          questionData
        ]);
      }

      handleCloseQuestionModal();

    } catch (err) {

      console.error(err);

      alert('Erro ao salvar pergunta');
    }
  };

  // =========================================================
  // CONTAINER
  // =========================================================

  const handleSalvarContainer = async () => {

    if (!novoNomeContainer.trim()) {

      alert('Digite um nome para o container');

      return;
    }

    try {

      const response = await fetch(
        'http://localhost:3001/containers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-professor-id': idProfessorLogado
          },
          body: JSON.stringify({
            nome: novoNomeContainer,
            descricao: containerDescription,
            idProfessor: idProfessorLogado
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert('Container criado!');

        setNovoNomeContainer('');

        setContainerDescription('');

        fetchContainers();

      } else {

        alert(data.error || 'Erro ao criar container');
      }

    } catch (err) {

      console.error(err);

      alert('Erro ao criar container');
    }
  };

  // =========================================================
  // ABRIR CONTAINER
  // =========================================================

  const handleAcessarContainer = async (container) => {

    try {

      const idContainer = getContainerId(container);

      setSelectedContainerData(container);

      const response = await fetch(
        `http://localhost:3001/containers/${idContainer}/perguntas`
      );

      const data = await response.json();

      console.log(data);

      setQuestionsInContainer(data || []);

      setIsContainerModalOpen(true);

    } catch (err) {

      console.error(err);

      alert('Erro ao carregar perguntas');

      setQuestionsInContainer([]);
    }
  };

  // =========================================================
  // EXCLUIR PERGUNTA
  // =========================================================

  const handleDeleteQuestion = async (idPergunta) => {

    const confirmar = window.confirm(
      'Deseja realmente excluir esta pergunta?'
    );

    if (!confirmar) return;

    try {

      const response = await fetch(
        `http://localhost:3001/perguntas/${idPergunta}`,
        {
          method: 'DELETE',
          headers: {
            'x-professor-id': idProfessorLogado
          }
        }
      );

      if (response.ok) {

        setQuestionsInContainer(prev =>
          prev.filter(q => q.id !== idPergunta)
        );

      } else {

        alert('Erro ao excluir pergunta');
      }

    } catch (err) {

      console.error(err);

      alert('Erro ao excluir pergunta');
    }
  };
  // =========================================================
  // EXCLUIR CONTAINER
  // =========================================================

  const handleDeleteContainer = async (idContainer) => {

    const confirmar = window.confirm(
      'Deseja realmente excluir este container?'
    );

    if (!confirmar) return;

    try {

      const response = await fetch(
        `http://localhost:3001/containers/${idContainer}`,
        {
          method: 'DELETE',
          headers: {
            'x-professor-id': idProfessorLogado
          }
        }
      );

      const data = await response.json();

      if (response.ok) {

        setContainersDoBanco(prev =>
          prev.filter(
            c => getContainerId(c) !== idContainer
          )
        );

        alert('Container excluído com sucesso');

      } else {

        alert(data.error || 'Erro ao excluir container');
      }

    } catch (err) {

      console.error(err);

      alert('Erro ao excluir container');
    }
  };
  // =========================================================
  // EDITAR PERGUNTA
  // =========================================================

  const handleEditQuestion = (question) => {

    setEditingQuestionId(question.id);

    setEnunciado(question.enunciado);

    setOptions([
      question.A || '',
      question.B || '',
      question.C || '',
      question.D || ''
    ]);

    const corretaIndex = ['A', 'B', 'C', 'D']
      .indexOf(question.correta);

    setCorrectOption(
      corretaIndex >= 0 ? corretaIndex : 0
    );

    // FECHA O MODAL DO CONTAINER
    setIsContainerModalOpen(false);

    // ABRE O MODAL DA PERGUNTA
    setTimeout(() => {
      setIsModalOpen(true);
    }, 150);
  };

  // =========================================================
  // SELECT CONTAINER AUTO
  // =========================================================

  const handleSelectContainerAuto = (idContainer) => {

    setSelectedContainers(prev => {

      if (prev.includes(idContainer)) {

        return prev.filter(id => id !== idContainer);
      }

      return [...prev, idContainer];
    });
  };

  // =========================================================
  // OPTION CHANGE
  // =========================================================

  const handleOptionChange = (index, value) => {

    const updated = [...options];

    updated[index] = value;

    setOptions(updated);
  };

  // =========================================================
  // CREATE QUIZ
  // =========================================================

  const handleFinishQuiz = async () => {

    if (!quizTitle.trim()) {

      alert('Digite um título');

      return;
    }

    try {

      setIsSaving(true);

      const payload = {

        titulo: quizTitle,

        idProfessor: idProfessorLogado,

        idTurma: selectedTurmaId,

        typeCriacao: creationMode,

        perguntas:
          creationMode === 'manual'
            ? questions
            : [],

        containers:
          creationMode === 'auto'
            ? selectedContainers
            : [],

        quantidadePerguntasAuto: qtdPerguntas,

        data: dateRange
      };

      const response = await fetch(
        'http://localhost:3001/criar-quiz',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-professor-id': idProfessorLogado
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(`Quiz criado! PIN: ${data.pin}`);

        navigate('/home-professor');

      } else {

        alert(data.error || 'Erro ao criar quiz');
      }

    } catch (err) {

      console.error(err);

    } finally {

      setIsSaving(false);
    }
  };

  // =========================================================
  // MENU
  // =========================================================

  const menuConfig = [
    {
      label: "Dashboard",
      onClick: () => navigate('/home-professor')
    },
    {
      label: "Atividade",
      onClick: () => navigate('/criar-quiz')
    },
    {
      label: "Minhas Salas",
      onClick: () => navigate('/gerenciar-turmas')
    },
    {
      label: "Relatórios",
      onClick: () => navigate('/relatorios')
    },
    {
      label: "Sair",
      onClick: () => {
        localStorage.clear();
        navigate('/');
      }
    },
  ];

  // =========================================================
  // RETURN
  // =========================================================

  return (

    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName="Prof. Fabiano"
    >

      <S.Container>

        <S.Header>

          <h1>

            {
              creationMode === 'container'
                ? 'Gerenciar Containers'
                : 'Criar Nova Atividade'
            }

          </h1>

          {
            creationMode && (

              <MyButton
                onClick={() => {

                  setCreationMode(null);

                  setQuestions([]);

                  setSelectedContainers([]);

                  setQuizTitle('');
                }}
              >
                ← Voltar
              </MyButton>
            )
          }

        </S.Header>

        {
          !creationMode ? (

            <S.SelectionGrid>

              <S.ModeCard
                onClick={() => setCreationMode('auto')}
              >
                <h3>Quiz Automático</h3>

                <p>
                  Gere quizzes usando containers.
                </p>
              </S.ModeCard>

              <S.ModeCard
                onClick={() => setCreationMode('manual')}
              >
                <h3>Quiz Manual</h3>

                <p>
                  Crie perguntas personalizadas.
                </p>
              </S.ModeCard>

              <S.ModeCard
                onClick={() => setCreationMode('container')}
              >
                <h3>Containers</h3>

                <p>
                  Organize seus bancos de perguntas.
                </p>
              </S.ModeCard>

            </S.SelectionGrid>

          ) : (

            <S.ContentSection>

              {/* ===================================================== */}
              {/* MANUAL */}
              {/* ===================================================== */}

              {
                creationMode === 'manual' && (

                  <S.StepContainer>

                    <h2>Perguntas do Quiz</h2>

                    <MyButton
                      onClick={handleOpenCreateQuestion}
                    >
                      + Nova Pergunta
                    </MyButton>

                    <S.QuestionList>

                      {
                        questions.length === 0
                          ? 'Nenhuma pergunta adicionada.'
                          : questions.map((q, index) => (

                            <S.QuestionItem
                              key={index}
                            >

                              <div className="info">

                                <strong>
                                  {q.enunciado}
                                </strong>

                                <span>
                                  {q.alternativas.length} alternativas
                                </span>

                              </div>

                            </S.QuestionItem>

                          ))
                      }

                    </S.QuestionList>

                    <MyButton
                      onClick={() =>
                        setShowScheduleModal(true)
                      }
                    >
                      Finalizar Quiz
                    </MyButton>

                  </S.StepContainer>
                )
              }

              {/* ===================================================== */}
              {/* AUTO */}
              {/* ===================================================== */}

              {
                creationMode === 'auto' && (

                  <S.StepContainer>

                    <h2>Selecionar Containers</h2>

                    <S.ContainerList>

                      {
                        containersDoBanco.map(container => {

                          const idContainer =
                            getContainerId(container);

                          const selected =
                            selectedContainers.includes(idContainer);

                          return (

                            <S.ContainerItem
                              key={idContainer}
                              onClick={() =>
                                handleSelectContainerAuto(idContainer)
                              }
                            >

                              <div>

                                <input
                                  type="checkbox"
                                  checked={selected}
                                  readOnly
                                />

                                <strong>
                                  {getContainerNome(container)}
                                </strong>

                              </div>

                            </S.ContainerItem>

                          );
                        })
                      }

                    </S.ContainerList>

                    <div>

                      <label>
                        Quantidade de perguntas
                      </label>

                      <input
                        type="number"
                        value={qtdPerguntas}
                        onChange={(e) =>
                          setQtdPerguntas(e.target.value)
                        }
                      />

                    </div>

                    <MyButton
                      onClick={() =>
                        setShowScheduleModal(true)
                      }
                    >
                      Finalizar Quiz
                    </MyButton>

                  </S.StepContainer>
                )
              }

              {/* ===================================================== */}
              {/* CONTAINERS */}
              {/* ===================================================== */}

              {
                creationMode === 'container' && (

                  <S.StepContainer>

                    <h2>Novo Container</h2>

                    <input
                      type="text"
                      placeholder="Nome"
                      value={novoNomeContainer}
                      onChange={(e) =>
                        setNovoNomeContainer(e.target.value)
                      }
                    />

                    <textarea
                      placeholder="Descrição"
                      value={containerDescription}
                      onChange={(e) =>
                        setContainerDescription(e.target.value)
                      }
                    />

                    <MyButton
                      onClick={handleSalvarContainer}
                    >
                      Criar Container
                    </MyButton>

                    <S.ExistingContainersSection>

                      <h2>Meus Containers</h2>

                      <S.ContainersList>

                        {
                          loadingContainers
                            ? (
                              <p>Carregando...</p>
                            )
                            : containersDoBanco.map(container => (

                              <S.ContainerRow
                                key={getContainerId(container)}
                              >

                                <div className="container-info">

                                  <div>

                                    <strong>
                                      {getContainerNome(container)}
                                    </strong>

                                    <p>
                                      {getContainerDescricao(container)}
                                    </p>

                                  </div>

                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '10px'
                                  }}
                                >

                                  <MyButton
                                    onClick={() =>
                                      handleAcessarContainer(container)
                                    }
                                  >
                                    Abrir
                                  </MyButton>

                                  <MyButton
                                    onClick={() =>
                                      handleDeleteContainer(
                                        getContainerId(container)
                                      )
                                    }
                                  >
                                    Excluir
                                  </MyButton>

                                </div>

                              </S.ContainerRow>

                            ))
                        }

                      </S.ContainersList>

                    </S.ExistingContainersSection>

                  </S.StepContainer>
                )
              }

            </S.ContentSection>

          )
        }

        {/* ===================================================== */}
        {/* MODAL FINAL */}
        {/* ===================================================== */}

        <Modal
          title="Finalizar Quiz"
          isOpen={showScheduleModal}
          onClose={() =>
            setShowScheduleModal(false)
          }
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >

            <input
              type="text"
              placeholder="Título do Quiz"
              value={quizTitle}
              onChange={(e) =>
                setQuizTitle(e.target.value)
              }
            />

            <select
              value={selectedTurmaId}
              onChange={(e) =>
                setSelectedTurmaId(e.target.value)
              }
            >

              {
                classes.map((c) => (

                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.nome}
                  </option>

                ))
              }

            </select>

            <input
              type="date"
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value)
              }
            />

            <S.ModalFooter>

              <MyButton
                onClick={() =>
                  setShowScheduleModal(false)
                }
              >
                Cancelar
              </MyButton>

              <MyButton
                onClick={handleFinishQuiz}
                disabled={isSaving}
              >
                {
                  isSaving
                    ? 'Salvando...'
                    : 'Salvar Quiz'
                }
              </MyButton>

            </S.ModalFooter>

          </div>

        </Modal>

        {/* ===================================================== */}
        {/* MODAL PERGUNTA */}
        {/* ===================================================== */}

        <QuestionModal
          isOpen={isModalOpen}
          onClose={handleCloseQuestionModal}
          title="Pergunta"
        >

          <S.FormQuestion
            onSubmit={handleSaveManualQuestion}
          >

            <textarea
              placeholder="Digite a pergunta"
              value={enunciado}
              onChange={(e) =>
                setEnunciado(e.target.value)
              }
              required
            />

            <S.OptionsGrid>

              {
                options.map((option, index) => (

                  <S.OptionInputGroup
                    key={index}
                  >

                    <input
                      type="radio"
                      checked={correctOption === index}
                      onChange={() =>
                        setCorrectOption(index)
                      }
                    />

                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                      required
                    />

                  </S.OptionInputGroup>

                ))
              }

            </S.OptionsGrid>

            <S.ModalFooter>

              <MyButton
                type="button"
                onClick={handleCloseQuestionModal}
              >
                Cancelar
              </MyButton>

              <MyButton type="submit">
                Salvar
              </MyButton>

            </S.ModalFooter>

          </S.FormQuestion>

        </QuestionModal>

        {/* ===================================================== */}
        {/* MODAL CONTAINER */}
        {/* ===================================================== */}

        <Modal
          title={
            selectedContainerData
              ? getContainerNome(selectedContainerData)
              : 'Container'
          }
          isOpen={isContainerModalOpen}
          onClose={() =>
            setIsContainerModalOpen(false)
          }
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >

            {
              questionsInContainer.length === 0 ? (

                <p>
                  Nenhuma pergunta cadastrada.
                </p>

              ) : (

                questionsInContainer.map((question) => (

                  <S.QuestionItem
                    key={question.id}
                  >

                    <div className="info">

                      <strong>
                        {question.enunciado}
                      </strong>

                      <span>
                        Correta: {question.correta}
                      </span>

                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px'
                      }}
                    >

                      <MyButton
                        onClick={() =>
                          handleEditQuestion(question)
                        }
                      >
                        Editar
                      </MyButton>

                      <MyButton
                        onClick={() =>
                          handleDeleteQuestion(question.id)
                        }
                      >
                        Excluir
                      </MyButton>

                    </div>

                  </S.QuestionItem>

                ))
              )
            }

          </div>

        </Modal>

      </S.Container>

    </DashboardLayout>
  );
}

export default CreateQuiz2;