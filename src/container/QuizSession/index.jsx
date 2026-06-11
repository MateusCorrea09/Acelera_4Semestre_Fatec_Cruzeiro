import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import DashboardLayout from '../../components/DashboardLayout';
import ResultBar from '../../components/ResultBar';
import { MyButton } from '../../components/Buttons';
import * as S from './style';

function QuizPage() {

  const navigate = useNavigate();
  const idQuiz = localStorage.getItem('quizSelecionado');

  const [ultimaRespostaArduino,
    setUltimaRespostaArduino] =
    useState(null);

  const [aguardandoResposta,
    setAguardandoResposta] =
    useState(false);

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


  useEffect(() => {

    if (!quizData) return;

    setAguardandoResposta(false);

    const perguntaAtual =
      quizData.perguntas[currentStep];

    enviarPerguntaParaArduino(
      perguntaAtual
    );

  }, [quizData, currentStep]);

  const carregarQuiz = async () => {
    console.log('Buscando quiz:', idQuiz);
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

  useEffect(() => {

    const intervalo =
      setInterval(async () => {

        try {

          const resposta =
            await fetch(
              'http://localhost:3001/arduino/resposta'
            );

          const dados =
            await resposta.json();

          if (
            dados.resposta &&
            dados.resposta !== ultimaRespostaArduino
          ) {

            setUltimaRespostaArduino(
              dados.resposta
            );

            const opcao =
              parseInt(
                dados.resposta
              ) - 1;

            if (
              opcao >= 0 &&
              opcao <= 3
            ) {

              handleAnswer(
                opcao
              );
            }
          }

        } catch (erro) {

          console.error(
            erro
          );
        }

      }, 1000);

    return () =>
      clearInterval(intervalo);

  }, []);
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
    if (aguardandoResposta) return;
    setAguardandoResposta(true);

    if (!quizData) return;

    const perguntaAtual =
      quizData.perguntas[currentStep];

    const answer = {

      isRight:
        index ===
        perguntaAtual.correta
    };

    const novasRespostas = [
      ...userAnswers,
      answer
    ];

    setUserAnswers(prev => [
      ...prev,
      answer
    ]);

    if (
      currentStep + 1 <
      quizData.perguntas.length
    ) {

      setCurrentStep(
        currentStep + 1
      );

    } else {

      fetch(
        'http://localhost:3001/arduino/fim',
        {
          method: 'POST'
        }
      );

      setIsFinished(true);
    }
  };
  // ====================================================
  // Arduino comunicações
  // ====================================================
  const enviarPerguntaParaArduino = async (pergunta) => {

    try {

      await fetch(
        'http://localhost:3001/arduino/pergunta',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({

            enunciado:
              pergunta.enunciado,

            alternativas:
              pergunta.alternativas
          })
        }
      );

    } catch (error) {

      console.error(
        'Erro ao enviar para Arduino',
        error
      );
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
      (
        acertos /
        quizData.perguntas.length
      ) * 100;

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

          <h2>
            Quiz Finalizado
          </h2>

          <h3>
            {rank.icon}
            {' '}
            {rank.msg}
          </h3>

          <p>

            Acertos:
            {' '}
            {acertos}
            {' / '}
            {
              quizData.perguntas.length
            }

          </p>

          <MyButton
            onClick={
              salvarResultado
            }
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