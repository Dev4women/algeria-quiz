import { useState, useEffect } from "react";
import questions from "../data/questions";
import confetti from "canvas-confetti";

function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
  if (showResult) {
    const audio = new Audio(`${import.meta.env.BASE_URL}kassaman.mp3`);
    audio.play().catch((error) => {
      console.error("Erreur de lecture audio :", error);
    });

    const flagShape = confetti.shapeFromText({ text: "🇩🇿", scalar: 4 });

    const interval = setInterval(() => {
      confetti({
        particleCount: 10,
        startVelocity: 15,
        gravity: 0.3,
        spread: 100,
        ticks: 700,
        origin: { x: Math.random(), y: 0 },
        shapes: [flagShape],
        scalar: 6,
      });
    }, 250);

    return () => clearInterval(interval);
  }
}, [showResult]);

  function handleAnswerClick(option) {
    if (selectedAnswer) return;

    setSelectedAnswer(option);

    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  }

  function handleNextClick() {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  }

  function handleRestart() {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  }

  if (showResult) {
    return (
      <div className="result-screen">
        <h2>Quiz terminé !</h2>
        <p>
          Tu as obtenu {score} bonnes réponses sur {questions.length}.
        </p>
        <button onClick={handleRestart}>Recommencer</button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="question-counter">
        Question {currentQuestionIndex + 1} / {questions.length}
      </p>
      <h2>{currentQuestion.question}</h2>

      <div className="options">
        {currentQuestion.options.map((option) => {
          let className = "option-btn";

          if (selectedAnswer) {
            if (option === currentQuestion.correctAnswer) {
              className += " correct";
            } else if (option === selectedAnswer) {
              className += " incorrect";
            }
          }

          return (
            <button
              key={option}
              className={className}
              onClick={() => handleAnswerClick(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className="feedback">
          {selectedAnswer === currentQuestion.correctAnswer ? (
            <p className="correct-text">Correct !</p>
          ) : (
            <p className="incorrect-text">
              Incorrect. La bonne réponse était : {currentQuestion.correctAnswer}
            </p>
          )}
          <button onClick={handleNextClick}>
            {currentQuestionIndex === questions.length - 1 ? "Voir le résultat" : "Question suivante"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;