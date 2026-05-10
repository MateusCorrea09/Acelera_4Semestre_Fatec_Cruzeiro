import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import * as S from './style';
import InfoCard from '../../components/InfoCard';
import { Modal } from '../../components/Modal';
import { useNavigate } from 'react-router-dom';


function HomeProfessor() {
  const navigate = useNavigate();

  
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:3001/alunos')
      .then(res => res.json())
      .then(data => {
        console.log("Dados que chegaram do Banco:", data); 
        setAlunos(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);


  const abrirDetalhes = (aluno) => {
    setSelectedStudent(aluno);
    setIsModalOpen(true);
  };

  const menuConfig = [
    { label: "Dashboard", onClick: () => navigate('/home-professor') },
    { label: "Atividade", onClick: () => navigate('/criar-quiz') },
    { label: "Minhas Salas", onClick: () => navigate('/gerenciar-turmas') },
    { label: "Relatórios", onClick: () => navigate('/relatorios') },
    {
      label: "Sair", onClick: () => {
        localStorage.clear();
        navigate('/');
      }
    },
  ];

  return (

    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName={`Prof. ${localStorage.getItem('userName') || 'Nome_professor'}`}
    >
      <S.Panel>
        <S.SearchBar>
          <input type="text" placeholder="Pesquisar aluno(a)" />
        </S.SearchBar>

        <S.InteractionsArea>
          <div className="label-tab">Nome_turma</div>

          <S.CarouselTrack>
            {loading ? (
              <p>Carregando alunos...</p>
            ) : (
              alunos.map((aluno, index) => (
                <motion.div
                  key={aluno.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <InfoCard
                    icon="👨‍🎓"
                    title={aluno.nome} 
                    tag={aluno.sala}  
                    footerText={
                      <>
                        RESULTADO <br />
                        {/* Se nota for null ou undefined, mostra '---' */}
                        {aluno.nota !== null && aluno.nota !== undefined ? aluno.nota : '---'}
                      </>
                    }
                    onClick={() => abrirDetalhes(aluno)}
                  />
                </motion.div>
              ))
            )}
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