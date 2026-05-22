import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import InfoCard from '../../components/InfoCard';
import { Modal, ReviewModal } from '../../components/Modal';
import { MyButton } from '../../components/Buttons';
import LCalendar from '../../components/LCalendar';
import ResultBar from '../../components/ResultBar';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function ManagerTurma() {

  const navigate = useNavigate();

  // =========================================================
  // STORAGE
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

  const [salasDoProfessor, setSalasDoProfessor] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);

  const [stats, setStats] = useState({
    mediaGeral: '0%',
    quizMaisDificil: 'Nenhum',
    alunosAtivos: '0/0'
  });

  const [quizzesDaTurma, setQuizzesDaTurma] = useState([]);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [quizPedagogicoData, setQuizPedagogicoData] = useState({
    perguntaMaisFacil: '',
    perguntaMaisDificil: '',
    graficosPerguntas: []
  });

  const [detalhesAlunosTurma, setDetalhesAlunosTurma] = useState([]);

  // =========================================================
  // MODAIS
  // =========================================================

  const [showClassModal, setShowClassModal] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  const [showQuizDetailsModal, setShowQuizDetailsModal] = useState(false);

  const [showMediaModal, setShowMediaModal] = useState(false);

  const [showParticipacaoModal, setShowParticipacaoModal] = useState(false);

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
  // BUSCAR TURMAS
  // =========================================================

  useEffect(() => {

    if (!idProfessorLogado) {
      console.error("❌ Professor não encontrado");
      return;
    }

    fetch(
      `http://localhost:3001/turmas-professor/${idProfessorLogado}`,
      {
        method: 'GET',
        headers: requestHeaders
      }
    )
      .then(async (res) => {

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {

        console.log("📚 Turmas:", data);

        if (Array.isArray(data) && data.length > 0) {

          setSalasDoProfessor(data);

          setSelectedClass(data[0]);

          localStorage.setItem(
            'idTurmaAtiva',
            data[0].id
          );
        }

      })
      .catch((err) => {
        console.error("❌ Erro turmas:", err);
      });

  }, []);

  // =========================================================
  // CARREGA DADOS DA TURMA
  // =========================================================

  useEffect(() => {

    if (!selectedClass?.id) return;

    const turmaId = selectedClass.id;

    console.log("📘 Carregando turma:", turmaId);

    // =====================================================
    // STATS
    // =====================================================

    fetch(
      `http://localhost:3001/turma-stats/${turmaId}`,
      {
        method: 'GET',
        headers: requestHeaders
      }
    )
      .then(async (res) => {

        if (!res.ok) {
          throw new Error(`Erro stats ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {

        console.log("📊 Stats:", data);

        setStats({
          mediaGeral: data.mediaGeral || '0%',
          quizMaisDificil:
            data.quizMaisDificil || 'Nenhum',
          alunosAtivos:
            data.alunosAtivos || '0/0'
        });

      })
      .catch((err) => {
        console.error("❌ Stats:", err);
      });

    // =====================================================
    // QUIZZES
    // =====================================================

    fetch(
      `http://localhost:3001/turma-quizzes/${turmaId}`,
      {
        method: 'GET',
        headers: requestHeaders
      }
    )
      .then(async (res) => {

        if (!res.ok) {
          throw new Error(`Erro quizzes ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {

        console.log("📝 Quizzes:", data);

        setQuizzesDaTurma(
          Array.isArray(data)
            ? data
            : []
        );

      })
      .catch((err) => {
        console.error("❌ Quizzes:", err);
      });

    // =====================================================
    // ALUNOS
    // =====================================================

    fetch(
      `http://localhost:3001/alunos/turma/${turmaId}`,
      {
        method: 'GET',
        headers: requestHeaders
      }
    )
      .then(async (res) => {

        if (!res.ok) {
          throw new Error(`Erro alunos ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {

        console.log("👨‍🎓 Alunos:", data);

        setDetalhesAlunosTurma(
          Array.isArray(data)
            ? data
            : []
        );

      })
      .catch((err) => {
        console.error("❌ Alunos:", err);
      });

  }, [selectedClass]);

  // =========================================================
  // DETALHES DO QUIZ
  // =========================================================

  const handleOpenQuizDetails = (quiz) => {

    setSelectedQuiz(quiz);

    // Como ainda não existe rota pedagógica completa,
    // simulamos os dados usando os resultados do quiz

    setQuizPedagogicoData({
      perguntaMaisFacil:
        "Questão introdutória",
      perguntaMaisDificil:
        "Questão com menor média de acertos",
      graficosPerguntas: [
        {
          label: 'Acertos',
          percentage: quiz.mediaAcertos || 0
        },
        {
          label: 'Erros',
          percentage: 100 - (quiz.mediaAcertos || 0)
        }
      ]
    });

    setShowQuizDetailsModal(true);
  };

  // =========================================================
  // FILTROS
  // =========================================================

  const alunosResponderam =
    detalhesAlunosTurma.filter(
      aluno =>
        aluno.nota !== null &&
        aluno.nota !== undefined &&
        aluno.nota !== "---"
    );

  const alunosPendentes =
    detalhesAlunosTurma.filter(
      aluno =>
        aluno.nota === null ||
        aluno.nota === undefined ||
        aluno.nota === "---"
    );

  // =========================================================
  // NOME TURMA
  // =========================================================

  const nomeTurmaAtual =
    selectedClass?.nome ||
    "Selecione uma Sala";

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName={`Prof. ${
        localStorage.getItem('userName')
        || 'Professor'
      }`}
    >

      <S.Container>

        {/* HEADER */}

        <S.Header>

          <h1>
            Gerenciador de Turma - {nomeTurmaAtual}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >

            <MyButton
              onClick={() => setShowClassModal(true)}
            >
              Selecionar Sala
            </MyButton>

            <MyButton
              onClick={() => setShowCalendar(true)}
            >
              Filtrar por Período
            </MyButton>

          </div>

        </S.Header>

        {/* CARDS */}

        <S.StatsGrid>

          <InfoCard
            title="Média de Acertos da Sala"
            value={stats.mediaGeral}
            footerText="Desempenho geral"
            onClick={() => setShowMediaModal(true)}
          />

          <InfoCard
            title="Quiz com menor desempenho"
            value={stats.quizMaisDificil}
            footerText="Requer atenção"
          />

          <InfoCard
            title="Participação"
            value={stats.alunosAtivos}
            footerText="Alunos ativos"
            onClick={() => setShowParticipacaoModal(true)}
          />

        </S.StatsGrid>

        {/* QUIZZES */}

        <S.ContentSection>

          <S.SectionTitle>
            Desempenho por Quiz
          </S.SectionTitle>

          <S.Table>

            <thead>
              <tr>
                <th>Quiz</th>
                <th>PIN</th>
                <th>Média</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              {quizzesDaTurma.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign: 'center',
                      padding: '20px'
                    }}
                  >
                    Nenhum quiz encontrado.
                  </td>

                </tr>

              ) : (

                quizzesDaTurma.map((quiz) => (

                  <tr key={quiz.id}>

                    <td>{quiz.titulo}</td>

                    <td>{quiz.pin}</td>

                    <td>
                      {quiz.mediaAcertos || 0}%
                    </td>

                    <td>

                      <MyButton
                        onClick={() =>
                          handleOpenQuizDetails(quiz)
                        }
                      >
                        Ver Estatísticas
                      </MyButton>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </S.Table>

        </S.ContentSection>

        {/* MODAL TURMAS */}

        <Modal
          title="Selecionar Sala"
          isOpen={showClassModal}
          onClose={() => setShowClassModal(false)}
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >

            {salasDoProfessor.map((sala) => (

              <MyButton
                key={sala.id}
                onClick={() => {

                  setSelectedClass(sala);

                  localStorage.setItem(
                    'idTurmaAtiva',
                    sala.id
                  );

                  setShowClassModal(false);
                }}
              >
                📁 {sala.nome}
              </MyButton>

            ))}

          </div>

        </Modal>

        {/* MODAL DETALHES QUIZ */}

        <ReviewModal
          isOpen={showQuizDetailsModal}
          onClose={() =>
            setShowQuizDetailsModal(false)
          }
          quizTitle={selectedQuiz?.titulo || ""}
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >

            <div>

              <strong>
                💡 Pergunta mais fácil:
              </strong>

              <p>
                {quizPedagogicoData.perguntaMaisFacil}
              </p>

            </div>

            <div>

              <strong>
                ⚠️ Pergunta mais difícil:
              </strong>

              <p>
                {quizPedagogicoData.perguntaMaisDificil}
              </p>

            </div>

            <div>

              {quizPedagogicoData
                .graficosPerguntas
                ?.map((item, index) => (

                  <ResultBar
                    key={index}
                    label={item.label}
                    percentage={item.percentage}
                  />

                ))}

            </div>

          </div>

        </ReviewModal>

        {/* MODAL MÉDIAS */}

        <Modal
          title="Notas da Sala"
          isOpen={showMediaModal}
          onClose={() => setShowMediaModal(false)}
        >

          <div style={{ padding: '10px' }}>

            {alunosResponderam.length === 0 ? (

              <p>
                Nenhum aluno respondeu quizzes.
              </p>

            ) : (

              alunosResponderam.map((aluno) => (

                <p key={aluno.id}>
                  {aluno.nome} — {aluno.nota}
                </p>

              ))

            )}

          </div>

        </Modal>

        {/* MODAL PARTICIPAÇÃO */}

        <Modal
          title="Participação"
          isOpen={showParticipacaoModal}
          onClose={() =>
            setShowParticipacaoModal(false)
          }
        >

          <div style={{ padding: '10px' }}>

            <h3>✔️ Responderam</h3>

            {alunosResponderam.length === 0 ? (

              <p>Nenhum aluno.</p>

            ) : (

              alunosResponderam.map((aluno) => (

                <p key={aluno.id}>
                  {aluno.nome}
                </p>

              ))

            )}

            <h3 style={{ marginTop: '20px' }}>
              ⏳ Pendentes
            </h3>

            {alunosPendentes.length === 0 ? (

              <p>Nenhum aluno pendente.</p>

            ) : (

              alunosPendentes.map((aluno) => (

                <p key={aluno.id}>
                  {aluno.nome}
                </p>

              ))

            )}

          </div>

        </Modal>

        {/* MODAL CALENDÁRIO */}

        <Modal
          title="Filtrar por Período"
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
        >

          <LCalendar />

        </Modal>

      </S.Container>

    </DashboardLayout>

  );
}

export default ManagerTurma;