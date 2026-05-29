
import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import DashboardLayout from '../../components/DashboardLayout';
import { Modal } from "../../components/Modal";
import { MyButton } from '../../components/Buttons';
import ResultBar from '../../components/ResultBar';
import * as S from './style';

import { useNavigate } from 'react-router-dom';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Reports() {

  const navigate = useNavigate();

  const reportRef = useRef(null);

  // =========================================================
  // PROFESSOR
  // =========================================================

  const idProfessorLogado =
    localStorage.getItem('idUsuario');

  const professorName =
    localStorage.getItem('userName')
    || 'Professor';

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

  const [exporting, setExporting] =
    useState(false);

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
  // INSIGHTS PEDAGÓGICOS
  // =========================================================

  const melhorQuiz =
    recentQuizzes.length > 0
      ? [...recentQuizzes]
        .sort((a, b) => b.avg - a.avg)[0]
      : null;

  const piorQuiz =
    recentQuizzes.length > 0
      ? [...recentQuizzes]
        .sort((a, b) => a.avg - b.avg)[0]
      : null;

  const nivelTurma = () => {

    if (stats.mediaGeral >= 80)
      return 'Excelente';

    if (stats.mediaGeral >= 70)
      return 'Bom';

    if (stats.mediaGeral >= 60)
      return 'Regular';

    return 'Necessita Atenção';
  };

  // =========================================================
  // EXPORTAR PDF
  // =========================================================

  const handleExportPDF = async () => {

    try {

      setExporting(true);

      const element =
        reportRef.current;

      if (!element) return;

      const canvas =
        await html2canvas(
          element,
          {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          }
        );

      const imgData =
        canvas.toDataURL('image/png');

      const pdf =
        new jsPDF(
          'p',
          'mm',
          'a4'
        );

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        pdf.internal.pageSize.getHeight();

      const imgWidth =
        pdfWidth;

      const imgHeight =
        (canvas.height * imgWidth)
        / canvas.width;

      let heightLeft =
        imgHeight;

      let position = 0;

      // =============================================
      // PRIMEIRA PÁGINA
      // =============================================

      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pdfHeight;

      // =============================================
      // OUTRAS PÁGINAS
      // =============================================

      while (heightLeft > 0) {

        position =
          heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pdfHeight;
      }

      // =============================================
      // DOWNLOAD
      // =============================================

      pdf.save(
        `relatorio-${currentClass?.name || 'turma'}.pdf`
      );

    } catch (error) {

      console.error(
        'Erro ao exportar PDF:',
        error
      );

      alert(
        'Erro ao gerar PDF.'
      );

    } finally {

      setExporting(false);
    }
  };

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

        const data =
          await response.json();

        if (
          Array.isArray(data)
          && data.length > 0
        ) {

          const turmasFormatadas =
            data.map(turma => ({

              id: turma.id,
              name: turma.nome
            }));

          setMyClasses(
            turmasFormatadas
          );

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

    if (!currentClass?.id)
      return;

    const carregarDadosTurma =
      async () => {

        try {

          const statsResponse =
            await fetch(
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

          setStats({

            totalAlunos:
              Number(
                statsData.totalAlunos || 0
              ),

            quizzesRealizados:
              Number(
                statsData.totalQuizzes || 0
              ),

            mediaGeral:
              Number(
                statsData.mediaGeral || 0
              )
          });

          // =========================================
          // QUIZZES
          // =========================================

          const quizzesResponse =
            await fetch(
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

          const quizzesFormatados =
            quizzesData.map(q => ({

              id: q.id,

              title:
                q.titulo || 'Sem título',

              avg:
                Number(
                  q.mediaAcertos || 0
                ),

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

        const response =
          await fetch(
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

        const data =
          await response.json();

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
            Number(
              data.mediaTurma || 0
            ),

          totalRespostas:
            Number(
              data.totalRespostas || 0
            ),

          statusAnalise:
            data.statusAnalise ||
            "Análise básica disponível"
        });

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
      userName={`Prof. ${professorName}`}
    >

      <S.Container ref={reportRef}>

        {/* ================================================= */}
        {/* CAPA RELATÓRIO */}
        {/* ================================================= */}

        <div
          style={{
            background:
              'linear-gradient(135deg, #2563eb, #1e3a8a)',

            borderRadius: '20px',

            padding: '35px',

            color: '#fff',

            marginBottom: '30px',

            boxShadow:
              '0 10px 30px rgba(0,0,0,0.15)'
          }}
        >

          <h1
            style={{
              fontSize: '2.3rem',
              marginBottom: '10px'
            }}
          >
            Relatório Pedagógico
          </h1>

          <p
            style={{
              opacity: 0.9,
              fontSize: '1rem'
            }}
          >
            Plataforma Acelera
          </p>

          <div
            style={{
              marginTop: '25px',
              display: 'flex',
              gap: '40px',
              flexWrap: 'wrap'
            }}
          >

            <div>
              <strong>Professor:</strong>
              <br />
              {professorName}
            </div>

            <div>
              <strong>Turma:</strong>
              <br />
              {currentClass?.name || '-'}
            </div>

            <div>
              <strong>Gerado em:</strong>
              <br />
              {
                new Date()
                  .toLocaleString('pt-BR')
              }
            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* BOTÃO */}
        {/* ================================================= */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '25px'
          }}
        >

          <MyButton
            onClick={handleExportPDF}
          >
            {
              exporting
                ? 'Gerando PDF...'
                : 'Exportar Relatório PDF'
            }
          </MyButton>

        </div>

        {/* ================================================= */}
        {/* KPIS */}
        {/* ================================================= */}

        <S.SummaryGrid>

          <S.KPICard>
            <span>Alunos Vinculados</span>
            <strong>
              {stats.totalAlunos}
            </strong>
          </S.KPICard>

          <S.KPICard>
            <span>Quizzes Aplicados</span>
            <strong>
              {stats.quizzesRealizados}
            </strong>
          </S.KPICard>

          <S.KPICard>
            <span>Média da Turma</span>
            <strong>
              {stats.mediaGeral}%
            </strong>
          </S.KPICard>

        </S.SummaryGrid>

        {/* ================================================= */}
        {/* INSIGHTS */}
        {/* ================================================= */}

        <div
          style={{
            background: '#fff',
            borderRadius: '18px',
            padding: '25px',
            marginTop: '30px',
            boxShadow:
              '0 4px 15px rgba(0,0,0,0.08)'
          }}
        >

          <h2
            style={{
              marginBottom: '20px',
              color: '#1e3a8a'
            }}
          >
            Insights Pedagógicos
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(250px, 1fr))',

              gap: '20px'
            }}
          >

            <div>
              <strong>Desempenho Geral</strong>

              <p>
                A turma apresenta nível
                <strong>
                  {' '}
                  {nivelTurma()}
                </strong>.
              </p>
            </div>

            <div>
              <strong>Melhor Quiz</strong>

              <p>
                {
                  melhorQuiz?.title ||
                  'Indisponível'
                }

                {' '}
                (
                {melhorQuiz?.avg || 0}
                %)
              </p>
            </div>

            <div>
              <strong>Quiz Crítico</strong>

              <p>
                {
                  piorQuiz?.title ||
                  'Indisponível'
                }

                {' '}
                (
                {piorQuiz?.avg || 0}
                %)
              </p>
            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* MÉTRICAS */}
        {/* ================================================= */}

        <S.ChartSection
          style={{
            marginTop: '30px'
          }}
        >

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

        {/* ================================================= */}
        {/* QUIZZES */}
        {/* ================================================= */}

        <S.ActivitiesSection
          style={{
            marginTop: '30px'
          }}
        >

          <h2
            style={{
              marginBottom: '20px'
            }}
          >
            Ranking de Quizzes
          </h2>

          {
            recentQuizzes.length === 0
              ? (

                <p>
                  Nenhum quiz encontrado.
                </p>

              ) : (

                recentQuizzes
                  .sort((a, b) =>
                    b.avg - a.avg
                  )
                  .map(quiz => (

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

        {/* ================================================= */}
        {/* RECOMENDAÇÕES */}
        {/* ================================================= */}

        <div
          style={{
            marginTop: '40px',
            background: '#fff',
            borderRadius: '18px',
            padding: '25px',
            boxShadow:
              '0 4px 15px rgba(0,0,0,0.08)'
          }}
        >

          <h2
            style={{
              color: '#1e3a8a',
              marginBottom: '20px'
            }}
          >
            Recomendações Pedagógicas
          </h2>

          <ul
            style={{
              paddingLeft: '20px',
              lineHeight: '35px'
            }}
          >

            <li>
              Reforçar conteúdos com
              média inferior a 70%.
            </li>

            <li>
              Aplicar exercícios de
              revisão prática.
            </li>

            <li>
              Monitorar quizzes com
              baixa participação.
            </li>

            <li>
              Revisar conteúdos com
              maior índice de erro.
            </li>

          </ul>

        </div>

        {/* ================================================= */}
        {/* RODAPÉ */}
        {/* ================================================= */}

        <div
          style={{
            marginTop: '50px',
            paddingTop: '20px',
            borderTop:
              '1px solid #ddd',

            textAlign: 'center',

            color: '#888',

            fontSize: '0.9rem'
          }}
        >

          Relatório gerado automaticamente
          pela plataforma Acelera.

        </div>

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

          <h2>
            {
              selectedQuiz?.title
            }
          </h2>

          <p>
            <strong>PIN:</strong>
            {' '}
            {selectedQuiz?.pin}
          </p>

          <p>
            <strong>Média:</strong>
            {' '}
            {
              quizPedagogicoData.mediaTurma
            }%
          </p>

          <p>
            <strong>Total Respostas:</strong>
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
              Pergunta Mais Fácil
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
              Pergunta Mais Difícil
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
                  Indicadores
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
