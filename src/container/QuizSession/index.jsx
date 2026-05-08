import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ResultBar from '../../components/ResultBar';
import { MyButton } from '../../components/Buttons';
import * as S from './style';


function QuizPage() {
  const quizData = {
    titulo: "Matemática Básica",
    perguntas: [
      { id: 1, enunciado: "Quanto é 5 + 3?", alternativas: ["6", "7", "8", "9"], correta: 2 },
      { id: 2, enunciado: "Quanto é 12 - 4?", alternativas: ["6", "7", "8", "9"], correta: 2 },
      { id: 3, enunciado: "Quanto é 6 × 7?", alternativas: ["36", "42", "48", "56"], correta: 1 },
      { id: 4, enunciado: "Quanto é 81 ÷ 9?", alternativas: ["7", "8", "9", "10"], correta: 2 },
      { id: 5, enunciado: "Qual é o resultado de 15 + 20?", alternativas: ["30", "35", "40", "45"], correta: 1 },
      { id: 6, enunciado: "Quanto é 9 × 8?", alternativas: ["72", "64", "81", "70"], correta: 0 },
      { id: 7, enunciado: "Qual é o dobro de 25?", alternativas: ["45", "50", "55", "60"], correta: 1 },
      { id: 8, enunciado: "Quanto é 100 - 37?", alternativas: ["63", "67", "73", "57"], correta: 0 },
      { id: 9, enunciado: "Qual é a metade de 96?", alternativas: ["46", "48", "50", "52"], correta: 1 },
      { id: 10, enunciado: "Quanto é 11 + 22?", alternativas: ["31", "32", "33", "34"], correta: 2 }
    ]
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quizData.perguntas[currentStep];
  const totalQuestions = quizData.perguntas.length;

  // --- FUNÇÃO DE RANKING ---
  const getRank = (percentage) => {
    if (percentage === 100) return { icon: "👑", msg: "Perfeito! Você é um mestre!", color: "#FFD700" };
    if (percentage >= 80) return { icon: "🏆", msg: "Excelente desempenho!", color: "#4CAF50" };
    if (percentage >= 60) return { icon: "🥈", msg: "Muito bom! Continue praticando.", color: "#FF8C42" };
    if (percentage >= 40) return { icon: "🥉", msg: "Bom esforço, mas pode melhorar.", color: "#CD7F32" };
    return { icon: "📚", msg: "Não desanime! Vamos revisar?", color: "#666" };
  };

  const handleAnswer = (index) => {
    const answer = { isRight: index === currentQuestion.correta };
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentStep + 1 < totalQuestions) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const acertos = userAnswers.filter(a => a.isRight).length;
    const score = (acertos / totalQuestions) * 100;
    const rank = getRank(score);

    return (
      <DashboardLayout userName="Aluno: Nome_Aluno">
        <S.FinishContainer>
          <div className="rank-icon" style={{ filter: `drop-shadow(0 0 15px ${rank.color}66)` }}>
            {rank.icon}
          </div>
          <h2 style={{ color: rank.color }}>{rank.msg}</h2>
          <p>Você completou <strong>{quizData.titulo}</strong></p>

          <div style={{ margin: '30px 0', width: '100%' }}>
            <ResultBar label="Desempenho Final" percentage={score} color={rank.color} />
          </div>

          <S.StatsInfo>
            <div><strong>{acertos}</strong><span>Acertos</span></div>
            <div><strong>{totalQuestions}</strong><span>Total</span></div>
          </S.StatsInfo>

          <MyButton onClick={() => window.location.reload()} style={{ marginTop: '25px', width: '100%' }}>
            Finalizar Atividade
          </MyButton>
        </S.FinishContainer>
      </DashboardLayout>
    );
  }

  return (
    <S.ImmersiveWrapper>
      <S.QuizHeader>
        <div className="top-info">
          <span>{quizData.titulo}</span>
          <strong>Questão {currentStep + 1} de {totalQuestions}</strong>
        </div>
        <S.ProgressBar>
          <div className="fill" style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }} />
        </S.ProgressBar>
      </S.QuizHeader>

      <S.MainContent>
        <S.QuestionText>{currentQuestion.enunciado}</S.QuestionText>
        <S.HardwareStatus>
          <span className="pulse-dot" />
          Aguardando resposta no Totem Luzio...
        </S.HardwareStatus>
      </S.MainContent>

      <S.FooterSim>
        <p>Simulador de Hardware (ESP32):</p>
        <div className="btn-group">
          {currentQuestion.alternativas.map((alt, i) => (
            <button key={i} onClick={() => handleAnswer(i)}>
              {String.fromCharCode(65 + i)}
            </button>
          ))}
        </div>
      </S.FooterSim>
    </S.ImmersiveWrapper>
  );
}

export default QuizPage;