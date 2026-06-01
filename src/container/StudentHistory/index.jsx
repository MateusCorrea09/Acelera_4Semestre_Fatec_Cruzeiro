import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { ReviewModal } from "../../components/Modal";
import ResultBar from '../../components/ResultBar';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

function StudentHistory() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [historyData, setHistoryData] = useState([]);
  const handleOpenDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };
  useEffect(() => {

    const idAluno = localStorage.getItem('idAluno');

    if (!idAluno) {
      navigate('/');
      return;
    }

    fetch(
      `http://localhost:3001/aluno/${idAluno}/historico`
    )
      .then(res => res.json())
      .then(data => {

        setHistoryData(data || []);

      })
      .catch(err => {

        console.error(
          'Erro ao carregar histórico:',
          err
        );

      });

  }, [navigate]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  const menuConfig = [

    {
      label: "Dashboard",
      onClick: () => navigate('/home-aluno')
    },

    {
      label: "Minha Sala",
      onClick: () => console.log("Minha Sala")
    },

    {
      label: "Histórico",
      onClick: () => navigate('/StudentHistory')
    },

    {
      label: "Sair",
      onClick: () => {

        localStorage.clear();
        navigate('/');

      }
    }

  ];

  return (
    <DashboardLayout
      sidebarTitle="Aluno"
      menuItems={menuConfig}
      userName={
        localStorage.getItem('userName') || 'Aluno'
      }>

      <S.Container>

        <S.Header>
          <h1>Meu Desempenho</h1>
          <p>Acompanhe sua evolução e revise seus erros.</p>
        </S.Header>

        <S.HistoryGrid>

          {historyData.map((quiz) => {

            const percentage = quiz.nota * 10;

            return (
              <S.HistoryCard
                key={quiz.id}
                onClick={() => handleOpenDetails(quiz)}
              >

                <div className="card-header">
                  <strong>{quiz.titulo}</strong>
                  <span>{quiz.data}</span>
                </div>

                <div className="card-body">

                  <ResultBar
                    percentage={percentage}
                    color={percentage >= 70 ? "#4CAF50" : "#FF8C42"}
                  />

                  <small>
                    Nota: {quiz.nota.toFixed(1)}
                  </small>

                </div>

                <button className="view-btn">
                  Revisar Questões
                </button>

              </S.HistoryCard>
            );
          })}

        </S.HistoryGrid>

        {selectedQuiz && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            quizTitle={selectedQuiz.titulo}
          >

            <S.ReviewList>

              {selectedQuiz.perguntas?.length > 0 ? (

                selectedQuiz.perguntas.map((item, index) => (

                  <S.ReviewItem
                    key={index}
                    isRight={item.isRight}
                  >

                    <div className="status-dot" />

                    <div className="content">

                      <p className="question-text">
                        <strong>{index + 1}.</strong> {item.q}
                      </p>

                      <div className="answers">

                        <span>
                          Sua resposta:
                          {" "}
                          <strong className="user-res">
                            {item.r}
                          </strong>
                        </span>

                        {!item.isRight && (
                          <span className="correct-res">
                            Correta:
                            {" "}
                            <strong>{item.correta}</strong>
                          </span>
                        )}

                      </div>

                    </div>

                  </S.ReviewItem>

                ))

              ) : (

                <p style={{
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  Nenhuma revisão disponível.
                </p>

              )}

            </S.ReviewList>

          </ReviewModal>
        )}

      </S.Container>

    </DashboardLayout>
  );
}

export default StudentHistory;