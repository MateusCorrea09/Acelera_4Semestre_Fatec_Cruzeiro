import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Modal, QuestionModal } from "../../components/Modal";
import { MyButton } from '../../components/Buttons';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function CreateQuiz2() {
  const navigate = useNavigate();
  const idProfessorLogado = 1;

  // --- Estados do Novo Gerenciador de Containers ---
  const [selectedContainerData, setSelectedContainerData] = useState(null);
  const [containerDescription, setContainerDescription] = useState("");
  const [questionsInContainer, setQuestionsInContainer] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [novoNomeContainer, setNovoNomeContainer] = useState("");
  const [containerEditando, setContainerEditando] = useState(null);

  // --- Estados Únicos para carregar os Containers do Banco ---
  const [containersDoBanco, setContainersDoBanco] = useState([]);
  const [loadingContainers, setLoadingContainers] = useState(true);

  // --- Estados do Fluxo de Geração do Quiz Automático ---
  const [qtdPerguntas, setQtdPerguntas] = useState(5);

  // --- Estados de Fluxo Geral ---
  const [creationMode, setCreationMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- Dados do Quiz ---
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [dateRange, setDateRange] = useState(new Date().toISOString().split('T')[0]);

  // --- Dados do Modal de Pergunta ---
  const [enunciado, setEnunciado] = useState("");
  const [correctOption, setCorrectOption] = useState(0);
  const [options, setOptions] = useState(["", "", "", ""]);

  // --- Dados de Turmas ---
  const [classes, setClasses] = useState([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState("");

  // 1. Busca as turmas associadas ao professor e recupera a última selecionada
  useEffect(() => {
    fetch(`http://localhost:3001/turmas-professor/${idProfessorLogado}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setClasses(data);
          
          // Tenta pegar a turma que o professor estava mexendo lá na tela de gerenciamento
          const turmaAtivaSalva = localStorage.getItem('idTurmaAtiva');
          
          // Verifica se a turma salva realmente pertence à lista de turmas carregadas
          const existeNaLista = data.some(c => String(c.IDTURMA || c.id) === String(turmaAtivaSalva));

          if (turmaAtivaSalva && existeNaLista) {
            setSelectedTurmaId(turmaAtivaSalva);
          } else {
            // Fallback caso não tenha nada no localStorage: pega a primeira da lista
            const primeiraTurmaId = data[0].IDTURMA || data[0].id || "";
            setSelectedTurmaId(primeiraTurmaId);
          }
        }
      })
      .catch(err => console.error("Erro ao buscar turmas para o quiz:", err));
  }, [idProfessorLogado]);

  // Função isolada para buscar containers de forma consistente
  const fetchContainers = useCallback(() => {
    setLoadingContainers(true);
    fetch(`http://localhost:3001/containers/professor/${idProfessorLogado}`)
      .then(res => res.json())
      .then(data => {
        if (data) setContainersDoBanco(data);
      })
      .catch(err => console.error("Erro ao buscar containers do professor:", err))
      .finally(() => setLoadingContainers(false));
  }, [idProfessorLogado]);

  // 2. DISPARAR APENAS NA MONTAGEM DO COMPONENTE
  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  // Acessar detalhes de um container específico
  const handleAcessarContainer = async (container) => {
    setSelectedContainerData(container);
    setNovoNomeContainer(container.NOMECONTAINER || container.nome || container.NOME || "");
    setContainerDescription(container.DESCRICAO || container.descricao || "");

    const containerId = container.IDCONTAINER || container.IDCONTAINER_PK || container.id || container.ID_CONTAINER;

    if (!containerId) {
      console.error("Não foi possível identificar o ID do container selecionado:", container);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/containers/${containerId}/perguntas`);
      if (response.ok) {
        const data = await response.json();
        setQuestionsInContainer(data);
      } else {
        setQuestionsInContainer([]);
      }
    } catch (err) {
      console.error("Erro ao buscar perguntas do container:", err);
      setQuestionsInContainer([]);
    }
  };

  // Atualizar nome e descrição do container
  const handleAtualizarDadosContainer = async () => {
    const containerId = selectedContainerData.IDCONTAINER || selectedContainerData.IDCONTAINER_PK || selectedContainerData.id;
    const payload = {
      nome: novoNomeContainer,
      descricao: containerDescription,
      idProfessor: Number(idProfessorLogado)
    };

    try {
      const response = await fetch(`http://localhost:3001/containers/${containerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Informações do container updated com sucesso!");
        setSelectedContainerData(null);
        setNovoNomeContainer("");
        setContainerDescription("");
        fetchContainers();
      }
    } catch (err) {
      console.error("Erro ao atualizar container:", err);
    }
  };

  // Fechar modal limpando estados com segurança
  const handleCloseQuestionModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setEditingQuestionId(null);
    setEnunciado("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
  };

  // Salvar ou Editar pergunta REAL dentro de um container (Banco de Dados)
  const handleSaveContainerQuestion = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const isEdicao = editingQuestionId !== null;
    const url = isEdicao
      ? `http://localhost:3001/perguntas/${editingQuestionId}`
      : `http://localhost:3001/perguntas`;

    const containerId = selectedContainerData.IDCONTAINER || selectedContainerData.IDCONTAINER_PK || selectedContainerData.id;

    // Garante o envio das alternativas como array simples de strings (evita quebrar as colunas extras)
    const alternativasTratadas = options.map(alt => 
      alt && typeof alt === 'object' ? (alt.texto || alt.DESCRICAO || alt.texto_alternativa || "") : alt
    );

    const questionPayload = {
      idProfessor: Number(idProfessorLogado),
      idContainer: containerId,
      enunciado: enunciado,
      dificuldade: "Média",
      explicacao: "Inserido/Editado via gerenciador de containers",
      alternativas: alternativasTratadas,
      rotuloCorreto: String.fromCharCode(65 + correctOption)
    };

    try {
      const response = await fetch(url, {
        method: isEdicao ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionPayload)
      });

      if (response.ok) {
        alert(isEdicao ? "Questão atualizada com sucesso!" : "Questão salva e vinculada ao container com sucesso!");
        handleCloseQuestionModal();

        setTimeout(() => {
          handleAcessarContainer(selectedContainerData);
        }, 100);
      } else {
        const erroStatus = await response.json();
        alert(`Erro: ${erroStatus.error || 'Erro ao processar requisição'}`);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  // Funções do Fluxo Manual de Quiz (Apenas Local no Array)
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
    
    // Tratamento preventivo para alternativas locais do quiz manual
    const alternativasTratadas = q.alternativas.map(alt => 
      alt && typeof alt === 'object' ? (alt.texto || alt.DESCRICAO || alt.texto_alternativa || "") : alt
    );
    setOptions(alternativasTratadas);
    setCorrectOption(q.correta);
    setIsModalOpen(true);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Fluxo de Salvamento Exclusivo para Quiz Manual
  const handleSaveManualQuestion = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const alternativasTratadas = options.map(alt => 
      alt && typeof alt === 'object' ? (alt.texto || alt.DESCRICAO || alt.texto_alternativa || "") : alt
    );

    const questionData = {
      enunciado: enunciado,
      alternativas: alternativasTratadas,
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

  // Seleção múltipla de containers para o Quiz Automático
  const handleSelectContainerAuto = (idContainer) => {
    if (!idContainer) return;
    setSelectedContainers((prevSelected) => {
      if (prevSelected.includes(idContainer)) {
        return prevSelected.filter(id => id !== idContainer);
      } else {
        return [...prevSelected, idContainer];
      }
    });
  };

  // Criar ou Editar bloco de Container estrutural
  const handleSalvarContainer = async (e) => {
    e.preventDefault();
    if (!novoNomeContainer.trim()) return;

    const isEdicao = !!containerEditando;
    const url = isEdicao
      ? `http://localhost:3001/containers/${containerEditando.id}`
      : 'http://localhost:3001/containers';

    const payload = {
      nome: novoNomeContainer,
      idProfessor: Number(idProfessorLogado)
    };

    try {
      const response = await fetch(url, {
        method: isEdicao ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(isEdicao ? "Container updated!" : "Novo container criado com sucesso!");
        setNovoNomeContainer("");
        setContainerEditando(null);
        setCreationMode(null);
        fetchContainers();
      }
    } catch (err) {
      console.error("Erro ao gerenciar container:", err);
    }
  };

  // Função refatorada para salvar o Quiz sem estourar o erro de coluna IDTURMA_FK
  const handleFinishQuiz = async () => {
    if (!quizTitle.trim()) {
      alert("Por favor, dê um título para o seu quiz antes de salvar.");
      return;
    }

    // Enviamos apenas os dados puros que a tabela QUIZ aceita estruturalmente.
    // Deixamos a data e a turma como dados opcionais ou mapeamento para "Implementação Futura"
    const payload = {
      titulo: quizTitle,
      idProfessor: Number(idProfessorLogado),
      typeCriacao: creationMode,
      quantidadePerguntasAuto: creationMode === 'auto' ? Number(qtdPerguntas) : null,
      perguntas: creationMode === 'manual' ? questions : [],
      containers: creationMode === 'auto' ? selectedContainers : []
    };

    setIsSaving(true);

    try {
      const response = await fetch('http://localhost:3001/criar-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Quiz cadastrado e salvo com sucesso!");
        setCreationMode(null);
        setQuizTitle("");
        setQuestions([]);
        setSelectedContainers([]);
        setShowScheduleModal(false);
        navigate('/home-professor');
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar quiz: ${errorData.message || 'Erro interno no servidor'}`);
      }
    } catch (error) {
      console.error("Erro na requisição HTTP:", error);
      alert("Não foi possível conectar ao servidor backend.");
    } finally {
      setIsSaving(false);
    }
  };

  const menuConfig = [
    { label: "Dashboard", onClick: () => navigate('/home-professor') },
    { label: "Atividade", onClick: () => navigate('/criar-quiz') },
    { label: "Minhas Salas", onClick: () => navigate('/gerenciar-turmas') },
    { label: "Relatórios", onClick: () => navigate('/relatorios') },
    { label: "Sair", onClick: () => { localStorage.clear(); navigate('/'); } },
  ];

  const convertLabelToIndex = (label) => {
    if (!label) return 0;
    if (typeof label === 'number') return label;
    const code = label.toUpperCase().charCodeAt(0);
    return (code >= 65 && code <= 68) ? code - 65 : 0;
  };

  return (
    <DashboardLayout sidebarTitle="Professor" menuItems={menuConfig} userName="Prof. Fabiano">
      <S.Container>
        <S.Header>
          <h1>{creationMode === 'container' ? "Gerenciador de Containers" : "Criar Nova Atividade"}</h1>
          {creationMode && (
            <MyButton onClick={() => { setCreationMode(null); setContainerEditando(null); setNovoNomeContainer(""); setSelectedContainerData(null); }}>Voltar</MyButton>
          )}
        </S.Header>

        {creationMode && creationMode !== 'container' && (
          <div style={{ marginBottom: '25px', width: '100%', maxWidth: '600px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '8px' }}>
              Título do Quiz
            </label>
            <input
              type="text"
              placeholder="Ex: Quiz de Revisão Acelera - Geometria Básica"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            />
          </div>
        )}

        {/* 1. SELEÇÃO DE MODO INICIAL */}
        {!creationMode ? (
          <S.SelectionGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%' }}>
            <S.ModeCard onClick={() => setCreationMode('auto')}>
              <h3>Gerar Quiz Automático</h3>
              <p>Selecione containers de perguntas e a aplicação montará o quiz para você.</p>
            </S.ModeCard>

            <S.ModeCard onClick={() => setCreationMode('manual')}>
              <h3>Criar Quiz Manual</h3>
              <p>Escreva suas próprias perguntas e respostas para um quiz específico.</p>
            </S.ModeCard>

            <S.ModeCard onClick={() => setCreationMode('container')} style={{ borderTop: '5px solid #2196F3' }}>
              <h3 style={{ color: '#2196F3' }}>Gerenciador de Containers</h3>
              <p>Crie novos blocos temáticos ou edite as gavetas de conteúdos existentes no seu banco.</p>
            </S.ModeCard>
          </S.SelectionGrid>
        ) : (
          <S.ContentSection>
            {/* FLUXO A: AUTOMÁTICO */}
            {creationMode === 'auto' && (
              <S.StepContainer>
                <h2>Gerar Quiz Automático</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Selecione os seus containers (bancos de questões) abaixo para que o sistema gere o quiz baseado neles.
                </p>

                {loadingContainers ? (
                  <p>Carregando seus containers do banco...</p>
                ) : containersDoBanco.length === 0 ? (
                  <p style={{ color: '#e76f51', fontStyle: 'italic' }}>
                    Você ainda não possui nenhum container de perguntas cadastrado. Vá na aba de "Containers" para criar o primeiro!
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '12px', width: '100%', marginBottom: '20px' }}>
                    {containersDoBanco.map((container) => {
                      const idContainer = container.IDCONTAINER || container.id || container.IDCONTAINER_PK;
                      const nomeContainer = container.NOMECONTAINER || container.nome || container.NOME;
                      const descricaoContainer = container.DESCRICAO || container.descricao || "Sem descrição informada.";
                      const isSelected = selectedContainers.includes(idContainer);

                      return (
                        <div
                          key={idContainer}
                          onClick={() => handleSelectContainerAuto(idContainer)}
                          style={{
                            padding: '16px',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #2196F3' : '1px solid #ccc',
                            backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isSelected ? '#1e88e5' : '#333' }}>
                            {isSelected ? '☑️' : '📁'} {nomeContainer}
                          </span>
                          <span style={{ fontSize: '0.9rem', color: '#666' }}>
                            {descricaoContainer}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedContainers.length > 0 && (
                  <div style={{ marginTop: '25px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>
                      Quantidade de questões aleatórias (total distribuído):
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={qtdPerguntas}
                        onChange={(e) => setQtdPerguntas(e.target.value)}
                        style={{ width: '80px', marginLeft: '10px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </label>

                    <MyButton onClick={() => setShowScheduleModal(true)} style={{ backgroundColor: '#4CAF50' }}>
                      Avançar e Visualizar ({selectedContainers.length} selecionado{selectedContainers.length > 1 ? 's' : ''})
                    </MyButton>
                  </div>
                )}
              </S.StepContainer>
            )}

            {/* FLUXO B: MANUAL */}
            {creationMode === 'manual' && (
              <S.StepContainer>
                <h2>Passo 1: Construir Perguntas</h2>
                <MyButton onClick={handleOpenCreate}>+ Adicionar Pergunta</MyButton>
                <S.QuestionList>
                  {questions.length === 0 ? (
                    <p>Nenhuma pergunta adicionada ainda.</p>
                  ) : (
                    <React.Fragment>
                      {questions.map((q, i) => (
                        <S.QuestionItem key={i} onClick={() => handleOpenEditManual(i)}>
                          <div className="info">
                            <strong>{i + 1}. {q.enunciado}</strong>
                            <span>Clique para editar</span>
                          </div>
                          <div className="status-tag">Salva</div>
                        </S.QuestionItem>
                      ))}
                    </React.Fragment>
                  )}
                </S.QuestionList>
                <MyButton onClick={handleFinishQuiz} disabled={questions.length === 0}>
                  Finalizar e Salvar Atividade
                </MyButton>
              </S.StepContainer>
            )}

            {/* FLUXO C: GERENCIADOR DE CONTAINERS */}
            {creationMode === 'container' && (
              <S.StepContainer>
                {!selectedContainerData ? (
                  <React.Fragment>
                    <h2>Criar Novo Container</h2>
                    <form onSubmit={handleSalvarContainer} style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '30px' }}>
                      <input
                        type="text"
                        value={novoNomeContainer}
                        onChange={(e) => setNovoNomeContainer(e.target.value)}
                        placeholder="Ex: Geometria Analítica, Funções..."
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
                        required
                      />
                      <MyButton type="submit" style={{ backgroundColor: '#4CAF50' }}>
                        Criar Bloco
                      </MyButton>
                    </form>

                    <S.ExistingContainersSection>
                      <h2>Meus Containers Existentes</h2>
                      <S.ContainersList>
                        {containersDoBanco && containersDoBanco.length === 0 ? (
                          <p style={{ color: '#666', fontStyle: 'italic', padding: '10px' }}>
                            Nenhum container cadastrado ainda.
                          </p>
                        ) : (
                          containersDoBanco.map((container) => {
                            const idContainer = container.IDCONTAINER || container.id || container.IDCONTAINER_PK;
                            const nomeContainer = container.NOMECONTAINER || container.nome || container.NOME;
                            const descricaoContainer = container.DESCRICAO || container.descricao || "Sem descrição informada.";

                            return (
                              <div
                                key={idContainer}
                                onClick={() => handleAcessarContainer(container)}
                                style={{
                                  padding: '16px',
                                  borderRadius: '8px',
                                  border: '1px solid #ccc',
                                  backgroundColor: '#fff',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                  position: 'relative'
                                }}
                              >
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                                  📁 {nomeContainer}
                                </span>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                  {descricaoContainer}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </S.ContainersList>
                    </S.ExistingContainersSection>
                  </React.Fragment>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <button
                        type="button"
                        onClick={() => { setSelectedContainerData(null); setNovoNomeContainer(""); setContainerDescription(""); }}
                        style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                      >
                        ← Voltar para Lista de Containers
                      </button>
                      <MyButton type="button" onClick={handleAtualizarDadosContainer} style={{ backgroundColor: '#e07a5f' }}>
                        Salvar Alterações do Bloco
                      </MyButton>
                    </div>

                    <div style={{ display: 'grid', gap: '15px', marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nome do Container</label>
                        <input
                          type="text"
                          value={novoNomeContainer}
                          onChange={(e) => setNovoNomeContainer(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Descrição / Subtópicos</label>
                        <textarea
                          value={containerDescription}
                          onChange={(e) => setContainerDescription(e.target.value)}
                          placeholder="Descreva quais assuntos ou competências este container abrange..."
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '60px', resize: 'vertical' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3>Questões neste Container ({questionsInContainer.length})</h3>
                      <MyButton type="button" onClick={handleOpenCreate} style={{ backgroundColor: '#4CAF50', padding: '6px 12px', fontSize: '0.9rem' }}>
                        + Nova Questão
                      </MyButton>
                    </div>

                    <S.QuestionList>
                      {questionsInContainer.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Este container ainda não possui perguntas cadastradas.</p>
                      ) : (
                        questionsInContainer.map((q, i) => {
                          const enunciadoQuestao = q.enunciado || q.ENUNCIADO || "Questão sem enunciado";
                          const idQuestao = q.IDPERGUNTA || q.id || q.IDPERGUNTA_PK;
                          
                          // Garante que o map interno não tente ler objetos como string crua
                          const alternativasQuestao = q.alternativas
                            ? q.alternativas.map(alt => alt && typeof alt === 'object' ? (alt.texto || alt.DESCRICAO || alt.texto_alternativa || "") : alt)
                            : [
                              q.A && typeof q.A === 'object' ? q.A.texto : (q.A || q.a || ""),
                              q.B && typeof q.B === 'object' ? q.B.texto : (q.B || q.b || ""),
                              q.C && typeof q.C === 'object' ? q.C.texto : (q.C || q.c || ""),
                              q.D && typeof q.D === 'object' ? q.D.texto : (q.D || q.d || "")
                            ].filter(Boolean);

                          return (
                            <S.QuestionItem key={idQuestao || i} onClick={() => {
                              setEditingQuestionId(idQuestao);
                              setEnunciado(enunciadoQuestao);
                              setOptions(alternativasQuestao);
                              setCorrectOption(convertLabelToIndex(q.correta || q.CORRETA || q.rotuloCorreto || q.ROTULOCORRETO));
                              setIsModalOpen(true);
                            }}>
                              <div className="info">
                                <strong>{i + 1}. {enunciadoQuestao}</strong>
                                <span>Clique para editar esta questão do container</span>
                              </div>
                              <div className="status-tag" style={{ backgroundColor: '#2196F3' }}>Banco</div>
                            </S.QuestionItem>
                          );
                        })
                      )}
                    </S.QuestionList>
                  </div>
                )}
              </S.StepContainer>
            )}
          </S.ContentSection>
        )}

        {/* Modais de controle */}
        {isModalOpen && (
          <QuestionModal
            title={editingIndex !== null || editingQuestionId !== null ? "Editar Pergunta" : "Nova Pergunta"}
            isOpen={isModalOpen}
            onClose={handleCloseQuestionModal}
          >
            <S.FormQuestion onSubmit={creationMode === 'container' ? handleSaveContainerQuestion : handleSaveManualQuestion}>
              <div className="input-group">
                <label>Enunciado da Questão</label>
                <textarea
                  name="enunciado"
                  value={enunciado}
                  onChange={(e) => setEnunciado(e.target.value)}
                  placeholder="Escreva o enunciado aqui..."
                  required
                />
              </div>

              {options.map((option, index) => (
                <div className="input-group" key={index}>
                  <label>Alternativa {String.fromCharCode(65 + index)}</label>
                  <input
                    type="text"
                    // Evita exibir [object Object] extraindo o campo de texto correto caso retorne objeto mapeado
                    value={option && typeof option === 'object' ? (option.texto || option.DESCRICAO || option.texto_alternativa || "") : option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Texto da alternativa ${String.fromCharCode(65 + index)}`}
                    required
                  />
                </div>
              ))}

              <div className="input-group">
                <label>Alternativa Correta</label>
                <select
                  value={correctOption}
                  onChange={(e) => setCorrectOption(Number(e.target.value))}
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
                <MyButton type="button" onClick={handleCloseQuestionModal} style={{ backgroundColor: '#f44336' }}>Cancelar</MyButton>
              </div>
            </S.FormQuestion>
          </QuestionModal>
        )}

        {showScheduleModal && (
          <Modal
            title="Revisar e Salvar Atividade"
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Turma Vinculada (Leitura):</label>
                <select
                  value={selectedTurmaId}
                  onChange={(e) => setSelectedTurmaId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
                >
                  {classes && classes.length > 0 ? (
                    classes.map((c) => (
                      <option key={c.IDTURMA || c.id} value={c.IDTURMA || c.id}>
                        {c.NOMETURMA || c.nome || `Turma ${c.IDTURMA || c.id}`}
                      </option>
                    ))
                  ) : (
                    <option value="">Nenhuma turma ativa encontrada</option>
                  )}
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Data de Cadastro:</label>
                <input
                  type="date"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <MyButton onClick={handleFinishQuiz} disabled={isSaving} style={{ backgroundColor: '#4CAF50' }}>
                  {isSaving ? "Salvando..." : "Confirmar e Salvar Atividade"}
                </MyButton>
                <MyButton onClick={() => setShowScheduleModal(false)} style={{ backgroundColor: '#f44336' }}>Voltar</MyButton>
              </div>
            </div>
          </Modal>
        )}
      </S.Container>
    </DashboardLayout>
  );
}

export default CreateQuiz2;