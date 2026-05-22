import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Modal } from "../../components/Modal";
import { MyButton } from '../../components/Buttons';
import ResultBar from '../../components/ResultBar';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function Reports() {

  const navigate = useNavigate();

  // =========================================================
  // PROFESSOR
  // =========================================================

  const idProfessorLogado =
    localStorage.getItem('idUsuario');

  // =========================================================
  // HEADERS
  // =========================================================

  const requestHeaders = {
    'Content-Type': 'application/json',
    'x-professor-id': idProfessorLogado
  };

  // =========================================================
  // STATES
  // =========================================================

  const [myClasses, setMyClasses] =
    useState([]);

  const [currentClass, setCurrentClass] =
    useState(null);

  const [stats, setStats] = useState({
    totalAlunos: 0,
    quizzesRealizados: 0,
    mediaGeral: 0
  });

  const [recentQuizzes, setRecentQuizzes] =
    useState([]);

  const [selectedQuiz, setSelectedQuiz] =
    useState(null);

  const [quizPedagogicoData,
    setQuizPedagogicoData] = useState({

      perguntaMaisFacil: '',
      perguntaMaisDificil: '',
      graficosPerguntas: [],
      mediaTurma: 0,
      totalRespostas: 0,
      statusAnalise: ''
    });

  const [showQuizDetailsModal,
    setShowQuizDetailsModal] = useState(false);

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
    }
  ];

  // =========================================================
  // CARREGA TURMAS
  // =========================================================

  useEffect(() => {

    if (!idProfessorLogado) {

      console.error(
        "❌ Professor não encontrado"
      );

      return;
    }

    const carregarTurmas = async () => {

      try {

        const response = await fetch(
          `http://localhost:3001/turmas-professor/${idProfessorLogado}`,
          {
            method: 'GET',
            headers: requestHeaders
          }
        );

        if (!response.ok) {

          throw new Error(
            `Erro turmas: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "📚 Turmas recebidas:",
          data
        );

        if (
          Array.isArray(data) &&
          data.length > 0
        ) {

          const turmasFormatadas =
            data.map(turma => ({

              id: turma.id,
              name: turma.nome
            }));

          setMyClasses(turmasFormatadas);

          setCurrentClass(
            turmasFormatadas[0]
          );

        } else {

          setMyClasses([]);

          setCurrentClass(null);
        }

      } catch (error) {

        console.error(
          "❌ Erro ao buscar turmas:",
          error
        );
      }
    };

    carregarTurmas();

  }, []);

  // =========================================================
  // CARREGA DADOS DA TURMA
  // =========================================================

  useEffect(() => {

    if (!currentClass?.id) return;

    const carregarDadosTurma = async () => {

      try {

        // =====================================================
        // STATS
        // =====================================================

        const statsResponse = await fetch(
          `http://localhost:3001/turma-stats/${currentClass.id}`,
          {
            headers: requestHeaders
          }
        );

        if (!statsResponse.ok) {

          throw new Error(
            `Erro stats: ${statsResponse.status}`
          );
        }

        const statsData =
          await statsResponse.json();

        console.log(
          "📈 Stats:",
          statsData
        );

        setStats({

          totalAlunos:
            Number(statsData.totalAlunos || 0),

          quizzesRealizados:
            Number(statsData.totalQuizzes || 0),

          mediaGeral:
            Number(statsData.mediaGeral || 0)
        });

        // =====================================================
        // QUIZZES
        // =====================================================

        const quizzesResponse = await fetch(
          `http://localhost:3001/turma-quizzes/${currentClass.id}`,
          {
            headers: requestHeaders
          }
        );

        if (!quizzesResponse.ok) {

          throw new Error(
            `Erro quizzes: ${quizzesResponse.status}`
          );
        }

        const quizzesData =
          await quizzesResponse.json();

        console.log(
          "🧠 Quizzes:",
          quizzesData
        );

        const quizzesFormatados =
          quizzesData.map(q => ({

            id: q.id,

            title:
              q.titulo || 'Sem título',

            avg:
              Number(q.mediaAcertos || 0),

            pin:
              q.pin || 'Sem PIN'
          }));

        setRecentQuizzes(
          quizzesFormatados
        );

      } catch (error) {

        console.error(
          "❌ Erro dados turma:",
          error
        );
      }
    };

    carregarDadosTurma();

  }, [currentClass]);

  // =========================================================
  // DETALHES QUIZ
  // =========================================================

  const handleOpenQuizDetails =
    async (quiz) => {

      try {

        setSelectedQuiz(quiz);

        console.log(
          "🟢 Abrindo detalhes do quiz:",
          quiz
        );

        const response = await fetch(
          `http://localhost:3001/turma-quiz-detalhes/${currentClass.id}/${quiz.id}`,
          {
            method: 'GET',
            headers: requestHeaders
          }
        );

        if (!response.ok) {

          throw new Error(
            `Erro detalhes: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "📘 Detalhes quiz:",
          data
        );

        setQuizPedagogicoData({

          perguntaMaisFacil:
            data.perguntaMaisFacil ||
            "Indisponível",

          perguntaMaisDificil:
            data.perguntaMaisDificil ||
            "Indisponível",

          graficosPerguntas:
            data.graficosPerguntas || [],

          mediaTurma:
            Number(data.mediaTurma || 0),

          totalRespostas:
            Number(data.totalRespostas || 0),

          statusAnalise:
            data.statusAnalise ||
            "Análise básica disponível"
        });

        // =====================================================
        // ABRE MODAL
        // =====================================================

        setShowQuizDetailsModal(true);

      } catch (error) {

        console.error(
          "❌ Erro detalhes quiz:",
          error
        );

        alert(
          "Erro ao carregar detalhes do quiz."
        );
      }
    };

  // =========================================================
  // FECHAR MODAL
  // =========================================================

  const closeModal = () => {

    setShowQuizDetailsModal(false);

    setSelectedQuiz(null);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName={
        `Prof. ${localStorage.getItem('userName')
        || 'Professor'
        }`
      }
    >

      <S.Container>

        <S.Header>

          <div>

            <h1>
              Relatórios de Desempenho
            </h1>

            <p
              style={{
                color: '#FF8C42',
                fontWeight: 'bold',
                marginTop: '5px'
              }}
            >
              Turma:
              {' '}
              {
                currentClass?.name
                || 'Nenhuma turma'
              }
            </p>

          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >

            <MyButton
              onClick={() => window.print()}
            >
              Exportar PDF
            </MyButton>

          </div>

        </S.Header>

        {/* KPIS */}

        <S.SummaryGrid>

          <S.KPICard>

            <span>
              Alunos Vinculados
            </span>

            <strong>
              {stats.totalAlunos}
            </strong>

          </S.KPICard>

          <S.KPICard>

            <span>
              Quizzes Aplicados
            </span>

            <strong>
              {stats.quizzesRealizados}
            </strong>

          </S.KPICard>

          <S.KPICard>

            <span>
              Média da Turma
            </span>

            <strong>
              {stats.mediaGeral}%
            </strong>

          </S.KPICard>

        </S.SummaryGrid>

        {/* CONTEÚDO */}

        <S.MainSection>

          <S.ChartSection>

            <h3>
              Métricas de Engajamento
            </h3>

            <ResultBar
              label="Média de Acertos"
              percentage={
                Number(stats.mediaGeral)
              }
              color="#4CAF50"
            />

            <ResultBar
              label="Participação"
              percentage={
                stats.totalAlunos > 0
                  ? 85
                  : 0
              }
              color="#FF8C42"
            />

            <ResultBar
              label="Consistência"
              percentage={
                stats.totalAlunos > 0
                  ? 70
                  : 0
              }
              color="#2196F3"
            />

          </S.ChartSection>

          {/* QUIZZES */}

          <S.ActivitiesSection>

            <h3>
              Atividades Recentes
            </h3>

            {
              recentQuizzes.length === 0
                ? (

                  <p
                    style={{
                      color: '#888',
                      textAlign: 'center',
                      marginTop: '20px'
                    }}
                  >
                    Nenhum quiz encontrado.
                  </p>

                ) : (

                  recentQuizzes.map(quiz => (

                    <S.ActivityItem
                      key={quiz.id}
                    >

                      <div className="info">

                        <strong>
                          {quiz.title}
                        </strong>

                        <small>
                          PIN: {quiz.pin}
                        </small>

                      </div>

                      <div
                        style={{
                          textAlign: 'right'
                        }}
                      >

                        <div
                          style={{

                            fontWeight: 'bold',

                            color:
                              quiz.avg >= 70
                                ? '#4CAF50'
                                : '#FF8C42'
                          }}
                        >
                          {quiz.avg}%
                        </div>

                        <MyButton
                          onClick={() =>
                            handleOpenQuizDetails(
                              quiz
                            )
                          }
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.7rem',
                            marginTop: '5px'
                          }}
                        >
                          Ver Detalhes
                        </MyButton>

                      </div>

                    </S.ActivityItem>

                  ))
                )
            }

          </S.ActivitiesSection>

        </S.MainSection>

      </S.Container>

      {/* ===================================================== */}
      {/* MODAL DETALHES QUIZ */}
      {/* ===================================================== */}

      <Modal
        isOpen={showQuizDetailsModal}
        title="Detalhes do Quiz"
        onClose={closeModal}
      >

        <div
          style={{
            padding: '10px'
          }}
        >

          <h2
            style={{
              marginBottom: '10px'
            }}
          >
            {
              selectedQuiz?.title
              || 'Quiz'
            }
          </h2>

          <p>
            <strong>PIN:</strong>
            {' '}
            {
              selectedQuiz?.pin
              || 'Sem PIN'
            }
          </p>

          <p>
            <strong>Média da turma:</strong>
            {' '}
            {
              quizPedagogicoData.mediaTurma
            }
          </p>

          <p>
            <strong>Total de respostas:</strong>
            {' '}
            {
              quizPedagogicoData.totalRespostas
            }
          </p>

          <p>
            <strong>Status:</strong>
            {' '}
            {
              quizPedagogicoData.statusAnalise
            }
          </p>

          <hr
            style={{
              margin: '20px 0'
            }}
          />

          <div>

            <h3>
              Pergunta mais fácil
            </h3>

            <p>
              {
                quizPedagogicoData
                  .perguntaMaisFacil
              }
            </p>

          </div>

          <div
            style={{
              marginTop: '20px'
            }}
          >

            <h3>
              Pergunta mais difícil
            </h3>

            <p>
              {
                quizPedagogicoData
                  .perguntaMaisDificil
              }
            </p>

          </div>

          {
            quizPedagogicoData
              .graficosPerguntas
              ?.length > 0 && (

              <div
                style={{
                  marginTop: '25px'
                }}
              >

                <h3>
                  Gráficos
                </h3>

                {
                  quizPedagogicoData
                    .graficosPerguntas
                    .map((item, index) => (

                      <div
                        key={index}
                        style={{
                          marginBottom: '15px'
                        }}
                      >

                        <ResultBar
                          label={item.label}
                          percentage={
                            Number(
                              item.percentage || 0
                            )
                          }
                          color="#4CAF50"
                        />

                      </div>
                    ))
                }

              </div>
            )
          }

        </div>

      </Modal>

    </DashboardLayout>
  );
}

export default Reports;