import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import InfoCard from '../../components/InfoCard';
import { Modal } from '../../components/Modal';
import { MyButton } from '../../components/Buttons';
import LCalendar from '../../components/LCalendar';
import * as S from './style';

function ManagerTurma() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false); // Estado para o novo modal
  const [dateRange, setDateRange] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);

  // Exemplo de dados vindos das tabelas "Professores" e "Salas" do seu SQL Server
  const salasDoProfessor = [
    { id: 1, nome: "7º Ano" },
    { id: 2, nome: "8º Ano" },
    { id: 3, nome: "9º Ano" },
  ];

  const menuConfig = [
    { label: "Dashboard", onClick: () => console.log("Home") },
    { label: "Atividade", onClick: () => console.log("Sair") },
    { label: "Minhas Salas", onClick: () => setShowClassModal(true) },
    { label: "Relatórios", onClick: () => console.log("Relatorios") },
    { label: "Sair", onClick: () => console.log("Sair") },
  ];

  const stats = {
    mediaGeral: "78%",
    quizMaisDificil: "Matemática básica",
    alunosAtivos: "24/30"
  };

  return (
    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName="Prof. Nome_professor">
      <S.Container>
        <S.Header>
          <h1>Gerenciador de Turma - {selectedClass ? selectedClass.nome : "Selecione uma Sala"}</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <MyButton onClick={() => setShowClassModal(true)}>
              Selecionar Sala
            </MyButton>
            <MyButton onClick={() => setShowCalendar(true)}>
              Filtrar por Período
            </MyButton>
          </div>
        </S.Header>

        <S.StatsGrid>
          <InfoCard title="Média de Acertos da Sala" value={stats.mediaGeral} />
          <InfoCard title="Quiz com menor desempenho" value={stats.quizMaisDificil} />
          <InfoCard title="Participação Mensal" value={stats.alunosAtivos} />
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
              <tr>
                <td>Nome do quiz</td>
                <td>data_quiz</td>
                <td>%de acerto</td>
                <td><button>Ver Questões</button></td>
              </tr>
            </tbody>
          </S.Table>
        </S.ContentSection>

        {/* Modal de Calendário */}
        {showCalendar && (
          <Modal title="Selecionar Período" isOpen={showCalendar} onClose={() => setShowCalendar(false)}>
            <S.CalendarWrapper>
              <LCalendar
                onDateChange={setDateRange}
                quizzesAgendados={['2026-04-12']}
              />
              <MyButton onClick={() => setShowCalendar(false)} style={{ marginTop: '20px' }}>
                Aplicar Filtro
              </MyButton>
            </S.CalendarWrapper>
          </Modal>
        )}

        {/* Modal de Seleção de Salas */}
        {showClassModal && (
          <Modal title="Minhas Salas" isOpen={showClassModal} onClose={() => setShowClassModal(false)}>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>Selecione a turma que deseja gerenciar:</p>
              {salasDoProfessor.map((sala) => (
                <MyButton 
                  key={sala.id} 
                  style={{ width: '100%', backgroundColor: selectedClass?.id === sala.id ? '#ff7b00' : '#e67e3a' }}
                  onClick={() => {
                    setSelectedClass(sala);
                    setShowClassModal(false);
                    console.log(`Filtrando por Sala ID: ${sala.id}`);
                  }}
                >
                  {sala.nome}
                </MyButton>
              ))}
            </div>
          </Modal>
        )}
      </S.Container>
    </DashboardLayout>
  );
}

export default ManagerTurma;