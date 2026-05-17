import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import InfoCard from '../../components/InfoCard';
import { Modal, ReviewModal } from '../../components/Modal'; // Removidos os modais do CreateQuiz
import { MyButton } from '../../components/Buttons';
import LCalendar from '../../components/LCalendar';
import ResultBar from '../../components/ResultBar';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function ManagerTurma() {
  const navigate = useNavigate();

  const [salasDoProfessor, setSalasDoProfessor] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [stats, setStats] = useState({ mediaGeral: '0%', quizMaisDificil: 'Nenhum', alunosAtivos: '0/0' });
  const [quizzesDaTurma, setQuizzesDaTurma] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizPedagogicoData, setQuizPedagogicoData] = useState({ perguntaMaisFacil: '', perguntaMaisDificil: '', graficosPerguntas: [] });

  const [showClassModal, setShowClassModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuizDetailsModal, setShowQuizDetailsModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showParticipacaoModal, setShowParticipacaoModal] = useState(false);

  const [detalhesAlunosTurma, setDetalhesAlunosTurma] = useState([]);

  const idProfessorLogado = localStorage.getItem('idUsuario') || 1;

  // 1. Carrega as turmas do professor ao iniciar
  useEffect(() => {
    fetch(`http://localhost:3001/turmas-professor/${idProfessorLogado}`)
      .then(res => res.json())
      .then(data => {
        console.log("Salas recebidas do banco:", data);
        if (data && data.length > 0) {
          setSalasDoProfessor(data);
          setSelectedClass(data[0]); 
          
          // AJUSTE AQUI: Salva a turma inicial padrão no localStorage
          const idInicial = data[0].IDTURMA || data[0].id;
          localStorage.setItem('idTurmaAtiva', idInicial);
        }
      })
      .catch(err => console.error("Erro ao buscar turmas no Front:", err));
  }, [idProfessorLogado]);

  // 2. Carrega as estatísticas e quizzes da turma selecionada
  useEffect(() => {
    const turmaId = selectedClass?.IDTURMA || selectedClass?.id;
    if (!turmaId) return;

    fetch(`http://localhost:3001/turma-stats/${turmaId}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Erro nas estatísticas:", err));

    fetch(`http://localhost:3001/turma-quizzes/${turmaId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Quizzes recebidos para essa sala:", data);
        setQuizzesDaTurma(data || []);
      })
      .catch(err => console.error("Erro nos quizzes da turma:", err));

    fetch(`http://localhost:3001/alunos?turmaId=${turmaId}`)
      .then(res => res.json())
      .then(data => setDetalhesAlunosTurma(data || []))
      .catch(err => console.error("Erro ao buscar lista de alunos:", err));

  }, [selectedClass]);

  // 3. Carrega detalhes específicos gráficos do Quiz
  const handleOpenQuizDetails = (quiz) => {
    const turmaId = selectedClass?.IDTURMA || selectedClass?.id;
    const quizId = quiz?.IDQUIZ_PK || quiz?.id;

    if (!turmaId || !quizId) return;
    setSelectedQuiz(quiz);

    fetch(`http://localhost:3001/turma-quiz-detalhes/${turmaId}/${quizId}`)
      .then(res => res.json())
      .then(data => {
        setQuizPedagogicoData(data);
        setShowQuizDetailsModal(true);
      })
      .catch(err => console.error("Erro ao buscar analíticas do quiz:", err));
  };

  const alunosResponderam = detalhesAlunosTurma.filter(aluno => aluno.nota !== null && aluno.nota !== undefined && aluno.nota !== '');
  const alunosPendentes = detalhesAlunosTurma.filter(aluno => !aluno.nota && aluno.nota !== 0);

  const menuConfig = [
    { label: "Dashboard", onClick: () => navigate('/home-professor') },
    { label: "Atividade", onClick: () => navigate('/criar-quiz') },
    { label: "Minhas Salas", onClick: () => navigate('/gerenciar-turmas') },
    { label: "Relatórios", onClick: () => navigate('/relatorios') },
    { label: "Sair", onClick: () => { localStorage.clear(); navigate('/'); } },
  ];

  const nomeTurmaAtual = selectedClass?.NOMETURMA || selectedClass?.nome || "Selecione uma Sala";

  return (
    <DashboardLayout sidebarTitle="Professor" menuItems={menuConfig} userName="Prof. Fabiano">
      <S.Container>
        <S.Header>
          <h1>Gerenciador de Turma - {nomeTurmaAtual}</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <MyButton onClick={() => setShowClassModal(true)}>Selecionar Sala</MyButton>
            <MyButton onClick={() => setShowCalendar(true)}>Filtrar por Período</MyButton>
          </div>
        </S.Header>

        <S.StatsGrid>
          <InfoCard
            title="Média de Acertos da Sala"
            value={stats.mediaGeral}
            footerText="Desempenho geral"
            onClick={() => setShowMediaModal(true)}
          />
          <InfoCard
            title="Quiz com menor desempenho"
            value={stats.quizMaisDificil === "Nenhum" ? "---" : stats.quizMaisDificil}
            footerText="Requer attention"
            onClick={() => {
              if (quizzesDaTurma.length > 0) {
                const piorQuiz = quizzesDaTurma.find(q => q.titulo === stats.quizMaisDificil);
                if (piorQuiz) handleOpenQuizDetails(piorQuiz);
              }
            }}
          />
          <InfoCard
            title="Participação Mensal"
            value={stats.alunosAtivos}
            footerText="Alunos que responderam"
            onClick={() => setShowParticipacaoModal(true)}
          />
        </S.StatsGrid>

        <S.ContentSection>
          <S.SectionTitle>Desempenho por Quiz</S.SectionTitle>
          <S.Table>
            <thead>
              <tr>
                <th>Nome do Quiz</th>
                <th>Data</th>
                <th>Média de Acertos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {quizzesDaTurma.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    Nenhum histórico de quiz encontrado para esta sala.
                  </td>
                </tr>
              ) : (
                quizzesDaTurma.map((quiz, index) => (
                  <tr key={index}>
                    <td>{quiz.titulo}</td>
                    <td>{quiz.dataConclusao || 'Sem data'}</td>
                    <td>{quiz.mediaAcertos}%</td>
                    <td>
                      <MyButton onClick={() => handleOpenQuizDetails(quiz)}>
                        Ver Estatísticas
                      </MyButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </S.Table>
        </S.ContentSection>

        {/* --- 1. MODAL SELECIONAR SALA --- */}
        {showClassModal && (
          <Modal title="Selecionar Sala" isOpen={showClassModal} onClose={() => setShowClassModal(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
              {salasDoProfessor.map((sala) => (
                <MyButton 
                  key={sala.IDTURMA || sala.id} 
                  onClick={() => { 
                    setSelectedClass(sala); 
                    
                    // AJUSTE AQUI: Salva o novo ID selecionado no localStorage antes de fechar o modal
                    const idSelecionado = sala.IDTURMA || sala.id;
                    localStorage.setItem('idTurmaAtiva', idSelecionado);
                    
                    setShowClassModal(false); 
                  }}
                  style={{ justifyContent: 'left', backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ddd' }}
                >
                  📁 {sala.NOMETURMA || sala.nome}
                </MyButton>
              ))}
            </div>
          </Modal>
        )}

        {/* --- 2. MODAL DE REVISÃO DO DESEMPENHO DO QUIZ --- */}
        <ReviewModal
          isOpen={showQuizDetailsModal}
          onClose={() => setShowQuizDetailsModal(false)}
          quizTitle={selectedQuiz ? selectedQuiz.titulo : ""}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eafaf1', borderRadius: '8px', borderLeft: '5px solid #2ecc71' }}>
                <strong style={{ color: '#27ae60', fontSize: '0.9rem' }}>💡 Maior índice de acerto:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#333' }}>{quizPedagogicoData.perguntaMaisFacil || "Nenhum dado"}</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fdf2f2', borderRadius: '8px', borderLeft: '5px solid #e74c3c' }}>
                <strong style={{ color: '#c0392b', fontSize: '0.9rem' }}>⚠️ Maior índice de erro:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#333' }}>{quizPedagogicoData.perguntaMaisDificil || "Nenhum dado"}</p>
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

        {/* --- 3. MODAL DE MÉDIAS DA SALA --- */}
        {showMediaModal && (
          <Modal title="Detalhes de Notas da Sala" isOpen={showMediaModal} onClose={() => setShowMediaModal(false)}>
            <div style={{ padding: '10px' }}>
              <h4>Notas dos alunos ativos:</h4>
              <ul>
                {alunosResponderam.map((aluno, i) => (
                  <li key={i}>{aluno.nome || aluno.NOME}: <strong>{aluno.nota}% de acertos</strong></li>
                ))}
              </ul>
            </div>
          </Modal>
        )}

        {/* --- 4. MODAL DE PARTICIPAÇÃO --- */}
        {showParticipacaoModal && (
          <Modal title="Lista de Participação" isOpen={showParticipacaoModal} onClose={() => setShowParticipacaoModal(false)}>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <h4 style={{ color: '#2ecc71' }}>Responderam ({alunosResponderam.length}):</h4>
                {alunosResponderam.map((a, i) => <span key={i} style={{ display: 'block' }}>✔️ {a.nome || a.NOME}</span>)}
              </div>
              <div>
                <h4 style={{ color: '#e74c3c' }}>Pendentes ({alunosPendentes.length}):</h4>
                {alunosPendentes.map((a, i) => <span key={i} style={{ display: 'block' }}>⏳ {a.nome || a.NOME}</span>)}
              </div>
            </div>
          </Modal>
        )}

        {/* --- 5. COMPONENTE DE CALENDÁRIO --- */}
        {showCalendar && (
          <Modal title="Filtrar por Período" isOpen={showCalendar} onClose={() => setShowCalendar(false)}>
            <LCalendar onChange={(range) => console.log("Filtro aplicado:", range)} />
          </Modal>
        )}

      </S.Container>
    </DashboardLayout>
  );
}

export default ManagerTurma;