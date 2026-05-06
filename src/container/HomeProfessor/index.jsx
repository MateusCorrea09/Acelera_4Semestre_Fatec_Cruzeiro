import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import * as S from './style';
import InfoCard from '../../components/InfoCard';
import {Modal} from '../../components/Modal';

function HomeProfessor() {
  const [alunos] = useState([
    { id: 1, nome: "Lucas", sala: "101", nota: "8.5", acertos: 8, desempenho: "Ótimo" },
    { id: 2, nome: "Ana", sala: "101", nota: "9.0", acertos: 9, desempenho: "Excelente" },
    { id: 3, nome: "Beatriz", sala: "101", nota: "7.0", acertos: 7, desempenho: "Bom" }
  ]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const abrirDetalhes = (aluno) => {
    setSelectedStudent(aluno);
    setIsModalOpen(true);
  };

  const menuConfig = [
    { label: "Dashboard", onClick: () => console.log("Home") },
    { label: "Atividade", onClick: () => console.log("Sair") },
    { label: "Minhas Salas", onClick: () => console.log("Salas") },
    { label: "Relatórios", onClick: () => console.log("Relatorios") },
    { label: "Sair", onClick: () => console.log("Sair") },
  ];

  return (
    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName="Prof. Nome_professor"
    >
      <S.Panel>
        <S.SearchBar>
          <input type="text" placeholder="Pesquisar aluno(a)" />
        </S.SearchBar>

        <S.InteractionsArea>
          <div className="label-tab">Nome_turma</div>

          <S.CarouselTrack>
            {alunos.map((aluno, index) => (
              <motion.div
                key={aluno.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <InfoCard
                  icon="👨‍🎓"
                  title={aluno.nome}
                  tag={`Sala ${aluno.sala}`}
                  footerText={<>RESULTADO_QUIZ <br /> {aluno.nota}</>}
                  onClick={() => abrirDetalhes(aluno)}
                />
              </motion.div>
            ))}
          </S.CarouselTrack>
        </S.InteractionsArea>

        <S.FooterPanel>Resumo da aula de hoje</S.FooterPanel>
      </S.Panel>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes do Aluno"
      >
        {selectedStudent && (
          <>
            <h2 style={{ color: '#FF8C42' }}>Desempenho de {selectedStudent.nome}</h2>
            <p><strong>Acertos:</strong> {selectedStudent.acertos}</p>
            <p><strong>Avaliação:</strong> {selectedStudent.desempenho}</p>
            <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
              Dados coletados via Projeto.
            </p>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default HomeProfessor;