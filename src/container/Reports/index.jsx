import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Modal, ReviewModal } from "../../components/Modal";
import { MyButton } from '../../components/Buttons';
import ResultBar from '../../components/ResultBar';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function Reports() {
  const navigate = useNavigate();
  const idProfessorLogado = localStorage.getItem('idUsuario') || 1;

  // Estados de Dados do Banco
  const [myClasses, setMyClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [stats, setStats] = useState({ totalAlunos: 0, quizzesRealizados: 0, mediaGeral: 0 });
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  // Estados para o detalhamento gráfico do Quiz selecionado
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizPedagogicoData, setQuizPedagogicoData] = useState({ perguntaMaisFacil: '', perguntaMaisDificil: '', graficosPerguntas: [] });

  // Estados para Controle de Modais
  const [showClassModal, setShowClassModal] = useState(false);
  const [showQuizDetailsModal, setShowQuizDetailsModal] = useState(false);

  // 1. Busca as turmas associadas ao professor e trata chaves do banco (IDTURMA, NOMETURMA)
  useEffect(() => {
    fetch(`http://localhost:3001/turmas-professor/${idProfessorLogado}`)
      .then(res => res.json())
      .then(async (data) => {
        if (data && data.length > 0) {
          const turmasComAlunosReais = await Promise.all(
            data.map(async (turma) => {
              // 🟢 CORREÇÃO: Mapeia chaves seguras prevenindo o padrão SQLite
              const targetId = turma.IDTURMA || turma.id;
              const targetName = turma.NOMETURMA || turma.nome;

              try {
                const statsRes = await fetch(`http://localhost:3001/turma-stats/${targetId}`);
                const statsData = await statsRes.json();

                let totalDeAlunosDaSala = 0;
                if (statsData.alunosAtivos && statsData.alunosAtivos.includes('/')) {
                  totalDeAlunosDaSala = parseInt(statsData.alunosAtivos.split('/')[1]) || 0;
                } else {
                  totalDeAlunosDaSala = turma.totalAlunos || turma.qntAlunos || 0;
                }

                return {
                  id: targetId,
                  name: targetName,
                  totalaluno: totalDeAlunosDaSala
                };
              } catch (err) {
                console.error("Erro ao complementar dados da turma:", err);
                return { id: targetId, name: targetName, totalaluno: turma.totalAlunos || 0 };
              }
            })
          );

          setMyClasses(turmasComAlunosReais);
          setCurrentClass(turmasComAlunosReais[0]);
        }
      })
      .catch(err => console.error("Erro ao buscar turmas no relatório:", err));
  }, [idProfessorLogado]);

  // 2. Carrega os dados estatísticos dinâmicos da turma selecionada
  useEffect(() => {
    // Como normalizamos no passo 1, aqui podemos usar com segurança .id
    if (!currentClass || !currentClass.id) return;

    let quizzesContadosDoBanco = 0;
    let listaDeQuizzesTratada = [];

    fetch(`http://localhost:3001/turma-quizzes/${currentClass.id}`)
      .then(res => res.json())
      .then(quizData => {
        if (quizData && quizData.length > 0) {
          listaDeQuizzesTratada = quizData.map(q => {
            let mediaQuiz = parseFloat(q.mediaAcertos) || 0;
            if (mediaQuiz > 0 && mediaQuiz <= 10) {
              mediaQuiz = mediaQuiz * 10;
            }
            return {
              // 🟢 CORREÇÃO: Garante o ID do Quiz vindo mapeado do banco (IDQUIZ_PK ou id)
              id: q.IDQUIZ_PK || q.id,
              title: q.titulo || q.TITULO,
              date: q.dataConclusao || 'Sem data',
              avg: mediaQuiz
            };
          });
          quizzesContadosDoBanco = quizData.length;
        }
        setRecentQuizzes(listaDeQuizzesTratada);

        return fetch(`http://localhost:3001/turma-stats/${currentClass.id}`);
      })
      .then(res => res.json())
      .then(statsData => {
        let totalMatriculados = currentClass.totalaluno;
        if (statsData.alunosAtivos && statsData.alunosAtivos.includes('/')) {
          totalMatriculados = statsData.alunosAtivos.split('/')[1];
        }

        const qtdQuizzesFinais = statsData.quizzesAplicados ||
          statsData.totalQuizzes ||
          statsData.qtdQuizzes ||
          quizzesContadosDoBanco;

        let mediaTratada = parseFloat(statsData.mediaGeral) || 0;
        if (mediaTratada > 0 && mediaTratada <= 10) {
          mediaTratada = mediaTratada * 10;
        }

        setStats({
          totalAlunos: totalMatriculados,
          quizzesRealizados: qtdQuizzesFinais,
          mediaGeral: mediaTratada
        });
      })
      .catch(err => console.error("Erro ao carregar e cruzar estatísticas do relatório:", err));

  }, [currentClass]);

  // Função para abrir o modal com gráficos por questão
  const handleOpenQuizDetails = (quiz) => {
    if (!currentClass || !quiz) return;
    setSelectedQuiz(quiz);

    fetch(`http://localhost:3001/turma-quiz-detalhes/${currentClass.id}/${quiz.id}`)
      .then(res => res.json())
      .then(data => {
        setQuizPedagogicoData(data);
        setShowQuizDetailsModal(true);
      })
      .catch(err => console.error("Erro ao buscar analíticas do relatório do quiz:", err));
  };

  const menuConfig = [
    { label: "Dashboard", onClick: () => navigate('/home-professor') },
    { label: "Atividade", onClick: () => navigate('/criar-quiz') },
    { label: "Minhas Salas", onClick: () => navigate('/gerenciar-turmas') },
    { label: "Relatórios", onClick: () => navigate('/relatorios') },
    { label: "Sair", onClick: () => { localStorage.clear(); navigate('/'); } },
  ];

  return (
    <DashboardLayout sidebarTitle="Professor" menuItems={menuConfig} userName="Prof. Fabiano">
      <S.Container>
        <S.Header>
          <div>
            <h1>Relatórios de Desempenho</h1>
            <p style={{ color: '#FF8C42', fontWeight: 'bold', margin: '5px 0 0 0' }}>
              Turma: {currentClass ? currentClass.name : "Selecione uma Sala"}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <MyButton onClick={() => setShowClassModal(true)}>Mudar Sala</MyButton>
            <MyButton onClick={() => window.print()}>Exportar PDF</MyButton>
          </div>
        </S.Header>

        <S.SummaryGrid>
          <S.KPICard>
            <span>Alunos Vinculados</span>
            <strong>{stats.totalAlunos}</strong>
          </S.KPICard>
          <S.KPICard>
            <span>Quizzes Aplicados</span>
            <strong>{stats.quizzesRealizados}</strong>
          </S.KPICard>
          <S.KPICard>
            <span>Média da Turma</span>
            <strong>{stats.mediaGeral}%</strong>
          </S.KPICard>
        </S.SummaryGrid>

        <S.MainSection>
          <S.ChartSection>
            <h3>Métricas de Engajamento</h3>
            <ResultBar label="Média de Acertos" percentage={stats.mediaGeral} color="#4CAF50" />
            <ResultBar label="Taxa de Entrega" percentage={stats.mediaGeral > 0 ? 85 : 0} color="#FF8C42" />
            <ResultBar label="Consistência Semanal" percentage={stats.mediaGeral > 0 ? 70 : 0} color="#2196F3" />
          </S.ChartSection>

          <S.ActivitiesSection>
            <h3>Atividades Recentes</h3>
            {recentQuizzes.length === 0 ? (
              <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>
                Nenhum quiz realizado por esta turma.
              </p>
            ) : (
              recentQuizzes.map(quiz => (
                <S.ActivityItem key={quiz.id}>
                  <div className="info">
                    <strong>{quiz.title}</strong>
                    <small>Finalizado em {quiz.date}</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: quiz.avg > 70 ? '#4CAF50' : '#FF8C42' }}>
                      {quiz.avg}% acerto
                    </div>
                    <MyButton
                      onClick={() => handleOpenQuizDetails(quiz)}
                      style={{ padding: '5px 10px', fontSize: '0.7rem', marginTop: '5px' }}
                    >
                      Ver Detalhes
                    </MyButton>
                  </div>
                </S.ActivityItem>
              ))
            )}
          </S.ActivitiesSection>
        </S.MainSection>

        {/* --- MODAL DO RAIO-X COMPORTAMENTAL DO QUIZ --- */}
        <ReviewModal
          isOpen={showQuizDetailsModal}
          onClose={() => setShowQuizDetailsModal(false)}
          quizTitle={selectedQuiz ? selectedQuiz.title : ""}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eafaf1', borderRadius: '8px', borderLeft: '5px solid #2ecc71' }}>
                <strong style={{ color: '#27ae60', fontSize: '0.9rem' }}>💡 Maior índice de acerto:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#333' }}>{quizPedagogicoData.perguntaMaisFacil || "Processando dados..."}</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fdf2f2', borderRadius: '8px', borderLeft: '5px solid #e74c3c' }}>
                <strong style={{ color: '#c0392b', fontSize: '0.9rem' }}>⚠️ Maior índice de erro:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#333' }}>{quizPedagogicoData.perguntaMaisDificil || "Processando dados..."}</p>
              </div>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />

            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#555' }}>Média de Acertos por Questão:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {quizPedagogicoData.graficosPerguntas && quizPedagogicoData.graficosPerguntas.map((progresso, idx) => (
                  <ResultBar
                    key={idx}
                    label={progresso.label}
                    percentage={progresso.percentage}
                    color={progresso.percentage < 50 ? '#e67e3a' : '#2ecc71'}
                  />
                ))}
              </div>
            </div>
          </div>
        </ReviewModal>

        {/* --- MODAL SELEÇÃO DE SALAS --- */}
        {showClassModal && (
          <Modal title="Minhas Salas" isOpen={showClassModal} onClose={() => setShowClassModal(false)}>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
              Selecione a turma para carregar os relatórios:
            </p>

            <S.ClassGrid>
              {myClasses.map(classe => (
                <S.ClassCard
                  key={classe.id}
                  isSelected={currentClass && currentClass.id === classe.id}
                  onClick={() => {
                    setCurrentClass(classe);
                    setShowClassModal(false);
                  }}
                >
                  <div className="class-info">
                    <strong>{classe.name}</strong>
                    <span>{classe.totalaluno} Alunos vinculados</span>
                  </div>

                  {currentClass && currentClass.id === classe.id && (
                    <div className="check-icon">✓</div>
                  )}
                </S.ClassCard>
              ))}
            </S.ClassGrid>

            <div style={{ marginTop: '20px' }}>
              <MyButton
                onClick={() => setShowClassModal(false)}
                style={{ width: '100%', backgroundColor: '#eee', color: '#666' }}
              >
                Cancelar
              </MyButton>
            </div>
          </Modal>
        )}
      </S.Container>
    </DashboardLayout>
  );
}

export default Reports;