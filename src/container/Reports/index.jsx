import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Modal } from "../../components/Modal";
import { MyButton } from '../../components/Buttons';
import ResultBar from '../../components/ResultBar';
import * as S from './style';
import { useNavigate } from 'react-router-dom';

function Reports() {
  const navigate = useNavigate();
  const myClasses = [
    { id: 1, name: "7º Ano A", totalaluno: 19 },
    { id: 2, name: "8º Ano B", totalaluno: 24 },
    { id: 3, name: "9º Ano C", totalaluno: 32 },
  ];

  const [showClassModal, setShowClassModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(myClasses[0]); 

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

  
  const stats = {
    totalAlunos: currentClass.totalaluno, 
    quizzesRealizados: 12,
    mediaGeral: 78
  };

  const recentQuizzes = [
    { id: 1, title: "Matemática básica", date: "01/05/2026", avg: 82 },
    { id: 2, title: "Revisão para P1", date: "28/04/2026", avg: 65 },
    { id: 3, title: "Tarefa 03", date: "25/04/2026", avg: 90 },
  ];

  return (
    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName="Prof. Nome_professor"
    >
      <S.Container>
        <S.Header>
          <div>
            <h1>Relatórios de Desempenho</h1>
            <p style={{ color: '#FF8C42', fontWeight: 'bold' }}>Turma: {currentClass.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <MyButton onClick={() => window.print()}>Exportar PDF</MyButton>
          </div>
        </S.Header>

        <S.SummaryGrid>
          <S.KPICard>
            <span>Alunos Ativos</span>
          
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
            <ResultBar label="Taxa de Entrega" percentage={92} color="#FF8C42" />
            <ResultBar label="Consistência Semanal" percentage={60} color="#2196F3" />
          </S.ChartSection>

          <S.ActivitiesSection>
            <h3>Atividades Recentes</h3>
            {recentQuizzes.map(quiz => (
              <S.ActivityItem key={quiz.id}>
                <div className="info">
                  <strong>{quiz.title}</strong>
                  <small>Finalizado em {quiz.date}</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: quiz.avg > 70 ? '#4CAF50' : '#FF8C42' }}>
                    {quiz.avg}% acerto
                  </div>
                  <MyButton style={{ padding: '5px 10px', fontSize: '0.7rem', marginTop: '5px' }}>
                    Ver Detalhes
                  </MyButton>
                </div>
              </S.ActivityItem>
            ))}
          </S.ActivitiesSection>
        </S.MainSection>

        {showClassModal && (
          <Modal
            title="Minhas Salas"
            isOpen={showClassModal}
            onClose={() => setShowClassModal(false)}
          >
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
              Selecione a turma para carregar os relatórios:
            </p>

            <S.ClassGrid>
              {myClasses.map(classe => (
                <S.ClassCard
                  key={classe.id}
                  isSelected={currentClass.id === classe.id}
                  onClick={() => {
                    setCurrentClass(classe);
                    setShowClassModal(false);
                  }}
                >
                  <div className="class-info">
                    <strong>{classe.name}</strong>
                    {/* Aqui também usamos a informação individual da lista */}
                    <span>{classe.totalaluno} Alunos vinculados</span>
                  </div>

                  {currentClass.id === classe.id && (
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