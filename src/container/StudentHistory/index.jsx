import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { ReviewModal } from "../../components/Modal";
import ResultBar from '../../components/ResultBar';

import * as S from './style';

function StudentHistory() {

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const historyData = [
    {
      id: 1,
      titulo: "Operações Fundamentais",
      data: "08/05/2026",
      acertos: 4,
      total: 5,
      assunto: "Aritmética",
      dificuldade: "Fácil",
      perguntas: [
        {
          q: "Quanto é 7 x 8?",
          r: "56",
          correta: "56",
          isRight: true
        },
        {
          q: "Qual o resultado de 155 + 45?",
          r: "200",
          correta: "200",
          isRight: true
        },
        {
          q: "Qual o valor de 100 / 4?",
          r: "20",
          correta: "25",
          isRight: false
        },
        {
          q: "Resolva: (10 + 5) * 2",
          r: "30",
          correta: "30",
          isRight: true
        },
        {
          q: "Quanto é 9 - (3 x 2)?",
          r: "3",
          correta: "3",
          isRight: true
        }
      ]
    },
    {
      id: 2,
      titulo: "Geometria Plana",
      data: "06/05/2026",
      acertos: 2,
      total: 3,
      assunto: "Geometria",
      dificuldade: "Média",
      perguntas: [
        {
          q: "Quantos lados tem um hexágono?",
          r: "6",
          correta: "6",
          isRight: true
        },
        {
          q: "Qual a fórmula da área do quadrado?",
          r: "Lado x Lado",
          correta: "Lado x Lado",
          isRight: true
        },
        {
          q: "O que é um triângulo isósceles?",
          r: "Três lados iguais",
          correta: "Dois lados iguais",
          isRight: false
        }
      ]
    },
    {
      id: 3,
      titulo: "Equações de 1º Grau",
      data: "04/05/2026",
      acertos: 1,
      total: 2,
      assunto: "Álgebra",
      dificuldade: "Média",
      perguntas: [
        {
          q: "Se 2x = 10, qual o valor de x?",
          r: "5",
          correta: "5",
          isRight: true
        },
        {
          q: "Resolva: x + 7 = 12",
          r: "4",
          correta: "5",
          isRight: false
        }
      ]
    }
  ];

  const handleOpenDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  const menuConfig = [
    { label: "Dashboard", onClick: () => console.log("Home") },
    { label: "Minha Sala", onClick: () => console.log("Salas") },
    { label: "Histórico", onClick: () => console.log("Relatorios") },
    { label: "Sair", onClick: () => console.log("Sair") },
  ];

  return (
    <DashboardLayout
      sidebarTitle="Aluno"
      menuItems={menuConfig}
      userName="Marcos Algusto">

      <S.Container>

        <S.Header>
          <h1>Meu Desempenho</h1>
          <p>Acompanhe sua evolução e revise seus erros.</p>
        </S.Header>

        <S.HistoryGrid>

          {historyData.map((quiz) => {

            const percentage = (quiz.acertos / quiz.total) * 100;

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
                    {quiz.acertos} de {quiz.total} acertos
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