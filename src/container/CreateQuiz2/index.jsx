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

  console.log("ID PROFESSOR:", idProfessorLogado);

  // =========================
  // ESTADOS
  // =========================

  const [selectedContainerData, setSelectedContainerData] = useState(null);
  const [containerDescription, setContainerDescription] = useState("");
  const [questionsInContainer, setQuestionsInContainer] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [novoNomeContainer, setNovoNomeContainer] = useState("");

  const [containersDoBanco, setContainersDoBanco] = useState([]);
  const [loadingContainers, setLoadingContainers] = useState(true);

  const [qtdPerguntas, setQtdPerguntas] = useState(5);

  const [creationMode, setCreationMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [dateRange, setDateRange] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [enunciado, setEnunciado] = useState("");
  const [correctOption, setCorrectOption] = useState(0);
  const [options, setOptions] = useState(["", "", "", ""]);

  const [classes, setClasses] = useState([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState("");

  // =========================
  // HELPERS
  // =========================

  const getContainerId = (container) =>
    container?.id ||
    container?.IDCONTAINER ||
    container?.IDCONTAINER_PK;

  const getContainerNome = (container) =>
    container?.nome ||
    container?.NOMECONTAINER ||
    container?.NOME ||
    "Container";

  const getContainerDescricao = (container) =>
    container?.descricao ||
    container?.DESCRICAO ||
    "Sem descrição informada.";

  const convertLabelToIndex = (label) => {

    if (!label) return 0;

    if (typeof label === 'number') return label;

    const code = label.toUpperCase().charCodeAt(0);

    return (code >= 65 && code <= 68)
      ? code - 65
      : 0;
  };

  // =========================
  // BUSCAR TURMAS
  // =========================

  useEffect(() => {

    fetch(`http://localhost:3001/turmas-professor/${idProfessorLogado}`)
      .then(res => res.json())
      .then(data => {

        if (data && data.length > 0) {

          setClasses(data);

          const turmaAtivaSalva =
            localStorage.getItem('idTurmaAtiva');

          const existeNaLista = data.some(
            c =>
              String(c.IDTURMA || c.id)
              ===
              String(turmaAtivaSalva)
          );

          if (turmaAtivaSalva && existeNaLista) {

            setSelectedTurmaId(turmaAtivaSalva);

          } else {

            setSelectedTurmaId(
              data[0].IDTURMA || data[0].id || ""
            );
          }
        }
      })
      .catch(err => {
        console.error(err);
      });

  }, [idProfessorLogado]);

  // =========================
  // FETCH CONTAINERS
  // =========================

  const fetchContainers = useCallback(() => {

    setLoadingContainers(true);

    fetch(
      `http://localhost:3001/containers/professor/${idProfessorLogado}`
    )
      .then(res => res.json())
      .then(data => {

        setContainersDoBanco(data || []);

      })
      .catch(err => {

        console.error("Erro containers:", err);

        setContainersDoBanco([]);

      })
      .finally(() => {

        setLoadingContainers(false);

      });

  }, [idProfessorLogado]);

  useEffect(() => {

    fetchContainers();

  }, [fetchContainers]);

  // =========================
  // ACESSAR CONTAINER
  // =========================

  const handleAcessarContainer = async (container) => {

    const idContainer = getContainerId(container);

    const nomeContainer = getContainerNome(container);

    const descricaoContainer =
      getContainerDescricao(container);

    setSelectedContainerData({
      ...container,
      id: idContainer
    });

    setNovoNomeContainer(nomeContainer);

    setContainerDescription(descricaoContainer);

    try {

      const response = await fetch(
        `http://localhost:3001/containers/${idContainer}/perguntas`
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {
          error: 'Resposta inválida do servidor'
        };
      }

      setQuestionsInContainer(data || []);

    } catch (err) {

      console.error(err);

      setQuestionsInContainer([]);
    }
  };

  // =========================
  // ATUALIZAR CONTAINER
  // =========================

  const handleAtualizarDadosContainer = async () => {

    if (!selectedContainerData) return;

    try {

      const response = await fetch(
        `http://localhost:3001/containers/${selectedContainerData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: novoNomeContainer,
            descricao: containerDescription,
            idProfessor: idProfessorLogado
          })
        }
      );

      if (response.ok) {

        alert("Container atualizado!");

        fetchContainers();

        setSelectedContainerData(null);
      }

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // FECHAR MODAL
  // =========================

  const handleCloseQuestionModal = () => {

    setIsModalOpen(false);

    setEditingIndex(null);

    setEditingQuestionId(null);

    setEnunciado("");

    setOptions(["", "", "", ""]);

    setCorrectOption(0);
  };

  // =========================
  // SALVAR QUESTÃO CONTAINER
  // =========================

  const handleSaveContainerQuestion = async (e) => {

    e.preventDefault();

    if (!selectedContainerData) return;

    const isEdicao =
      editingQuestionId !== null;

    const url = isEdicao
      ? `http://localhost:3001/perguntas/${editingQuestionId}`
      : `http://localhost:3001/perguntas`;

    const payload = {
      idProfessor: idProfessorLogado,
      idContainer: selectedContainerData.id,
      enunciado,
      alternativas: options,
      rotuloCorreto:
        String.fromCharCode(65 + correctOption)
    };

    try {

      const response = await fetch(url, {

        method: isEdicao ? 'PUT' : 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(payload)
      });

      if (response.ok) {

        alert("Pergunta salva!");

        handleCloseQuestionModal();

        handleAcessarContainer(selectedContainerData);
      }

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // QUIZ MANUAL
  // =========================

  const handleOpenCreate = () => {

    setEditingIndex(null);

    setEditingQuestionId(null);

    setEnunciado("");

    setOptions(["", "", "", ""]);

    setCorrectOption(0);

    setIsModalOpen(true);
  };

  const handleOpenEditManual = (index) => {

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

  const handleSaveManualQuestion = (e) => {

    e.preventDefault();

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

      setQuestions([...questions, questionData]);
    }

    handleCloseQuestionModal();
  };

  // =========================
  // SELEÇÃO CONTAINERS AUTO
  // =========================

  const handleSelectContainerAuto = (idContainer) => {

    if (!idContainer) return;

    setSelectedContainers(prev => {

      if (prev.includes(idContainer)) {

        return prev.filter(id => id !== idContainer);
      }

      return [...prev, idContainer];
    });
  };

  // =========================
  // SALVAR CONTAINER
  // =========================

  const handleSalvarContainer = async () => {
    try {

      const response = await fetch(
        'http://localhost:3001/containers',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            nome: novoNomeContainer,
            descricao: containerDescription,
            idProfessor: idProfessorLogado
          })
        }
      );

      if (response.ok) {

        alert("Container criado!");

        setNovoNomeContainer("");

        setContainerDescription("");

        fetchContainers();
      }

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // FINALIZAR QUIZ
  // =========================

  const handleFinishQuiz = async () => {

    if (!quizTitle.trim()) {

      alert("Digite um título");

      return;
    }

    const payload = {

      titulo: quizTitle,

      idProfessor: idProfessorLogado,

      idTurma: selectedTurmaId,

      perguntas:
        creationMode === 'manual'
          ? questions
          : [],

      containers:
        creationMode === 'auto'
          ? selectedContainers
          : [],

      typeCriacao: creationMode,

      quantidadePerguntasAuto:
        Number(qtdPerguntas)
    };

    setIsSaving(true);

    try {

      const response = await fetch(
        'http://localhost:3001/criar-quiz',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(payload)
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {
          error: 'Resposta inválida do servidor'
        };
      }

      if (response.ok) {

        alert(`Quiz criado! PIN: ${data.pin}`);

        navigate('/home-professor');

      } else {

        alert(data.error || "Erro ao criar quiz");
      }

    } catch (err) {

      console.error(err);

    } finally {

      setIsSaving(false);
    }
  };

  // =========================
  // MENU
  // =========================

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

  // =========================
  // RETURN
  // =========================

  return (
    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName="Prof. Fabiano"
    >

      <S.Container>

        {/* =========================================
      HEADER
      ========================================= */}

        <S.Header>

          <div>
            <h1>
              {creationMode === 'container'
                ? "Gerenciador de Containers"
                : "Criar Nova Atividade"}
            </h1>

            {creationMode && (
              <p
                style={{
                  color: '#666',
                  marginTop: '6px'
                }}
              >
                {
                  creationMode === 'manual'
                    ? 'Monte perguntas personalizadas manualmente.'
                    : creationMode === 'auto'
                      ? 'Selecione containers para gerar um quiz automático.'
                      : 'Gerencie seus bancos de perguntas.'
                }
              </p>
            )}
          </div>

          {creationMode && (
            <MyButton
              onClick={() => {

                setCreationMode(null);

                setSelectedContainerData(null);

                setQuestions([]);

                setSelectedContainers([]);

                setQuizTitle("");

              }}
              style={{
                backgroundColor: '#757575'
              }}
            >
              ← Voltar
            </MyButton>
          )}

        </S.Header>

        {/* =========================================
      CAMPO TÍTULO QUIZ
      ========================================= */}

        {
          creationMode &&
          creationMode !== 'container' && (
            <div
              style={{
                width: '100%',
                maxWidth: '700px',
                marginBottom: '30px'
              }}
            >

              <label
                style={{
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333'
                }}
              >
                Título do Quiz
              </label>

              <input
                type="text"
                placeholder="Ex: Revisão de Matemática - 2º Bimestre"
                value={quizTitle}
                onChange={(e) =>
                  setQuizTitle(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />

            </div>
          )
        }

        {/* =========================================
      SELEÇÃO DE MODO
      ========================================= */}

        {!creationMode ? (

          <S.SelectionGrid>

            <S.ModeCard
              onClick={() => setCreationMode('auto')}
            >
              <h3>Gerar Quiz Automático</h3>

              <p>
                Monte quizzes usando containers já cadastrados.
              </p>
            </S.ModeCard>

            <S.ModeCard
              onClick={() => setCreationMode('manual')}
            >
              <h3>Criar Quiz Manual</h3>

              <p>
                Crie perguntas manualmente e personalize o quiz.
              </p>
            </S.ModeCard>

            <S.ModeCard
              onClick={() => setCreationMode('container')}
              style={{
                borderTop: '5px solid #2196F3'
              }}
            >
              <h3
                style={{
                  color: '#2196F3'
                }}
              >
                Gerenciar Containers
              </h3>

              <p>
                Crie e organize bancos de perguntas.
              </p>
            </S.ModeCard>

          </S.SelectionGrid>

        ) : (


          <S.ContentSection>

            {/* =========================================
  QUIZ MANUAL
  ========================================= */}

            {creationMode === 'manual' && (

              <S.StepContainer>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                  }}
                >

                  <div>
                    <h2>Quiz Manual</h2>

                    <p
                      style={{
                        color: '#666'
                      }}
                    >
                      Adicione perguntas e respostas manualmente.
                    </p>
                  </div>

                  <MyButton
                    onClick={handleOpenCreate}
                    style={{
                      backgroundColor: '#4CAF50'
                    }}
                  >
                    + Nova Pergunta
                  </MyButton>

                </div>

                <S.QuestionList>

                  {questions.length === 0 ? (

                    <div
                      style={{
                        padding: '30px',
                        textAlign: 'center',
                        color: '#666'
                      }}
                    >
                      Nenhuma pergunta adicionada ainda.
                    </div>

                  ) : (

                    questions.map((q, index) => (

                      <S.QuestionItem
                        key={index}
                        onClick={() =>
                          handleOpenEditManual(index)
                        }
                      >

                        <div className="info">

                          <strong>
                            {index + 1}. {q.enunciado}
                          </strong>

                          <span>
                            Clique para editar
                          </span>

                        </div>

                        <div
                          className="status-tag"
                          style={{
                            backgroundColor: '#4CAF50'
                          }}
                        >
                          Salva
                        </div>

                      </S.QuestionItem>

                    ))

                  )}

                </S.QuestionList>

                <div
                  style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >

                  <MyButton
                    onClick={() =>
                      setShowScheduleModal(true)
                    }
                    disabled={questions.length === 0}
                  >
                    Finalizar Quiz
                  </MyButton>

                </div>

              </S.StepContainer>

            )}

            {/* =========================================
  QUIZ AUTOMÁTICO
  ========================================= */}

            {creationMode === 'auto' && (

              <S.StepContainer>

                <h2>Quiz Automático</h2>

                <p
                  style={{
                    color: '#666',
                    marginBottom: '25px'
                  }}
                >
                  Escolha os containers utilizados no quiz.
                </p>

                {loadingContainers ? (

                  <p>Carregando containers...</p>

                ) : (

                  <div
                    style={{
                      display: 'grid',
                      gap: '14px'
                    }}
                  >

                    {containersDoBanco.map(container => {

                      const idContainer =
                        getContainerId(container);

                      const nome =
                        getContainerNome(container);

                      const descricao =
                        getContainerDescricao(container);

                      const selected =
                        selectedContainers.includes(idContainer);

                      return (

                        <div
                          key={idContainer}
                          onClick={() =>
                            handleSelectContainerAuto(idContainer)
                          }
                          style={{
                            border: selected
                              ? '2px solid #2196F3'
                              : '1px solid #ccc',
                            padding: '18px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            backgroundColor: selected
                              ? '#E3F2FD'
                              : '#fff',
                            transition: '0.2s'
                          }}
                        >

                          <strong>
                            {selected ? '☑️ ' : '📁 '}
                            {nome}
                          </strong>

                          <p
                            style={{
                              marginTop: '8px',
                              color: '#666'
                            }}
                          >
                            {descricao}
                          </p>

                        </div>
                      );
                    })}

                  </div>

                )}

                <div
                  style={{
                    marginTop: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >

                  <label
                    style={{
                      fontWeight: 'bold'
                    }}
                  >
                    Quantidade de Perguntas
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={qtdPerguntas}
                    onChange={(e) =>
                      setQtdPerguntas(e.target.value)
                    }
                    style={{
                      width: '90px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc'
                    }}
                  />

                </div>

                <div
                  style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >

                  <MyButton
                    onClick={() =>
                      setShowScheduleModal(true)
                    }
                    disabled={
                      selectedContainers.length === 0
                    }
                  >
                    Continuar
                  </MyButton>

                </div>

              </S.StepContainer>

            )}

            {/* =========================================
  GERENCIAR CONTAINERS
  ========================================= */}

            {creationMode === 'container' && (

              <S.StepContainer>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                  }}
                >

                  <div>
                    <h2>Meus Containers</h2>

                    <p
                      style={{
                        color: '#666'
                      }}
                    >
                      Gerencie seus bancos de perguntas.
                    </p>
                  </div>

                </div>

                {/* FORM NOVO CONTAINER */}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '30px'
                  }}
                >

                  <input
                    type="text"
                    placeholder="Nome do container"
                    value={novoNomeContainer}
                    onChange={(e) =>
                      setNovoNomeContainer(e.target.value)
                    }
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                  />

                  <textarea
                    placeholder="Descrição"
                    value={containerDescription}
                    onChange={(e) =>
                      setContainerDescription(e.target.value)
                    }
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      minHeight: '100px'
                    }}
                  />

                  <MyButton
                    onClick={handleSalvarContainer}
                    style={{
                      backgroundColor: '#2196F3'
                    }}
                  >
                    + Criar Container
                  </MyButton>

                </div>

                {/* LISTA CONTAINERS */}

                {loadingContainers ? (

                  <p>Carregando containers...</p>

                ) : containersDoBanco.length === 0 ? (

                  <p>Nenhum container encontrado.</p>

                ) : (

                  <div
                    style={{
                      display: 'grid',
                      gap: '15px'
                    }}
                  >

                    {containersDoBanco.map(container => {

                      const idContainer =
                        getContainerId(container);

                      const nome =
                        getContainerNome(container);

                      const descricao =
                        getContainerDescricao(container);

                      return (

                        <div
                          key={idContainer}
                          style={{
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '18px',
                            backgroundColor: '#fff'
                          }}
                        >

                          <strong>
                            📁 {nome}
                          </strong>

                          <p
                            style={{
                              marginTop: '8px',
                              color: '#666'
                            }}
                          >
                            {descricao}
                          </p>

                          <div
                            style={{
                              marginTop: '15px',
                              display: 'flex',
                              gap: '10px'
                            }}
                          >

                            <MyButton
                              onClick={() =>
                                handleAcessarContainer(container)
                              }
                            >
                              Gerenciar
                            </MyButton>

                          </div>

                        </div>
                      );
                    })}

                  </div>

                )}

              </S.StepContainer>

            )}

          </S.ContentSection>


        )}

        {/* =========================================
      MODAL FINALIZAR QUIZ
      ========================================= */}

        {
          showScheduleModal && (

            <Modal
              title="Revisar e Finalizar Quiz"
              isOpen={showScheduleModal}
              onClose={() =>
                setShowScheduleModal(false)
              }
            >

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  padding: '10px'
                }}
              >

                <div>

                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block'
                    }}
                  >
                    Título do Quiz
                  </label>

                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) =>
                      setQuizTitle(e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                  />

                </div>

                <div>

                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block'
                    }}
                  >
                    Turma
                  </label>

                  <select
                    value={selectedTurmaId}
                    onChange={(e) =>
                      setSelectedTurmaId(e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                  >

                    {classes.map((c) => (

                      <option
                        key={c.id || c.IDTURMA}
                        value={c.id || c.IDTURMA}
                      >
                        {c.nome || c.NOMETURMA}
                      </option>

                    ))}

                  </select>

                </div>

                <div>

                  <label
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'block'
                    }}
                  >
                    Data
                  </label>

                  <input
                    type="date"
                    value={dateRange}
                    onChange={(e) =>
                      setDateRange(e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                  />

                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '20px'
                  }}
                >

                  <MyButton
                    onClick={handleFinishQuiz}
                    disabled={isSaving}
                    style={{
                      backgroundColor: '#4CAF50'
                    }}
                  >
                    {
                      isSaving
                        ? 'Salvando...'
                        : 'Salvar Quiz'
                    }
                  </MyButton>

                  <MyButton
                    onClick={() =>
                      setShowScheduleModal(false)
                    }
                    style={{
                      backgroundColor: '#f44336'
                    }}
                  >
                    Voltar
                  </MyButton>

                </div>

              </div>

            </Modal>

          )
        }
        {/* =========================================
MODAL CRIAR / EDITAR PERGUNTA
========================================= */}

        <QuestionModal
          isOpen={isModalOpen}
          onClose={handleCloseQuestionModal}
          title={
            editingIndex !== null ||
              editingQuestionId !== null
              ? "Editar Pergunta"
              : "Nova Pergunta"
          }
        >

          <form
            onSubmit={
              creationMode === 'container'
                ? handleSaveContainerQuestion
                : handleSaveManualQuestion
            }
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >

            {/* ENUNCIADO */}

            <div>

              <label
                style={{
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Enunciado
              </label>

              <textarea
                value={enunciado}
                onChange={(e) =>
                  setEnunciado(e.target.value)
                }
                placeholder="Digite a pergunta..."
                required
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  resize: 'vertical'
                }}
              />

            </div>

            {/* ALTERNATIVAS */}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >

              {options.map((option, index) => (

                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
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
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                  />

                </div>

              ))}

            </div>

            {/* BOTÕES */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '10px'
              }}
            >

              <MyButton
                type="button"
                onClick={handleCloseQuestionModal}
                style={{
                  backgroundColor: '#757575'
                }}
              >
                Cancelar
              </MyButton>

              <MyButton
                type="submit"
                style={{
                  backgroundColor: '#4CAF50'
                }}
              >
                Salvar Pergunta
              </MyButton>

            </div>

          </form>

        </QuestionModal>

      </S.Container>

    </DashboardLayout>
  );
}

export default CreateQuiz2;