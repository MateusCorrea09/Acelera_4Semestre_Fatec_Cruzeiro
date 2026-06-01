import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/DashboardLayout';
import ResultBar from '../../components/ResultBar';
import { MyButton } from '../../components/Buttons';
import * as S from './style';

function QuizPage() {

  const navigate = useNavigate();
  const idQuiz = localStorage.getItem('quizSelecionado');

  const [loading, setLoading] = useState(true);

  const [quizData, setQuizData] = useState(null);

  const [currentStep, setCurrentStep] =
    useState(0);

  const [userAnswers, setUserAnswers] =
    useState([]);

  const [isFinished, setIsFinished] =
    useState(false);

  // ====================================================
  // CARREGA QUIZ
  // ====================================================

  useEffect(() => {

    if (!idQuiz) {

      console.error(
        'Nenhum quiz selecionado'
      );

      setLoading(false);

      return;
    }

    carregarQuiz();

  }, [idQuiz]);

  const carregarQuiz = async () => {
    console.log('Buscando quiz:',idQuiz);
    try {

      const response =
        await fetch(
          `http://localhost:3001/quiz/${idQuiz}`
        );

      const data =
        await response.json();

      setQuizData(data);

    } catch (error) {

      console.error(
        'Erro ao carregar quiz',
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ====================================================
  // RANKING
  // ====================================================

  const getRank = (percentage) => {

    if (percentage === 100)
      return {
        icon: "👑",
        msg: "Perfeito! Você é um mestre!",
        color: "#FFD700"
      };

    if (percentage >= 80)
      return {
        icon: "🏆",
        msg: "Excelente desempenho!",
        color: "#4CAF50"
      };

    if (percentage >= 60)
      return {
        icon: "🥈",
        msg: "Muito bom! Continue praticando.",
        color: "#FF8C42"
      };

    if (percentage >= 40)
      return {
        icon: "🥉",
        msg: "Bom esforço!",
        color: "#CD7F32"
      };

    return {
      icon: "📚",
      msg: "Continue estudando!",
      color: "#666"
    };
  };

  // ====================================================
  // RESPONDER
  // ====================================================

  const handleAnswer = (index) => {

    const perguntaAtual =
      quizData.perguntas[currentStep];

    const answer = {

      isRight:
        index === perguntaAtual.correta
    };

    const novasRespostas = [
      ...userAnswers,
      answer
    ];

    setUserAnswers(
      novasRespostas
    );

    if (
      currentStep + 1 <
      quizData.perguntas.length
    ) {

      setCurrentStep(
        currentStep + 1
      );

    } else {

      setIsFinished(true);
    }
  };

  // ====================================================
  // SALVAR RESULTADO
  // ====================================================

const salvarResultado = async () => {

  try {

    const idAluno =
      localStorage.getItem('idAluno');

    const acertos =
      userAnswers.filter(
        a => a.isRight
      ).length;

    const notaFinal =
      Number(
        (
          (acertos /
            quizData.perguntas.length) *
          10
        ).toFixed(2)
      );

    const response =
      await fetch(
        'http://localhost:3001/resultados',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            idAluno,
            idQuiz,
            notaFinal,
            acertos
          })
        }
      );

    const data =
      await response.json();

    console.log(
      'Resultado salvo:',
      data
    );

    navigate('/home-aluno');

  } catch (error) {

    console.error(
      'Erro salvar resultado',
      error
    );
  }
};

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <h2>
        Carregando Quiz...
      </h2>
    );
  }

  if (!quizData) {

    return (
      <h2>
        Quiz não encontrado
      </h2>
    );
  }

  // ====================================================
  // FINALIZADO
  // ====================================================

  if (isFinished) {

    const acertos =
      userAnswers.filter(
        a => a.isRight
      ).length;

    const score =
      (acertos /
        quizData.perguntas.length) *
      100;

    const rank =
      getRank(score);

    return (

      <DashboardLayout
        userName={
          localStorage.getItem(
            'userName'
          )
        }
      >

        <S.FinishContainer>

          <div
            className="rank-icon"
            style={{
              filter:
                `drop-shadow(0 0 15px ${rank.color}66`
            }}
          >
            {rank.icon}
          </div>

          <h2
            style={{
              color: rank.color
            }}
          >
            {rank.msg}
          </h2>

          <p>

            Você completou

            <strong>
              {' '}
              {quizData.titulo}
            </strong>

          </p>

          <div
            style={{
              margin: '30px 0',
              width: '100%'
            }}
          >

            <ResultBar
              label="Desempenho Final"
              percentage={score}
              color={rank.color}
            />

          </div>

          <S.StatsInfo>

            <div>
              <strong>
                {acertos}
              </strong>

              <span>
                Acertos
              </span>
            </div>

            <div>
              <strong>
                {
                  quizData.perguntas.length
                }
              </strong>

              <span>
                Total
              </span>
            </div>

          </S.StatsInfo>

          <MyButton
            onClick={
              salvarResultado
            }
            style={{
              marginTop: '25px',
              width: '100%'
            }}
          >
            Finalizar Atividade
          </MyButton>

        </S.FinishContainer>

      </DashboardLayout>
    );
  }

  const currentQuestion =
    quizData.perguntas[currentStep];

  const totalQuestions =
    quizData.perguntas.length;

  // ====================================================
  // QUIZ
  // ====================================================

  return (

    <S.ImmersiveWrapper>

      <S.QuizHeader>

        <div className="top-info">

          <span>
            {quizData.titulo}
          </span>

          <strong>

            Questão
            {' '}
            {currentStep + 1}
            {' '}
            de
            {' '}
            {totalQuestions}

          </strong>

        </div>

        <S.ProgressBar>

          <div
            className="fill"
            style={{
              width:
                `${(
                  (
                    currentStep + 1
                  ) /
                  totalQuestions
                ) * 100}%`
            }}
          />

        </S.ProgressBar>

      </S.QuizHeader>

      <S.MainContent>

        <S.QuestionText>

          {
            currentQuestion.enunciado
          }

        </S.QuestionText>

      </S.MainContent>

      <S.FooterSim>

        <div className="btn-group">

          {currentQuestion.alternativas.map(
            (
              alternativa,
              index
            ) => (

              <button
                key={index}
                onClick={() =>
                  handleAnswer(index)
                }
              >
                {alternativa}
              </button>
            )
          )}

        </div>

      </S.FooterSim>

    </S.ImmersiveWrapper>
  );
}

export default QuizPage;